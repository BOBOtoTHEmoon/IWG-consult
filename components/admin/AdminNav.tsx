"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BagIcon, BoxIcon, ExternalIcon, GridIcon, ListIcon, PenIcon, PlusIcon, SparkleIcon, TruckIcon } from "../Icons";

const links = [
  { href: "/admin", label: "Overview", icon: GridIcon },
  { href: "/admin/orders", label: "Orders", icon: BagIcon, badge: 3 },
  { href: "/admin/sourcing", label: "Sourcing requests", icon: ListIcon },
  { href: "/admin/products/new", label: "Products", icon: BoxIcon },
  { href: "/admin/content", label: "Site content", icon: PenIcon },
  { href: "/admin/assistant", label: "AI assistant", icon: SparkleIcon },
  { href: "/admin/delivery", label: "Delivery rates", icon: TruckIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-7 bg-ink px-[18px] py-7 text-[#d9cfc0] lg:flex">
      <div className="flex items-center gap-2.5 px-2.5">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-clay font-display text-lg font-semibold text-cream">G</span>
        <span className="flex flex-col">
          <span className="font-display text-[17px] text-cream">Import with Goody</span>
          <span className="text-xs text-[#a89d8e]">Shop admin</span>
        </span>
      </div>
      <nav aria-label="Admin" className="flex flex-col gap-1 text-[15px]">
        {links.map(({ href, label, icon: Icon, badge }) => {
          const on = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 ${on ? "bg-ink-soft font-semibold text-cream" : "text-[#d9cfc0] hover:bg-ink-soft"}`}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {badge ? (
                <span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-clay px-1.5 text-xs font-bold text-white">{badge}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="mt-auto flex h-11 items-center gap-2.5 rounded-xl border border-[#3a342c] px-3 text-sm text-[#d9cfc0]">
        View live shop <ExternalIcon size={16} />
      </Link>
    </aside>
  );
}

export function AdminTabBar() {
  const pathname = usePathname();
  const item = (href: string, label: string, Icon: typeof GridIcon) => {
    const on = pathname === href;
    return (
      <Link
        href={href}
        aria-current={on ? "page" : undefined}
        className={`flex h-14 w-16 flex-col items-center justify-center gap-1 text-[11px] ${on ? "font-bold text-cream" : "text-[#a89d8e]"}`}
      >
        <Icon size={20} />
        {label}
      </Link>
    );
  };
  return (
    <nav aria-label="Admin" className="fixed inset-x-0 bottom-0 z-30 flex h-[76px] items-center justify-around bg-ink px-2 pb-3 lg:hidden">
      {item("/admin", "Home", GridIcon)}
      {item("/admin/orders", "Orders", BagIcon)}
      <Link href="/admin/products/new" aria-label="Add product" className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-clay text-white">
        <PlusIcon size={22} />
      </Link>
      {item("/admin/sourcing", "Sourcing", ListIcon)}
      {item("/admin/content", "Content", PenIcon)}
    </nav>
  );
}
