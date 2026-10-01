"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRightIcon, PlusIcon, SearchIcon } from "@/components/Icons";
import { categories, categoryName, gbp, products, sampleStock } from "@/lib/data";

function StockBadge({ count }: { count: number }) {
  if (count === 0)
    return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#f6ddd0] px-2.5 text-xs font-semibold text-clay-dark">Sold out</span>;
  if (count <= 3)
    return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#f1e6c8] px-2.5 text-xs font-semibold text-[#6e5316]">{count} left</span>;
  return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-jade-soft px-2.5 text-xs font-semibold text-jade">{count} in stock</span>;
}

export default function AdminProducts() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q));
  }, [query, cat]);

  const chip = (on: boolean) =>
    `h-10 shrink-0 rounded-full border-[1.5px] px-3.5 text-sm font-semibold ${
      on ? "border-ink bg-ink text-cream" : "border-line-strong text-ink"
    }`;

  return (
    <main className="mx-auto flex max-w-[1100px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Products</h1>
          <span className="text-sm text-subtle">{products.length} in the shop</span>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-clay px-4 text-sm font-semibold text-white hover:bg-clay-dark sm:h-[46px] sm:px-5 sm:text-[15px]"
        >
          <PlusIcon size={18} />
          Add product
        </Link>
      </div>

      <label className="relative block">
        <span className="sr-only">Search products</span>
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products"
          className="h-12 w-full rounded-full border-[1.5px] border-line-strong bg-paper pl-11 pr-4 text-base"
        />
      </label>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <button onClick={() => setCat("all")} className={chip(cat === "all")}>All</button>
        {categories.map((c) => (
          <button key={c.slug} onClick={() => setCat(c.slug)} className={chip(cat === c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-paper p-8 text-center">
          <p className="font-semibold">No products match.</p>
          <p className="mt-1 text-sm text-muted">Try another search or category, or add a new product.</p>
        </div>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper">
          {list.map((p) => (
            <li key={p.slug} className="border-b border-[#ece3d5] last:border-b-0">
              <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3 p-3 text-ink hover:bg-sand/50 sm:gap-4 sm:p-4">
                <span className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16" style={{ background: p.tint }} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-[15px] font-semibold sm:text-base">{p.name}</span>
                  <span className="text-[13px] text-subtle sm:text-sm">
                    {categoryName(p.category)} | {gbp(p.price)}
                  </span>
                </span>
                <StockBadge count={sampleStock[p.slug] ?? 0} />
                <ChevronRightIcon size={18} className="shrink-0 text-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}