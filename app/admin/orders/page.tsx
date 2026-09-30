"use client";

import { useState } from "react";
import { SearchIcon } from "@/components/Icons";
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
  const shown = orders.filter((o) => tab === "All" || o.status === tab);
  const count = (t: OrderStatus) => orders.filter((o) => o.status === t).length;

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-4 px-4 py-6 sm:px-8 lg:py-9">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-[32px] font-medium">Orders</h1>
        <button aria-label="Search orders" className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-line-strong bg-paper">
          <SearchIcon size={19} />
        </button>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter orders">
        {tabs.map((t) => {
          const on = t === tab;
          const n = t !== "All" && t !== "Shipped" ? ` · ${count(t)}` : "";
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
          <p className="rounded-[18px] border border-line bg-paper p-8 text-center text-muted">No orders here right now.</p>
        )}
        {shown.map((o) => (
          <article key={o.id} className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold">#{o.id}</span>
              <span className={`flex h-[26px] items-center rounded-full px-2.5 text-xs font-bold ${statusTone[o.status]}`}>{o.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="h-[52px] w-[52px] shrink-0 rounded-xl" style={{ background: o.tint }} />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-semibold">{o.customer}</span>
                <span className="text-[13px] text-muted">
                  {o.destination} · {o.international ? "International" : `${o.items} ${o.items === 1 ? "item" : "items"}`}
                </span>
              </span>
              <span className="text-base font-bold">{gbp(o.total)}</span>
            </div>
            <button
              className={`h-11 rounded-xl text-[15px] font-semibold ${
                o.status === "Shipped" || o.status === "Delivered" ? "bg-[#f0e6d8] text-ink" : "bg-ink text-cream"
              }`}
            >
              {action[o.status]}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
