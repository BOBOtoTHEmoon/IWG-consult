import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon, InfoIcon, MailIcon, WhatsappIcon } from "@/components/Icons";
import { site } from "@/lib/site";
import { getSourcingRequestByRef } from "@/lib/sourcing";
import { whatsappLink, whatsappMessage } from "@/lib/sourcing-types";
   import SourcingPayButton from "@/components/shop/SourcingPayButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your sourcing request | Import with Goody", robots: { index: false } };

// The customer's private page for one request. Before payment it's the payment step;
// after payment it's the confirmation, with the WhatsApp message ready to send.
export default async function SourcingRequestStatus({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const r = await getSourcingRequestByRef(ref);
  if (!r) notFound();

  const paid = r.feeStatus !== "unpaid";
  const wa = site.whatsappNumber ? whatsappLink(site.whatsappNumber, whatsappMessage(r)) : "";

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      {paid ? (
        <section className="flex flex-col items-start gap-5 rounded-3xl border border-line bg-paper p-6 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-white">
            <CheckIcon size={24} strokeWidth={2.5} />
          </span>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-subtle">Request {r.number}</span>
            <h1 className="font-display text-[34px] leading-tight sm:text-5xl">Payment received. You&apos;re all set!</h1>
          </div>
          <p className="text-[17px] leading-relaxed text-muted">
            Goody will come back to you with suppliers and the full product cost within 2 to 4 working days. We&apos;ve
            emailed a confirmation to <strong className="text-ink">{r.email}</strong>.
          </p>

          {wa ? (
            <div className="flex w-full flex-col gap-3 rounded-2xl bg-jade-soft p-5">
              <p className="text-[15px] font-semibold text-jade">Next: message Goody on WhatsApp</p>
              <p className="text-[15px] leading-relaxed text-ink">
                Your message is ready with your request number and your list, so Goody can ask you anything she needs.
                Just press send, and add any extra photos there.
              </p>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 items-center justify-center gap-2.5 rounded-full bg-[#1f7a4d] text-base font-semibold text-white hover:bg-[#186640]"
              >
                <WhatsappIcon size={20} />
                Message Goody on WhatsApp
              </a>
            </div>
          ) : (
            <a
              href={`mailto:${site.email}?subject=Sourcing request ${r.number}`}
              className="flex h-14 items-center justify-center gap-2.5 self-stretch rounded-full bg-ink text-base font-semibold text-cream"
            >
              <MailIcon size={20} />
              Email Goody about your list
            </a>
          )}
        </section>
      ) : (
        <section className="flex flex-col gap-5 rounded-3xl border border-line bg-paper p-6 sm:p-10">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-subtle">Request {r.number} | Step 2 of 2</span>
            <h1 className="font-display text-[34px] leading-tight sm:text-5xl">Pay £50 to send your request</h1>
          </div>
          <p className="text-[17px] leading-relaxed text-muted">
            Your list is saved. Goody starts sourcing as soon as the £50 commitment fee is paid, and it&apos;s refunded when you
            go ahead with the purchase.
          </p>
                     <SourcingPayButton refId={r.publicRef} />
          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-subtle">
            <InfoIcon size={18} className="mt-0.5 shrink-0" />
            Keep this page open, or come back to it from the same link. Once you&apos;ve paid, you&apos;ll see your
            confirmation here and can message Goody on WhatsApp.
          </p>
        </section>
      )}

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold">Your list</h2>
        <ol className="flex flex-col">
          {r.items.map((i, n) => (
            <li key={i.id} className="flex gap-3 border-b border-[#ece3d5] py-3 last:border-b-0">
              <span className="w-6 shrink-0 font-semibold text-subtle">{n + 1}.</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-semibold">
                  {i.name} <span className="font-normal text-subtle">x{i.quantity}</span>
                </span>
                {i.description && <span className="whitespace-pre-line text-sm text-muted">{i.description}</span>}
              </span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-subtle">
          Delivering to {r.country}. Need to change something?{" "}
          <Link href="/contact" className="text-clay underline">Get in touch</Link>.
        </p>
      </section>
    </div>
  );
}