"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { refreshShop } from "@/app/admin/actions";
import { compressImage } from "@/lib/compress-image";
import { siteImageUrl, toSettingsRow, type HomeCategory, type SiteSettings } from "@/lib/site-content-types";
import { createClient } from "@/lib/supabase/client";
import { CameraIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExternalIcon } from "../Icons";
import { uniqueId } from "@/lib/unique-id";

const BUCKET = "site-images";
const input = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base";
const textarea = "w-full resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-4 py-3 text-base leading-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-4 sm:p-6";

// A photo slot: what's saved (path), or a new file waiting to upload (file + preview).
type Slot = { path: string | null; file?: File; preview?: string };

const heroSlots = [
  { key: "heroImageMain", label: "Large photo", tint: "#e6d3bf" },
  { key: "heroImageTop", label: "Top right", tint: "#e9cfc6" },
  { key: "heroImageBottom", label: "Bottom right", tint: "#d8dfd0" },
] as const;
type HeroKey = (typeof heroSlots)[number]["key"];

function PhotoSlot({
  slot,
  tint,
  label,
  onPick,
  onClear,
  className = "",
}: {
  slot: Slot;
  tint: string;
  label: string;
  onPick: (file: File) => void;
  onClear: () => void;
  className?: string;
}) {
  const src = slot.preview ?? (slot.path ? siteImageUrl(slot.path) : null);
  return (
    <div className={`relative overflow-hidden rounded-[14px] ${className}`} style={{ background: tint }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <label className={`relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 text-center text-[12px] font-semibold ${src ? "bg-ink/0 text-transparent hover:bg-ink/30 hover:text-cream" : "text-[#7a5f49]"}`}>
        <CameraIcon size={20} />
        {src ? "Replace" : label}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.target.value = "";
          }}
        />
      </label>
      {src && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Remove ${label.toLowerCase()}`}
          className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink"
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
}

export default function ContentEditor({
  settings,
  categories: initialCategories,
  products,
}: {
  settings: SiteSettings;
  categories: HomeCategory[];
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [s, setS] = useState<SiteSettings>(settings);
  const [hero, setHero] = useState<Record<HeroKey, Slot>>({
    heroImageMain: { path: settings.heroImageMain },
    heroImageTop: { path: settings.heroImageTop },
    heroImageBottom: { path: settings.heroImageBottom },
  });
  const [cats, setCats] = useState(initialCategories.map((c) => ({ ...c, slot: { path: c.image } as Slot })));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const previews = useRef<string[]>([]);

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setS((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const preview = (file: File) => {
    const url = URL.createObjectURL(file);
    previews.current.push(url);
    return url;
  };

  const pickHero = (key: HeroKey, file: File) => {
    setHero((h) => ({ ...h, [key]: { path: h[key].path, file, preview: preview(file) } }));
    setSaved(false);
  };
  const clearHero = (key: HeroKey) => {
    setHero((h) => ({ ...h, [key]: { path: null } }));
    setSaved(false);
  };

  const pickCat = (slug: string, file: File) => {
    setCats((all) => all.map((c) => (c.slug === slug ? { ...c, slot: { path: c.slot.path, file, preview: preview(file) } } : c)));
    setSaved(false);
  };
  const clearCat = (slug: string) => {
    setCats((all) => all.map((c) => (c.slug === slug ? { ...c, slot: { path: null } } : c)));
    setSaved(false);
  };
  const toggleCat = (slug: string) => {
    setCats((all) => all.map((c) => (c.slug === slug ? { ...c, showOnHome: !c.showOnHome } : c)));
    setSaved(false);
  };
  const moveCat = (index: number, dir: -1 | 1) => {
    setCats((all) => {
      const next = [...all];
      const target = index + dir;
      if (target < 0 || target >= next.length) return all;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSaved(false);
  };

  const highlightMissing = s.heroHighlight.trim() !== "" && !s.heroHeadline.includes(s.heroHighlight.trim());

  async function save() {
    setError("");
    if (!s.heroHeadline.trim()) return setError("Add a headline.");
    if (s.featuredMode === "chosen" && !s.featuredProductId) return setError("Choose the featured product, or switch back to the newest.");
    if (s.announcementOn && !s.announcementText.trim()) return setError("Write the announcement message, or switch the bar off.");
    setBusy(true);

    const supabase = createClient();
    const toDelete: string[] = [];

    // Upload a new photo if one was picked, and note the old one for deletion.
    async function resolve(slot: Slot, original: string | null, folder: string) {
      if (slot.file) {
        const blob = await compressImage(slot.file, 2000);
               const path = `${folder}/${uniqueId()}.jpg`;
        const { error: e } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
        if (e) throw new Error("A photo didn't upload. Check your connection and try again.");
        if (original) toDelete.push(original);
        return path;
      }
      if (!slot.path && original) toDelete.push(original);
      return slot.path;
    }

    try {
      const next: SiteSettings = {
        ...s,
        heroHeadline: s.heroHeadline.trim(),
        heroHighlight: s.heroHighlight.trim(),
        heroIntro: s.heroIntro.trim(),
        sourcingHeading: s.sourcingHeading.trim(),
        announcementText: s.announcementText.trim(),
        heroImageMain: await resolve(hero.heroImageMain, settings.heroImageMain, "hero"),
        heroImageTop: await resolve(hero.heroImageTop, settings.heroImageTop, "hero"),
        heroImageBottom: await resolve(hero.heroImageBottom, settings.heroImageBottom, "hero"),
      };

      const { error: settingsError } = await supabase.from("site_settings").update(toSettingsRow(next)).eq("id", 1);
      if (settingsError) throw new Error("We couldn't save the homepage. Please try again.");

      for (const [i, c] of cats.entries()) {
        const original = initialCategories.find((x) => x.slug === c.slug)?.image ?? null;
        const image = await resolve(c.slot, original, "categories");
        const { error: catError } = await supabase
          .from("categories")
          .update({ image, show_on_home: c.showOnHome, sort_order: i + 1 })
          .eq("slug", c.slug);
        if (catError) throw new Error("We couldn't save the categories. Please try again.");
      }

      if (toDelete.length) await supabase.storage.from(BUCKET).remove(toDelete);
      await refreshShop();
      setSaved(true);
      router.refresh();
        } catch (e) {
      console.error("Homepage save failed:", e);
      const message = (e as Error).message;
      setError(message.startsWith("We couldn't") || message.startsWith("A photo") ? message : "Something went wrong while saving. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 pb-24 pt-6 sm:px-8 lg:py-9">      <Link href="/admin/more" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink lg:hidden">
        <ChevronLeftIcon size={20} />
        More
      </Link>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">Homepage</h1>
          <span className="text-sm text-subtle">Change what shoppers see first. No code needed.</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-sm font-semibold text-ink"
        >
          Preview <ExternalIcon size={16} />
        </Link>
      </div>

      <section className={card}>
        <h2 className="text-lg font-bold">Top of the page</h2>
        <label className={label}>
          Headline
          <input value={s.heroHeadline} onChange={(e) => set("heroHeadline", e.target.value)} maxLength={90} className={input} />
        </label>
        <label className={label}>
          Word shown in terracotta
          <input value={s.heroHighlight} onChange={(e) => set("heroHighlight", e.target.value)} maxLength={30} className={input} />
          {highlightMissing && (
            <span className="text-[13px] font-semibold text-clay-dark">This word isn&apos;t in the headline, so nothing will be highlighted.</span>
          )}
        </label>
        <label className={label}>
          Intro text
          <textarea rows={3} value={s.heroIntro} onChange={(e) => set("heroIntro", e.target.value)} maxLength={260} className={textarea} />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">
            Photos <span className="font-normal text-subtle">(tap to add or replace)</span>
          </span>
          <div className="grid h-56 grid-cols-2 grid-rows-2 gap-2.5 sm:h-72">
            {heroSlots.map((slot, i) => (
              <PhotoSlot
                key={slot.key}
                slot={hero[slot.key]}
                tint={slot.tint}
                label={slot.label}
                onPick={(f) => pickHero(slot.key, f)}
                onClear={() => clearHero(slot.key)}
                className={i === 0 ? "row-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Featured product</h2>
        <p className="-mt-2 text-sm text-muted">The small &quot;New in&quot; card on the top photos.</p>
        <label className="flex items-center gap-3 rounded-xl border-[1.5px] border-line-strong bg-white p-3.5 text-[15px] has-[:checked]:border-ink">
          <input type="radio" name="featured" checked={s.featuredMode === "newest"} onChange={() => set("featuredMode", "newest")} className="h-5 w-5 accent-clay" />
          Show my newest product automatically
        </label>
        <label className="flex items-center gap-3 rounded-xl border-[1.5px] border-line-strong bg-white p-3.5 text-[15px] has-[:checked]:border-ink">
          <input type="radio" name="featured" checked={s.featuredMode === "chosen"} onChange={() => set("featuredMode", "chosen")} className="h-5 w-5 accent-clay" />
          Let me choose one
        </label>
        {s.featuredMode === "chosen" && (
          <label className={label}>
            Product
            <select value={s.featuredProductId ?? ""} onChange={(e) => set("featuredProductId", e.target.value || null)} className={input}>
              <option value="">Choose a product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className={card}>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Categories on the homepage</h2>
          <p className="text-sm text-muted">Add a picture for each, choose which show, and use the arrows to change the order.</p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {cats.map((c, i) => (
            <li key={c.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
              <PhotoSlot
                slot={c.slot}
                tint={c.tint}
                label="Add"
                onPick={(f) => pickCat(c.slug, f)}
                onClear={() => clearCat(c.slug)}
                className="h-20 w-16 shrink-0"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-semibold">{c.name}</span>
                <label className="flex items-center gap-2 text-sm text-muted">
                  <input type="checkbox" checked={c.showOnHome} onChange={() => toggleCat(c.slug)} className="h-[18px] w-[18px] accent-jade" />
                  Show on homepage
                </label>
              </span>
              <span className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveCat(i, -1)}
                  disabled={i === 0}
                  aria-label={`Move ${c.name} up`}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand disabled:opacity-30"
                >
                  <ChevronRightIcon size={18} className="-rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCat(i, 1)}
                  disabled={i === cats.length - 1}
                  aria-label={`Move ${c.name} down`}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-sand disabled:opacity-30"
                >
                  <ChevronRightIcon size={18} className="rotate-90" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Sourcing section</h2>
        <label className={label}>
          Heading
          <input value={s.sourcingHeading} onChange={(e) => set("sourcingHeading", e.target.value)} maxLength={90} className={input} />
        </label>
      </section>

      <section className={card}>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-lg font-bold">Announcement bar</span>
            <span className="text-sm text-muted">A thin strip above the menu, for sales or delivery offers.</span>
          </span>
          <input
            type="checkbox"
            checked={s.announcementOn}
            onChange={(e) => set("announcementOn", e.target.checked)}
            className="h-6 w-6 shrink-0 accent-jade"
          />
        </label>
        {s.announcementOn && (
          <label className={label}>
            Message
            <input
              value={s.announcementText}
              onChange={(e) => set("announcementText", e.target.value)}
              maxLength={100}
              placeholder="e.g. Free UK delivery on orders over £50"
              className={input}
            />
          </label>
        )}
      </section>

            {/* Floating save button: hovers above the tab bar on phones, bottom right on desktop */}
      <div className="pointer-events-none sticky bottom-[100px] z-10 flex flex-col items-end gap-2 lg:bottom-6">
        {error && (
          <p
            role="alert"
            className="pointer-events-auto max-w-full rounded-xl bg-[#f6ddd0] px-3.5 py-2.5 text-sm font-semibold text-clay-dark shadow-[0_8px_24px_rgba(26,24,20,0.12)]"
          >
            {error}
          </p>
        )}
        {saved && (
          <span
            role="status"
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-jade-soft px-3.5 py-2 text-sm font-semibold text-jade shadow-[0_8px_24px_rgba(26,24,20,0.12)]"
          >
            <CheckIcon size={16} />
            Saved. The homepage is updated.
          </span>
        )}
        <button
          onClick={save}
          disabled={busy}
          className="pointer-events-auto h-12 rounded-full bg-clay px-6 font-semibold text-white shadow-[0_10px_30px_rgba(184,84,42,0.35)] transition-colors hover:bg-clay-dark disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save changes"}
        </button>
      </div>
    </main>
  );
}