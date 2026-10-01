"use client";

import Link from "next/link";
import { useState } from "react";
import { gbp, serviceCharge, sourcingRequests, sourcingTone, type SourcingStatus } from "@/lib/data";

const tabs: (SourcingStatus | "All")[] = ["New", "Quote sent", "Going ahead", "Not proceeding", "All"];

export default function AdminSourcing() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("New");
  const shown = sourcingRequests.filter((r) => tab === "All" || r.status === tab);
  const count = (t: SourcingStatus) => sourcingRequests.filter((r) => r.status === t).length;

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Sourcing requests</h1>
        <span className="text-sm text-subtle">Lists customers have sent, with their £50 commitment fee paid.</span>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter requests">
        {tabs.map((t) => {
          const on = t === tab;
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
              {t !== "All" && count(t) > 0 ? ` · ${count(t)}` : ""}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-[20px] border border-line bg-paper p-8 text-center text-muted">Nothing here right now.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((r) => {
            const itemCount = r.items.length;
            const total = r.quote ? r.quote.productCost + serviceCharge(r.quote.productCost) + r.quote.shipping : null;
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/sourcing/${r.id}`}
                  className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4 text-ink hover:border-line-strong sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-base font-semibold">{r.name}</span>
                      <span className="truncate text-[13px] text-subtle">
                        #{r.id} | {r.country} | {r.submitted}
                      </span>
                    </span>
                    <span className={`inline-flex h-[26px] shrink-0 items-center rounded-full px-2.5 text-xs font-bold ${sourcingTone[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="truncate text-[15px] text-muted">
                    {r.items.map((i) => `${i.qty} x ${i.name}`).join(", ")}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#ece3d5] pt-3 text-sm">
                    <span className="text-subtle">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                    <span className="font-semibold">{total !== null ? `Quote ${gbp(total)}` : "Needs a quote"}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}