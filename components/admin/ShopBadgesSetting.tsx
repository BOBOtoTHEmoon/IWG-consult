"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveBadgeSettings } from "@/app/admin/badge-actions";
import type { BadgeSettings } from "@/lib/shop-signals";

// Lets Goody switch the shop's sales badges on or off. Everything shown comes from real orders.
export default function ShopBadgesSetting({ initial }: { initial: BadgeSettings }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [minText, setMinText] = useState(String(initial.soldCountMin));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, startSaving] = useTransition();
  const changed =
    value.showSoldCounts !== initial.showSoldCounts ||
    value.showRecentPurchases !== initial.showRecentPurchases ||
    minText !== String(initial.soldCountMin);

  function save() {
    setMessage(null);
    startSaving(async () => {
      const result = await saveBadgeSettings({ ...value, soldCountMin: Number(minText) });
      setMessage(result.ok ? { ok: true, text: "Saved. The shop has been updated." } : { ok: false, text: result.error });
      if (result.ok) router.refresh();
    });
  }

  const row = "flex items-center justify-between gap-4 rounded-xl border border-line bg-paper p-3.5";
  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-line bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold">Shop badges</span>
        <span className="text-[13px] text-subtle">These use your real orders. Cancelled orders aren&apos;t counted.</span>
      </div>

      <label className={row}>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">Show how many have sold</span>
          <span className="text-[13px] text-subtle">&quot;24 sold&quot; on products, and a Best seller badge on your top 3.</span>
        </span>
        <input
          type="checkbox"
          checked={value.showSoldCounts}
          onChange={(e) => setValue({ ...value, showSoldCounts: e.target.checked })}
          className="h-[22px] w-[22px] shrink-0 accent-jade"
        />
      </label>

      {value.showSoldCounts && (
        <label className="flex flex-wrap items-center gap-3 px-1 text-sm font-semibold">
          Only show once a product has sold
          <input
            value={minText}
            onChange={(e) => setMinText(e.target.value)}
            type="number"
            min={1}
            className="h-11 w-[90px] rounded-xl border-[1.5px] border-line-strong bg-white px-3 text-base font-normal"
          />
          <span className="font-normal text-subtle">or more</span>
        </label>
      )}

      <label className={row}>
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold">Show recent purchases</span>
          <span className="text-[13px] text-subtle">
            A small note like &quot;Someone in London bought this&quot;, from the last 7 days. Only the town is shown, never names.
          </span>
        </span>
        <input
          type="checkbox"
          checked={value.showRecentPurchases}
          onChange={(e) => setValue({ ...value, showRecentPurchases: e.target.checked })}
          className="h-[22px] w-[22px] shrink-0 accent-jade"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !changed}
          className="h-11 rounded-full bg-clay px-5 text-sm font-semibold text-white hover:bg-clay-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save badges"}
        </button>
        {message && (
          <span role="status" className={`text-sm font-semibold ${message.ok ? "text-jade" : "text-clay-dark"}`}>
            {message.text}
          </span>
        )}
      </div>
    </section>
  );
}