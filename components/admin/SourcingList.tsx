"use client";

import Link from "next/link";
import { useState } from "react";
import { gbp } from "@/lib/data";
import { SOURCING_LABEL, SOURCING_TONE, formatDay, quoteTotal, type SourcingRequest, type SourcingStatus } from "@/lib/sourcing-types";
import { SearchIcon } from "../Icons";

const tabs: (SourcingStatus | "all")[] = ["new", "quote_sent", "going_ahead", "not_proceeding", "awaiting_payment", "all"];

export default function SourcingList({ requests }: { requests: SourcingRequest[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("new");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const count = (s: SourcingStatus) => requests.filter((r) => r.status === s).length;
  const shown = requests.filter(
    (r) =>
      (tab === "all" || r.status === tab) &&
      (!q || r.name.toLowerCase().includes(q) || r.number.toLowerCase().includes(q) || r.email.toLowerCase().includes(q))
  );

  if (requests.length === 0) {
    return (
      <div className="rounded-[20px] border border-line bg-paper p-10 text-center">
        <p className="text-lg font-semibold">No sourcing requests yet</p>
        <p className="mt-1 text-sm text-muted">Requests appear here when customers send their list.</p>
      </div>
    );
  }

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search requests</span>
        <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or request number"
          className="h-12 w-full rounded-full border-[1.5px] border-line-strong bg-paper pl-11 pr-4 text-base"
        />
      </label>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter requests">
        {tabs.map((t) => {
          const on = t === tab;
          const n = t === "all" ? 0 : count(t);
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
              {t === "all" ? "All" : SOURCING_LABEL[t]}
              {n > 0 ? ` · ${n}` : ""}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-[20px] border border-line bg-paper p-8 text-center text-muted">Nothing here right now.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((r) => {
            const total = quoteTotal(r);
            return (
              <li key={r.id}>
                <Link
                  href={`/admin/sourcing/${r.number}`}
                  className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4 text-ink hover:border-line-strong sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-base font-semibold">{r.name}</span>
                      <span className="truncate text-[13px] text-subtle">
                        {r.number} | {r.country} | {formatDay(r.createdAt)}
                      </span>
                    </span>
                    <span className={`inline-flex h-[26px] shrink-0 items-center rounded-full px-2.5 text-xs font-bold ${SOURCING_TONE[r.status]}`}>
                      {SOURCING_LABEL[r.status]}
                    </span>
                  </div>
                  <p className="truncate text-[15px] text-muted">{r.items.map((i) => `${i.quantity} x ${i.name}`).join(", ")}</p>
                  <div className="flex items-center justify-between border-t border-[#ece3d5] pt-3 text-sm">
                    <span className="text-subtle">
                      {r.items.length} {r.items.length === 1 ? "item" : "items"} | £50 {r.feeStatus === "unpaid" ? "not paid" : r.feeStatus}
                    </span>
                    <span className="font-semibold">
                      {total !== null ? `Quote ${gbp(total)}` : r.status === "awaiting_payment" ? "Waiting for payment" : "Needs a quote"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}