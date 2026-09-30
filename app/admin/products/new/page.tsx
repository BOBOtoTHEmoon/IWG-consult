import Link from "next/link";
import { CameraIcon, ChevronLeftIcon } from "@/components/Icons";
import { categories } from "@/lib/data";

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";

// TODO (backend phase): server action that uploads photos to Supabase Storage and inserts the product.
export default function NewProductPage() {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col">
      <header className="flex h-16 items-center gap-1 border-b border-line pl-1.5 pr-3 lg:mt-6 lg:border-b-0">
        <Link href="/admin" aria-label="Back" className="flex h-11 w-11 items-center justify-center text-ink">
          <ChevronLeftIcon size={22} />
        </Link>
        <h1 className="flex-1 text-lg font-bold lg:font-display lg:text-[32px] lg:font-medium">New product</h1>
        <button form="product-form" name="intent" value="draft" className="h-10 px-3 text-[15px] font-semibold text-clay">
          Save draft
        </button>
      </header>

      <form id="product-form" className="flex flex-col gap-[18px] px-4 py-5">
        <div className="flex flex-col gap-2.5">
          <span className="text-sm font-semibold">
            Photos <span className="font-normal text-subtle">(first one is the cover)</span>
          </span>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            <div className="relative h-28 rounded-[14px] bg-[#ddd0bc]">
              <span className="absolute bottom-2 left-2 flex h-[22px] items-center rounded-full bg-ink px-2 text-[11px] font-semibold text-cream">Cover</span>
            </div>
            <div className="h-28 rounded-[14px] bg-[#e6d3bf]" />
            <label className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#b3a591] bg-paper text-[13px] font-semibold text-muted">
              <CameraIcon size={22} />
              Add photo
              <input type="file" accept="image/*" multiple capture="environment" className="sr-only" />
            </label>
          </div>
        </div>

        <label className={label}>Product name<input name="name" required defaultValue="Rattan storage basket" className={input} /></label>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>Price (£)<input name="price" inputMode="decimal" defaultValue="24.00" className={input} /></label>
          <label className={label}>In stock<input name="stock" type="number" min={0} defaultValue={12} className={input} /></label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            Category
            <select name="category" className={input}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className={label}>Weight (g)<input name="weight" type="number" min={0} defaultValue={850} className={input} /></label>
        </div>
        <span className="-mt-2 text-[13px] text-subtle">Weight sets the Royal Mail delivery band at checkout.</span>

        <label className={label}>
          Description
          <textarea
            name="description"
            rows={4}
            defaultValue="Hand-woven rattan with a lid. Good for blankets, toys or laundry."
            className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-3 text-base font-normal leading-normal"
          />
        </label>

        <label className="flex min-h-[52px] items-center justify-between rounded-[14px] border border-line bg-white px-4 text-[15px] font-semibold">
          Show in shop
          <input name="visible" type="checkbox" defaultChecked className="h-[22px] w-[22px] accent-jade" />
        </label>

        <div className="sticky bottom-[76px] -mx-4 border-t border-line bg-paper px-4 pb-4 pt-3 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0">
          <button name="intent" value="publish" className="h-[54px] w-full rounded-full bg-clay text-base font-semibold text-white hover:bg-clay-dark">
            Publish product
          </button>
        </div>
      </form>
    </main>
  );
}
