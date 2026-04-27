"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Mail, Phone, MapPin, Send } from "lucide-react";

const cols = [
  {
    title: "Pages",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/#process", label: "Process" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#testimonials", label: "Reviews" },
      {
        href: "/start-brief",
        label: "Contact",
      },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "#", label: "Instagram" },
      { href: "#", label: "LinkedIn" },
      { href: "#", label: "WhatsApp" },
      { href: "mailto:hello@iwgconsult.com", label: "Email" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 lg:pt-24 pb-10">
        {/* Newsletter strip */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 pb-16 mb-16 border-b border-[var(--color-cream)]/10">
          <div className="lg:col-span-7">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#f5d6a8] mb-4 font-semibold">
              Stay in the loop
            </p>
            <h3 className="text-3xl lg:text-5xl tracking-[-0.025em] leading-[1.05] mb-3">
              Sourcing notes,{" "}
              <span className="text-[#f5d6a8] font-medium">
                straight to your inbox
              </span>
              .
            </h3>
            <p className="text-[var(--color-cream)]/65 text-sm lg:text-base leading-relaxed max-w-md">
              Quarterly notes on factory trends, freight pricing and supplier
              tips for UK importers. No spam.
            </p>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <form
              onSubmit={handleSubscribe}
              className="w-full flex items-center gap-2 p-1.5 rounded-full bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/15 backdrop-blur-sm"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-5 py-2.5 text-sm text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#f5d6a8] text-[var(--color-ink)] text-sm font-medium hover:bg-[var(--color-cream)] transition-colors duration-300"
              >
                {submitted ? (
                  <>Subscribed ✓</>
                ) : (
                  <>
                    Subscribe <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Brand block */}
          <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="IWG Consult"
                className="h-10 w-auto"
              />
            </Link>  
            <p className="text-[var(--color-cream)]/65 text-sm leading-relaxed max-w-sm mb-6">
              Global procurement, personally managed. Sourcing, verification and
              shipping handled end-to-end by experienced import consultants.
            </p>

            {/* Contact details */}
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-[var(--color-cream)]/75">
                <Mail className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <a
                  href="mailto:hello@iwgconsult.com"
                  className="hover:text-[var(--color-cream)] transition-colors"
                >
                  hello@iwgconsult.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-cream)]/75">
                <Phone className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <a
                  href="tel:+441234567890"
                  className="hover:text-[var(--color-cream)] transition-colors"
                >
                  +44 1234 567 890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-[var(--color-cream)]/75">
                <MapPin className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <span>United Kingdom · Remote globally</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-3 gap-6">
            {cols.map((col) => (
              <div key={col.title}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#f5d6a8] mb-5 font-semibold">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[var(--color-cream)]/75 hover:text-[var(--color-cream)] text-sm transition-colors duration-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals strip */}
        <div className="grid sm:grid-cols-3 gap-4 py-6 mb-8 border-y border-[var(--color-cream)]/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-cream)]/[0.06] grid place-items-center shrink-0">
              <span className="number-display text-sm text-[#f5d6a8]">7+</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-cream)]">
                Years in business
              </p>
              <p className="text-xs text-[var(--color-cream)]/55">
                Operating since 2018
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-cream)]/[0.06] grid place-items-center shrink-0">
              <span className="number-display text-sm text-[#f5d6a8]">200+</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-cream)]">
                Verified factories
              </p>
              <p className="text-xs text-[var(--color-cream)]/55">
                Audited supplier network
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-cream)]/[0.06] grid place-items-center shrink-0">
              <span className="number-display text-sm text-[#f5d6a8]">£100k+</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-cream)]">Orders managed</p>
              <p className="text-xs text-[var(--color-cream)]/55">
                Across 500+ briefs
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--color-cream)]/55">
          <p>© {new Date().getFullYear()} IWG Consult. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-[var(--color-cream)] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-[var(--color-cream)] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}