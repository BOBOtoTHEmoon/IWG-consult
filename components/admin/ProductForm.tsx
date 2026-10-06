"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { refreshShop } from "@/app/admin/actions";
import { compressImage } from "@/lib/compress-image";
import { categories } from "@/lib/data";
import { OPTION_LABELS, productImageUrl, slugify, type ShopProduct } from "@/lib/product-types";
import type { ShippingMethod, ShippingZone } from "@/lib/shipping-types";
import { createClient } from "@/lib/supabase/client";
import { uniqueId } from "@/lib/unique-id";
import { CameraIcon, CheckIcon, ChevronLeftIcon, CloseIcon, PlusIcon, TrashIcon } from "../Icons";

// One row in the options editor. Stock is kept as text while typing.
// A saved photo has imagePath; a newly picked one has file + preview until it uploads.
type OptionRow = { key: string; name: string; hex: string; stock: string; imagePath?: string; file?: File; preview?: string };

// A photo already saved in storage has a path. A new one has a file waiting to upload.
type Photo = { key: string; url: string; path?: string; file?: File };

const BUCKET = "product-images";
const input = "h-[52px] w-full rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";

export default function ProductForm({
  product,
  shipping = { zones: [], methods: [] },
}: {
  product?: ShopProduct;
  shipping?: { zones: ShippingZone[]; methods: ShippingMethod[] };
}) {
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
  const [hasOptions, setHasOptions] = useState((product?.options.length ?? 0) > 0);
  const [optionLabel, setOptionLabel] = useState(product?.optionLabel ?? "Colour");
  const [optionRows, setOptionRows] = useState<OptionRow[]>(
    product?.options.length
      ? product.options.map((o) => ({ key: uniqueId(), name: o.name, hex: o.hex ?? "#3b3733", stock: String(o.stock), imagePath: o.image }))
      : [{ key: "first", name: "", hex: "#3b3733", stock: "" }]
  );
  const [freeShipping, setFreeShipping] = useState(product?.freeShipping ?? false);
  const [limitMethods, setLimitMethods] = useState((product?.shippingMethodIds.length ?? 0) > 0);
  const [methodIds, setMethodIds] = useState<string[]>(product?.shippingMethodIds ?? []);
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

  const isColour = optionLabel === "Colour";
  const optionTotal = optionRows.reduce((n, r) => n + Math.max(0, Math.floor(Number(r.stock) || 0)), 0);
  const updateRow = (key: string, changes: Partial<OptionRow>) =>
    setOptionRows((rows) => rows.map((r) => (r.key === key ? { ...r, ...changes } : r)));
  const addRow = () => setOptionRows((rows) => [...rows, { key: uniqueId(), name: "", hex: "#3b3733", stock: "" }]);
  const pickOptionPhoto = (key: string, file: File) => {
    const url = URL.createObjectURL(file);
    previews.current.push(url);
    updateRow(key, { file, preview: url });
  };
  const clearOptionPhoto = (key: string) => updateRow(key, { file: undefined, preview: undefined, imagePath: undefined });
  const removeRow = (key: string) => setOptionRows((rows) => (rows.length > 1 ? rows.filter((r) => r.key !== key) : rows));

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

    const keptRows = hasOptions ? optionRows.filter((r) => r.name.trim()) : [];
    const cleanOptions = hasOptions
      ? keptRows
          .map((r) => ({
            name: r.name.trim(),
            ...(isColour ? { hex: r.hex } : {}),
            stock: Math.max(0, Math.floor(Number(r.stock) || 0)),
          }))
      : [];
    if (hasOptions) {
      if (cleanOptions.length < 2) return setError(`Add at least two ${optionLabel.toLowerCase()} options, or switch options off.`);
      const names = cleanOptions.map((o) => o.name.toLowerCase());
      if (new Set(names).size !== names.length) return setError("Two options have the same name. Give each one a different name.");
    }
    // Only keep options that still exist.
    const chosenMethods = methodIds.filter((id) => shipping.methods.some((m) => m.id === id));
    if (limitMethods && chosenMethods.length === 0) return setError("Choose at least one delivery option, or allow all of them.");
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
        const path = `${slug}/${uniqueId()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
        if (uploadError) throw new Error("A photo didn't upload. Check your connection and try again.");
        paths.push(path);
      }

      // 2. Upload any new option photos and attach each option's photo.
      const optionsToSave: { name: string; hex?: string; stock: number; image?: string }[] = [];
      for (const [i, r] of keptRows.entries()) {
        let image = r.imagePath;
        if (r.file) {
          const blob = await compressImage(r.file);
          image = `${slug}/${uniqueId()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(image, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
          if (uploadError) throw new Error("A photo didn't upload. Check your connection and try again.");
        }
        optionsToSave.push({ ...cleanOptions[i], ...(image ? { image } : {}) });
      }

      // 3. Save the product.
      const row = {
        name: name.trim(),
        price: Number(Number(price).toFixed(2)),
        // With options, the product's stock is the total of all its options.
        stock: hasOptions ? cleanOptions.reduce((n, o) => n + o.stock, 0) : Math.max(0, Math.floor(Number(stock) || 0)),
        options: optionsToSave,
        option_label: optionLabel,
        free_shipping: freeShipping,
        shipping_method_ids: limitMethods ? chosenMethods : [],
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

      // 4. Clean up photos that were removed, including old option photos no longer used.
      const keptOptionImages = new Set(optionsToSave.map((o) => o.image).filter(Boolean));
      const oldOptionImages = (product?.options ?? []).map((o) => o.image).filter((p): p is string => Boolean(p) && !keptOptionImages.has(p));
      const toRemove = [...removedPaths, ...oldOptionImages];
      if (toRemove.length) {
        await supabase.storage.from(BUCKET).remove(toRemove);
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
      if (hasOptions) {
        setOptionRows(
          keptRows.map((r, i) => ({ key: r.key, name: r.name, hex: r.hex, stock: r.stock, imagePath: optionsToSave[i].image }))
        );
      }
      setLive(status === "live");
      setNotice(status === "live" ? "Saved. It's live in the shop." : "Saved. It's hidden from the shop.");
      router.refresh();
    } catch (e) {
      console.error("Product save failed:", e);
      const message = (e as Error).message;
      setError(message.startsWith("We couldn't") || message.startsWith("A photo") ? message : "Something went wrong while saving. Please try again.");
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
    // Delete the product's photos and any option photos with it.
    const allPhotos = [...product.imagePaths, ...product.options.map((o) => o.image).filter((p): p is string => Boolean(p))];
    if (allPhotos.length) await supabase.storage.from(BUCKET).remove(allPhotos);
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
        className="flex flex-col gap-[18px] px-4 pb-24 pt-5 lg:pb-10"
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
          {hasOptions ? (
            <div className={label}>
              In stock
              <span className="flex h-[52px] items-center rounded-xl border-[1.5px] border-dashed border-line-strong bg-paper px-3.5 text-base font-normal text-muted">
                {optionTotal} in total
              </span>
            </div>
          ) : (
            <label className={label}>
              In stock
              <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min={0} placeholder="0" className={input} />
            </label>
          )}
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
        <span className="-mt-2 text-[13px] text-subtle">Weight is used for delivery options priced by weight.</span>

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

        <section className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-4">
          <label className="flex items-center justify-between gap-4">
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">This product comes in different options</span>
              <span className="text-[13px] text-subtle">For example colours, sizes or lengths, each with its own stock.</span>
            </span>
            <input
              type="checkbox"
              checked={hasOptions}
              onChange={(e) => setHasOptions(e.target.checked)}
              className="h-[22px] w-[22px] shrink-0 accent-jade"
            />
          </label>

          {hasOptions && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Options are</span>
                <div className="flex flex-wrap gap-2">
                  {OPTION_LABELS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setOptionLabel(l)}
                      aria-pressed={optionLabel === l}
                      className={`h-10 rounded-full border-[1.5px] px-4 text-sm font-semibold ${
                        optionLabel === l ? "border-ink bg-ink text-cream" : "border-line-strong text-ink"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="flex flex-col gap-2.5">
                {optionRows.map((r, i) => {
                  const photo = r.preview ?? (r.imagePath ? productImageUrl(r.imagePath) : undefined);
                  return (
                    <li key={r.key} className="flex gap-3 rounded-2xl border border-line bg-paper p-2.5">
                      {/* This option's own photo, shown when a customer picks it */}
                      <div className="relative h-[100px] w-[80px] shrink-0 overflow-hidden rounded-xl border-[1.5px] border-dashed border-[#b3a591] bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {photo && <img src={photo} alt="" className="absolute inset-0 h-full w-full object-cover" />}
                        <label
                          className={`relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-center text-[11px] font-semibold ${
                            photo ? "text-transparent hover:bg-ink/30 hover:text-cream" : "text-muted"
                          }`}
                        >
                          <CameraIcon size={18} />
                          {photo ? "Replace" : "Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            aria-label={`Photo for option ${i + 1}`}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) pickOptionPhoto(r.key, f);
                              e.target.value = "";
                            }}
                          />
                        </label>
                        {photo && (
                          <button
                            type="button"
                            onClick={() => clearOptionPhoto(r.key)}
                            aria-label={`Remove photo for option ${i + 1}`}
                            className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-ink"
                          >
                            <CloseIcon size={14} />
                          </button>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            value={r.name}
                            onChange={(e) => updateRow(r.key, { name: e.target.value })}
                            maxLength={30}
                            aria-label={`${optionLabel} name`}
                            placeholder={isColour ? (i === 0 ? "e.g. Black" : "e.g. Brown") : optionLabel === "Length" ? 'e.g. 22"' : optionLabel === "Size" ? "e.g. Medium" : "e.g. Curly"}
                            className="h-11 min-w-0 flex-1 rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-base text-ink"
                          />
                          <button
                            type="button"
                            onClick={() => removeRow(r.key)}
                            disabled={optionRows.length === 1}
                            aria-label={`Remove option ${i + 1}`}
                            className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl text-subtle hover:bg-sand disabled:opacity-30"
                          >
                            <CloseIcon size={18} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {isColour && (
                            <input
                              type="color"
                              value={r.hex}
                              onChange={(e) => updateRow(r.key, { hex: e.target.value })}
                              aria-label={`Swatch colour for option ${i + 1}`}
                              className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border-[1.5px] border-line-strong bg-white p-1"
                            />
                          )}
                          <label className="flex items-center gap-2 text-[13px] font-semibold text-subtle">
                            Stock
                            <input
                              value={r.stock}
                              onChange={(e) => updateRow(r.key, { stock: e.target.value })}
                              type="number"
                              min={0}
                              placeholder="0"
                              className="h-11 w-[84px] rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-base font-normal text-ink"
                            />
                          </label>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="text-[13px] text-subtle">
                Add a photo to an option and the product page switches to it when a customer picks that option.
              </p>
              <button
                type="button"
                onClick={addRow}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-clay text-sm font-bold text-clay"
              >
                <PlusIcon size={16} />
                Add another {optionLabel.toLowerCase()}
              </button>
            </>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-[18px] border border-line bg-white p-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-semibold">Delivery</span>
            <span className="text-[13px] text-subtle">
              Prices for each option are set on the <Link href="/admin/delivery" className="font-semibold text-clay underline">Delivery</Link> page.
            </span>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-xl border border-line bg-paper p-3.5">
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold">Free delivery on this product</span>
              <span className="text-[13px] text-subtle">It won&apos;t add to the delivery cost at checkout</span>
            </span>
            <input type="checkbox" checked={freeShipping} onChange={(e) => setFreeShipping(e.target.checked)} className="h-[22px] w-[22px] shrink-0 accent-jade" />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Which delivery options can it use?</span>
            <span className="-mt-1 text-[13px] text-subtle">
              {freeShipping
                ? "Delivery is free on whichever of these the customer picks. Choose \"Only the ones I choose\" to limit it, for example free UK delivery only."
                : "Leave on \"All of them\" unless this product can't go with some options, for example large items that can't be sent abroad."}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[false, true].map((limited) => (
                <button
                  key={String(limited)}
                  type="button"
                  onClick={() => setLimitMethods(limited)}
                  aria-pressed={limitMethods === limited}
                  className={`rounded-xl border-[1.5px] px-3.5 py-3 text-left text-[15px] font-semibold ${
                    limitMethods === limited ? "border-ink bg-paper" : "border-line-strong"
                  }`}
                >
                  {limited ? "Only the ones I choose" : "All of them"}
                </button>
              ))}
            </div>
          </div>

          {limitMethods &&
            (shipping.methods.length === 0 ? (
              <p className="rounded-xl bg-[#f1e6c8] px-3.5 py-3 text-sm text-[#6e5316]">
                There are no delivery options yet. Add them on the <Link href="/admin/delivery" className="font-semibold underline">Delivery</Link> page first.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {shipping.zones.map((z) => {
                  const zoneMethods = shipping.methods.filter((m) => m.zoneId === z.id);
                  if (zoneMethods.length === 0) return null;
                  return (
                    <fieldset key={z.id} className="flex flex-col gap-1">
                      <legend className="mb-1 text-[13px] font-bold uppercase tracking-[0.08em] text-subtle">{z.name}</legend>
                      {zoneMethods.map((m) => (
                        <label key={m.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                          <input
                            type="checkbox"
                            checked={methodIds.includes(m.id)}
                            onChange={(e) =>
                              setMethodIds((ids) => (e.target.checked ? [...ids, m.id] : ids.filter((x) => x !== m.id)))
                            }
                            className="h-5 w-5 accent-clay"
                          />
                          {m.name}
                          {!m.active && <span className="text-xs text-subtle">(switched off)</span>}
                        </label>
                      ))}
                    </fieldset>
                  );
                })}
                <p className="text-[13px] text-subtle">Customers in a zone with none of these ticked won&apos;t be able to buy this product.</p>
              </div>
            ))}
        </section>

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

        {/* Floating save button: hovers above the tab bar on phones */}
        <div className="pointer-events-none sticky bottom-[100px] z-10 flex flex-col gap-2 lg:static">
          {error && (
            <p
              role="alert"
              className="pointer-events-auto rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark shadow-[0_8px_24px_rgba(26,24,20,0.12)] lg:shadow-none"
            >
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="pointer-events-auto flex items-center gap-2 rounded-xl bg-jade-soft px-3.5 py-2.5 text-sm font-semibold text-jade shadow-[0_8px_24px_rgba(26,24,20,0.12)] lg:shadow-none"
            >
              <CheckIcon size={16} />
              {notice}
            </p>
          )}
          <button
            type="submit"
            disabled={busy !== ""}
            className="pointer-events-auto h-[54px] w-full rounded-full bg-clay text-base font-semibold text-white shadow-[0_10px_30px_rgba(184,84,42,0.35)] hover:bg-clay-dark disabled:opacity-60 lg:shadow-none"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Publish product"}
          </button>
        </div>
      </form>
    </main>
  );
}