"use client";

import Link from "next/link";
import { useState } from "react";
import { CameraIcon, CheckIcon, ExternalIcon } from "@/components/Icons";
import { categories, products } from "@/lib/data";

const input = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base";
const textarea = "w-full resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-4 py-3 text-base leading-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-4 sm:p-6";

const heroSlots = [
  { key: "main", label: "Large photo", tint: "#e6d3bf" },
  { key: "top", label: "Top right", tint: "#e9cfc6" },
  { key: "bottom", label: "Bottom right", tint: "#d8dfd0" },
];

// TODO (backend phase): load these values from Supabase, save them back, and have the homepage read them.
export default function AdminContent() {
  const [headline, setHeadline] = useState("Beautiful things, sourced with care.");
  const [highlight, setHighlight] = useState("sourced");
  const [intro, setIntro] = useState(
    "Homeware, fashion, baby essentials and gifts, hand-picked from trusted makers in China and delivered to your door in the UK and beyond."
  );
  const [featuredMode, setFeaturedMode] = useState<"newest" | "choose">("newest");
  const [featured, setFeatured] = useState(products[0].slug);
  const [shownCategories, setShownCategories] = useState<string[]>(categories.map((c) => c.slug));
  const [sourcingHeading, setSourcingHeading] = useState("Can't find it in the shop? Goody will source it for you.");
  const [bannerOn, setBannerOn] = useState(false);
  const [bannerText, setBannerText] = useState("Free UK delivery on orders over £50");
  const [saved, setSaved] = useState(false);

  const change = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setSaved(false);
  };

  const toggleCategory = (slug: string) =>
    change(setShownCategories)(
      shownCategories.includes(slug) ? shownCategories.filter((s) => s !== slug) : [...shownCategories, slug]
    );

  const highlightMissing = highlight.trim() !== "" && !headline.includes(highlight.trim());

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
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
          <input value={headline} onChange={(e) => change(setHeadline)(e.target.value)} className={input} />
        </label>
        <label className={label}>
          Word shown in terracotta
          <input value={highlight} onChange={(e) => change(setHighlight)(e.target.value)} className={input} />
          {highlightMissing && (
            <span className="text-[13px] font-semibold text-clay-dark">This word isn&apos;t in the headline, so nothing will be highlighted.</span>
          )}
        </label>
        <label className={label}>
          Intro text
          <textarea rows={3} value={intro} onChange={(e) => change(setIntro)(e.target.value)} className={textarea} />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Photos</span>
          <div className="grid grid-cols-3 gap-2.5">
            {heroSlots.map((s) => (
              <label
                key={s.key}
                className="flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] text-center text-[12px] font-semibold text-[#7a5f49] sm:h-36"
                style={{ background: s.tint }}
              >
                <CameraIcon size={20} />
                {s.label}
                <input type="file" accept="image/*" className="sr-only" onChange={() => setSaved(false)} />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Featured product</h2>
        <p className="-mt-2 text-sm text-muted">The small &quot;New in&quot; card on the top photos.</p>
        <label className="flex items-center gap-3 rounded-xl border-[1.5px] border-line-strong bg-white p-3.5 text-[15px] has-[:checked]:border-ink">
          <input type="radio" name="featured" checked={featuredMode === "newest"} onChange={() => change(setFeaturedMode)("newest")} className="h-5 w-5 accent-clay" />
          Show my newest product automatically
        </label>
        <label className="flex items-center gap-3 rounded-xl border-[1.5px] border-line-strong bg-white p-3.5 text-[15px] has-[:checked]:border-ink">
          <input type="radio" name="featured" checked={featuredMode === "choose"} onChange={() => change(setFeaturedMode)("choose")} className="h-5 w-5 accent-clay" />
          Let me choose one
        </label>
        {featuredMode === "choose" && (
          <label className={label}>
            Product
            <select value={featured} onChange={(e) => change(setFeatured)(e.target.value)} className={input}>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>{p.name}</option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Categories on the homepage</h2>
        <div className="flex flex-col gap-2">
          {categories.map((c) => (
            <label key={c.slug} className="flex min-h-12 items-center justify-between rounded-xl border border-line bg-white px-4 text-[15px] font-medium">
              <span className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg" style={{ background: c.tint }} />
                {c.name}
              </span>
              <input
                type="checkbox"
                checked={shownCategories.includes(c.slug)}
                onChange={() => toggleCategory(c.slug)}
                className="h-5 w-5 accent-jade"
              />
            </label>
          ))}
        </div>
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold">Sourcing section</h2>
        <label className={label}>
          Heading
          <input value={sourcingHeading} onChange={(e) => change(setSourcingHeading)(e.target.value)} className={input} />
        </label>
      </section>

      <section className={card}>
        <label className="flex items-center justify-between gap-4">
          <span className="flex flex-col gap-0.5">
            <span className="text-lg font-bold">Announcement bar</span>
            <span className="text-sm text-muted">A thin strip above the menu, for sales or delivery offers.</span>
          </span>
          <input type="checkbox" checked={bannerOn} onChange={(e) => change(setBannerOn)(e.target.checked)} className="h-6 w-6 shrink-0 accent-jade" />
        </label>
        {bannerOn && (
          <label className={label}>
            Message
            <input value={bannerText} onChange={(e) => change(setBannerText)(e.target.value)} className={input} />
          </label>
        )}
      </section>

      <div className="sticky bottom-[92px] z-10 -mx-4 flex items-center justify-end gap-3 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:mx-0 lg:rounded-[20px] lg:border lg:px-5">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-jade" role="status">
            <CheckIcon size={16} />
            Saved
          </span>
        )}
        <button
          onClick={() => setSaved(true)}
          className="h-12 rounded-full bg-clay px-6 font-semibold text-white hover:bg-clay-dark"
        >
          Save changes
        </button>
      </div>
    </main>
  );
}