import Link from "next/link";
import { CalendarIcon, PlusIcon, SparkleIcon } from "@/components/Icons";
import { gbp, orders, products, statusTone } from "@/lib/data";

// Render on every visit so the greeting and date are always current.
export const dynamic = "force-dynamic";

// Goody works in the UK, so greet her by UK time.
function ukNow() {
  const now = new Date();
  const tz = "Europe/London";
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: tz }).format(now)
  );
  return {
    greeting: hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening",
    weekday: new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: tz }).format(now),
    date: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: tz }).format(now),
  };
}

const actionFor: Record<string, string> = {
  "To pack": "Mark packed",
  Packed: "Add tracking",
  Shipped: "View",
  Delivered: "View",
};

const low = [
  { slug: "hand-painted-fan-set", name: "Hand-painted fan set", left: "2 left", tint: "#efdcb5" },
  { slug: "pleated-linen-midi-skirt", name: "Pleated linen midi skirt", left: "Size 14 sold out", tint: "#e9cfc6" },
  { slug: "silk-hair-scarf", name: "Silk hair scarf", left: "1 left", tint: "#e4c9c2" },
];

const asked = [
  "Do you deliver to Ireland?",
  "Is the stoneware dishwasher safe?",
  "When is the linen skirt back in size 14?",
];

export default function AdminOverview() {
  const { greeting, weekday, date } = ukNow();
  const toPack = orders.filter((o) => o.status === "To pack").length;

  const stats = [
    { label: "Sales this month", value: "£1,284.50", note: "31 orders", noteClass: "font-semibold text-jade" },
    { label: "Products live", value: String(products.length), note: "4 drafts waiting", noteClass: "text-subtle" },
    { label: "Low stock", value: "5", note: "Under 3 left", noteClass: "text-subtle", valueClass: "text-clay" },
  ];

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:gap-7 sm:px-8 lg:px-12 lg:py-9">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[30px] leading-tight tracking-[-0.015em] sm:text-[40px]">
            {greeting}, Goody
          </h1>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-paper py-1.5 pl-2.5 pr-3.5 text-sm">
            <CalendarIcon size={16} className="text-clay" />
            <span className="font-semibold text-ink">{weekday}</span>
            <span className="text-subtle">{date}</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:flex">
          <Link
            href="/admin/content"
            className="flex h-12 items-center justify-center rounded-full border-[1.5px] border-line-strong bg-paper px-4 text-sm font-semibold text-ink sm:h-[46px] sm:px-[18px] sm:text-[15px]"
          >
            Edit homepage
          </Link>
          <Link
            href="/admin/products/new"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-clay px-4 text-sm font-semibold text-white sm:h-[46px] sm:px-5 sm:text-[15px]"
          >
            <PlusIcon size={18} />
            Add product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <div className="flex flex-col gap-1.5 rounded-2xl bg-ink p-4 text-cream sm:gap-2.5 sm:rounded-[20px] sm:p-[22px]">
          <span className="text-[13px] text-[#d9cfc0] sm:text-sm">Orders to pack</span>
          <span className="font-display text-[26px] leading-tight sm:text-[42px]">{toPack}</span>
          <Link href="/admin/orders" className="text-[13px] font-semibold text-[#e8b89f] sm:text-sm">Open packing list</Link>
        </div>
        {stats.map((s) => (
          <div key={s.label} className="flex min-w-0 flex-col gap-1.5 rounded-2xl border border-line bg-paper p-4 sm:gap-2.5 sm:rounded-[20px] sm:p-[22px]">
            <span className="text-[13px] text-subtle sm:text-sm">{s.label}</span>
            <span className={`truncate font-display text-[26px] leading-tight sm:text-[42px] ${s.valueClass ?? ""}`}>{s.value}</span>
            <span className={`text-[13px] sm:text-sm ${s.noteClass}`}>{s.note}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <section className="flex min-w-0 flex-1 flex-col gap-2 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold sm:text-[19px]">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold">All orders</Link>
          </div>

          {/* Phones: compact list */}
          <ul className="flex flex-col sm:hidden">
            {orders.map((o) => (
                            <li key={o.id} className="border-t border-[#ece3d5]">
                <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-3 py-3 text-ink">
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{o.customer}</span>
                    <span className="truncate text-[13px] text-subtle">#{o.id} | {o.destination}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="text-[15px] font-semibold">{gbp(o.total)}</span>
                    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${statusTone[o.status]}`}>{o.status}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tablet and up: full table */}
          <div className="hidden overflow-x-auto sm:block">
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
<td className="font-semibold">
  <Link href={`/admin/orders/${o.id}`} className="text-ink hover:text-clay">#{o.id}</Link>
</td>
                    <td>{o.customer}</td>
                    <td className="text-muted">{o.destination}</td>
                    <td>{gbp(o.total)}</td>
                    <td>
                      <span className={`inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold ${statusTone[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="text-right">
                      <Link
  href={`/admin/orders/${o.id}`}
  className="inline-flex h-10 items-center rounded-full border-[1.5px] border-line-strong bg-white px-3.5 text-sm font-semibold text-ink"
>
  {actionFor[o.status]}
</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-5 xl:w-[360px] xl:shrink-0">
          <section className="flex flex-col gap-3.5 rounded-[20px] border border-line bg-paper p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold sm:text-[19px]">Running low</h2>
              <Link href="/admin/products" className="text-sm font-semibold">All products</Link>
            </div>
            {low.map((l) => (
              <div key={l.name} className="flex items-center gap-3">
                <span className="h-11 w-11 shrink-0 rounded-[10px]" style={{ background: l.tint }} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-semibold">{l.name}</span>
                  <span className="text-[13px] font-semibold text-clay">{l.left}</span>
                </span>
               <Link
  href={`/admin/products/${l.slug}`}
  className="flex h-9 shrink-0 items-center rounded-full bg-[#f0e6d8] px-3 text-[13px] font-semibold text-ink"
>
  Update
</Link>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-3.5 rounded-[20px] bg-brown p-4 text-cream sm:p-6">
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