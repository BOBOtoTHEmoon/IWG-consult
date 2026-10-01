"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, categoryName, gbp } from "@/lib/data";
import { LOW_STOCK, type ShopProduct } from "@/lib/product-types";
import ProductImage from "../ProductImage";
import { ChevronRightIcon, SearchIcon } from "../Icons";

function StockBadge({ product }: { product: ShopProduct }) {
  if (product.status === "draft")
    return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#e6e1d9] px-2.5 text-xs font-semibold text-muted">Draft</span>;
  if (product.stock === 0)
    return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#f6ddd0] px-2.5 text-xs font-semibold text-clay-dark">Sold out</span>;
  if (product.stock <= LOW_STOCK)
    return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-[#f1e6c8] px-2.5 text-xs font-semibold text-[#6e5316]">{product.stock} left</span>;
  return <span className="inline-flex h-6 shrink-0 items-center rounded-full bg-jade-soft px-2.5 text-xs font-semibold text-jade">{product.stock} in stock</span>;
}

export default function ProductList({ products }: { products: ShopProduct[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q));
  }, [products, query, cat]);

  const chip = (on: boolean) =>
    `h-10 shrink-0 rounded-full border-[1.5px] px-3.5 text-sm font-semibold ${
      on ? "border-ink bg-ink text-cream" : "border-line-strong text-ink"
    }`;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[20px] border border-line bg-paper p-10 text-center">
        <p className="text-lg font-semibold">No products yet</p>
        <p className="text-sm text-muted">Add the first one and it will appear in the shop.</p>
        <Link href="/admin/products/new" className="mt-2 flex h-11 items-center rounded-full bg-clay px-5 text-sm font-semibold text-white">
          Add product
        </Link>
      </div>
    );
  }

  return (
    <>
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
          <p className="mt-1 text-sm text-muted">Try another search or category.</p>
        </div>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper">
          {list.map((p) => (
            <li key={p.id} className="border-b border-[#ece3d5] last:border-b-0">
              <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3 p-3 text-ink hover:bg-sand/50 sm:gap-4 sm:p-4">
                <ProductImage src={p.images[0]} alt="" tint={p.tint} className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16" />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-[15px] font-semibold sm:text-base">{p.name}</span>
                  <span className="text-[13px] text-subtle sm:text-sm">
                    {categoryName(p.category)} | {gbp(p.price)}
                  </span>
                </span>
                <StockBadge product={p} />
                <ChevronRightIcon size={18} className="shrink-0 text-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}