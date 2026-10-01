"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { refreshShop } from "@/app/admin/actions";
import { compressImage } from "@/lib/compress-image";
import { categories } from "@/lib/data";
import { slugify, type ShopProduct } from "@/lib/product-types";
import { createClient } from "@/lib/supabase/client";
import { CameraIcon, CheckIcon, ChevronLeftIcon, CloseIcon, TrashIcon } from "../Icons";

// A photo already saved in storage has a path. A new one has a file waiting to upload.
type Photo = { key: string; url: string; path?: string; file?: File };

const BUCKET = "product-images";
const input = "h-[52px] w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";

export default function ProductForm({ product }: { product?: ShopProduct }) {
  const router = useRouter();
  const editing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? product.price.toFixed(2) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [category, setCategory] = useState(product?.category ?? categories[0].slug);
  const [weight, setWeight] = useState(product?.weightGrams ? String(product.weightGrams) : "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [tag, setTag] = useState(product?.tag ?? "");
  const [live, setLive] = useState(product ? product.status === "live" : true);
  const [photos, setPhotos] = useState<Photo[]>(
    product ? product.imagePaths.map((path, i) => ({ key: path, path, url: product.images[i] })) : []
  );
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState<"" | "saving" | "deleting">("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const previews = useRef<string[]>([]);

  // Free the preview URLs when leaving the page.
  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const added = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      previews.current.push(url);
      return { key: url, url, file };
    });
    setPhotos((p) => [...p, ...added]);
  }

  function removePhoto(photo: Photo) {
    setPhotos((all) => all.filter((p) => p.key !== photo.key));
    if (photo.path) setRemovedPaths((r) => [...r, photo.path!]);
  }

  function makeCover(key: string) {
    setPhotos((p) => {
      const chosen = p.find((x) => x.key === key);
      return chosen ? [chosen, ...p.filter((x) => x.key !== key)] : p;
    });
  }

  // Find a free URL name: "rattan-basket", then "rattan-basket-2", and so on.
  async function uniqueSlug(base: string) {
    const supabase = createClient();
    const { data } = await supabase.from("products").select("slug").like("slug", `${base}%`);
    const taken = new Set((data ?? []).map((r) => r.slug));
    if (!taken.has(base)) return base;
    let n = 2;
    while (taken.has(`${base}-${n}`)) n++;
    return `${base}-${n}`;
  }

  async function save(status: "draft" | "live") {
    setNotice("");
    if (!name.trim()) return setError("Add a product name.");
    if (!(Number(price) > 0)) return setError("Add a price greater than £0.");
    if (status === "live" && photos.length === 0) return setError("Add at least one photo before it goes live.");
    setError("");
    setBusy("saving");

    const supabase = createClient();
    try {
      const slug = product?.slug ?? (await uniqueSlug(slugify(name)));

      // 1. Upload new photos (shrunk first), keeping the order shown on screen.
      const paths: string[] = [];
      for (const photo of photos) {
        if (photo.path) {
          paths.push(photo.path);
          continue;
        }
        const blob = await compressImage(photo.file!);
        const path = `${slug}/${crypto.randomUUID()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
        if (uploadError) throw new Error("A photo didn't upload. Check your connection and try again.");
        paths.push(path);
      }

      // 2. Save the product.
      const row = {
        name: name.trim(),
        price: Number(Number(price).toFixed(2)),
        stock: Math.max(0, Math.floor(Number(stock) || 0)),
        category,
        weight_grams: weight ? Math.max(0, Math.floor(Number(weight))) : null,
        description: description.trim(),
        tag: tag.trim() || null,
        status,
        images: paths,
      };

      const { error: saveError } = product
        ? await supabase.from("products").update(row).eq("id", product.id)
        : await supabase.from("products").insert({ ...row, slug });
      if (saveError) throw new Error("We couldn't save the product. Please try again.");

      // 3. Clean up photos that were removed.
      if (removedPaths.length) {
        await supabase.storage.from(BUCKET).remove(removedPaths);
        setRemovedPaths([]);
      }

      await refreshShop(slug);

      if (!product) {
        router.push("/admin/products");
        router.refresh();
        return;
      }
      // Swap freshly uploaded photos for their saved versions.
      setPhotos(
        paths.map((path) => ({
          key: path,
          path,
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
        }))
      );
      setLive(status === "live");
      setNotice(status === "live" ? "Saved. It's live in the shop." : "Saved. It's hidden from the shop.");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!product) return;
    setBusy("deleting");
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);
    if (deleteError) {
      setBusy("");
      setError("We couldn't delete the product. Please try again.");
      return;
    }
    if (product.imagePaths.length) await supabase.storage.from(BUCKET).remove(product.imagePaths);
    await refreshShop(product.slug);
    router.push("/admin/products");
    router.refresh();
  }

  const saving = busy === "saving";

  return (
    <main className="mx-auto flex max-w-[720px] flex-col">
      <header className="flex h-16 items-center gap-1 border-b border-line pl-1.5 pr-3 lg:mt-6 lg:border-b-0">
        <Link href="/admin/products" aria-label="Back to products" className="flex h-11 w-11 items-center justify-center text-ink">
          <ChevronLeftIcon size={22} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold lg:font-display lg:text-[32px] lg:font-normal">
          {editing ? "Edit product" : "New product"}
        </h1>
        {!editing && (
          <button onClick={() => save("draft")} disabled={saving} className="h-10 shrink-0 px-3 text-[15px] font-semibold text-clay disabled:opacity-50">
            Save draft
          </button>
        )}
        {editing && (
          <Link href={`/product/${product!.slug}`} target="_blank" className="h-10 shrink-0 px-3 text-[15px] font-semibold leading-10 text-clay">
            View
          </Link>
        )}
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(editing ? (live ? "live" : "draft") : "live");
        }}
        className="flex flex-col gap-[18px] px-4 py-5"
      >
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-semibold">
            Photos <span className="font-normal text-subtle">(the first is the cover. Tap a photo to make it the cover)</span>
          </span>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {photos.map((p, i) => (
              <div key={p.key} className="relative h-28 overflow-hidden rounded-[14px] bg-[#efe5d4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => makeCover(p.key)}
                  aria-label={i === 0 ? "Cover photo" : "Make this the cover photo"}
                  className="absolute inset-0"
                />
                {i === 0 && (
                  <span className="pointer-events-none absolute bottom-2 left-2 flex h-[22px] items-center rounded-full bg-ink px-2 text-[11px] font-semibold text-cream">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(p)}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#b3a591] bg-paper text-[13px] font-semibold text-muted">
              <CameraIcon size={22} />
              Add photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => {
                  addPhotos(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <label className={label}>
          Product name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rattan storage basket" className={input} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Price (£)
            <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="0.00" className={input} />
          </label>
          <label className={label}>
            In stock
            <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min={0} placeholder="0" className={input} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Weight (g)
            <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" min={0} placeholder="e.g. 850" className={input} />
          </label>
        </div>
        <span className="-mt-2 text-[13px] text-subtle">Weight sets the Royal Mail delivery band at checkout.</span>

        <label className={label}>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="What is it, what is it made of, and why will they love it?"
            className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-3 text-base font-normal leading-normal"
          />
        </label>

        <label className={label}>
          <span>
            Label on the photo <span className="font-normal text-subtle">(optional, e.g. New, Gift idea)</span>
          </span>
          <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={20} className={input} />
        </label>

        {editing && (
          <label className="flex min-h-[52px] items-center justify-between rounded-[14px] border border-line bg-white px-4 text-[15px] font-semibold">
            <span className="flex flex-col gap-0.5">
              Show in shop
              <span className="text-[13px] font-normal text-subtle">{live ? "Shoppers can see and buy it" : "Hidden from shoppers"}</span>
            </span>
            <input type="checkbox" checked={live} onChange={(e) => setLive(e.target.checked)} className="h-[22px] w-[22px] accent-jade" />
          </label>
        )}

        {editing && (
          <div className="rounded-[14px] border border-line bg-paper p-4">
            {confirmDelete ? (
              <div className="flex flex-col gap-3">
                <p className="text-[15px] font-semibold">Delete {name || "this product"}? This can&apos;t be undone.</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="h-11 rounded-full border-[1.5px] border-line-strong bg-white font-semibold">
                    Keep it
                  </button>
                  <button
                    type="button"
                    onClick={remove}
                    disabled={busy !== ""}
                    className="h-11 rounded-full bg-clay-dark font-semibold text-white disabled:opacity-60"
                  >
                    {busy === "deleting" ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="flex h-10 items-center gap-2 text-[15px] font-semibold text-clay-dark">
                <TrashIcon size={18} />
                Delete product
              </button>
            )}
          </div>
        )}

        <div className="sticky bottom-[92px] -mx-4 flex flex-col gap-2 border-t border-line bg-paper px-4 pb-4 pt-3 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0">
          {error && (
            <p role="alert" className="rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark">{error}</p>
          )}
          {notice && (
            <p role="status" className="flex items-center gap-2 rounded-xl bg-jade-soft px-3.5 py-2.5 text-sm font-semibold text-jade">
              <CheckIcon size={16} />
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={busy !== ""}
            className="h-[54px] w-full rounded-full bg-clay text-base font-semibold text-white hover:bg-clay-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Publish product"}
          </button>
        </div>
      </form>
    </main>
  );
}