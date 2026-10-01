"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "../Icons";
import Logo from "./Logo";

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const basketCount = 2; // replace with real basket state

  const nav = [
    { href: "/shop", label: "Shop", active: pathname.startsWith("/shop") || pathname.startsWith("/product") },
    { href: "/sourcing", label: "Sourcing services", active: pathname.startsWith("/sourcing") },
  ];

  // Close the menu whenever the page changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Stop the page behind from scrolling, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-2 sm:px-6 lg:h-[84px] lg:px-20">
          <button
            className={`${iconBtn} lg:hidden`}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon size={22} />
          </button>
          <Logo />
          <nav aria-label="Main" className="hidden gap-10 text-[15px] font-medium lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={n.active ? "font-semibold text-clay" : "text-ink hover:text-clay"}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button className={`${iconBtn} hidden lg:flex`} aria-label="Search">
              <SearchIcon />
            </button>
            <Link href="/checkout" className={`${iconBtn} relative`} aria-label={`Basket, ${basketCount} items`}>
              <BagIcon />
              <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay text-[11px] font-bold text-white">
                {basketCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu lives outside the header so the blur does not trap it. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-cream transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-2">
          <span className="pl-3">
            <Logo small />
          </span>
          <button className={iconBtn} aria-label="Close menu" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
          {nav.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={`border-b border-line py-5 font-display text-3xl transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${n.active ? "text-clay" : "text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}