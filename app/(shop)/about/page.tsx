import Link from "next/link";
import PhotoPlaceholder from "@/components/PhotoPlaceholder";
import { CheckboxIcon, PinIcon, RouteIcon, SearchIcon } from "@/components/Icons";

export const metadata = {
  title: "About Goody | Import with Goody",
  description: "The person behind Import with Goody, a UK sourcing studio and shop for goods from China.",
};

const ways = [
  { icon: SearchIcon, title: "Straight to the source", body: "I work directly with suppliers and factories in China, not through a chain of middlemen." },
  { icon: CheckboxIcon, title: "Checked, not assumed", body: "Quantity and quality are verified before anything is shipped or listed." },
  { icon: RouteIcon, title: "The right route", body: "Every order goes by the best shipping route and method for the type of product." },
  { icon: PinIcon, title: "Followed to your door", body: "Items are tracked all the way, so nothing gets lost along the way." },
];

// TODO: replace the bracketed story with Goody's own words and a real photo.
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      <section className="flex flex-col gap-10 pb-20 pt-10 lg:flex-row lg:items-center lg:gap-20 lg:pb-28 lg:pt-16">
        <div className="flex flex-1 flex-col gap-6">
          <h1 className="font-display text-[40px] leading-[1.06] tracking-[-0.015em] sm:text-6xl">
            Hi, I&apos;m Goody.
          </h1>
          <p className="max-w-[600px] text-lg leading-relaxed text-muted sm:text-xl">
            Import with Goody started as a sourcing service for UK clients: people who wanted good products from
            China without the guesswork. The shop grew out of that, so you can buy the pieces I love without
            placing a big order.
          </p>
          <p className="max-w-[600px] text-base leading-relaxed text-muted sm:text-lg">
            [Goody&apos;s story in her own words: how she started, what she loves sourcing, and who she does it
            for.]
          </p>
        </div>
        <PhotoPlaceholder tint="#e6d3bf" label="Photo of Goody" className="h-[380px] rounded-[28px] sm:h-[520px] lg:w-[520px] lg:shrink-0" />
      </section>

      <section className="flex flex-col gap-9 pb-20 lg:pb-28">
        <h2 className="font-display text-3xl tracking-[-0.015em] sm:text-[44px]">How I work</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ways.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3.5 border-t-2 border-ink pt-5">
              <Icon size={26} className="text-clay" />
              <span className="text-[19px] font-bold">{title}</span>
              <span className="text-[15px] leading-relaxed text-muted">{body}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-[28px] border border-line bg-paper p-8 sm:p-10">
            <h2 className="font-display text-3xl">Shop the collection</h2>
            <p className="text-base leading-relaxed text-muted">
              Homeware, fashion, baby essentials and gifts, ready to post from the UK.
            </p>
            <Link href="/shop" className="mt-2 flex h-[52px] items-center self-start rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">
              Browse the shop
            </Link>
          </div>
          <div className="flex flex-col gap-4 rounded-[28px] bg-brown p-8 text-cream sm:p-10">
            <h2 className="font-display text-3xl">Need something specific?</h2>
            <p className="text-base leading-relaxed text-[#e8d9c6]">
              Send me your list and I&apos;ll find it, check it and ship it to you.
            </p>
            <Link href="/sourcing" className="mt-2 flex h-[52px] items-center self-start rounded-full bg-cream px-[26px] font-semibold text-brown">
              See how sourcing works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}