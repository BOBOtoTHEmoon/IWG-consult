"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "../Icons";
import Logo from "./Logo";

const nav = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?category=homeware", label: "Homeware" },
  { href: "/shop?category=fashion", label: "Fashion" },
  { href: "/shop?category=baby", label: "Baby" },
  { href: "/shop?category=gifts", label: "Gifts" },
];

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const basketCount = 2; // replace with real basket state

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-2 sm:px-6 lg:h-[84px] lg:px-20">
        <button className={`${iconBtn} lg:hidden`} aria-label="Open menu" onClick={() => setOpen(true)}>
          <MenuIcon size={22} />
        </button>
        <Logo />
        <nav aria-label="Main" className="hidden gap-8 text-[15px] font-medium lg:flex">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className="text-ink hover:text-clay">
              {n.label}
            </Link>
          ))}
          <Link
            href="/sourcing"
            aria-current={pathname === "/sourcing" ? "page" : undefined}
            className="font-semibold text-clay hover:text-clay-dark"
          >
            Sourcing services
          </Link>
        </nav>
        <div className="flex items-center gap-1">
          <button className={`${iconBtn} hidden lg:flex`} aria-label="Search">
            <SearchIcon />
          </button>
          <button className={`${iconBtn} hidden lg:flex`} aria-label="Account">
            <UserIcon />
          </button>
          <Link href="/checkout" className={`${iconBtn} relative`} aria-label={`Basket, ${basketCount} items`}>
            <BagIcon />
            <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay text-[11px] font-bold text-white">
              {basketCount}
            </span>
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 bg-cream lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-[60px] items-center justify-between border-b border-line px-2">
            <span className="pl-3"><Logo small /></span>
            <button className={iconBtn} aria-label="Close menu" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
            {[...nav, { href: "/sourcing", label: "Sourcing services" }].map((n) => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-display text-2xl text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
