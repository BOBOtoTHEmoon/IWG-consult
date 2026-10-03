import Link from "next/link";
import Reveal from "@/components/Reveal";
import StickyRequestButton from "@/components/shop/StickyRequestButton";
import { ArrowRightIcon, CalendarIcon, CheckboxIcon, InfoIcon, RouteIcon, SearchIcon } from "@/components/Icons";

export const metadata = {
  title: "Sourcing services | Import with Goody",
  description:
    "Send Goody a list of what you want from China. £50 commitment fee, refunded when you go ahead. 10% service charge on the product cost.",
  alternates: { canonical: "/sourcing" },
};

const glance = [
  { big: "£50", small: "To start, refunded when you go ahead" },
  { big: "10%", small: "Service charge on the product cost" },
  { big: "2 to 4", small: "Working days to get your quote" },
];

const steps = [
  ["Send your list", "Describe every item you want in as much detail as you can, and pay the £50 commitment fee."],
  ["We source it", "Within 2 to 4 working days, Goody comes back with verified suppliers and the full product cost."],
  ["You go ahead", "Approve your options, and samples if needed. Then pay for the products plus the 10% service charge, and your £50 is refunded."],
  ["Made, checked and shipped", "You get weekly updates while your order is made. It's checked for quantity and quality, then shipped by air or sea and tracked to you."],
];

const covers = [
  { icon: SearchIcon, title: "Finding suppliers", body: "Supplier research, factory checks and price negotiation, so you get the right product at the right price." },
  { icon: CheckboxIcon, title: "Samples and quality checks", body: "Samples arranged where needed, and every order checked for quantity and quality before it ships." },
  { icon: CalendarIcon, title: "Weekly updates", body: "While your order is being made, you hear from Goody every week, so you're never left guessing." },
  { icon: RouteIcon, title: "Shipping and tracking", body: "The best route for your products, by air or sea, tracked all the way to your door." },
];

const faqs = [
  ["What does the £50 cover?", "Supplier research, factory verification, price negotiation, sample coordination where needed, and all communication with manufacturers. It doesn't include the cost of the products or shipping."],
  ["When do I get my £50 back?", "As soon as you go ahead with the purchase. You pay the product cost and the 10% service charge, and the £50 is returned to you."],
  ["What if I change my mind after you've sourced my items?", "The £50 is not refunded, because the sourcing work has already been done."],
  ["How long does delivery from China take?", "It depends on the shipping method. Air freight usually takes around 7 working days or more, and sea freight up to 60 days. Goody recommends the best option for your items, timeline and budget."],
  ["Can I see a sample before ordering?", "Yes, where it makes sense. Goody arranges samples for you to approve before the full order is made."],
  ["How is the service charge worked out?", "It is 10% of the total product cost from China. For example, if your products come to £450, the service charge is £45."],
];

export default function SourcingPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      {/* Hero */}
      <section className="flex flex-col gap-8 pb-14 pt-8 lg:flex-row lg:items-center lg:gap-20 lg:pb-24 lg:pt-20">
        <div className="flex flex-1 flex-col gap-5 lg:gap-6">
          <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.14em] text-jade sm:text-[13px]">Sourcing from China</span>
          <h1
            className="animate-fade-up font-display text-[36px] leading-[1.05] tracking-[-0.02em] sm:text-6xl lg:text-[70px]"
            style={{ animationDelay: "80ms" }}
          >
            Tell us what you need. <span className="text-clay">We&apos;ll find it</span> in China.
          </h1>
          <p className="animate-fade-up max-w-[600px] text-base leading-relaxed text-muted sm:text-[19px]" style={{ animationDelay: "160ms" }}>
            Send Goody a list of the products you want. She finds the right suppliers and gives you the full cost, then
            checks, ships and tracks your order all the way to you.
          </p>
          <div className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:gap-3.5" style={{ animationDelay: "240ms" }}>
            <Link
              id="hero-request-button"
              href="/sourcing/request"
              className="group flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-clay px-7 font-semibold text-white hover:bg-clay-dark"
            >
              Start your request
              <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="hidden h-[54px] items-center justify-center rounded-full border-[1.5px] border-ink px-[26px] font-semibold text-ink sm:flex"
            >
              How pricing works
            </Link>
          </div>
        </div>

        {/* At a glance: three across on phones, stacked in a card on desktop */}
        <div className="animate-fade-up grid grid-cols-3 gap-2 rounded-[24px] bg-ink p-3 text-cream sm:gap-3 sm:p-5 lg:flex lg:w-[440px] lg:shrink-0 lg:flex-col lg:gap-0 lg:rounded-[28px] lg:p-9" style={{ animationDelay: "200ms" }}>
          <span className="hidden pb-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold lg:block">At a glance</span>
          {glance.map((g) => (
            <div key={g.big} className="flex flex-col gap-1 rounded-2xl bg-ink-soft p-3 lg:gap-1.5 lg:rounded-none lg:border-t lg:border-[#3a342c] lg:bg-transparent lg:px-0 lg:py-5 lg:last:pb-0">
              <span className="font-display text-2xl leading-none sm:text-3xl lg:text-[44px]">{g.big}</span>
              <span className="text-xs leading-snug text-[#d9cfc0] sm:text-sm lg:text-base">{g.small}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps: a tight numbered list on phones, cards from tablet up */}
      <section className="flex flex-col gap-6 pb-14 lg:gap-10 lg:pb-28">
        <Reveal>
          <h2 className="font-display text-[28px] tracking-[-0.015em] sm:text-[46px]">How it works</h2>
        </Reveal>
        <ol className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title} className="border-t border-line py-4 first:border-t-0 first:pt-0 sm:border-t-0 sm:p-0">
              <Reveal
                delay={i * 80}
                className="flex gap-4 sm:h-full sm:flex-col sm:gap-3.5 sm:rounded-[22px] sm:border sm:border-line sm:bg-paper sm:p-7"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-base text-white sm:h-11 sm:w-11 sm:text-xl ${
                    i === 3 ? "bg-jade" : "bg-clay"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1 sm:gap-3.5">
                  <span className="text-base font-bold sm:text-xl">{title}</span>
                  <span className="text-sm leading-relaxed text-muted sm:text-[15px]">{body}</span>
                </span>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-28 pb-14 lg:pb-28">
        <Reveal className="flex flex-col gap-6 rounded-[24px] bg-sand p-5 sm:rounded-[32px] sm:p-12 lg:flex-row lg:items-start lg:gap-16 lg:p-16">
          <div className="flex flex-1 flex-col gap-4 sm:gap-5">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">Simple pricing</span>
            <h2 className="font-display text-[26px] leading-[1.15] tracking-[-0.015em] sm:text-[44px] sm:leading-[1.1]">
              You only pay for our service when you go ahead.
            </h2>
            <p className="text-[15px] leading-relaxed text-muted sm:text-[17px]">
              The £50 commitment fee lets us start sourcing straight away. When you go ahead, you pay 10% of the product
              cost as our service charge and the £50 comes back to you.
            </p>
            <div className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 sm:gap-3.5 sm:p-5">
              <InfoIcon size={20} className="mt-px shrink-0 text-clay-dark" />
              <span className="text-sm leading-relaxed sm:text-[15px]">
                <strong>If you decide not to go ahead,</strong> the £50 is kept, as it covers the sourcing work already done.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 text-[15px] shadow-[0_18px_40px_rgba(60,30,10,0.1)] sm:gap-4 sm:rounded-3xl sm:p-8 sm:text-base lg:w-[460px] lg:shrink-0">
            <span className="text-sm font-bold text-subtle">Example order</span>
            <Row label="Products from China" value="£450.00" />
            <Row label="Service charge (10%)" value="£45.00" />
            <Row label="Your £50 fee" value="Refunded" valueClass="font-bold text-jade" />
            <Row label="Shipping" value="Quoted for your items" valueClass="text-muted" />
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-bold">Our fee for this order</span>
              <span className="font-display text-[28px] font-semibold sm:text-[34px]">£45.00</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* What it covers: 2 x 2 on phones */}
      <section className="flex flex-col gap-6 pb-14 lg:gap-9 lg:pb-28">
        <Reveal>
          <h2 className="font-display text-[28px] tracking-[-0.015em] sm:text-[46px]">What the service covers</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-8 lg:grid-cols-4 lg:gap-5">
          {covers.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80} className="flex flex-col gap-2 border-t-2 border-ink pt-4 sm:gap-3.5 sm:pt-5">
              <Icon size={22} className="text-clay" />
              <span className="text-[15px] font-bold leading-snug sm:text-[19px]">{title}</span>
              <span className="text-[13px] leading-relaxed text-muted sm:text-[15px]">{body}</span>
            </Reveal>
          ))}
        </div>
        <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
          <strong className="text-ink">Not included in the £50:</strong> the cost of the products and shipping. Both are quoted
          for you before you decide to go ahead.
        </p>
      </section>

      {/* Call to action */}
      <section className="pb-14 lg:pb-28">
        <Reveal className="flex flex-col items-start gap-5 rounded-[24px] bg-ink p-6 text-cream sm:rounded-[32px] sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-[28px] leading-tight sm:text-[40px]">Ready when you are.</h2>
            <p className="text-[15px] text-[#d9cfc0] sm:text-base">It takes a few minutes. Add as many items as you like.</p>
          </div>
          <Link href="/sourcing/request" className="flex h-[54px] items-center gap-2 rounded-full bg-cream px-7 font-semibold text-ink">
            Start your request <ArrowRightIcon size={18} />
          </Link>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="flex flex-col gap-6 pb-24 lg:flex-row lg:gap-20">
        <h2 className="font-display text-[28px] tracking-[-0.015em] sm:text-[40px] lg:w-[360px] lg:shrink-0">Questions</h2>
        <div className="flex flex-1 flex-col border-t border-line-strong">
          {faqs.map(([q, a]) => (
            <details key={q} className="border-b border-line-strong py-4 sm:py-[22px]">
              <summary className="cursor-pointer text-base font-semibold sm:text-lg">{q}</summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <StickyRequestButton watchId="hero-request-button" />
    </div>
  );
}

function Row({ label, value, valueClass = "font-semibold" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#ece3d5] pb-3">
      <span>{label}</span>
      <span className={`text-right ${valueClass}`}>{value}</span>
    </div>
  );
}