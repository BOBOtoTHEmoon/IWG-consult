import Link from "next/link";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { ArrowRightIcon, CheckboxIcon, PinIcon, RouteIcon, SearchIcon } from "@/components/Icons";

export const metadata = {
  title: "About Goody | Import with Goody",
  description:
    "Meet Goodness Omotolani Olanrewaju, the import specialist behind Import with Goody. Sourcing from China, checked and shipped to you, since 2018.",
};

// TODO: confirm these figures with Goody before launch.
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
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-10 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-20 lg:pb-24 lg:pt-16">
        <div className="flex flex-1 flex-col gap-6">
          <span className="animate-fade-up text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">About Import with Goody</span>
          <h1
            className="animate-fade-up font-display text-[40px] leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[68px]"
            style={{ animationDelay: "80ms" }}
          >
            Sourcing should feel like <span className="text-clay">trust.</span>
          </h1>
          <p className="animate-fade-up max-w-[600px] text-lg leading-relaxed text-muted sm:text-xl" style={{ animationDelay: "160ms" }}>
            Import with Goody started in 2018 as a side venture between a UK importer and a freight specialist who were
            tired of watching good clients get burned by faceless agents. Today it&apos;s a sourcing service and a shop,
            built on the same promise: one person who knows your order, from the factory to your front door.
          </p>
          <div className="animate-fade-up flex flex-wrap gap-3.5 pt-1" style={{ animationDelay: "240ms" }}>
            <Link href="/sourcing" className="group flex h-[52px] items-center gap-2 rounded-full bg-clay px-6 font-semibold text-white hover:bg-clay-dark">
              Start a sourcing request
              <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/shop" className="flex h-[52px] items-center rounded-full border-[1.5px] border-ink px-6 font-semibold text-ink hover:bg-ink hover:text-cream">
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
        <Reveal className="mx-auto flex max-w-[1000px] flex-col gap-6 px-5 py-20 sm:px-10 lg:py-28">
          <span className="font-display text-7xl leading-none text-gold" aria-hidden="true">&ldquo;</span>
          <blockquote className="-mt-6 font-display text-[28px] leading-[1.25] sm:text-[40px]">
            Seven years between UK importers and Asian manufacturers taught me one thing: most sourcing problems are
            communication problems. Every brief I take on, I treat as if I were the one waiting for the container to land.
          </blockquote>
          <span className="text-[15px] text-[#e8d9c6]">Goody, founder</span>
        </Reveal>
      </section>

      {/* Numbers */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-20 lg:py-24">
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="flex flex-col gap-2 border-t-2 border-ink pt-5">
              <span className="font-display text-[56px] leading-none text-clay sm:text-[72px]">
                <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
              </span>
              <span className="text-base text-muted">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-9 px-5 pb-20 sm:px-10 lg:px-20 lg:pb-28">
        <Reveal>
          <h2 className="font-display text-3xl tracking-[-0.015em] sm:text-[44px]">How we work</h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ways.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 90} className="flex flex-col gap-3.5 border-t-2 border-ink pt-5">
              <Icon size={26} className="text-clay" />
              <span className="text-[19px] font-bold">{title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{body}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Two ways in */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-10 lg:px-20">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-[28px] border border-line bg-paper p-8 sm:p-10">
            <h2 className="font-display text-3xl">Shop the collection</h2>
            <p className="text-base leading-relaxed text-muted">
              Homeware, fashion, baby essentials and gifts Goody has already sourced and checked, ready to post from the UK.
            </p>
            <Link href="/shop" className="mt-2 flex h-[52px] items-center self-start rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">
              Browse the shop
            </Link>
          </Reveal>
          <Reveal delay={100} className="flex flex-col gap-4 rounded-[28px] bg-ink p-8 text-cream sm:p-10">
            <h2 className="font-display text-3xl">Need something specific?</h2>
            <p className="text-base leading-relaxed text-[#d9cfc0]">
              Send your list. Goody finds the suppliers, checks the goods and ships them to you, for 10% of the product cost.
            </p>
            <Link href="/sourcing" className="mt-2 flex h-[52px] items-center self-start rounded-full bg-cream px-[26px] font-semibold text-ink">
              See how sourcing works
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}