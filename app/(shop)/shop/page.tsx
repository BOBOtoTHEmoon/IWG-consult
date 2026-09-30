import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { categories, products } from "@/lib/data";

export const metadata = { title: "Shop all | Import with Goody" };

const prices = ["Under £15", "£15 to £30", "£30 to £50", "Over £50"];
const swatches = [
  ["Cream", "#efe6d6"],
  ["Terracotta", "#b8542a"],
  ["Sage", "#9aab92"],
  ["Charcoal", "#3b3733"],
  ["Blush", "#e2bdb3"],
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const active = categories.find((c) => c.slug === category);
  const list = active ? products.filter((p) => p.category === active.slug) : products;

  const pill = (on: boolean) =>
    `flex h-11 shrink-0 items-center rounded-full px-5 text-[15px] ${
      on ? "bg-ink font-semibold text-cream" : "border-[1.5px] border-line-strong font-medium text-ink hover:border-ink"
    }`;

  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      <section className="flex flex-col gap-3.5 pb-10 pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-subtle">
          <Link href="/" className="text-subtle">Home</Link>
          <span>/</span>
          <span className="text-ink">{active ? active.name : "Shop all"}</span>
        </nav>
        <h1 className="font-display text-[40px] font-medium tracking-[-0.02em] sm:text-6xl">
          {active ? active.name : "Shop all"}
        </h1>
        <p className="text-base text-muted sm:text-lg">Hand-picked homeware, fashion, baby essentials and gifts.</p>
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pt-3.5 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href="/shop" className={pill(!active)}>All</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className={pill(active?.slug === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-12 pb-24">
        {/* Filters: UI only for now, wire to query params with Supabase */}
        <aside className="hidden w-[260px] shrink-0 flex-col gap-8 pt-2 lg:flex">
          <fieldset className="flex flex-col gap-3 border-b border-line pb-7">
            <legend className="mb-3.5 text-[15px] font-bold">Price</legend>
            {prices.map((p) => (
              <label key={p} className="flex min-h-8 items-center gap-3 text-[15px]">
                <input type="radio" name="price" className="h-[18px] w-[18px] accent-clay" />
                {p}
              </label>
            ))}
          </fieldset>
          <fieldset className="flex flex-col gap-3 border-b border-line pb-7">
            <legend className="mb-3.5 text-[15px] font-bold">Colour</legend>
            <div className="flex flex-wrap gap-2.5">
              {swatches.map(([name, hex]) => (
                <button key={name} aria-label={name} className="h-9 w-9 rounded-full border border-line-strong" style={{ background: hex }} />
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3.5 text-[15px] font-bold">Availability</legend>
            <label className="flex min-h-8 items-center gap-3 text-[15px]">
              <input type="checkbox" defaultChecked className="h-[18px] w-[18px] accent-clay" />
              In stock only
            </label>
            <label className="flex min-h-8 items-center gap-3 text-[15px]">
              <input type="checkbox" className="h-[18px] w-[18px] accent-clay" />
              New this month
            </label>
          </fieldset>
        </aside>

        <div className="flex flex-1 flex-col gap-7">
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-muted">
              {list.length} {list.length === 1 ? "product" : "products"}
            </span>
            <label className="flex items-center gap-2.5 text-sm text-muted">
              Sort by
              <select className="h-11 rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-[15px] text-ink">
                <option>Newest</option>
                <option>Price, low to high</option>
                <option>Price, high to low</option>
              </select>
            </label>
          </div>
          {list.length === 0 ? (
            <div className="rounded-3xl border border-line bg-paper p-10 text-center">
              <p className="text-lg font-semibold">Nothing in this category yet.</p>
              <p className="mt-2 text-muted">
                Browse <Link href="/shop">everything</Link>, or{" "}
                <Link href="/sourcing">ask Goody to source it for you</Link>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} imageClass="h-[220px] sm:h-[300px] lg:h-[340px]" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
