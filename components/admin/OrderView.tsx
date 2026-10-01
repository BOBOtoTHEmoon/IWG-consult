"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon, ChevronLeftIcon, ExternalIcon, MailIcon, WhatsappIcon } from "../Icons";
import { gbp, royalMailTrackingUrl, statusTone, type FullOrder, type OrderStatus } from "@/lib/data";

const steps: OrderStatus[] = ["To pack", "Packed", "Shipped", "Delivered"];
const stepLabel: Record<OrderStatus, string> = {
  "To pack": "Paid",
  Packed: "Packed",
  Shipped: "Shipped",
  Delivered: "Delivered",
};

export default function OrderView({ order }: { order: FullOrder }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.tracking ?? "");
  const [notice, setNotice] = useState("");

  const current = steps.indexOf(status);
  const subtotal = order.lines.reduce((s, l) => s + l.price * l.qty, 0);
  const waLink = order.phone ? `https://wa.me/${order.phone.replace(/[^0-9]/g, "")}` : "";

  function move(next: OrderStatus, message: string) {
    // TODO (backend phase): save to Supabase and email the customer through Resend.
    setStatus(next);
    setNotice(message);
  }

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <Link href="/admin/orders" className="-ml-2 flex h-10 items-center gap-1 self-start rounded-full pr-3 text-sm font-semibold text-ink print:hidden">
        <ChevronLeftIcon size={20} />
        Orders
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-[28px] leading-tight sm:text-[36px]">#{order.id}</h1>
          <span className="text-sm text-subtle">Placed {order.placed}</span>
        </div>
        <span className={`inline-flex h-8 shrink-0 items-center rounded-full px-3 text-sm font-bold ${statusTone[status]}`}>{status}</span>
      </div>

      {/* Progress */}
      <ol className="grid grid-cols-4 gap-2 print:hidden" aria-label="Order progress">
        {steps.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s} className="flex flex-col gap-2">
              <span className={`h-1.5 rounded-full ${done ? "bg-jade" : "bg-line"}`} />
              <span className={`flex items-center gap-1 text-xs font-semibold sm:text-[13px] ${done ? "text-jade" : "text-subtle"}`}>
                {done && <CheckIcon size={13} strokeWidth={3} />}
                {stepLabel[s]}
              </span>
            </li>
          );
        })}
      </ol>

      {notice && (
        <p role="status" className="rounded-[14px] bg-jade-soft px-4 py-3 text-sm font-semibold text-jade print:hidden">
          {notice}
        </p>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
            <h2 className="text-lg font-bold">Items</h2>
            {order.lines.map((l) => (
              <div key={l.slug + (l.variant ?? "")} className="flex items-center gap-3">
                <span className="relative h-14 w-14 shrink-0 rounded-xl" style={{ background: l.tint }}>
                  <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1 text-xs font-bold text-cream">
                    {l.qty}
                  </span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Link href={`/admin/products/${l.slug}`} className="truncate text-[15px] font-semibold text-ink hover:underline">
                    {l.name}
                  </Link>
                  {l.variant && <span className="text-[13px] text-subtle">{l.variant}</span>}
                </span>
                <span className="text-[15px] font-semibold">{gbp(l.price * l.qty)}</span>
              </div>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[#ece3d5] pt-3 text-[15px]">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{gbp(subtotal)}</span></div>
              <div className="flex justify-between">
                <span className="text-muted">{order.shippingMethod}</span>
                <span>{order.shippingPrice === 0 ? "Free" : gbp(order.shippingPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-[#ece3d5] pt-2 font-bold">
                <span>Total paid</span>
                <span>{gbp(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
            <h2 className="text-lg font-bold">Customer</h2>
            <address className="text-[15px] not-italic leading-relaxed">
              {order.address.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <p className="text-sm text-muted">{order.email}{order.phone ? ` | ${order.phone}` : ""}</p>
            <div className="flex gap-2.5 print:hidden">
              <a
                href={`mailto:${order.email}?subject=Your order ${order.id}`}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-white text-sm font-semibold text-ink sm:flex-none sm:px-5"
              >
                <MailIcon size={18} />
                Email
              </a>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-white text-sm font-semibold text-ink sm:flex-none sm:px-5"
                >
                  <WhatsappIcon size={18} />
                  WhatsApp
                </a>
              )}
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-4 rounded-[20px] bg-ink p-4 text-cream sm:p-6 lg:sticky lg:top-6 lg:w-[360px] lg:shrink-0 print:hidden">
          <h2 className="text-lg font-bold">Next step</h2>

          {status === "To pack" && (
            <>
              <p className="text-sm leading-relaxed text-[#d9cfc0]">Pack the items above, then mark the order as packed.</p>
              <button onClick={() => window.print()} className="h-12 rounded-full border-[1.5px] border-[#3a342c] font-semibold text-cream">
                Print packing slip
              </button>
              <button onClick={() => move("Packed", "Marked as packed.")} className="h-12 rounded-full bg-cream font-semibold text-ink">
                Mark as packed
              </button>
            </>
          )}

          {status === "Packed" && (
            <>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                Royal Mail tracking number
                <input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value.toUpperCase())}
                  placeholder="e.g. AB123456789GB"
                  className="h-12 rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal text-ink"
                />
                <span className="font-normal text-[#a89d8e]">Leave empty if you sent it untracked.</span>
              </label>
              <button
                onClick={() =>
                  move("Shipped", tracking ? `Marked as shipped. Tracking ${tracking} sent to the customer.` : "Marked as shipped. The customer has been emailed.")
                }
                className="h-12 rounded-full bg-clay font-semibold text-white"
              >
                Mark as shipped
              </button>
            </>
          )}

          {status === "Shipped" && (
            <>
              {tracking ? (
                <a
                  href={royalMailTrackingUrl(tracking)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[14px] bg-ink-soft px-4 py-3 text-sm"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[#a89d8e]">Tracking</span>
                    <span className="font-semibold">{tracking}</span>
                  </span>
                  <ExternalIcon size={16} />
                </a>
              ) : (
                <p className="text-sm text-[#d9cfc0]">Sent untracked.</p>
              )}
              <button onClick={() => move("Delivered", "Marked as delivered.")} className="h-12 rounded-full bg-cream font-semibold text-ink">
                Mark as delivered
              </button>
            </>
          )}

          {status === "Delivered" && (
            <p className="flex items-center gap-2 rounded-[14px] bg-ink-soft px-4 py-3 text-sm text-[#d9cfc0]">
              <CheckIcon size={16} className="text-[#9fd3bf]" />
              Delivered. Nothing left to do.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}