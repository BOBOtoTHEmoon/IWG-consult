"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon } from "../Icons";

type Purchase = { key: string; name: string; slug: string; image: string | null; place: string; at: string };

const FIRST_DELAY = 8000; // wait before the first one
const GAP = 35000; // time between pop-ups
const SHOW_FOR = 7000; // how long each stays up
const MAX_PER_VISIT = 3;
const STORE_KEY = "iwg-recent-purchases";

function ago(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function readSeen(): { keys: string[]; off: boolean } {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "") ?? { keys: [], off: false };
  } catch {
    return { keys: [], off: false };
  }
}
function saveSeen(v: { keys: string[]; off: boolean }) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(v));
  } catch {
    // Private browsing can block storage. The pop-ups still work for this page.
  }
}

// A small note in the corner when someone recently bought something. Real orders only, a few per visit.
export default function RecentPurchases() {
  const pathname = usePathname();
  const [queue, setQueue] = useState<Purchase[]>([]);
  const [current, setCurrent] = useState<Purchase | null>(null);
  const hidden = pathname.startsWith("/payment") || pathname.startsWith("/order");

  // Load the recent purchases once per visit.
  useEffect(() => {
    if (readSeen().off) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/recent-purchases");
        const data = await res.json();
        if (cancelled || !Array.isArray(data.items)) return;
        const seen = readSeen().keys;
        setQueue((data.items as Purchase[]).filter((p) => !seen.includes(p.key)));
      } catch {
        // Not important enough to show an error.
      }
    }, FIRST_DELAY);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Show them one at a time, with a long gap, and stop after a few.
  useEffect(() => {
    if (queue.length === 0 || current || hidden) return;
    const seen = readSeen();
    if (seen.off || seen.keys.length >= MAX_PER_VISIT) return;
    const t = setTimeout(
      () => {
        if (document.hidden) return;
        const [next, ...rest] = queue;
        saveSeen({ ...seen, keys: [...seen.keys, next.key] });
        setQueue(rest);
        setCurrent(next);
      },
      seen.keys.length === 0 ? 0 : GAP
    );
    return () => clearTimeout(t);
  }, [queue, current, hidden]);

  // Each one disappears on its own.
  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), SHOW_FOR);
    return () => clearTimeout(t);
  }, [current]);

  if (!current || hidden) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-24 z-40 flex items-center gap-3 rounded-[18px] border border-line bg-white p-3 pr-2 shadow-[0_12px_32px_rgba(26,24,20,0.16)] motion-safe:animate-[pop-in_0.35s_ease-out] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[340px]"
    >
      <Link href={`/product/${current.slug}`} onClick={() => setCurrent(null)} className="flex min-w-0 flex-1 items-center gap-3">
        {current.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="h-14 w-14 shrink-0 rounded-xl bg-sand" />
        )}
        <span className="flex min-w-0 flex-col gap-0.5 text-[13px] leading-snug">
          <span className="text-subtle">Someone in {current.place} bought</span>
          <span className="truncate text-[14px] font-semibold text-ink">{current.name}</span>
          <span className="text-subtle">{ago(current.at)}</span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => {
          setCurrent(null);
          saveSeen({ ...readSeen(), off: true }); // closing one turns them off for this visit
        }}
        aria-label="Close"
        className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full text-subtle hover:bg-sand"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}