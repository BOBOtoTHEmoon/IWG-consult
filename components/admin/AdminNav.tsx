"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { orders } from "@/lib/data";
import {
  BagIcon,
  BoxIcon,
  DotsIcon,
  ExternalIcon,
  GridIcon,
  ListIcon,
  PenIcon,
  SparkleIcon,
  TruckIcon,
} from "../Icons";

const toPack = orders.filter((o) => o.status === "To pack").length;

const isActive = (pathname: string, href: string) =>
  href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

const sidebarLinks = [
  { href: "/admin", label: "Overview", icon: GridIcon },
  { href: "/admin/orders", label: "Orders", icon: BagIcon, badge: toPack },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/sourcing", label: "Sourcing requests", icon: ListIcon },
  { href: "/admin/content", label: "Site content", icon: PenIcon },
  { href: "/admin/assistant", label: "AI assistant", icon: SparkleIcon },
  { href: "/admin/delivery", label: "Delivery rates", icon: TruckIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-7 bg-ink px-[18px] py-7 text-[#d9cfc0] lg:flex print:hidden">
      <div className="flex items-center gap-2.5 px-2.5">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-clay font-display text-lg font-semibold text-cream">G</span>
        <span className="flex flex-col">
          <span className="font-display text-[17px] text-cream">Import with Goody</span>
          <span className="text-xs text-[#a89d8e]">Shop admin</span>
        </span>
      </div>
      <nav aria-label="Admin" className="flex flex-col gap-1 text-[15px]">
        {sidebarLinks.map(({ href, label, icon: Icon, badge }) => {
          const on = isActive(pathname, href);
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

const moreRoutes = ["/admin/more", "/admin/content", "/admin/assistant", "/admin/delivery"];

const tabs = [
  { href: "/admin", label: "Home", icon: GridIcon },
  { href: "/admin/orders", label: "Orders", icon: BagIcon, badge: toPack },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/sourcing", label: "Sourcing", icon: ListIcon },
  { href: "/admin/more", label: "More", icon: DotsIcon },
];

// Phones: floating glass tab bar (same pattern as InboxPilot, in Goody's colours).
export function AdminTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Admin"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden print:hidden"
    >
      <div className="pointer-events-auto grid w-full max-w-md grid-cols-5 gap-1 rounded-full border border-white/70 bg-white/60 p-1.5 shadow-[0_10px_40px_rgba(26,24,20,0.16),0_2px_6px_rgba(26,24,20,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-[1.8]">
        {tabs.map(({ href, label, icon: Icon, badge }) => {
          const on =
            href === "/admin/more" ? moreRoutes.some((r) => pathname.startsWith(r)) : isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[11px] font-medium transition-colors ${
                on ? "bg-white text-ink shadow-[0_1px_4px_rgba(26,24,20,0.10)]" : "text-subtle active:bg-white/60"
              }`}
            >
              <span className="relative">
                <Icon size={22} strokeWidth={on ? 2.2 : 1.8} className={on ? "text-clay" : ""} />
                {badge ? (
                  <span className="absolute -right-3 -top-1.5 min-w-[18px] rounded-full bg-clay px-1 text-center text-[10px] font-semibold leading-[18px] text-white ring-2 ring-white/80">
                    {badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}