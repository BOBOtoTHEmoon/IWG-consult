"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-[var(--color-line)] shadow-[0_24px_60px_-30px_rgba(26,24,20,0.25)]">
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 relative h-[220px] lg:h-auto lg:min-h-[360px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&h=1400&fit=crop&q=80"
              alt="Shipping containers at port"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(184,84,42,0.3) 0%, rgba(26,24,20,0.45) 100%)",
              }}
            />

            {/* Floating stat — smaller */}
            <div className="absolute bottom-4 left-4 right-4 lg:right-auto lg:max-w-[220px] bg-[var(--color-cream)] rounded-lg px-4 py-3 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-[var(--color-ochre)]" />
                <p className="text-[9px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold">
                  Average response
                </p>
              </div>
              <p className="number-display text-lg text-[var(--color-ink)] leading-none">
                5–10{" "}
                <span className="text-xs text-[var(--color-stone)] font-sans">
                  working days
                </span>
              </p>
            </div>
          </motion.div>

          {/* Right: dark CTA panel */}
          <div className="lg:col-span-8 bg-[var(--color-ink)] text-[var(--color-cream)] relative px-7 py-10 lg:px-12 lg:py-14 flex flex-col justify-center overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, var(--color-cream) 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#f5d6a8] mb-3 font-semibold">
                Ready to start?
              </p>
              <h2 className="text-3xl lg:text-5xl leading-[1.05] tracking-[-0.02em] mb-5 max-w-2xl">
                Tell us what you need to{" "}
                <span className="text-[#f5d6a8] font-medium">source</span>.
              </h2>
              <p className="text-[var(--color-cream)]/65 text-sm lg:text-base leading-relaxed mb-7 max-w-md">
                Submit a brief in under three minutes. We'll come back with first
                supplier matches inside ten working days — no commitment until
                you approve a quote.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-7">
                <Link
                  href="/start-brief"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] text-sm tracking-wide hover:bg-[#f5d6a8] transition-colors duration-300"
                >
                  Start a sourcing brief
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="mailto:hello@iwgconsult.com"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-cream)]/30 text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-cream)]/10 transition-colors duration-300"
                >
                  Email instead
                </Link>
              </div>

              <div className="pt-5 border-t border-[var(--color-cream)]/10 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-[var(--color-cream)]/55">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#f5d6a8]" />
                  No upfront commitment
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#f5d6a8]" />
                  Quote within 24 hours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#f5d6a8]" />
                  UK customs handled
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}