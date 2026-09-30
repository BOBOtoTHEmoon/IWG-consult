import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRightIcon, CheckIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { categories, gbp, products } from "@/lib/data";

const steps = [
  ["Found at source", "Goody works directly with suppliers and factories in China, so there is no chain of middlemen."],
  ["Checked before listing", "Samples are reviewed for quality and finish before anything goes on sale."],
  ["Delivered to you", "Posted from the UK with Royal Mail, to UK and international addresses."],
];

export default function HomePage() {
  const newArrivals = products.slice(0, 4);
  const featured = products[0];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-[72px] lg:px-20 lg:pb-24 lg:pt-[72px]">
        <div className="flex flex-col gap-5 lg:w-[600px] lg:shrink-0 lg:gap-7">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">
            A UK sourcing studio with a shop
          </span>
          <h1 className="font-display text-[42px] font-medium leading-[1.03] tracking-[-0.02em] sm:text-6xl lg:text-[78px]">
            Beautiful things, <em className="text-clay">sourced</em> with care.
          </h1>
          <p className="max-w-[520px] text-base leading-relaxed text-muted sm:text-[19px]">
            Homeware, fashion, baby essentials and gifts, hand-picked from trusted makers in China and delivered to
            your door in the UK and beyond.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3.5">
            <Link
              href="/shop"
              className="flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-clay px-7 text-base font-semibold text-white hover:bg-clay-dark"
            >
              Shop the collection <ArrowRightIcon size={18} />
            </Link>
            <Link
              href="/sourcing"
              className="flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-ink px-[26px] text-base font-semibold text-ink hover:bg-ink hover:text-cream"
            >
              Source something custom
            </Link>
          </div>
          <div className="hidden flex-wrap gap-7 border-t border-line pt-5 text-sm text-muted sm:flex">
            <span className="flex items-center gap-2"><CheckIcon size={18} className="text-jade" />Checked before listing</span>
            <span className="flex items-center gap-2"><TruckIcon size={18} className="text-jade" />Royal Mail delivery</span>
            <span className="flex items-center gap-2"><ShieldIcon size={18} className="text-jade" />Secure PayPal checkout</span>
          </div>
        </div>

        <div className="relative grid h-[260px] flex-1 grid-cols-2 grid-rows-2 gap-4 sm:h-[480px] lg:h-[600px]">
          <PhotoPlaceholder tint="#e6d3bf" label="Lifestyle photo, homeware" className="row-span-2 rounded-3xl" />
          <PhotoPlaceholder tint="#e9cfc6" label="Fashion photo" className="rounded-3xl" />
          <PhotoPlaceholder tint="#d8dfd0" label="Baby photo" className="rounded-3xl" />
          <Link
            href={`/product/${featured.slug}`}
            className="absolute bottom-10 left-[-44px] hidden w-[300px] items-center gap-3.5 rounded-[18px] bg-paper p-3.5 text-ink shadow-[0_18px_40px_rgba(60,30,10,0.16)] xl:flex"
          >
            <span className="h-16 w-16 shrink-0 rounded-xl" style={{ background: featured.tint }} />
            <span className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-clay">New in</span>
              <span className="text-[15px] font-semibold">{featured.name}</span>
              <span className="text-sm text-muted">{gbp(featured.price)}</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-20 sm:px-10 lg:gap-9 lg:px-20 lg:pb-24 lg:pt-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">Shop by category</h2>
          <Link href="/shop" className="text-[15px] font-semibold">See everything</Link>
        </div>
        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="relative h-[260px] w-[220px] shrink-0 snap-start overflow-hidden rounded-[20px] sm:w-auto lg:h-[330px]"
            >
              <PhotoPlaceholder tint={c.tint} className="h-full w-full" />
              <span className="absolute inset-x-3.5 bottom-3.5 flex h-12 items-center justify-between rounded-[14px] bg-paper px-4 text-[15px] font-semibold text-ink">
                {c.name}
                <ArrowRightIcon size={16} className="text-clay" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-20 sm:px-10 lg:gap-9 lg:px-20 lg:pb-28">
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">Just landed</span>
            <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[46px]">New arrivals</h2>
          </div>
          <Link href="/shop" className="text-[15px] font-semibold">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-brown text-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-20 sm:px-10 lg:flex-row lg:gap-24 lg:px-20 lg:py-[104px]">
          <div className="flex flex-col gap-6 lg:w-[560px] lg:shrink-0">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">The Goody difference</span>
            <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.015em] sm:text-[52px] sm:leading-[1.08]">
              Every piece is found at the source and looked over before it reaches you.
            </h2>
            <p className="text-base leading-relaxed text-[#e8d9c6] sm:text-lg">
              Import with Goody started as a sourcing service for UK clients. The shop brings that same careful eye to a
              small, considered collection, so you get a personal buyer&apos;s standards without the minimum order.
            </p>
            <Link href="/sourcing" className="flex h-[52px] items-center self-start rounded-full bg-cream px-[26px] font-semibold text-brown">
              Meet Goody
            </Link>
          </div>
          <ol className="flex flex-1 flex-col">
            {steps.map(([title, body], i) => (
              <li key={title} className="flex gap-7 border-t border-cream/20 py-7 last:border-b">
                <span className="w-[60px] shrink-0 font-display text-[34px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-2">
                  <span className="text-[22px] font-semibold">{title}</span>
                  <span className="text-base leading-relaxed text-[#e8d9c6]">{body}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Sourcing CTA */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-20 lg:py-28">
        <div className="flex flex-col overflow-hidden rounded-[28px] border border-line bg-paper lg:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-5 p-8 sm:p-16">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-jade">Sourcing services</span>
            <h2 className="font-display text-3xl font-medium leading-[1.1] tracking-[-0.015em] sm:text-[44px]">
              Looking for something we don&apos;t stock?
            </h2>
            <p className="max-w-[560px] text-base leading-relaxed text-muted sm:text-lg">
              Send Goody a list of what you want from China. She finds the right suppliers, checks quality and quantity,
              and gets it shipped to you, for a service charge of 10% of the product cost.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/sourcing#request" className="flex h-[52px] items-center rounded-full bg-ink px-[26px] font-semibold text-cream">
                Start a sourcing request
              </Link>
              <Link href="/sourcing" className="flex h-[52px] items-center px-2 font-semibold text-ink underline">
                How it works
              </Link>
            </div>
          </div>
          <PhotoPlaceholder tint="#efdcb5" label="Photo of Goody sourcing" className="min-h-[280px] lg:min-h-[420px] lg:w-[520px]" />
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 pb-20 sm:px-10 lg:flex-row lg:items-center lg:px-20 lg:pb-24">
        <div className="flex flex-col gap-2.5">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">Be first to see new arrivals</h2>
          <p className="text-base text-muted">One short email when new stock lands. No spam.</p>
        </div>
        {/* TODO: connect to Resend audience or Supabase table */}
        <form className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Email address
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-[52px] rounded-full border-[1.5px] border-line-strong bg-paper px-[18px] text-base font-normal sm:w-[340px]"
            />
          </label>
          <button className="h-[52px] rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">Sign up</button>
        </form>
      </section>
    </>
  );
}
