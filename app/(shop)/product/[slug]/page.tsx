import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuyBox from "@/components/shop/ProductBuyBox";
import ProductCard from "@/components/shop/ProductCard";
import ProductGallery from "@/components/shop/ProductGallery";
import { GlobeIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import { categoryName, gbp, getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} | Import with Goody` : "Product | Import with Goody" };
}

const assurances = [
  { icon: TruckIcon, title: "UK delivery with Royal Mail", body: "Rates are shown at checkout based on your address." },
  { icon: GlobeIcon, title: "International delivery available", body: "We ship worldwide from the UK." },
  { icon: ShieldIcon, title: "Secure checkout", body: "Pay with PayPal, or a debit or credit card through PayPal." },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

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
          <ProductGallery tint={product.tint} />

          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-clay">
                {categoryName(product.category)}
              </span>
              <h1 className="font-display text-[34px] font-medium leading-[1.08] tracking-[-0.015em] sm:text-[46px]">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-[28px] font-semibold">{gbp(product.price)}</span>
                <span className="flex h-7 items-center gap-1.5 rounded-full bg-jade-soft px-3 text-[13px] font-semibold text-jade">
                  <span className="h-[7px] w-[7px] rounded-full bg-jade" />
                  In stock
                </span>
              </div>
            </div>
            <p className="text-[17px] leading-relaxed text-muted">
              {product.description ?? "Product description added by Goody from the admin."}
            </p>

            <ProductBuyBox price={product.price} colours={product.colours} />

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
              <details open className="border-b border-line py-[18px]">
                <summary className="cursor-pointer text-base font-semibold">Details and dimensions</summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  [Details and dimensions from the admin]
                </p>
              </details>
              <details className="border-b border-line py-[18px]">
                <summary className="cursor-pointer text-base font-semibold">Materials and care</summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">[Materials and care from the admin]</p>
              </details>
              <details className="border-b border-line py-[18px]">
                <summary className="cursor-pointer text-base font-semibold">Delivery and returns</summary>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">[Goody&apos;s delivery and returns policy]</p>
              </details>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8 pb-24">
        <h2 className="font-display text-3xl font-medium tracking-[-0.015em] sm:text-[40px]">You may also like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} imageClass="h-[220px] sm:h-[300px]" />
          ))}
        </div>
      </section>
    </div>
  );
}
