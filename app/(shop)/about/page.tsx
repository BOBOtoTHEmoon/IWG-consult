import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, CheckboxIcon, PinIcon, RouteIcon, SearchIcon } from "@/components/Icons";

export const metadata = {
  title: "About Goody | Import with Goody",
  description:
    "Meet Goodness Omotolani Olanrewaju, the import specialist behind Import with Goody. Sourcing from China, checked and shipped to you, since 2018.",
};

const stats = [
  { to: 7, suffix: "+", label: "Years in sourcing and freight" },
  { to: 200, suffix: "+", label: "Verified factories" },
  { to: 100, prefix: "£", suffix: "k+", label: "Of orders managed" },
];

const ways = [
  { icon: SearchIcon, title: "Straight to the source", body: "We work directly with verified factories in China, not through a chain of middlemen." },
  { icon: CheckboxIcon, title: "Checked, not assumed", body: "Quantity and quality are verified before anything is shipped or listed." },
  { icon: RouteIcon, title: "The right route", body: "Every order goes by the best shipping route and method for the type of product." },
  { icon: PinIcon, title: "Followed to your door", body: "Items are tracked all the way, so you always know where your order is." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pb-14 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-20 lg:pb-24 lg:pt-16">
        <div className="flex flex-1 flex-col gap-5 sm:gap-6">
          <span className="animate-fade-up text-xs font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">About Import with Goody</span>
          <h1
            className="animate-fade-up font-display text-[38px] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[68px]"
            style={{ animationDelay: "80ms" }}
          >
            Sourcing should feel like <span className="text-clay">trust.</span>
          </h1>
          <p className="animate-fade-up max-w-[600px] text-base leading-relaxed text-muted sm:text-xl" style={{ animationDelay: "160ms" }}>
            Import with Goody started in 2018 as a side venture between a UK importer and a freight specialist who were
            tired of watching good clients get burned by faceless agents. Today it&apos;s a sourcing service and a shop,
            built on the same promise: one person who knows your order, from the factory to your front door.
          </p>
          {/* Side by side, even on phones */}
          <div className="animate-fade-up grid grid-cols-2 gap-2.5 pt-1 sm:flex sm:gap-3.5" style={{ animationDelay: "240ms" }}>
            <Link
              href="/sourcing/request"
              className="group flex h-12 items-center justify-center gap-2 rounded-full bg-clay px-3 text-[15px] font-semibold text-white hover:bg-clay-dark sm:h-[52px] sm:px-6 sm:text-base"
            >
              <span className="sm:hidden">Start a request</span>
              <span className="hidden sm:inline">Start a sourcing request</span>
              <ArrowRightIcon size={18} className="hidden transition-transform duration-300 group-hover:translate-x-1 sm:block" />
            </Link>
            <Link
              href="/shop"
              className="flex h-12 items-center justify-center rounded-full border-[1.5px] border-ink px-3 text-[15px] font-semibold text-ink hover:bg-ink hover:text-cream sm:h-[52px] sm:px-6 sm:text-base"
            >
              Browse the shop
            </Link>
          </div>
        </div>

        <figure className="animate-fade-up relative lg:w-[480px] lg:shrink-0" style={{ animationDelay: "200ms" }}>
          <div className="overflow-hidden rounded-[28px] bg-[#e6d3bf]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/goody.jpg"
              alt="Goodness Omotolani Olanrewaju, founder of Import with Goody"
              width={900}
              height={1100}
              className="aspect-[9/11] w-full object-cover"
            />
          </div>
          <figcaption className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-paper p-4 shadow-[0_18px_40px_rgba(60,30,10,0.16)] sm:left-6 sm:right-auto sm:max-w-[320px]">
            <span className="block text-[15px] font-semibold">Goodness Omotolani Olanrewaju</span>
            <span className="text-sm text-subtle">Founder and lead consultant</span>
          </figcaption>
        </figure>
      </section>

      {/* Quote */}
      <section className="bg-brown text-cream">
        <Reveal className="mx-auto flex max-w-[1000px] flex-col gap-6 px-5 py-16 sm:px-10 lg:py-28">
          <span className="font-display text-6xl leading-none text-gold sm:text-7xl" aria-hidden="true">&ldquo;</span>
          <blockquote className="-mt-6 font-display text-[24px] leading-[1.3] sm:text-[40px] sm:leading-[1.25]">
            Seven years between UK importers and Asian manufacturers taught me one thing: most sourcing problems are
            communication problems. Every brief I take on, I treat as if I were the one waiting for the container to land.
          </blockquote>
          <span className="text-[15px] text-[#e8d9c6]">Goody, founder</span>
        </Reveal>
      </section>

      {/* Numbers: three across, even on phones */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 lg:px-20 lg:py-24">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="flex flex-col gap-1.5 border-t-2 border-ink pt-3 sm:gap-2 sm:pt-5">
              <span className="font-display text-[30px] leading-none text-clay sm:text-[56px] lg:text-[72px]">
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
              </span>
              <span className="text-xs leading-snug text-muted sm:text-base">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work: 2 x 2 on phones, 4 across on desktop */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-16 sm:gap-9 sm:px-10 lg:px-20 lg:pb-28">
        <Reveal>
          <h2 className="font-display text-[28px] tracking-[-0.015em] sm:text-[44px]">How we work</h2>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ways.map(({ icon: Icon, title, body }, i) => (
            <Reveal
              key={title}
              delay={i * 90}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4 sm:gap-3.5 sm:rounded-none sm:border-0 sm:border-t-2 sm:border-ink sm:bg-transparent sm:p-0 sm:pt-5"
            >
              <Icon size={22} className="text-clay" />
              <span className="text-[15px] font-bold leading-snug sm:text-[19px]">{title}</span>
              <span className="text-[13px] leading-relaxed text-muted sm:text-[15px]">{body}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Two ways in */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-20">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Reveal className="flex flex-col gap-3 rounded-[24px] border border-line bg-paper p-6 sm:gap-4 sm:rounded-[28px] sm:p-10">
            <h2 className="font-display text-[26px] sm:text-3xl">Shop the collection</h2>
            <p className="text-[15px] leading-relaxed text-muted sm:text-base">
              Homeware, fashion, baby essentials and gifts Goody has already sourced and checked, ready to post from the UK.
            </p>
            <Link href="/shop" className="mt-1 flex h-12 items-center self-start rounded-full bg-clay px-6 font-semibold text-white hover:bg-clay-dark sm:h-[52px]">
              Browse the shop
            </Link>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-3 rounded-[24px] bg-ink p-6 text-cream sm:gap-4 sm:rounded-[28px] sm:p-10">
            <h2 className="font-display text-[26px] sm:text-3xl">Need something specific?</h2>
            <p className="text-[15px] leading-relaxed text-[#d9cfc0] sm:text-base">
              Send your list. Goody finds the suppliers, checks the goods and ships them to you, for 10% of the product cost.
            </p>
            <Link href="/sourcing" className="mt-1 flex h-12 items-center self-start rounded-full bg-cream px-6 font-semibold text-ink sm:h-[52px]">
              See how sourcing works
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}