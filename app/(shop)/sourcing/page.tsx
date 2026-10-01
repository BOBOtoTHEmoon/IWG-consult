import Link from "next/link";
import SourcingForm from "@/components/shop/SourcingForm";
import { ArrowRightIcon, CheckboxIcon, InfoIcon, PinIcon, RouteIcon, SearchIcon } from "@/components/Icons";

export const metadata = {
  title: "Sourcing services | Import with Goody",
  description:
    "Send Goody a list of what you want from China. £50 commitment fee, refunded when you go ahead. 10% service charge on the product cost.",
};

const glance = [
  ["£50", "Commitment fee to start. You get it back when you go ahead with your order."],
  ["10%", "Service charge on the total product cost from China."],
  ["2 to 4 days", "Working days to receive your sourced products and full cost."],
];

const steps = [
  ["Send your list", "Describe every item you want in as much detail as you can, and pay the £50 commitment fee."],
  ["We source it", "Within 2 to 4 working days, Goody comes back with suppliers and the full product cost."],
  ["You go ahead", "Pay for the products plus the 10% service charge. Your £50 commitment fee is refunded."],
  ["We check, ship and track", "Quantity and quality are verified, the best shipping route is chosen, and your items are tracked to you."],
];

const covers = [
  { icon: SearchIcon, title: "Finding suppliers", body: "We search for the products on your list and confirm prices with suppliers." },
  { icon: CheckboxIcon, title: "Quantity and quality checks", body: "We verify that you get the right quantity and the quality you expect." },
  { icon: RouteIcon, title: "Best shipping route", body: "We pick the best route and shipping method for your type of product." },
  { icon: PinIcon, title: "Tracking to delivery", body: "We keep track of your items so you never miss your delivery." },
];

const faqs = [
  ["When do I get my £50 back?", "As soon as you go ahead with the purchase. You pay the product cost and the 10% service charge, and the £50 is returned to you."],
  ["What if I change my mind after you've sourced my items?", "The £50 is not refunded, because the sourcing work has already been done."],
  ["How is the service charge worked out?", "It is 10% of the total product cost from China. For example, if your products come to £450, the service charge is £45."],
];

export default function SourcingPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      {/* Hero */}
      <section className="flex flex-col gap-10 pb-20 pt-10 lg:flex-row lg:items-center lg:gap-20 lg:pb-24 lg:pt-20">
        <div className="flex flex-1 flex-col gap-6">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-jade">Sourcing from China</span>
          <h1 className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-[70px]">
            Tell us what you need. <span className="text-clay">We&apos;ll find it</span>
          </h1>
          <p className="max-w-[600px] text-base leading-relaxed text-muted sm:text-[19px]">
            Send Goody a list of the products you want. She finds the right suppliers and gives you the full cost, then
            checks, ships and tracks your order all the way to you.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3.5">
            <Link href="#request" className="flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-clay px-7 font-semibold text-white hover:bg-clay-dark">
              Start your request <ArrowRightIcon size={18} />
            </Link>
            <Link href="#pricing" className="flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-ink px-[26px] font-semibold text-ink">
              How pricing works
            </Link>
          </div>
        </div>
        <div className="flex flex-col rounded-[28px] bg-ink p-7 text-cream sm:p-9 lg:w-[460px] lg:shrink-0">
          <span className="pb-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">At a glance</span>
          {glance.map(([big, small]) => (
            <div key={big} className="flex flex-col gap-1.5 border-t border-[#3a342c] py-5 last:pb-0">
              <span className="font-display text-4xl sm:text-[44px]">{big}</span>
              <span className="text-base text-[#d9cfc0]">{small}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="flex flex-col gap-10 pb-20 lg:pb-28">
        <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">How it works</h2>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex flex-col gap-3.5 rounded-[22px] border border-line bg-paper p-7">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-xl text-white ${i === 3 ? "bg-jade" : "bg-clay"}`}>
                {i + 1}
              </span>
              <span className="text-xl font-bold">{title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{body}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-28 pb-20 lg:pb-28">
        <div className="flex flex-col gap-10 rounded-[32px] bg-sand p-6 sm:p-16 lg:flex-row lg:items-start lg:gap-16">
          <div className="flex flex-1 flex-col gap-5">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">Simple pricing</span>
            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-[44px]">
              You only pay for our service when you go ahead.
            </h2>
            <p className="text-[17px] leading-relaxed text-muted">
              The £50 commitment fee shows us you are serious and lets us start sourcing straight away. When you go ahead
              with the purchase, you pay 10% of the product cost as our service charge and the £50 comes back to you.
            </p>
            <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-paper p-5">
              <InfoIcon size={22} className="mt-px shrink-0 text-clay-dark" />
              <span className="text-[15px] leading-relaxed">
                <strong>If you decide not to go ahead,</strong> the £50 is not refunded, because it covers the sourcing
                work we have already completed for you.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-[0_18px_40px_rgba(60,30,10,0.1)] sm:p-8 lg:w-[480px] lg:shrink-0">
            <span className="text-sm font-bold text-subtle">Example order</span>
            <Row label="Products from China" value="£450.00" />
            <Row label="Goody's service charge (10%)" value="£45.00" />
            <div className="flex items-center justify-between border-b border-[#ece3d5] pb-3.5">
              <span className="flex flex-col gap-0.5">
                <span>Commitment fee refunded</span>
                <span className="text-[13px] text-subtle">You paid this when you sent your list</span>
              </span>
              <span className="font-bold text-jade">£50.00 back</span>
            </div>
            <Row label="Shipping" value="Quoted for your items" muted />
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-bold">Our fee for this order</span>
              <span className="font-display text-[34px] font-semibold">£45.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="flex flex-col gap-9 pb-20 lg:pb-28">
        <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">What the service covers</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {covers.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3.5 border-t-2 border-ink pt-5">
              <Icon size={26} className="text-clay" />
              <span className="text-[19px] font-bold">{title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Request form */}
      <section className="pb-20 lg:pb-28">
        <SourcingForm />
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-8 pb-24 lg:flex-row lg:gap-20">
        <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[40px] lg:w-[360px] lg:shrink-0">Questions</h2>
        <div className="flex flex-1 flex-col border-t border-line-strong">
          {faqs.map(([q, a], i) => (
            <details key={q} open={i === 0} className="border-b border-line-strong py-[22px]">
              <summary className="cursor-pointer text-lg font-semibold">{q}</summary>
              <p className="mt-3 text-base leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between border-b border-[#ece3d5] pb-3.5">
      <span>{label}</span>
      <span className={muted ? "text-muted" : "font-semibold"}>{value}</span>
    </div>
  );
}
