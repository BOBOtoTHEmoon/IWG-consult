import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/shop/ProductCard";
import { FilterSheet, FilterSidebar, SortSelect } from "@/components/shop/ShopFilters";
import { categories } from "@/lib/data";
import { getLiveProducts } from "@/lib/products";

export const metadata = { title: "Shop all | Import with Goody" };

type Params = { category?: string; q?: string; price?: string; stock?: string; sort?: string };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const active = categories.find((c) => c.slug === params.category);
  const search = params.q?.trim() ?? "";

  const list = await getLiveProducts({
    category: active?.slug,
    search,
    price: params.price,
    inStock: params.stock === "1",
    sort: params.sort,
  });

  // Category pills keep the other filters (price, stock, sort, search) as they are.
  const withCategory = (slug?: string) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value && key !== "category") next.set(key, value);
    if (slug) next.set("category", slug);
    const qs = next.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const filtersOn = Boolean(params.price || params.stock === "1" || search);
  const title = search ? `Results for "${search}"` : active ? active.name : "Shop all";

  const pill = (on: boolean) =>
    `flex h-11 shrink-0 items-center rounded-full px-5 text-[15px] ${
      on ? "bg-ink font-semibold text-cream" : "border-[1.5px] border-line-strong font-medium text-ink hover:border-ink"
    }`;

  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      <section className="flex flex-col gap-3.5 pb-8 pt-8 lg:pb-10 lg:pt-12">
        <nav aria-label="Breadcrumb" className="flex gap-2 text-sm text-subtle">
          <Link href="/" className="text-subtle">Home</Link>
          <span>/</span>
          <span className="text-ink">{active ? active.name : "Shop all"}</span>
        </nav>
        <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em] sm:text-6xl">{title}</h1>
        {!search && <p className="text-base text-muted sm:text-lg">Hand-picked homeware, fashion, baby essentials and gifts.</p>}
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pt-3.5 sm:mx-0 sm:flex-wrap sm:px-0">
          <Link href={withCategory()} className={pill(!active)}>All</Link>
          {categories.map((c) => (
            <Link key={c.slug} href={withCategory(c.slug)} className={pill(active?.slug === c.slug)}>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex items-start gap-12 pb-24">
        <Suspense>
          <FilterSidebar />
        </Suspense>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[15px] text-muted">
              {list.length} {list.length === 1 ? "product" : "products"}
            </span>
            <div className="flex items-center gap-2">
              <Suspense>
                <FilterSheet />
                <SortSelect />
              </Suspense>
            </div>
          </div>

          {list.length === 0 ? (
            <div className="rounded-3xl border border-line bg-paper p-8 text-center sm:p-10">
              <p className="text-lg font-semibold">{search ? `Nothing matches "${search}".` : "Nothing here yet."}</p>
              <p className="mt-2 text-muted">
                {filtersOn ? (
                  <>
                    Try <Link href={active ? `/shop?category=${active.slug}` : "/shop"} className="text-clay underline">clearing the filters</Link>, or{" "}
                  </>
                ) : (
                  "Browse everything, or "
                )}
                <Link href="/sourcing" className="text-clay underline">ask Goody to source it for you</Link>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} imageClass="h-[200px] sm:h-[300px] lg:h-[340px]" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}