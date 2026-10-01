import Link from "next/link";
import { ExternalIcon, PenIcon, SparkleIcon, TruckIcon } from "@/components/Icons";

const items = [
  { href: "/admin/content", label: "Site content", body: "Homepage text, images and featured products", icon: PenIcon },
  { href: "/admin/assistant", label: "AI assistant", body: "What shoppers ask and the answers it uses", icon: SparkleIcon },
  { href: "/admin/delivery", label: "Delivery rates", body: "Royal Mail rates for UK and international", icon: TruckIcon },
];

export default function AdminMore() {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-5 px-4 py-6 sm:px-8 lg:py-9">
      <h1 className="font-display text-[30px] leading-tight sm:text-[40px]">More</h1>
      <ul className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-paper">
        {items.map(({ href, label, body, icon: Icon }) => (
          <li key={href} className="border-b border-[#ece3d5] last:border-b-0">
            <Link href={href} className="flex items-center gap-4 p-4 text-ink hover:bg-sand/60">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0e6d8] text-clay">
                <Icon size={20} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-base font-semibold">{label}</span>
                <span className="text-sm text-subtle">{body}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-line-strong bg-paper text-[15px] font-semibold text-ink"
      >
        View live shop <ExternalIcon size={16} />
      </Link>
    </main>
  );
}