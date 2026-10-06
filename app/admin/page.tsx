import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { CalendarIcon, PlusIcon, SparkleIcon } from "@/components/Icons";
import { getStaff } from "@/lib/auth";
import { gbp } from "@/lib/data";
import { STATUS_LABEL, STATUS_TONE, destination, shortName, type OrderStatus } from "@/lib/order-types";
import { getMonthSales, getOrders } from "@/lib/orders";
import { LOW_STOCK } from "@/lib/product-types";
import { getAllProducts } from "@/lib/products";
import { getAskedQuestions } from "@/lib/assistant-questions";
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

const actionFor: Record<OrderStatus, string> = {
  to_pack: "Mark packed",
  packed: "Add tracking",
  shipped: "View",
  delivered: "View",
  cancelled: "View",
};

export default async function AdminOverview() {
  const { greeting, weekday, date } = ukNow();
  const staff = await getStaff();
  const name = staff?.firstName ?? "there";
  const products = await getAllProducts();
  const liveProducts = products.filter((p) => p.status === "live");
  const drafts = products.length - liveProducts.length;
  const low = liveProducts.filter((p) => p.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock);
   const [allOrders, month, asked] = await Promise.all([getOrders(50), getMonthSales(), getAskedQuestions(7, 3)]);
  const orders = allOrders.slice(0, 5);
  const toPack = allOrders.filter((o) => o.status === "to_pack").length;

  const stats = [
    {
      label: "Sales this month",
      value: gbp(month.total),
      note: month.count === 0 ? "No orders yet" : `${month.count} ${month.count === 1 ? "order" : "orders"}`,
      noteClass: month.count > 0 ? "font-semibold text-jade" : "text-subtle",
    },
    {
      label: "Products live",
      value: String(liveProducts.length),
      note: drafts > 0 ? `${drafts} ${drafts === 1 ? "draft" : "drafts"} waiting` : "No drafts",
      noteClass: "text-subtle",
    },
    {
      label: "Low stock",
      value: String(low.length),
      note: `${LOW_STOCK} or fewer left`,
      noteClass: "text-subtle",
      valueClass: low.length > 0 ? "text-clay" : "",
    },
  ];

  return (
    <main className="flex flex-col gap-6 px-4 py-6 sm:gap-7 sm:px-8 lg:px-12 lg:py-9">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-[30px] leading-tight tracking-[-0.015em] sm:text-[40px]">
            {greeting}, {name}
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

          {orders.length === 0 && (
            <p className="border-t border-[#ece3d5] pt-4 text-sm text-muted">
              No orders yet. They&apos;ll appear here as soon as someone checks out.
            </p>
          )}

          {/* Phones: compact list */}
          <ul className={`flex flex-col sm:hidden ${orders.length === 0 ? "hidden" : ""}`}>
            {orders.map((o) => (
              <li key={o.id} className="border-t border-[#ece3d5]">
                <Link href={`/admin/orders/${o.number}`} className="flex items-center gap-3 py-3 text-ink">
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[15px] font-semibold">{shortName(o.customerName)}</span>
                    <span className="truncate text-[13px] text-subtle">#{o.number} | {destination(o)}</span>
                  </span>
                  <span className="flex flex-col items-end gap-1">
                    <span className="text-[15px] font-semibold">{gbp(o.total)}</span>
                    <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold ${STATUS_TONE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Tablet and up: full table */}
          <div className={`hidden overflow-x-auto ${orders.length > 0 ? "sm:block" : ""}`}>
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
                      <Link href={`/admin/orders/${o.number}`} className="text-ink hover:text-clay">#{o.number}</Link>
                    </td>
                    <td>{shortName(o.customerName)}</td>
                    <td className="text-muted">{destination(o)}</td>
                    <td>{gbp(o.total)}</td>
                    <td>
                      <span className={`inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold ${STATUS_TONE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/admin/orders/${o.number}`}
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
            {low.length === 0 && <p className="text-sm text-muted">Everything is well stocked.</p>}
            {low.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <ProductImage src={l.images[0]} alt="" tint={l.tint} className="h-11 w-11 shrink-0 rounded-[10px]" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-[15px] font-semibold">{l.name}</span>
                  <span className="text-[13px] font-semibold text-clay">{l.stock === 0 ? "Sold out" : `${l.stock} left`}</span>
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
                        {asked.length === 0 ? (
              <p className="text-[15px] leading-relaxed text-[#e8d9c6]">No questions this week yet.</p>
            ) : (
              asked.map((q) => (
                <span key={q.question} className="rounded-xl bg-cream/10 px-3.5 py-3 text-[15px]">
                  {q.question}
                  {q.count > 1 && <span className="ml-2 text-[13px] text-[#e8c98f]">{q.count} times</span>}
                </span>
              ))
            )}
            <Link href="/admin/assistant" className="text-sm font-semibold text-[#e8c98f]">See all questions</Link>
          </section>
        </div>
      </div>
    </main>
  );
}