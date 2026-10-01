"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeftIcon, ImageIcon, MailIcon, WhatsappIcon } from "../Icons";
import { gbp, serviceCharge, sourcingTone, type SourcingRequest, type SourcingStatus } from "@/lib/data";

const input = "h-12 w-full rounded-xl border-[1.5px] border-line-strong bg-white pl-8 pr-3 text-base";

export default function SourcingRequestView({ request }: { request: SourcingRequest }) {
  const [status, setStatus] = useState<SourcingStatus>(request.status);
  const [productCost, setProductCost] = useState(request.quote ? String(request.quote.productCost) : "");
  const [shipping, setShipping] = useState(request.quote ? String(request.quote.shipping) : "");
  const [notice, setNotice] = useState("");

  const cost = Number(productCost) || 0;
  const ship = Number(shipping) || 0;
  const charge = serviceCharge(cost);
  const total = cost + charge + ship;
  const canQuote = cost > 0;
  const waLink = request.phone ? `https://wa.me/${request.phone.replace(/[^0-9]/g, "")}` : "";

  function act(next: SourcingStatus, message: string) {
    // TODO (backend phase): save to Supabase and email the customer through Resend.
    setStatus(next);
    setNotice(message);
  }

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <Link href="/admin/sourcing" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink">
        <ChevronLeftIcon size={20} />
        Sourcing requests
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] leading-tight sm:text-[36px]">{request.name}</h1>
          <span className="text-sm text-subtle">
            #{request.id} | Sent {request.submitted} | Delivering to {request.country}
          </span>
        </div>
        <span className={`inline-flex h-8 items-center self-start rounded-full px-3 text-sm font-bold ${sourcingTone[status]}`}>{status}</span>
      </div>

      {notice && (
        <p role="status" className="rounded-[14px] bg-jade-soft px-4 py-3 text-sm font-semibold text-jade">
          {notice}
        </p>
      )}

      <div className="flex gap-2.5">
        <a
          href={`mailto:${request.email}?subject=Your sourcing request ${request.id}`}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper text-sm font-semibold text-ink sm:flex-none sm:px-5"
        >
          <MailIcon size={18} />
          Email
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
          <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
            <h2 className="text-lg font-bold">Their list</h2>
            {request.items.map((item, i) => (
              <div key={i} className="flex gap-3 rounded-2xl border border-line bg-white p-3.5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#efe5d4] text-[#7a5f49]">
                  {item.hasPhoto ? <ImageIcon size={20} /> : <span className="text-sm font-bold">{i + 1}</span>}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-[15px] font-semibold">
                    {item.name} <span className="font-normal text-subtle">x {item.qty}</span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted">{item.description}</span>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-sm font-semibold">
                      Reference link
                    </a>
                  )}
                </span>
              </div>
            ))}
          </section>

          {(request.budget || request.deadline || request.notes) && (
            <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 text-[15px] sm:p-6">
              <h2 className="text-lg font-bold">Extra details</h2>
              {request.budget && <p><span className="text-subtle">Budget for products:</span> {gbp(request.budget)}</p>}
              {request.deadline && <p><span className="text-subtle">Needed by:</span> {request.deadline}</p>}
              {request.notes && <p className="leading-relaxed text-muted">{request.notes}</p>}
            </section>
          )}
        </div>

        <section className="flex flex-col gap-4 rounded-[20px] bg-ink p-4 text-cream sm:p-6 lg:sticky lg:top-6 lg:w-[380px] lg:shrink-0">
          <h2 className="text-lg font-bold">Quote</h2>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Product cost from China
            <span className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle">£</span>
              <input
                inputMode="decimal"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                placeholder="0.00"
                className={`${input} text-ink`}
              />
            </span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Shipping to the customer
            <span className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle">£</span>
              <input
                inputMode="decimal"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                placeholder="0.00"
                className={`${input} text-ink`}
              />
            </span>
          </label>

          <div className="flex flex-col gap-2.5 border-t border-[#3a342c] pt-4 text-[15px]">
            <div className="flex justify-between text-[#d9cfc0]"><span>Products</span><span>{gbp(cost)}</span></div>
            <div className="flex justify-between text-[#d9cfc0]"><span>Service charge (10%)</span><span>{gbp(charge)}</span></div>
            <div className="flex justify-between text-[#d9cfc0]"><span>Shipping</span><span>{gbp(ship)}</span></div>
            <div className="flex items-baseline justify-between border-t border-[#3a342c] pt-3">
              <span className="font-bold">Customer pays</span>
              <span className="font-display text-3xl">{gbp(total)}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#a89d8e]">
              When they go ahead, their £50 commitment fee is refunded.
            </p>
          </div>

          {status === "New" && (
            <button
              disabled={!canQuote}
              onClick={() => act("Quote sent", `Quote of ${gbp(total)} sent to ${request.name}.`)}
              className="h-12 rounded-full bg-clay font-semibold text-white disabled:opacity-50"
            >
              Send quote
            </button>
          )}
          {status === "Quote sent" && (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => act("Going ahead", `${request.name} is going ahead. Remember to refund their £50.`)}
                className="h-12 rounded-full bg-cream font-semibold text-ink"
              >
                Mark as going ahead
              </button>
              <button
                onClick={() => act("Not proceeding", `${request.name} is not going ahead. The £50 fee is kept.`)}
                className="h-12 rounded-full border-[1.5px] border-[#3a342c] font-semibold text-cream"
              >
                Mark as not going ahead
              </button>
              <button
                disabled={!canQuote}
                onClick={() => act("Quote sent", `Updated quote of ${gbp(total)} sent to ${request.name}.`)}
                className="h-11 rounded-full text-sm font-semibold text-[#e8b89f] underline disabled:opacity-50"
              >
                Send updated quote
              </button>
            </div>
          )}
          {(status === "Going ahead" || status === "Not proceeding") && (
            <p className="rounded-[14px] bg-ink-soft px-4 py-3 text-sm text-[#d9cfc0]">
              {status === "Going ahead"
                ? "In progress. Track the order and update the customer by email or WhatsApp."
                : "Closed. The customer chose not to go ahead."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}