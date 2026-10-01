"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRightIcon, SearchIcon } from "@/components/Icons";
import { gbp, orders, statusTone, type OrderStatus } from "@/lib/data";

const tabs: (OrderStatus | "All")[] = ["To pack", "Packed", "Shipped", "All"];

const action: Record<OrderStatus, string> = {
  "To pack": "Mark as packed",
  Packed: "Add Royal Mail tracking",
  Shipped: "View tracking",
  Delivered: "View order",
};

export default function AdminOrders() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("To pack");
  const [query, setQuery] = useState("");
  // Local copy so "Mark as packed" works here. TODO (backend phase): save to Supabase.
  const [statuses, setStatuses] = useState<Record<string, OrderStatus>>(
    Object.fromEntries(orders.map((o) => [o.id, o.status]))
  );

  const q = query.trim().toLowerCase();
  const shown = orders.filter(
    (o) =>
      (tab === "All" || statuses[o.id] === tab) &&
      (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.destination.toLowerCase().includes(q))
  );
  const count = (t: OrderStatus) => orders.filter((o) => statuses[o.id] === t).length;

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-4 px-4 py-6 sm:px-8 lg:py-9">
      <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Orders</h1>

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
          const n = t !== "All" && t !== "Shipped" && count(t) > 0 ? ` · ${count(t)}` : "";
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
              {t}
              {n}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {shown.length === 0 && (
          <p className="rounded-[18px] border border-line bg-paper p-8 text-center text-muted">
            {q ? "No orders match your search." : "No orders here right now."}
          </p>
        )}
        {shown.map((o) => {
          const status = statuses[o.id];
          return (
            <article key={o.id} className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4">
              <Link href={`/admin/orders/${o.id}`} className="flex flex-col gap-3 text-ink">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold">#{o.id}</span>
                  <span className={`flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${statusTone[status]}`}>{status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-[52px] w-[52px] shrink-0 rounded-xl" style={{ background: o.tint }} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{o.customer}</span>
                    <span className="truncate text-[13px] text-muted">
                      {o.destination} | {o.international ? "International" : `${o.items} ${o.items === 1 ? "item" : "items"}`}
                    </span>
                  </span>
                  <span className="text-base font-bold">{gbp(o.total)}</span>
                  <ChevronRightIcon size={18} className="shrink-0 text-subtle" />
                </div>
              </Link>
              {status === "To pack" ? (
                <button
                  onClick={() => setStatuses((s) => ({ ...s, [o.id]: "Packed" }))}
                  className="h-11 rounded-xl bg-ink text-[15px] font-semibold text-cream"
                >
                  {action[status]}
                </button>
              ) : (
                <Link
                  href={`/admin/orders/${o.id}`}
                  className={`flex h-11 items-center justify-center rounded-xl text-[15px] font-semibold ${
                    status === "Packed" ? "bg-ink text-cream" : "bg-[#f0e6d8] text-ink"
                  }`}
                >
                  {action[status]}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}