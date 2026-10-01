"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { PRICE_RANGES } from "@/lib/product-types";
import { CloseIcon } from "../Icons";

// Updates the address bar, which re-runs the shop page with the new filters.
function useFilterParams() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  };

  return { params, update, pending };
}

function FilterControls() {
  const { params, update } = useFilterParams();
  const price = params.get("price") ?? "";
  const inStock = params.get("stock") === "1";

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-1 border-b border-line pb-7">
        <legend className="mb-3 text-[15px] font-bold">Price</legend>
        {[{ value: "", label: "Any price" }, ...PRICE_RANGES].map((r) => (
          <label key={r.value || "any"} className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
            <input
              type="radio"
              name="price"
              checked={price === r.value}
              onChange={() => update({ price: r.value || null })}
              className="h-[18px] w-[18px] accent-clay"
            />
            {r.label}
          </label>
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-1">
        <legend className="mb-3 text-[15px] font-bold">Availability</legend>
        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => update({ stock: e.target.checked ? "1" : null })}
            className="h-[18px] w-[18px] accent-clay"
          />
          In stock only
        </label>
      </fieldset>
    </div>
  );
}

// Desktop: filters in the left column.
export function FilterSidebar() {
  return (
    <aside className="hidden w-[240px] shrink-0 pt-2 lg:block">
      <FilterControls />
    </aside>
  );
}

export function SortSelect() {
  const { params, update } = useFilterParams();
  return (
    <label className="flex items-center gap-2.5 text-sm text-muted">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={params.get("sort") ?? "newest"}
        onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
        aria-label="Sort products"
        className="h-11 rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-[15px] text-ink"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price, low to high</option>
        <option value="price-desc">Price, high to low</option>
      </select>
    </label>
  );
}

// Phones and tablets: a "Filters" button that opens a bottom sheet.
export function FilterSheet() {
  const [open, setOpen] = useState(false);
  const { params, update } = useFilterParams();
  const active = (params.get("price") ? 1 : 0) + (params.get("stock") === "1" ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-[15px] font-semibold text-ink lg:hidden"
      >
        Filters
        {active > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-bold text-white">{active}</span>
        )}
      </button>

      <div aria-hidden={!open} inert={!open} className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[28px] bg-cream transition-transform duration-300 ease-out motion-reduce:transition-none ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
            <h2 className="font-display text-2xl">Filters</h2>
            <button onClick={() => setOpen(false)} aria-label="Close filters" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand">
              <CloseIcon />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-6">
            <FilterControls />
          </div>
          <div className="flex gap-3 border-t border-line bg-paper px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <button
              onClick={() => update({ price: null, stock: null })}
              disabled={active === 0}
              className="h-12 flex-1 rounded-full border-[1.5px] border-line-strong font-semibold text-ink disabled:opacity-40"
            >
              Clear
            </button>
            <button onClick={() => setOpen(false)} className="h-12 flex-[2] rounded-full bg-clay font-semibold text-white">
              Show results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}