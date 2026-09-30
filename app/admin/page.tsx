import Link from "next/link";
import { PlusIcon, SparkleIcon } from "@/components/Icons";
import { gbp, orders, products, statusTone } from "@/lib/data";

const actionFor: Record<string, string> = {
  "To pack": "Mark packed",
  Packed: "Add tracking",
  Shipped: "View",
  Delivered: "View",
};

const low = [
  { name: "Hand-painted fan set", left: "2 left", tint: "#efdcb5" },
  { name: "Pleated linen midi skirt", left: "Size 14 sold out", tint: "#e9cfc6" },
  { name: "Silk hair scarf", left: "1 left", tint: "#e4c9c2" },
];

const asked = [
  "Do you deliver to Ireland?",
  "Is the stoneware dishwasher safe?",
  "When is the linen skirt back in size 14?",
];

export default function AdminOverview() {
  const toPack = orders.filter((o) => o.status === "To pack").length;
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  const stats = [
    { label: "Sales this month", value: "£1,284.50", note: "31 orders", noteClass: "text-jade font-semibold" },
    { label: "Products live", value: String(products.length), note: "4 drafts waiting", noteClass: "text-subtle" },
    { label: "Low stock", value: "5", note: "Under 3 left", noteClass: "text-subtle", valueClass: "text-clay" },
  ];

  return (
    <main className="flex flex-col gap-7 px-4 py-6 sm:px-8 lg:px-12 lg:py-9">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-subtle">{today}</span>
          <h1 className="font-display text-[32px] font-medium tracking-[-0.015em] sm:text-[40px]">Good morning, Goody</h1>
        </div>
        <div className="flex gap-2.5">
          <Link href="/admin/content" className="flex h-[46px] items-center rounded-full border-[1.5px] border-line-strong bg-paper px-[18px] text-[15px] font-semibold text-ink">
            Edit homepage
          </Link>
          <Link href="/admin/products/new" className="flex h-[46px] items-center gap-2 rounded-full bg-clay px-5 text-[15px] font-semibold text-white">
            <PlusIcon size={18} />
            Add product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="flex flex-col gap-2.5 rounded-[20px] bg-ink p-[22px] text-cream">
          <span className="text-sm text-[#d9cfc0]">Orders to pack</span>
          <span className="font-display text-[42px]">{toPack}</span>
          <Link href="/admin/orders" className="text-sm font-semibold text-[#e8b89f]">Open packing list</Link>
        </div>
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-paper p-[22px]">
            <span className="text-sm text-subtle">{s.label}</span>
            <span className={`font-display text-[32px] sm:text-[42px] ${s.valueClass ?? ""}`}>{s.value}</span>
            <span className={`text-sm ${s.noteClass}`}>{s.note}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section className="flex flex-1 flex-col gap-2 overflow-x-auto rounded-[20px] border border-line bg-paper p-6">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-[19px] font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold">All orders</Link>
          </div>
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-[#ece3d5] text-[13px] text-subtle">
                <th className="py-2.5 font-semibold">Order</th>
                <th className="font-semibold">Customer</th>
                <th className="font-semibold">Ships to</th>
                <th className="font-semibold">Total</th>
                <th className="font-semibold">Status</th>
                <th><span className="sr-only">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="h-[58px] border-b border-[#ece3d5]">
                  <td className="font-semibold">#{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="text-muted">{o.destination}</td>
                  <td>{gbp(o.total)}</td>
                  <td>
                    <span className={`inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold ${statusTone[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="text-right">
                    <button className="h-10 rounded-full border-[1.5px] border-line-strong bg-white px-3.5 text-sm font-semibold">{actionFor[o.status]}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="flex flex-col gap-5 xl:w-[360px] xl:shrink-0">
          <section className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-paper p-6">
            <h2 className="text-[19px] font-bold">Running low</h2>
            {low.map((l) => (
              <div key={l.name} className="flex items-center gap-3">
                <span className="h-11 w-11 shrink-0 rounded-[10px]" style={{ background: l.tint }} />
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[15px] font-semibold">{l.name}</span>
                  <span className="text-[13px] font-semibold text-clay">{l.left}</span>
                </span>
                <button className="h-9 rounded-full bg-[#f0e6d8] px-3 text-[13px] font-semibold">Update</button>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-3.5 rounded-[20px] bg-brown p-6 text-cream">
            <div className="flex items-center gap-2.5">
              <SparkleIcon className="text-gold" />
              <h2 className="text-[17px] font-bold">What shoppers asked this week</h2>
            </div>
            {asked.map((q) => (
              <span key={q} className="rounded-xl bg-cream/10 px-3.5 py-3 text-[15px]">{q}</span>
            ))}
            <Link href="/admin/assistant" className="text-sm font-semibold text-[#e8c98f]">Teach the assistant an answer</Link>
          </section>
        </div>
      </div>
    </main>
  );
}
