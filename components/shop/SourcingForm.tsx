"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { compressImage } from "@/lib/compress-image";
import { COUNTRIES } from "@/lib/countries";
import { CameraIcon, CloseIcon, PlusIcon } from "../Icons";

const examples = [
  ["e.g. Wooden dining chairs", "e.g. Solid oak, cream cushion, seat height around 45 cm"],
  ["e.g. Baby bottle set", "e.g. Anti-colic, glass, 3 sizes, BPA free"],
  ["e.g. Branded tote bags", "e.g. Canvas, natural colour, my logo printed on one side"],
];

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink";
const label = "flex flex-col gap-2 text-sm font-semibold";

type Item = { key: number; photo?: Blob; preview?: string };

export default function SourcingForm() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([{ key: 1 }, { key: 2 }]);
  const [nextKey, setNextKey] = useState(3);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const previews = useRef<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const [asideInView, setAsideInView] = useState(false);

  // Hide the floating button once the real summary box is on screen.
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setAsideInView(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function floatingContinue() {
    if (agreed) {
      formRef.current?.requestSubmit(); // the browser also checks required fields first
    } else {
      setError("Please tick the box to confirm you understand how the £50 works.");
      asideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => () => previews.current.forEach((u) => URL.revokeObjectURL(u)), []);

  async function pickPhoto(key: number, file: File) {
    setError("");
    try {
      // Shrink big phone photos before upload, so they're quick to send.
      const blob = await compressImage(file);
      const preview = URL.createObjectURL(blob);
      previews.current.push(preview);
      setItems((all) => all.map((i) => (i.key === key ? { ...i, photo: blob, preview } : i)));
    } catch {
      setError("That photo couldn't be added. Please try a different one.");
    }
  }

  const clearPhoto = (key: number) => setItems((all) => all.map((i) => (i.key === key ? { key: i.key } : i)));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    items.forEach((item, i) => {
      if (item.photo) fd.set(`items[${i}][photo]`, item.photo, `item-${i + 1}.jpg`);
    });

    try {
      const res = await fetch("/api/sourcing", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ref) throw new Error(data.error || "Something went wrong. Please try again.");
      // On to the payment step for this request.
      router.push(`/sourcing/r/${data.ref}`);
    } catch (err) {
      setSending(false);
      setError((err as Error).message);
    }
  }

  return (
    <form ref={formRef} id="request" onSubmit={onSubmit} className="flex scroll-mt-28 flex-col items-start gap-12 lg:flex-row">
      <div className="flex w-full flex-1 flex-col gap-5">
        <div className="flex flex-col gap-2.5 pb-2">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">Start your request</span>
          <h1 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">What would you like us to find?</h1>
        </div>

        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <h2 className="text-xl font-bold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Full name<input name="name" required autoComplete="name" className={input} /></label>
            <label className={label}>Email address<input name="email" type="email" required autoComplete="email" className={input} /></label>
            <label className={label}>Phone or WhatsApp<input name="phone" type="tel" autoComplete="tel" className={input} /></label>
            <label className={label}>
              Where should it be delivered?
              <select name="country" defaultValue="United Kingdom" className={input}>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold">Your list</h2>
            <span className="text-sm text-subtle">{items.length === 1 ? "1 item" : `${items.length} items`}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-muted">
            The more detail you give, the faster and more accurate your sourcing will be. Include sizes, colours,
            materials and a photo or link if you have one. <strong className="text-ink">Not sure exactly what you want?</strong>{" "}
            Describe what it&apos;s for and your budget, and Goody can suggest options.
          </p>

          {items.map((item, i) => {
            const [namePh, descPh] = examples[i % examples.length];
            return (
              <div key={item.key} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold">Item {i + 1}</span>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((x) => x.key !== item.key))}
                      className="h-10 rounded-full px-3.5 text-sm font-semibold text-clay-dark hover:bg-sand"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3.5 sm:flex-row">
                  <label className={`${label} flex-1`}>
                    Product name
                    <input name={`items[${i}][name]`} required maxLength={160} placeholder={namePh} className={`${input} bg-paper`} />
                  </label>
                  <label className={`${label} sm:w-[140px]`}>
                    Quantity
                    <input name={`items[${i}][qty]`} type="number" min={1} placeholder="1" className={`${input} bg-paper`} />
                  </label>
                </div>
                <label className={label}>
                  Description
                  <textarea
                    name={`items[${i}][description]`}
                    rows={3}
                    maxLength={2000}
                    placeholder={descPh}
                    className="resize-none rounded-xl border-[1.5px] border-line-strong bg-paper px-4 py-3 text-base font-normal leading-normal"
                  />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className={`${label} flex-1`}>
                    Reference link (optional)
                    <input name={`items[${i}][link]`} type="url" placeholder="Paste a link to a similar product" className={`${input} bg-paper`} />
                  </label>
                  {item.preview ? (
                    <div className="flex h-[52px] items-center gap-2.5 rounded-xl border-[1.5px] border-jade bg-jade-soft pl-1.5 pr-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.preview} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="text-sm font-semibold text-jade">Photo added</span>
                      <button
                        type="button"
                        onClick={() => clearPhoto(item.key)}
                        aria-label={`Remove photo for item ${i + 1}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-jade hover:bg-white/60"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#b3a591] bg-paper px-[18px] text-sm font-semibold">
                      <CameraIcon size={18} />
                      Add photo
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) pickPhoto(item.key, f);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setItems([...items, { key: nextKey }]);
              setNextKey(nextKey + 1);
            }}
            disabled={items.length >= 30}
            className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-clay text-[15px] font-bold text-clay hover:bg-clay/5 disabled:opacity-40"
          >
            <PlusIcon size={18} />
            Add another item
          </button>
        </section>

        <section className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <h2 className="text-xl font-bold">
            Anything else <span className="text-base font-normal text-subtle">(optional)</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Rough budget for products (£)<input name="budget" inputMode="decimal" maxLength={40} className={input} /></label>
            <label className={label}>Need it by<input name="deadline" type="date" className={input} /></label>
          </div>
          <label className={label}>
            Notes for Goody
            <textarea name="notes" rows={3} maxLength={3000} className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-4 py-3 text-base font-normal leading-normal" />
          </label>
        </section>
        {/* Hidden from people; catches bots that fill in every field */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      </div>

      <aside ref={asideRef} className="flex w-full flex-col gap-4 rounded-3xl bg-ink p-6 text-cream sm:p-[30px] lg:sticky lg:top-28 lg:mt-24 lg:w-[420px] lg:shrink-0">
        <h2 className="text-xl font-bold">Your request</h2>
        <div className="flex justify-between text-[15px] text-[#d9cfc0]">
          <span>Items on your list</span>
          <span className="font-semibold text-cream">{items.length}</span>
        </div>
        <div className="flex justify-between text-[15px] text-[#d9cfc0]">
          <span>Sourced within</span>
          <span className="font-semibold text-cream">2 to 4 working days</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#3a342c] pt-4">
          <span className="text-base font-bold">To pay next</span>
          <span className="font-display text-4xl">£50.00</span>
        </div>
        <span className="text-sm leading-normal text-[#d9cfc0]">
          Commitment and sourcing fee. Refunded when you go ahead with the purchase. Once it&apos;s paid, you can message
          Goody on WhatsApp about your list.
        </span>
        <label className="flex items-start gap-3 rounded-[14px] bg-ink-soft p-3.5 text-sm leading-normal">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError("");
            }}
            className="mt-0.5 h-5 w-5 shrink-0 accent-gold"
          />
          I understand the £50 is refunded only if I go ahead with the purchase, and is kept if I don&apos;t.
        </label>
        {error && (
          <p role="alert" className="rounded-[14px] bg-[#f6ddd0] p-3.5 text-sm font-semibold text-clay-dark">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!agreed || sending}
          className="h-14 rounded-full bg-paypal text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Saving your list..." : "Continue to payment"}
        </button>
      </aside>

      {/* Phones: the next step stays at the bottom of the screen while they fill in their list */}
      <div
        aria-hidden={asideInView}
        className={`fixed bottom-6 left-5 right-[92px] z-30 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          asideInView ? "pointer-events-none translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={floatingContinue}
          disabled={sending}
          tabIndex={asideInView ? -1 : 0}
          className="flex h-14 w-full items-center justify-between rounded-full bg-ink pl-5 pr-1.5 text-cream shadow-[0_12px_30px_rgba(26,24,20,0.35)] disabled:opacity-60"
        >
          <span className="text-sm font-semibold">£50 to pay next</span>
          <span className="flex h-11 items-center rounded-full bg-paypal px-5 text-[15px] font-bold text-ink">
            {sending ? "Saving..." : "Continue"}
          </span>
        </button>
      </div>
    </form>
  );
}