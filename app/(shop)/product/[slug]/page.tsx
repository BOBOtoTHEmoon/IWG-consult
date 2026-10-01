import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuyBox from "@/components/shop/ProductBuyBox";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import { GlobeIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { categoryName, gbp } from "@/lib/data";
import { LOW_STOCK } from "@/lib/product-types";
import { getLiveProduct, getLiveProducts } from "@/lib/products";

// Refresh the cached page at least every minute. Admin saves also refresh it straight away.
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getLiveProduct(slug);
  return {
    title: p ? `${p.name} | Import with Goody` : "Product | Import with Goody",
    description: p?.description.slice(0, 160),
    openGraph: p?.images[0] ? { images: [p.images[0]] } : undefined,
  };
}

const assurances = [
  { icon: TruckIcon, title: "UK delivery with Royal Mail", body: "Rates are shown at checkout based on your address." },
  { icon: GlobeIcon, title: "International delivery available", body: "We ship worldwide from the UK." },
  { icon: ShieldIcon, title: "Secure checkout", body: "Pay with PayPal, or a debit or credit card through PayPal." },
];

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="flex h-7 items-center rounded-full bg-[#f6ddd0] px-3 text-[13px] font-semibold text-clay-dark">Sold out</span>;
  if (stock <= LOW_STOCK)
    return <span className="flex h-7 items-center rounded-full bg-[#f1e6c8] px-3 text-[13px] font-semibold text-[#6e5316]">Only {stock} left</span>;
  return (
    <span className="flex h-7 items-center gap-1.5 rounded-full bg-jade-soft px-3 text-[13px] font-semibold text-jade">
      <span className="h-[7px] w-[7px] rounded-full bg-jade" />
      In stock
    </span>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getLiveProduct(slug);
  if (!product) notFound();

  // Same category first, then anything else, up to four.
  const others = (await getLiveProducts({ limit: 12 })).filter((p) => p.slug !== product.slug);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 4);

  return (
    <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-20">
      <section className="flex flex-col gap-7 pb-20 pt-6 lg:pb-24 lg:pt-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-subtle">
          <Link href="/" className="text-subtle">Home</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="text-subtle">{categoryName(product.category)}</Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[72px]">
          <ProductGallery images={product.images} tint={product.tint} name={product.name} />

          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">
                {categoryName(product.category)}
              </span>
              <h1 className="font-display text-[34px] leading-[1.08] tracking-[-0.015em] sm:text-[46px]">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-[28px] font-semibold">{gbp(product.price)}</span>
                <StockLabel stock={product.stock} />
              </div>
            </div>
            {product.description && (
              <p className="whitespace-pre-line text-[17px] leading-relaxed text-muted">{product.description}</p>
            )}

            <ProductBuyBox price={product.price} colours={product.colours} stock={product.stock} />

            <div className="flex flex-col rounded-[18px] border border-line bg-paper px-5 py-2">
              {assurances.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3.5 border-b border-[#ece3d5] py-3.5 last:border-b-0">
                  <Icon size={22} className="shrink-0 text-jade" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{title}</span>
                    <span className="text-sm text-muted">{body}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col border-t border-line">
              <details className="border-b border-line py-[18px]">
                <summary className="cursor-pointer text-base font-semibold">Delivery and returns</summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  Posted from the UK with Royal Mail. See our <Link href="/delivery" className="text-clay underline">delivery</Link> and{" "}
                  <Link href="/returns" className="text-clay underline">returns</Link> pages for times, rates and how to send something back.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="flex flex-col gap-8 pb-24">
          <h2 className="font-display text-3xl tracking-[-0.015em] sm:text-[40px]">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-4 lg:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} imageClass="h-[190px] sm:h-[300px]" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}