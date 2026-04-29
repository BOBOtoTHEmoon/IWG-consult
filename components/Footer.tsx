"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";

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
      { href: "/start-brief", label: "Contact" },
    ],
  },
];

const socials = [
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: MessageCircle, label: "WhatsApp" },
  { href: "mailto:hello@iwgconsult.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
      {/* Subtle pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-12 lg:pt-16 pb-6">
        {/* === Newsletter strip — centered on mobile, split on desktop === */}
        <div className="text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center pb-8 lg:pb-12 mb-8 lg:mb-12 border-b border-[var(--color-cream)]/10">
          <div className="lg:col-span-7 mb-5 lg:mb-0">
            <p className="text-[10px] tracking-[0.18em] uppercase text-[#f5d6a8] mb-2.5 font-semibold">
              Stay in the loop
            </p>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl tracking-[-0.025em] leading-[1.1] mb-3 max-w-xl mx-auto lg:mx-0">
              Sourcing notes,{" "}
              <span className="text-[#f5d6a8] font-medium">
                straight to your inbox
              </span>
              .
            </h3>
            <p className="text-[var(--color-cream)]/65 text-[12px] lg:text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              Quarterly notes on factory trends, freight pricing and supplier
              tips. No spam.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="max-w-md mx-auto lg:mx-0 lg:col-span-5 flex items-center gap-1.5 p-1.5 rounded-full bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/15"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-transparent px-4 py-2 text-[13px] text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f5d6a8] text-[var(--color-ink)] text-[12px] font-medium hover:bg-[var(--color-cream)] transition-colors duration-300"
            >
              {submitted ? (
                <>Done ✓</>
              ) : (
                <>
                  Subscribe <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* === Main grid: brand left / links right (centered stack on mobile) === */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 mb-8 lg:mb-10">
          {/* Brand block */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <Link
              href="/"
              className="inline-flex items-center justify-center lg:justify-start mb-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-light.png"
                alt="IWG Consult"
                className="h-10 lg:h-11 w-auto"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.png";
                }}
              />
            </Link>
            <p className="text-[var(--color-cream)]/65 text-[13px] lg:text-sm leading-relaxed max-w-md mx-auto lg:mx-0 mb-5">
              Global procurement, personally managed. Sourcing, verification and
              shipping handled end-to-end.
            </p>

            {/* Contact row — horizontal on mobile and desktop */}
            <ul className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[12px] lg:text-sm text-[var(--color-cream)]/75">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <a
                  href="mailto:hello@iwgconsult.com"
                  className="hover:text-[var(--color-cream)] transition-colors"
                >
                  hello@iwgconsult.com
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <a
                  href="tel:+441234567890"
                  className="hover:text-[var(--color-cream)] transition-colors"
                >
                  +44 1234 567 890
                </a>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f5d6a8] shrink-0" />
                <span>UK · Remote globally</span>
              </li>
            </ul>
          </div>

          {/* Links + Connect — right side on desktop */}
          <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 text-center lg:text-left">
            {cols.map((col) => (
              <div key={col.title}>
                <p className="text-[9px] lg:text-[10px] tracking-[0.18em] uppercase text-[#f5d6a8] mb-3 font-semibold">
                  {col.title}
                </p>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[var(--color-cream)]/75 hover:text-[var(--color-cream)] text-[13px] transition-colors duration-300"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Connect — full width on mobile (spans 2 cols), single col on desktop */}
            <div className="col-span-2 lg:col-span-1">
              <p className="text-[9px] lg:text-[10px] tracking-[0.18em] uppercase text-[#f5d6a8] mb-3 font-semibold">
                Connect
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-full grid place-items-center bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/15 text-[var(--color-cream)]/75 hover:bg-[#f5d6a8] hover:text-[var(--color-ink)] hover:border-[#f5d6a8] transition-all duration-300"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* === Trust pills — centered on mobile, left-aligned on desktop === */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pb-6 lg:pb-8 mb-5 lg:mb-6 border-t border-[var(--color-cream)]/10 pt-6 lg:pt-8 border-b">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/10">
            <span className="number-display text-xs text-[#f5d6a8]">7+</span>
            <span className="text-[11px] text-[var(--color-cream)]/75">
              years
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/10">
            <span className="number-display text-xs text-[#f5d6a8]">200+</span>
            <span className="text-[11px] text-[var(--color-cream)]/75">
              factories
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-cream)]/[0.06] border border-[var(--color-cream)]/10">
            <span className="number-display text-xs text-[#f5d6a8]">£100k+</span>
            <span className="text-[11px] text-[var(--color-cream)]/75">
              managed
            </span>
          </div>
        </div>

        {/* === Bottom bar === */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--color-cream)]/55">
          <p>© {new Date().getFullYear()} IWG Consult. All rights reserved.</p>
          <div className="flex items-center gap-5">
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