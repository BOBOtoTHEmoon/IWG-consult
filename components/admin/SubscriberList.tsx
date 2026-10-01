"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Subscriber } from "@/lib/subscribers";
import { createClient } from "@/lib/supabase/client";
import { SearchIcon } from "../Icons";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }).format(new Date(iso));

export default function SubscriberList({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [copied, setCopied] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = subscribers.filter((s) => !q || s.email.includes(q));

  function downloadCsv() {
    const rows = [["Email", "Signed up", "Where"], ...subscribers.map((s) => [s.email, formatDate(s.createdAt), s.source])];
    const csv = rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `import-with-goody-email-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(subscribers.map((s) => s.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard can be blocked; the download still works. */
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("newsletter_subscribers").delete().eq("id", id);
    setBusyId("");
    setConfirmId("");
    router.refresh();
  }

  if (subscribers.length === 0) {
    return (
      <div className="rounded-[20px] border border-line bg-paper p-10 text-center">
        <p className="text-lg font-semibold">No sign-ups yet</p>
        <p className="mt-1 text-sm text-muted">Emails from the &quot;Be first to see new arrivals&quot; form on the homepage will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label className="relative block flex-1">
          <span className="sr-only">Search emails</span>
          <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search emails"
            className="h-12 w-full rounded-full border-[1.5px] border-line-strong bg-paper pl-11 pr-4 text-base"
          />
        </label>
        <div className="grid grid-cols-2 gap-2.5 sm:flex">
          <button onClick={copyAll} className="h-12 rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-sm font-semibold text-ink">
            {copied ? "Copied" : "Copy all"}
          </button>
          <button onClick={downloadCsv} className="h-12 rounded-full bg-clay px-4 text-sm font-semibold text-white">
            Download spreadsheet
          </button>
        </div>
      </div>

      <ul className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper">
        {shown.map((s) => (
          <li key={s.id} className="flex items-center gap-3 border-b border-[#ece3d5] px-4 py-3 last:border-b-0">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[15px] font-semibold">{s.email}</span>
              <span className="text-[13px] text-subtle">{formatDate(s.createdAt)}</span>
            </span>
            {confirmId === s.id ? (
              <span className="flex shrink-0 gap-1.5">
                <button onClick={() => setConfirmId("")} className="h-9 rounded-full px-3 text-sm font-semibold text-ink hover:bg-sand">
                  Keep
                </button>
                <button
                  onClick={() => remove(s.id)}
                  disabled={busyId === s.id}
                  className="h-9 rounded-full bg-clay-dark px-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Remove
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmId(s.id)} className="h-9 shrink-0 rounded-full px-3 text-sm font-semibold text-clay-dark hover:bg-sand">
                Remove
              </button>
            )}
          </li>
        ))}
        {shown.length === 0 && <li className="p-6 text-center text-sm text-muted">No emails match.</li>}
      </ul>
    </>
  );
}