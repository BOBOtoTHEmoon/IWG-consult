"use client";

import { useState } from "react";
import { CameraIcon, CheckIcon, PlusIcon } from "../Icons";

const examples = [
  ["e.g. Wooden dining chairs", "e.g. Solid oak, cream cushion, seat height around 45 cm"],
  ["e.g. Baby bottle set", "e.g. Anti-colic, glass, 3 sizes, BPA free"],
  ["e.g. Branded tote bags", "e.g. Canvas, natural colour, my logo printed on one side"],
];

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

const input =
  "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink";
const label = "flex flex-col gap-2 text-sm font-semibold";

type Status = "idle" | "sending" | "sent" | "error";

export default function SourcingForm() {
  const [ids, setIds] = useState([1, 2]);
  const [next, setNext] = useState(3);
  const [agreed, setAgreed] = useState(false);
  const [photos, setPhotos] = useState<Record<number, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    let photoBytes = 0;
    fd.forEach((v) => {
      if (v instanceof File) photoBytes += v.size;
    });
    if (photoBytes > MAX_PHOTO_BYTES) {
      setStatus("error");
      setError("Your photos add up to more than 4 MB. Remove one or use smaller photos.");
      return;
    }

    setStatus("sending");
    setError("");

    // TODO (payments phase): after this succeeds, create the £50 PayPal order and redirect to PayPal.
    try {
      const res = await fetch("/api/sourcing", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
      document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "sent") {
    return (
      <div id="request" className="flex scroll-mt-28 flex-col items-start gap-5 rounded-3xl border border-line bg-paper p-8 sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-white">
          <CheckIcon size={24} strokeWidth={2.5} />
        </span>
        <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[40px]">Request sent</h2>
        <p className="max-w-[560px] text-[17px] leading-relaxed text-muted">
          Goody has your list and will come back to you with suppliers and the full product cost within 2 to 4
          working days. We&apos;ve also sent a confirmation to your email.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form id="request" onSubmit={onSubmit} className="flex scroll-mt-28 flex-col items-start gap-12 lg:flex-row">
      <div className="flex w-full flex-1 flex-col gap-5">
        <div className="flex flex-col gap-2.5 pb-2">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">Start your request</span>
          <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">
            What would you like us to find?
          </h2>
        </div>

        <fieldset className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <legend className="float-left mb-1 text-xl font-bold">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Full name<input name="name" required autoComplete="name" className={input} /></label>
            <label className={label}>Email address<input name="email" type="email" required autoComplete="email" className={input} /></label>
            <label className={label}>Phone or WhatsApp<input name="phone" type="tel" autoComplete="tel" className={input} /></label>
            <label className={label}>
              Where should it be delivered?
              <select name="country" className={input}>
                <option>United Kingdom</option>
                <option>Ireland</option>
                <option>Nigeria</option>
                <option>United States</option>
                <option>Other country</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <div className="flex items-baseline justify-between">
            <legend className="text-xl font-bold">Your list</legend>
            <span className="text-sm text-subtle">{ids.length === 1 ? "1 item" : `${ids.length} items`}</span>
          </div>
          <p className="text-[15px] leading-relaxed text-muted">
            The more detail you give, the faster and more accurate your sourcing will be. Include sizes, colours,
            materials and a photo or link if you have one.
          </p>

          {ids.map((id, i) => {
            const [namePh, descPh] = examples[i % examples.length];
            return (
              <div key={id} className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold">Item {i + 1}</span>
                  {ids.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setIds(ids.filter((x) => x !== id))}
                      className="h-10 rounded-full px-3.5 text-sm font-semibold text-clay-dark hover:bg-sand"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-3.5 sm:flex-row">
                  <label className={`${label} flex-1`}>
                    Product name
                    <input name={`items[${i}][name]`} required placeholder={namePh} className={`${input} bg-paper`} />
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
                    placeholder={descPh}
                    className="resize-none rounded-xl border-[1.5px] border-line-strong bg-paper px-4 py-3 text-base font-normal leading-normal"
                  />
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className={`${label} flex-1`}>
                    Reference link (optional)
                    <input name={`items[${i}][link]`} type="url" placeholder="Paste a link to a similar product" className={`${input} bg-paper`} />
                  </label>
                  <label
                    className={`flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] px-[18px] text-sm font-semibold ${
                      photos[id] ? "border-jade bg-jade-soft text-jade" : "border-dashed border-[#b3a591] bg-paper"
                    }`}
                  >
                    {photos[id] ? <CheckIcon size={18} /> : <CameraIcon size={18} />}
                    {photos[id] ? "Photo added" : "Add photo"}
                    <input
                      name={`items[${i}][photo]`}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => setPhotos((p) => ({ ...p, [id]: !!e.target.files?.length }))}
                    />
                  </label>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setIds([...ids, next]);
              setNext(next + 1);
            }}
            className="flex h-[52px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-dashed border-clay text-[15px] font-bold text-clay hover:bg-clay/5"
          >
            <PlusIcon size={18} />
            Add another item
          </button>
        </fieldset>

        <fieldset className="flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7">
          <legend className="float-left mb-1 text-xl font-bold">
            Anything else <span className="text-base font-normal text-subtle">(optional)</span>
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>Rough budget for products (£)<input name="budget" inputMode="decimal" className={input} /></label>
            <label className={label}>Need it by<input name="deadline" type="date" className={input} /></label>
          </div>
          <label className={label}>
            Notes for Goody
            <textarea name="notes" rows={3} className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-4 py-3 text-base font-normal leading-normal" />
          </label>
        </fieldset>
      </div>

      <aside className="flex w-full flex-col gap-4 rounded-3xl bg-ink p-6 text-cream sm:p-[30px] lg:sticky lg:top-28 lg:mt-24 lg:w-[420px] lg:shrink-0">
        <h3 className="text-xl font-bold">Your request</h3>
        <div className="flex justify-between text-[15px] text-[#d9cfc0]">
          <span>Items on your list</span>
          <span className="font-semibold text-cream">{ids.length}</span>
        </div>
        <div className="flex justify-between text-[15px] text-[#d9cfc0]">
          <span>Sourced within</span>
          <span className="font-semibold text-cream">2 to 4 working days</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#3a342c] pt-4">
          <span className="text-base font-bold">To pay today</span>
          <span className="font-display text-4xl">£50.00</span>
        </div>
        <span className="text-sm leading-normal text-[#d9cfc0]">
          Commitment and sourcing fee. Refunded when you go ahead with the purchase.
        </span>
        <label className="flex items-start gap-3 rounded-[14px] bg-ink-soft p-3.5 text-sm leading-normal">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-gold"
          />
          I understand the £50 is refunded only if I go ahead with the purchase, and is kept if I don&apos;t.
        </label>
        {status === "error" && (
          <p role="alert" className="rounded-[14px] bg-[#f6ddd0] p-3.5 text-sm font-semibold text-clay-dark">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={!agreed || sending}
          className="h-14 rounded-full bg-paypal text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending your request..." : "Submit and pay £50 with PayPal"}
        </button>
        <span className="text-center text-[13px] text-[#a89d8e]">You&apos;ll get an email confirming your request.</span>
      </aside>
    </form>
  );
}