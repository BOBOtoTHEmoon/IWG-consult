import Link from "next/link";

export const metadata = {
  title: "FAQs | Import with Goody",
  description: "Answers about orders, delivery, returns and the sourcing service.",
};

type QA = { q: string; a: React.ReactNode };

const groups: { title: string; items: QA[] }[] = [
  {
    title: "Orders and payment",
    items: [
      { q: "Do I need an account to order?", a: "No. You check out as a guest with your email and delivery address, and pay with PayPal." },
      { q: "How can I pay?", a: "Through PayPal, using your PayPal balance or a debit or credit card. You don't need a PayPal account to pay by card." },
      { q: "Will I get a confirmation?", a: "Yes. You get an email when your order is placed, and another when it's posted." },
    ],
  },
  {
    title: "Delivery",
    items: [
      { q: "Where do you deliver?", a: <>Across the UK and internationally, with Royal Mail. See our <Link href="/delivery">delivery page</Link> for rates and times.</> },
      { q: "Can I track my order?", a: "If you choose a tracked service, your tracking number is in your dispatch email." },
      { q: "Will I pay customs charges?", a: "Orders sent outside the UK may be charged import duties or taxes by the destination country. These are paid by the person receiving the parcel." },
    ],
  },
  {
    title: "Returns",
    items: [
      { q: "Can I return something?", a: <>Yes. You can cancel within 14 days of receiving your order. Everything is explained on our <Link href="/returns">returns page</Link>.</> },
      { q: "What if my item arrives damaged?", a: <><Link href="/contact">Contact us</Link> within 30 days with your order number and a photo, and we'll put it right.</> },
    ],
  },
  {
    title: "Sourcing service",
    items: [
      { q: "How does sourcing work?", a: <>You send a list of what you want and pay a £50 commitment fee. Within 2 to 4 working days, Goody comes back with suppliers and the full product cost. <Link href="/sourcing">See the full process</Link>.</> },
      { q: "When do I get my £50 back?", a: "When you go ahead with the purchase. You pay the product cost plus a 10% service charge, and the £50 is refunded." },
      { q: "What if I don't go ahead?", a: "The £50 isn't refunded, because it covers the sourcing work already done." },
      { q: "How is shipping from China charged?", a: "It's quoted separately with your sourcing quote, based on the best route and method for your items." },
    ],
  },
];

export default function FaqsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-10 sm:px-10 lg:px-20 lg:pt-16">
      <div className="mx-auto max-w-[860px]">
        <h1 className="font-display text-[40px] leading-[1.08] tracking-[-0.015em] sm:text-[56px]">Questions and answers</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Can&apos;t find what you need? <Link href="/contact">Get in touch</Link> or ask the assistant.
        </p>

        <div className="mt-12 flex flex-col gap-14">
          {groups.map((g) => (
            <section key={g.title} className="flex flex-col gap-2">
              <h2 className="font-display text-2xl sm:text-3xl">{g.title}</h2>
              <div className="mt-2 flex flex-col border-t border-line-strong">
                {g.items.map((item) => (
                  <details key={item.q} className="group border-b border-line-strong py-5">
                    <summary className="cursor-pointer text-lg font-semibold">{item.q}</summary>
                    <div className="mt-3 text-base leading-relaxed text-muted [&_a]:text-clay [&_a]:underline">{item.a}</div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}