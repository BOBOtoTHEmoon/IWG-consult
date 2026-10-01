"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CameraIcon, CheckIcon, ChevronLeftIcon, CloseIcon, TrashIcon } from "../Icons";
import { categories, type Product } from "@/lib/data";

type Photo = { id: string; url?: string; tint?: string };

const input = "h-[52px] w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";

export default function ProductForm({
  product,
  stock,
}: {
  product?: Product; // present when editing
  stock?: number;
}) {
  const router = useRouter();
  const editing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? product.price.toFixed(2) : "");
  const [qty, setQty] = useState(stock !== undefined ? String(stock) : "");
  const [category, setCategory] = useState(product?.category ?? categories[0].slug);
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState(product?.description ?? "");
  const [visible, setVisible] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>(
    product ? [{ id: "cover", tint: product.tint }] : []
  );
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const urls = useRef<string[]>([]);

  // Free the preview URLs when leaving the page.
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const added = Array.from(files).map((f) => {
      const url = URL.createObjectURL(f);
      urls.current.push(url);
      return { id: url, url };
    });
    setPhotos((p) => [...p, ...added]);
  }

  function makeCover(id: string) {
    setPhotos((p) => {
      const chosen = p.find((x) => x.id === id);
      return chosen ? [chosen, ...p.filter((x) => x.id !== id)] : p;
    });
  }

  function save(intent: "draft" | "publish") {
    setNotice("");
    if (!name.trim()) return setError("Add a product name.");
    if (!(Number(price) > 0)) return setError("Add a price greater than £0.");
    if (intent === "publish" && photos.length === 0) return setError("Add at least one photo before publishing.");
    setError("");
    // TODO (backend phase): upload photos to Supabase Storage and insert or update the product.
    setNotice(
      intent === "draft"
        ? "Saved as a draft. It won't show in the shop yet."
        : editing
          ? "Changes saved."
          : "Product published. It's now live in the shop."
    );
  }

  function remove() {
    // TODO (backend phase): delete from Supabase.
    router.push("/admin/products");
  }

  return (
    <main className="mx-auto flex max-w-[720px] flex-col">
      <header className="flex h-16 items-center gap-1 border-b border-line pl-1.5 pr-3 lg:mt-6 lg:border-b-0">
        <Link href="/admin/products" aria-label="Back to products" className="flex h-11 w-11 items-center justify-center text-ink">
          <ChevronLeftIcon size={22} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-lg font-bold lg:font-display lg:text-[32px] lg:font-normal">
          {editing ? "Edit product" : "New product"}
        </h1>
        <button onClick={() => save("draft")} className="h-10 shrink-0 px-3 text-[15px] font-semibold text-clay">
          Save draft
        </button>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save("publish");
        }}
        className="flex flex-col gap-[18px] px-4 py-5"
      >
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-semibold">
            Photos <span className="font-normal text-subtle">(first one is the cover, tap a photo to make it the cover)</span>
          </span>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {photos.map((p, i) => (
              <div key={p.id} className="relative h-28 overflow-hidden rounded-[14px]" style={{ background: p.tint ?? "#efe5d4" }}>
                {p.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.url} alt="" className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => makeCover(p.id)}
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
                  onClick={() => setPhotos((all) => all.filter((x) => x.id !== p.id))}
                  aria-label="Remove photo"
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#b3a591] bg-paper text-[13px] font-semibold text-muted">
              <CameraIcon size={22} />
              Add photo
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} />
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
            <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" min={0} placeholder="0" className={input} />
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
            rows={4}
            placeholder="What is it, what is it made of, and why will they love it?"
            className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-3 text-base font-normal leading-normal"
          />
        </label>

        <label className="flex min-h-[52px] items-center justify-between rounded-[14px] border border-line bg-white px-4 text-[15px] font-semibold">
          Show in shop
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="h-[22px] w-[22px] accent-jade" />
        </label>

        {editing && (
          <div className="rounded-[14px] border border-line bg-paper p-4">
            {confirmDelete ? (
              <div className="flex flex-col gap-3">
                <p className="text-[15px] font-semibold">Delete {name || "this product"}? This can&apos;t be undone.</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="h-11 rounded-full border-[1.5px] border-line-strong bg-white font-semibold">
                    Keep it
                  </button>
                  <button type="button" onClick={remove} className="h-11 rounded-full bg-clay-dark font-semibold text-white">
                    Delete
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
          <button type="submit" className="h-[54px] w-full rounded-full bg-clay text-base font-semibold text-white hover:bg-clay-dark">
            {editing ? "Save changes" : "Publish product"}
          </button>
        </div>
      </form>
    </main>
  );
}