import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { CheckIcon } from "@/components/Icons";
import { gbp } from "@/lib/data";
import { getOrderAdmin } from "@/lib/orders";

export const dynamic = "force-dynamic";
export const metadata = { title: "Thank you for your order | Import with Goody", robots: { index: false } };

// The customer's private thank-you page after paying.
export default async function OrderThankYou({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const order = await getOrderAdmin({ publicRef: ref });
  if (!order) notFound();
  const firstName = order.customerName.split(/\s+/)[0];

  return (
    <div className="mx-auto flex max-w-[760px] flex-col gap-6 px-5 pb-24 pt-10 sm:px-10 lg:pt-16">
      <section className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-paper p-6 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-jade text-white">
          <CheckIcon size={24} strokeWidth={2.5} />
        </span>
        <span className="text-sm font-semibold text-subtle">Order #{order.number}</span>
        <h1 className="font-display text-[34px] leading-tight sm:text-5xl">Thank you, {firstName}!</h1>
        <p className="text-[17px] leading-relaxed text-muted">
          Your payment went through and your order is being prepared. We&apos;ve emailed a confirmation to{" "}
          <strong className="text-ink">{order.email}</strong>, and we&apos;ll email you again when it&apos;s on its way.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold">Your order</h2>
        <ul className="flex flex-col gap-3.5">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3.5">
              <ProductImage src={i.imageUrl ?? undefined} alt="" tint="#efe5d4" className="h-16 w-14 shrink-0 rounded-xl" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="font-semibold">{i.name}</span>
                <span className="text-[13px] text-subtle">
                  {i.variant ? `${i.variant} | ` : ""}Qty {i.quantity}
                </span>
              </span>
              <span className="font-semibold">{gbp(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-[#ece3d5] pt-3 text-[15px]">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{gbp(order.subtotal)}</span></div>
          <div className="flex justify-between">
            <span className="text-muted">{order.shippingMethod}</span>
            <span>{order.shippingPrice === 0 ? "Free" : gbp(order.shippingPrice)}</span>
          </div>
          <div className="flex justify-between border-t border-[#ece3d5] pt-2 font-bold"><span>Total paid</span><span>{gbp(order.total)}</span></div>
        </div>
        <div className="flex flex-col gap-1 border-t border-[#ece3d5] pt-3">
          <span className="text-sm font-semibold text-subtle">Delivering to</span>
          <address className="text-[15px] not-italic leading-relaxed">
            {order.addressLines.map((l, i) => (
              <span key={i} className="block">{l}</span>
            ))}
          </address>
        </div>
      </section>

      <Link href="/shop" className="flex h-[52px] items-center justify-center self-start rounded-full bg-clay px-7 font-semibold text-white hover:bg-clay-dark">
        Keep shopping
      </Link>
    </div>
  );
}