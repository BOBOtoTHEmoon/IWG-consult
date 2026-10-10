import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/shop/NewsletterForm";
import ProductCard from "@/components/shop/ProductCard";
import { ArrowRightIcon, CheckIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { gbp } from "@/lib/data";
import { getLiveProductById, getLiveProducts } from "@/lib/products";
import { getCategories, getSiteSettings } from "@/lib/site-content";
import { siteImageUrl } from "@/lib/site-content-types";
import { site } from "@/lib/site";

// Refresh the cached page at least every minute. Admin saves also refresh it straight away.
export const revalidate = 60;

const steps = [
  ["Send your list", "Tell Goody what you want, with photos or links if you have them. A £50 commitment fee gets things started."],
  ["She sources it", "Within 2 to 4 working days you get suppliers and the full product cost. Go ahead and the £50 comes back to you."],
  ["Checked, shipped and tracked", "Quantity and quality are verified, the best shipping route is chosen, and your items are tracked to you."],
];

// Stagger helper for the hero entrance.
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

// Puts the highlighted word in terracotta, if it appears in the headline.
function Headline({ text, highlight }: { text: string; highlight: string }) {
  const word = highlight.trim();
  const at = word ? text.indexOf(word) : -1;
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="text-clay">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

export default async function HomePage() {
  const [newArrivals, settings, allCategories] = await Promise.all([
    getLiveProducts({ limit: 4 }),
    getSiteSettings(),
    getCategories(),
  ]);
  const chosen =
    settings.featuredMode === "chosen" && settings.featuredProductId
      ? await getLiveProductById(settings.featuredProductId)
      : null;
  const featured = chosen ?? newArrivals[0];
  const homeCategories = allCategories.filter((c) => c.showOnHome);
  const heroImage = (path: string | null) => (path ? siteImageUrl(path) : undefined);

  // Tells Google who runs the site, for the business panel in search results.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    description: site.description,
    email: site.email,
    areaServed: ["GB", "Worldwide"],
    sameAs: [site.instagramLink].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 pb-16 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-[72px] lg:px-20 lg:pb-24 lg:pt-[72px]">
        <div className="flex flex-col gap-5 lg:w-[600px] lg:shrink-0 lg:gap-7">
          <h1
            className="animate-fade-up font-display text-[44px] font-normal leading-[1.05] tracking-[-0.01em] sm:text-6xl lg:text-[76px]"
            style={delay(0)}
          >
            <Headline text={settings.heroHeadline} highlight={settings.heroHighlight} />
          </h1>
          <p className="animate-fade-up max-w-[520px] text-base leading-relaxed text-muted sm:text-[19px]" style={delay(120)}>
            {settings.heroIntro}
          </p>
          <div className="animate-fade-up flex flex-col gap-3 sm:flex-row sm:gap-3.5" style={delay(220)}>
            <Link
              href="/shop"
              className="group flex h-[54px] items-center justify-center gap-2.5 rounded-full bg-clay px-7 text-base font-semibold text-white transition-[background-color,transform] hover:bg-clay-dark active:scale-[0.98]"
            >
              Shop the collection
              <ArrowRightIcon size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sourcing"
              className="flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-ink px-[26px] text-base font-semibold text-ink transition-[background-color,color,transform] hover:bg-ink hover:text-cream active:scale-[0.98]"
            >
              Source something custom
            </Link>
          </div>
          <div className="animate-fade-up hidden flex-wrap gap-7 border-t border-line pt-5 text-sm text-muted sm:flex" style={delay(320)}>
            <span className="flex items-center gap-2"><CheckIcon size={18} className="text-jade" />Checked before listing</span>
            <span className="flex items-center gap-2"><TruckIcon size={18} className="text-jade" />Royal Mail delivery</span>
            <span className="flex items-center gap-2"><ShieldIcon size={18} className="text-jade" />Secure PayPal checkout</span>
          </div>
        </div>

        <div className="relative grid h-[340px] flex-1 grid-cols-2 grid-rows-2 gap-3 sm:h-[480px] sm:gap-4 lg:h-[600px]">
          <div className="animate-fade-up row-span-2" style={delay(150)}>
            <ProductImage src={heroImage(settings.heroImageMain)} alt="" tint="#e6d3bf" eager className="h-full rounded-3xl" />
          </div>
          <div className="animate-fade-up" style={delay(260)}>
            <ProductImage src={heroImage(settings.heroImageTop)} alt="" tint="#e9cfc6" eager className="h-full rounded-3xl" />
          </div>
          <div className="animate-fade-up" style={delay(360)}>
            <ProductImage src={heroImage(settings.heroImageBottom)} alt="" tint="#d8dfd0" eager className="h-full rounded-3xl" />
          </div>
          {featured && (
            <Link
              href={`/product/${featured.slug}`}
              style={delay(650)}
              className="animate-pop-in absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-paper p-3 text-ink shadow-[0_18px_40px_rgba(60,30,10,0.16)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:left-6 sm:right-auto sm:w-[300px] sm:gap-3.5 sm:rounded-[18px] sm:p-3.5 xl:bottom-10 xl:left-[-44px]"
            >
              <ProductImage
                src={featured.images[0]}
                alt=""
                tint={featured.tint}
                className="h-14 w-14 shrink-0 rounded-xl sm:h-16 sm:w-16"
              />
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-clay">New in</span>
                <span className="text-[15px] font-semibold">{featured.name}</span>
                <span className="text-sm text-muted">{gbp(featured.price)}</span>
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* Categories */}
      {homeCategories.length > 0 && (
        <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-16 sm:gap-8 sm:px-10 lg:gap-9 lg:px-20 lg:pb-24 lg:pt-8">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl tracking-[-0.015em] sm:text-[46px]">Shop by category</h2>
            <Link
              href="/shop"
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-clay hover:text-clay-dark sm:text-[15px]"
            >
              View all <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 after:w-2 after:shrink-0 after:content-[''] sm:mx-0 sm:grid sm:grid-cols-3 sm:scroll-px-0 sm:gap-4 sm:overflow-visible sm:px-0 sm:after:hidden lg:grid-cols-5 lg:gap-5">
              {homeCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  className="group relative h-[190px] w-[160px] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-[260px] sm:w-auto sm:rounded-[20px] lg:h-[330px]"
                >
                  <ProductImage
                    src={c.image ? siteImageUrl(c.image) : undefined}
                    alt=""
                    tint={c.tint}
                    className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-2.5 bottom-2.5 flex h-10 items-center justify-between rounded-xl bg-paper px-3 text-sm font-semibold text-ink sm:inset-x-3.5 sm:bottom-3.5 sm:h-12 sm:rounded-[14px] sm:px-4 sm:text-[15px]">
                    {c.name}
                    <ArrowRightIcon size={15} className="shrink-0 text-clay transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>
      )}

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pb-20 sm:gap-8 sm:px-10 lg:gap-9 lg:px-20 lg:pb-28">
          <Reveal className="flex items-end justify-between gap-6">
            <div className="flex flex-col gap-1.5 sm:gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay sm:text-[13px]">Just landed</span>
              <h2 className="font-display text-2xl tracking-[-0.015em] sm:text-[46px]">New arrivals</h2>
            </div>
            <Link
              href="/shop"
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-clay hover:text-clay-dark sm:text-[15px]"
            >
              View all <ArrowRightIcon size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4 lg:gap-6">
            {newArrivals.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90}>
                <ProductCard product={p} imageClass="h-[190px] sm:h-[300px] lg:h-[380px]" />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Sourcing */}
      <section className="bg-brown text-cream">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-5 py-20 sm:px-10 lg:flex-row lg:gap-24 lg:px-20 lg:py-[104px]">
          <Reveal className="flex flex-col gap-6 lg:w-[560px] lg:shrink-0">
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">Sourcing services</span>
            <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.015em] sm:text-[52px] sm:leading-[1.08]">
              {settings.sourcingHeading}
            </h2>
            <p className="text-base leading-relaxed text-[#e8d9c6] sm:text-lg">
              Import with Goody started as a sourcing service for UK clients, and it still is. Send her a list of
              anything you want from China and she handles the suppliers, quality checks and shipping, for a service
              charge of 10% of the product cost.
            </p>
            <div className="flex items-center gap-4 sm:gap-5">
              <Link
                href="/sourcing/request"
                className="flex h-12 shrink-0 items-center rounded-full bg-cream px-5 text-[15px] font-semibold text-brown transition-transform active:scale-[0.98] sm:h-[52px] sm:px-[26px] sm:text-base"
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
          </Reveal>
          <ol className="flex flex-1 flex-col">
            {steps.map(([title, body], i) => (
              <li key={title} className="border-t border-cream/20 last:border-b">
                <Reveal delay={i * 120} className="flex gap-7 py-7">
                  <span className="w-[60px] shrink-0 font-display text-[34px] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-col gap-2">
                    <span className="text-[22px] font-semibold">{title}</span>
                    <span className="text-base leading-relaxed text-[#e8d9c6]">{body}</span>
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-20 lg:py-28">
        <Reveal className="flex flex-col justify-between gap-8 rounded-[28px] border border-line bg-paper p-8 sm:p-12 lg:flex-row lg:items-center lg:p-16">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-3xl sm:text-4xl">Be first to see new arrivals</h2>
            <p className="text-base text-muted">One short email when new stock lands. No spam.</p>
          </div>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}