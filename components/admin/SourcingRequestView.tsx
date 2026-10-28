"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { markFeePaid, markFeeRefunded, sendQuote, setSourcingStatus } from "@/app/admin/sourcing/actions";
import { gbp } from "@/lib/data";
import {
  SOURCING_LABEL,
  SOURCING_TONE,
  formatDay,
  serviceCharge,
  type SourcingRequest,
  type SourcingStatus,
} from "@/lib/sourcing-types";
import { CheckIcon, ChevronLeftIcon, ExternalIcon, MailIcon, WhatsappIcon } from "../Icons";

const money = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white pl-8 pr-3 text-base";
const card = "flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 sm:p-6";

export default function SourcingRequestView({ request: r }: { request: SourcingRequest }) {
  const router = useRouter();
  const [productCost, setProductCost] = useState(r.quoteProductCost != null ? String(r.quoteProductCost) : "");
  const [shipping, setShipping] = useState(r.quoteShipping != null ? String(r.quoteShipping) : "");
  const [quoteNotes, setQuoteNotes] = useState(r.quoteNotes ?? "");
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const cost = Number(productCost) || 0;
  const ship = shipping.trim() === "" ? null : Math.max(0, Number(shipping) || 0);
  const charge = serviceCharge(cost);
  const total = cost + charge + (ship ?? 0);
  const waLink = r.phone ? `https://wa.me/${r.phone.replace(/[^0-9]/g, "")}` : "";
  const paid = r.feeStatus !== "unpaid";

  async function run(action: () => Promise<{ ok: boolean; message?: string; error?: string }>) {
    setBusy(true);
    setNotice("");
    setError("");
    const result = await action();
    setBusy(false);
    if (!result.ok) return setError(result.error ?? "Something went wrong.");
    setNotice(result.message ?? "Saved.");
    router.refresh();
  }

  const status = (s: SourcingStatus) => run(() => setSourcingStatus(r.number, s));

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <Link href="/admin/sourcing" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink">
        <ChevronLeftIcon size={20} />
        Sourcing requests
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] leading-tight sm:text-[36px]">{r.name}</h1>
          <span className="text-sm text-subtle">
            {r.number} | Sent {formatDay(r.createdAt)} | Delivering to {r.country}
          </span>
        </div>
        <span className={`inline-flex h-8 items-center self-start rounded-full px-3 text-sm font-bold ${SOURCING_TONE[r.status]}`}>
          {SOURCING_LABEL[r.status]}
        </span>
      </div>

      {notice && <p role="status" className="rounded-[14px] bg-jade-soft px-4 py-3 text-sm font-semibold text-jade">{notice}</p>}
      {error && <p role="alert" className="rounded-[14px] bg-[#f6ddd0] px-4 py-3 text-sm font-semibold text-clay-dark">{error}</p>}

      <div className="flex flex-wrap gap-2.5">
        <a
          href={`mailto:${r.email}?subject=Your sourcing request ${r.number}`}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper text-sm font-semibold text-ink sm:flex-none sm:px-5"
        >
          <MailIcon size={18} />
          Email {r.email}
        </a>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper text-sm font-semibold text-ink sm:flex-none sm:px-5"
          >
            <WhatsappIcon size={18} />
            WhatsApp
          </a>
        )}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {/* The £50 fee */}
          <section className={card}>
            <h2 className="text-lg font-bold">£50 commitment fee</h2>
            {r.feeStatus === "unpaid" && (
              <>
                <p className="text-[15px] text-muted">
                  Not paid yet. The customer saved their list but hasn&apos;t paid. Once they pay online, this updates on its own.
                </p>
                {confirmPaid ? (
                  <div className="flex flex-col gap-2.5 rounded-xl bg-white p-3.5">
                    <p className="text-sm font-semibold">
                      Only do this if you&apos;ve received the £50 another way, like a bank transfer. The customer gets their confirmation email.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setConfirmPaid(false)} className="h-11 rounded-full border-[1.5px] border-line-strong font-semibold">
                        Cancel
                      </button>
                      <button
                        onClick={() => run(() => markFeePaid(r.id))}
                        disabled={busy}
                        className="h-11 rounded-full bg-ink font-semibold text-cream disabled:opacity-60"
                      >
                        Yes, it&apos;s paid
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setConfirmPaid(true)} className="h-11 self-start rounded-full border-[1.5px] border-line-strong bg-white px-4 text-sm font-semibold">
                    I&apos;ve received it another way
                  </button>
                )}
              </>
            )}
            {r.feeStatus === "paid" && (
              <p className="flex items-center gap-2 text-[15px]">
                <CheckIcon size={18} className="text-jade" />
                Paid {r.feePaidAt ? formatDay(r.feePaidAt) : ""}
                {r.feeReference ? <span className="text-subtle">({r.feeReference})</span> : null}
              </p>
            )}
            {r.feeStatus === "refunded" && <p className="text-[15px] text-muted">Refunded to the customer.</p>}
            {r.feeStatus === "paid" && r.status === "going_ahead" && (
              <button
                onClick={() => run(() => markFeeRefunded(r.number))}
                disabled={busy}
                className="h-11 self-start rounded-full border-[1.5px] border-line-strong bg-white px-4 text-sm font-semibold disabled:opacity-60"
              >
                I&apos;ve refunded the £50
              </button>
            )}
          </section>

          {/* Their list */}
          <section className={card}>
            <h2 className="text-lg font-bold">
              Their list <span className="font-normal text-subtle">({r.items.length})</span>
            </h2>
            <ol className="flex flex-col gap-3">
              {r.items.map((i, n) => (
                <li key={i.id} className="flex gap-3.5 rounded-2xl border border-line bg-white p-3.5">
                  {i.imageUrl ? (
                    <a href={i.imageUrl} target="_blank" rel="noreferrer" className="shrink-0" aria-label={`Open photo for ${i.name}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.imageUrl} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    </a>
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="font-semibold">
                      {n + 1}. {i.name} <span className="font-normal text-subtle">x{i.quantity}</span>
                    </span>
                    {i.description && <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{i.description}</p>}
                    {i.link && (
                      <a href={i.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-semibold text-clay">
                        Reference link <ExternalIcon size={14} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {(r.budget || r.deadline || r.notes) && (
              <dl className="flex flex-col gap-2 border-t border-[#ece3d5] pt-3 text-[15px]">
                {r.budget && (
                  <div className="flex justify-between gap-4"><dt className="text-muted">Budget for products</dt><dd>£{r.budget}</dd></div>
                )}
                {r.deadline && (
                  <div className="flex justify-between gap-4"><dt className="text-muted">Needed by</dt><dd>{formatDay(r.deadline)}</dd></div>
                )}
                {r.notes && (
                  <div className="flex flex-col gap-1"><dt className="text-muted">Notes</dt><dd className="whitespace-pre-line">{r.notes}</dd></div>
                )}
              </dl>
            )}
          </section>
        </div>

        {/* Quote */}
        <section className="flex flex-col gap-4 rounded-[20px] bg-ink p-4 text-cream sm:p-6 lg:sticky lg:top-6 lg:w-[380px] lg:shrink-0">
          <h2 className="text-lg font-bold">Quote</h2>
          {!paid ? (
            <p className="text-sm leading-relaxed text-[#d9cfc0]">You can send a quote once the £50 is paid.</p>
          ) : (
            <>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Product cost from China
                <span className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-normal text-subtle">£</span>
                  <input value={productCost} onChange={(e) => setProductCost(e.target.value)} inputMode="decimal" className={`${money} text-ink`} />
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                <span>
                  Shipping <span className="font-normal text-[#a89d8e]">(leave empty if not known yet)</span>
                </span>
                <span className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-normal text-subtle">£</span>
                  <input value={shipping} onChange={(e) => setShipping(e.target.value)} inputMode="decimal" className={`${money} text-ink`} />
                </span>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                <span>
                  Note to the customer <span className="font-normal text-[#a89d8e]">(optional)</span>
                </span>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Samples available for the chairs. Lead time about 3 weeks."
                  className="resize-none rounded-xl border-[1.5px] border-line-strong bg-white px-3.5 py-3 text-base font-normal text-ink"
                />
              </label>
              <div className="flex flex-col gap-2 rounded-[14px] bg-ink-soft p-4 text-sm">
                <div className="flex justify-between"><span className="text-[#d9cfc0]">Products</span><span>{gbp(cost)}</span></div>
                <div className="flex justify-between"><span className="text-[#d9cfc0]">Service charge (10%)</span><span>{gbp(charge)}</span></div>
                <div className="flex justify-between"><span className="text-[#d9cfc0]">Shipping</span><span>{ship === null ? "To confirm" : gbp(ship)}</span></div>
                <div className="flex justify-between border-t border-[#3a342c] pt-2 text-base font-bold"><span>Total</span><span>{gbp(total)}</span></div>
                <span className="text-xs text-[#a89d8e]">The customer&apos;s £50 is refunded when they go ahead.</span>
              </div>
              <button
                onClick={() => run(() => sendQuote(r.number, { productCost: cost, shipping: ship, notes: quoteNotes }))}
                disabled={busy || cost <= 0}
                className="h-12 rounded-full bg-clay font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Sending..." : r.quoteSentAt ? "Update and resend quote" : "Email quote to customer"}
              </button>
              {r.quoteSentAt && <span className="text-xs text-[#a89d8e]">Last sent {formatDay(r.quoteSentAt)}</span>}

              {(r.status === "quote_sent" || r.status === "going_ahead" || r.status === "not_proceeding") && (
                <div className="flex flex-col gap-2 border-t border-[#3a342c] pt-4">
                  <span className="text-sm font-semibold">What did the customer decide?</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => status("going_ahead")}
                      disabled={busy || r.status === "going_ahead"}
                      className="h-11 rounded-full bg-cream text-sm font-semibold text-ink disabled:opacity-50"
                    >
                      Going ahead
                    </button>
                    <button
                      onClick={() => status("not_proceeding")}
                      disabled={busy || r.status === "not_proceeding"}
                      className="h-11 rounded-full border-[1.5px] border-[#3a342c] text-sm font-semibold text-cream disabled:opacity-50"
                    >
                      Not proceeding
                    </button>
                  </div>
                  {r.status === "going_ahead" && r.feeStatus === "paid" && (
                    <span className="text-xs text-[#a89d8e]">Remember to refund their £50 in PayPal or Stripe (whichever they paid with), then mark it refunded on the left.</span>
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}