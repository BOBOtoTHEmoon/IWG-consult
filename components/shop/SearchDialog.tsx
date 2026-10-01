"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gbp } from "@/lib/data";
import { productImageUrl } from "@/lib/product-types";
import { createClient } from "@/lib/supabase/client";
import { ArrowRightIcon, CloseIcon, SearchIcon } from "../Icons";
import ProductImage from "../ProductImage";

type Result = { slug: string; name: string; price: number; tint: string; image?: string };

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  // Focus the box when it opens; lock page scroll; close on Escape.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Live results, a moment after they stop typing.
  useEffect(() => {
    const q = term.replace(/[%,()*\\]/g, " ").trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select("slug, name, price, tint, images")
        .eq("status", "live")
        .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
        .order("created_at", { ascending: false })
        .limit(6);
      setResults(
        (data ?? []).map((p) => ({
          slug: p.slug,
          name: p.name,
          price: Number(p.price),
          tint: p.tint,
          image: p.images?.[0] ? productImageUrl(p.images[0]) : undefined,
        }))
      );
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [term]);

  function close() {
    onClose();
    setTerm("");
    setResults([]);
  }

  const q = term.trim();

  return (
    <div aria-hidden={!open} inert={!open} className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={`absolute inset-x-0 top-0 bg-cream shadow-[0_20px_60px_rgba(26,24,20,0.2)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none sm:inset-x-auto sm:left-1/2 sm:top-6 sm:w-[min(640px,calc(100%-48px))] sm:-translate-x-1/2 sm:rounded-3xl ${
          open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!q) return;
            close();
            router.push(`/shop?q=${encodeURIComponent(q)}`);
          }}
          className="flex items-center gap-2 border-b border-line px-3 py-3 sm:px-4"
        >
          <SearchIcon size={20} className="ml-1 shrink-0 text-subtle" />
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for products"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-subtle"
          />
          <button type="button" onClick={close} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-sand">
            <CloseIcon />
          </button>
        </form>

        <div className="max-h-[70vh] overflow-y-auto p-3 sm:p-4">
          {q.length < 2 && <p className="px-2 py-3 text-sm text-subtle">Type at least two letters.</p>}
          {q.length >= 2 && !loading && results.length === 0 && (
            <p className="px-2 py-3 text-[15px] text-muted">
              Nothing found for &quot;{q}&quot;. Goody may be able to{" "}
              <Link href="/sourcing" onClick={close} className="text-clay underline">source it for you</Link>.
            </p>
          )}
          {results.length > 0 && (
            <ul className="flex flex-col">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/product/${r.slug}`} onClick={close} className="flex items-center gap-3 rounded-2xl p-2 text-ink hover:bg-sand">
                    <ProductImage src={r.image} alt="" tint={r.tint} className="h-14 w-14 shrink-0 rounded-xl" />
                    <span className="min-w-0 flex-1 truncate font-semibold">{r.name}</span>
                    <span className="shrink-0 text-[15px]">{gbp(r.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {q.length >= 2 && results.length > 0 && (
            <Link
              href={`/shop?q=${encodeURIComponent(q)}`}
              onClick={close}
              className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong text-[15px] font-semibold text-ink"
            >
              See all results <ArrowRightIcon size={16} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}