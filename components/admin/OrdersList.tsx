"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gbp } from "@/lib/data";
import { STATUS_LABEL, STATUS_TONE, destination, itemCount, shortName, type Order, type OrderStatus } from "@/lib/order-types";
import { createClient } from "@/lib/supabase/client";
import { ChevronRightIcon, SearchIcon } from "../Icons";
import ProductImage from "../ProductImage";

const tabs: (OrderStatus | "all")[] = ["to_pack", "packed", "shipped", "all"];

export default function OrdersList({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]>("to_pack");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const q = query.trim().toLowerCase();
  const shown = orders.filter(
    (o) =>
      (tab === "all" || o.status === tab) &&
      (!q ||
        o.number.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.country.toLowerCase().includes(q))
  );
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  async function markPacked(order: Order) {
    setBusyId(order.id);
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: "packed", packed_at: new Date().toISOString() })
      .eq("id", order.id);
    setBusyId("");
    if (error) return setError("We couldn't update that order. Please try again.");
    router.refresh();
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-[20px] border border-line bg-paper p-10 text-center">
        <p className="text-lg font-semibold">No orders yet</p>
        <p className="mt-1 text-sm text-muted">They&apos;ll appear here as soon as someone checks out.</p>
      </div>
    );
  }

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search orders</span>
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, order number or place"
          className="h-12 w-full rounded-full border-[1.5px] border-line-strong bg-paper pl-11 pr-4 text-base"
        />
      </label>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter orders">
        {tabs.map((t) => {
          const on = t === tab;
          const n = t === "to_pack" || t === "packed" ? count(t) : 0;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t)}
              className={`h-10 shrink-0 rounded-full border-[1.5px] px-3.5 text-sm font-semibold ${
                on ? "border-ink bg-ink text-cream" : "border-line-strong text-ink"
              }`}
            >
              {t === "all" ? "All" : STATUS_LABEL[t]}
              {n > 0 ? ` · ${n}` : ""}
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="rounded-[14px] bg-[#f6ddd0] px-4 py-3 text-sm font-semibold text-clay-dark">{error}</p>
      )}

      <div className="flex flex-col gap-3">
        {shown.length === 0 && (
          <p className="rounded-[18px] border border-line bg-paper p-8 text-center text-muted">
            {q ? "No orders match your search." : "Nothing here right now."}
          </p>
        )}
        {shown.map((o) => {
          const items = itemCount(o);
          return (
            <article key={o.id} className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4">
              <Link href={`/admin/orders/${o.number}`} className="flex flex-col gap-3 text-ink">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold">#{o.number}</span>
                  <span className={`flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${STATUS_TONE[o.status]}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ProductImage
                    src={o.items[0]?.imageUrl ?? undefined}
                    alt=""
                    tint="#efe5d4"
                    className="h-[52px] w-[52px] shrink-0 rounded-xl"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{shortName(o.customerName)}</span>
                    <span className="truncate text-[13px] text-muted">
                      {destination(o)} | {items} {items === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="text-base font-bold">{gbp(o.total)}</span>
                  <ChevronRightIcon size={18} className="shrink-0 text-subtle" />
                </div>
              </Link>
              {o.status === "to_pack" && (
                <button
                  onClick={() => markPacked(o)}
                  disabled={busyId === o.id}
                  className="h-11 rounded-xl bg-ink text-[15px] font-semibold text-cream disabled:opacity-60"
                >
                  {busyId === o.id ? "Saving..." : "Mark as packed"}
                </button>
              )}
              {o.status === "packed" && (
                <Link
                  href={`/admin/orders/${o.number}`}
                  className="flex h-11 items-center justify-center rounded-xl bg-ink text-[15px] font-semibold text-cream"
                >
                  Add Royal Mail tracking
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}