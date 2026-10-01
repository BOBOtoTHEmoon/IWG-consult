import Link from "next/link";
import Footer from "@/components/shop/Footer";
import Header from "@/components/shop/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 py-24 sm:px-10 lg:px-20 lg:py-32">
        <h1 className="font-display text-[40px] leading-[1.08] sm:text-6xl">We can&apos;t find that page</h1>
        <p className="max-w-[520px] text-lg leading-relaxed text-muted">
          It may have moved, or the link might be wrong. Try the shop, or tell Goody what you&apos;re looking for.
        </p>
        <div className="flex flex-wrap gap-3.5">
          <Link href="/shop" className="flex h-[52px] items-center rounded-full bg-clay px-[26px] font-semibold text-white hover:bg-clay-dark">
            Go to the shop
          </Link>
          <Link href="/sourcing" className="flex h-[52px] items-center rounded-full border-[1.5px] border-ink px-[26px] font-semibold text-ink">
            Request something custom
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}