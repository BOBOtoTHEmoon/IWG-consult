"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "../Icons";
import { useBasket } from "./BasketProvider";
import Logo from "./Logo";
import SearchDialog from "./SearchDialog";

const iconBtn =
  "flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const basket = useBasket();
  const count = basket.ready ? basket.count : 0;

  // Main links: big in the phone menu. "short" is the label used in the desktop menu bar.
  const nav = [
    { href: "/shop", label: "Shop", active: pathname.startsWith("/shop") || pathname.startsWith("/product") },
    { href: "/sourcing", label: "Sourcing services", active: pathname.startsWith("/sourcing") },
  ];
  // Help links: smaller in the phone menu, after the main links in the desktop menu bar.
  const help = [
    { href: "/faqs", label: "FAQs", short: "FAQs" },
    { href: "/contact", label: "Contact us", short: "Contact us" },
    { href: "/terms", label: "Terms and conditions", short: "Terms" },
  ].map((l) => ({ ...l, active: pathname.startsWith(l.href) }));

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

  const desktopLink = (active: boolean) => (active ? "font-semibold text-clay" : "text-ink hover:text-clay");

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-2 sm:px-6 lg:h-[84px] lg:px-12 xl:px-20">
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
          <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium lg:flex xl:gap-9">
            {[...nav.map((n) => ({ ...n, short: n.label })), ...help].map((n) => (
              <Link key={n.href} href={n.href} aria-current={n.active ? "page" : undefined} className={desktopLink(n.active)}>
                {n.short}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
              <SearchIcon />
            </button>
            <button
              onClick={basket.open}
              className={`${iconBtn} relative`}
              aria-label={count > 0 ? `Basket, ${count} ${count === 1 ? "item" : "items"}` : "Basket, empty"}
            >
              <BagIcon />
              {count > 0 && (
                <span className="absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-clay px-1 text-[11px] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={closeSearch} />

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
        <nav aria-label="Mobile" className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
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
          <div
            style={{ transitionDelay: open ? "200ms" : "0ms" }}
            className={`flex flex-col pt-4 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {help.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={`flex h-12 items-center text-lg font-semibold ${n.active ? "text-clay" : "text-muted"}`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}