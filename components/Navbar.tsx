"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { href: "/services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#testimonials", label: "Reviews" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu open OR scrolled past hero → use dark/cream mode
  const isLight = scrolled || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-cream)]/85 backdrop-blur-md border-b border-[var(--color-line)]/60"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between">
       {/* Logo */}
        <Link href="/" className="flex items-center group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isLight ? "/logo.png" : "/logo.png"}
            alt="IWG Consult"
            className="h-9 lg:h-10 w-auto transition-opacity duration-500"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] tracking-wide underline-grow transition-colors duration-500 ${
                isLight
                  ? "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  : "text-[var(--color-cream)]/90 hover:text-[var(--color-cream)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/start-brief"
            className={`hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] tracking-wide transition-all duration-500 ${
              isLight
                ? "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-ochre)]"
                : "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[#f5d6a8]"
            }`}
          >
            Get started <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden grid place-items-center w-10 h-10 transition-colors duration-500 ${
              isLight ? "text-[var(--color-ink)]" : "text-[var(--color-cream)]"
            }`}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open
            ? "max-h-[400px] border-t border-[var(--color-line)]/60"
            : "max-h-0"
        }`}
      >
        <nav className="px-6 py-6 flex flex-col gap-4 bg-[var(--color-cream)]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl text-[var(--color-ink)]"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/start-brief"
            className="mt-3 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm"
          >
            Get started <ArrowUpRight className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}