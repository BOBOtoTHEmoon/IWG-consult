import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRightIcon, CheckIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { categories, gbp, products } from "@/lib/data";

const steps = [
  ["Send your list", "Tell Goody what you want, with photos or links if you have them. A £50 commitment fee gets things started."],
  ["She sources it", "Within 2 to 4 working days you get suppliers and the full product cost. Go ahead and the £50 comes back to you."],
  ["Checked, shipped and tracked", "Quantity and quality are verified, the best shipping route is chosen, and your items are tracked to you."],
];
export default function HomePage() {
  const newArrivals = products.slice(0, 4);
  const featured = products[0];

  return (
    <>
      {/* Hero */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-[72px] lg:px-20 lg:pb-24 lg:pt-[72px]">
        <div className="flex flex-col gap-5 lg:w-[600px] lg:shrink-0 lg:gap-7">
          
                    <h1 className="font-display text-[44px] font-medium leading-[1.05] tracking-[-0.01em] sm:text-6xl lg:text-[76px]">
            Beautiful things, <span className="text-clay">sourced</span> with care.
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
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-16 sm:px-10 sm:gap-8 lg:gap-9 lg:px-20 lg:pb-24 lg:pt-8">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-2xl tracking-[-0.015em] sm:text-[46px]">Shop by category</h2>
          <Link
            href="/shop"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-clay hover:text-clay-dark sm:text-[15px]"
          >
            View all <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 after:w-2 after:shrink-0 after:content-[''] sm:mx-0 sm:grid sm:grid-cols-3 sm:scroll-px-0 sm:gap-4 sm:overflow-visible sm:px-0 sm:after:hidden lg:grid-cols-5 lg:gap-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="relative h-[190px] w-[160px] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-[260px] sm:w-auto sm:rounded-[20px] lg:h-[330px]"
            >
              <PhotoPlaceholder tint={c.tint} className="h-full w-full" />
              <span className="absolute inset-x-2.5 bottom-2.5 flex h-10 items-center justify-between rounded-xl bg-paper px-3 text-sm font-semibold text-ink sm:inset-x-3.5 sm:bottom-3.5 sm:h-12 sm:rounded-[14px] sm:px-4 sm:text-[15px]">
                {c.name}
                <ArrowRightIcon size={15} className="shrink-0 text-clay" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-20 sm:px-10 sm:gap-8 lg:gap-9 lg:px-20 lg:pb-28">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-1.5 sm:gap-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">Just landed</span>
            <h2 className="font-display text-2xl tracking-[-0.015em] sm:text-[46px]">New arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-clay hover:text-clay-dark sm:text-[15px]"
          >
            View all <ArrowRightIcon size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 lg:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.slug} product={p} imageClass="h-[190px] sm:h-[300px] lg:h-[380px]" />
          ))}
        </div>
      </section>

         {/* Sourcing */}
      <section className="bg-brown text-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-20 sm:px-10 lg:flex-row lg:gap-24 lg:px-20 lg:py-[104px]">
          <div className="flex flex-col gap-6 lg:w-[560px] lg:shrink-0">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">Sourcing services</span>
            <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.015em] sm:text-[52px] sm:leading-[1.08]">
              Can&apos;t find it in the shop? Goody will source it for you.
            </h2>
            <p className="text-base leading-relaxed text-[#e8d9c6] sm:text-lg">
              Import with Goody started as a sourcing service for UK clients, and it still is. Send her a list of
              anything you want from China and she handles the suppliers, quality checks and shipping, for a service
              charge of 10% of the product cost.
            </p>
                        <div className="flex items-center gap-4 sm:gap-5">
              <Link
                href="/sourcing#request"
                className="flex h-12 shrink-0 items-center rounded-full bg-cream px-5 text-[15px] font-semibold text-brown sm:h-[52px] sm:px-[26px] sm:text-base"
              >
                Start a sourcing request
              </Link>
              <Link
                href="/sourcing"
                className="flex h-12 shrink-0 items-center text-[15px] font-semibold text-cream underline underline-offset-4 sm:h-[52px] sm:text-base"
              >
                How it works
              </Link>
            </div>
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

            {/* Newsletter */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-20 lg:py-28">
        <div className="flex flex-col justify-between gap-8 rounded-[28px] border border-line bg-paper p-8 sm:p-12 lg:flex-row lg:items-center lg:p-16">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-3xl sm:text-4xl">Be first to see new arrivals</h2>
            <p className="text-base text-muted">One short email when new stock lands. No spam.</p>
          </div>
          {/* TODO: connect to Resend audience or Supabase table */}
          <form className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              className="h-[52px] rounded-full border-[1.5px] border-line-strong bg-white px-[18px] text-base sm:w-[340px]"
            />
            <button className="h-[52px] shrink-0 rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">
              Sign up
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
