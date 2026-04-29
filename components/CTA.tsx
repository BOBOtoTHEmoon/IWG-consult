"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 rounded-2xl overflow-hidden border border-[var(--color-line)] shadow-[0_24px_60px_-30px_rgba(26,24,20,0.25)]">
          {/* Left: image (desktop only) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block lg:col-span-5 relative lg:min-h-[320px]"
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

            {/* Top ribbon */}
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-cream)]/90 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] tracking-[0.18em] uppercase text-[var(--color-ink)] font-semibold">
                Currently sourcing
              </span>
            </div>
          </motion.div>

          {/* Right: dark CTA panel */}
          <div className="lg:col-span-7 bg-[var(--color-ink)] text-[var(--color-cream)] relative px-6 py-10 lg:px-12 lg:py-14 flex flex-col justify-center overflow-hidden">
            {/* Subtle dot pattern */}
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
              <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.025em] mb-4 lg:mb-5 max-w-2xl">
                Tell us what you need to{" "}
                <span className="text-[#f5d6a8] font-medium">source</span>.
              </h2>
              <p className="text-[var(--color-cream)]/65 text-[13px] sm:text-sm lg:text-base leading-relaxed mb-6 lg:mb-7 max-w-md">
                Submit a brief in under three minutes. First supplier matches
                inside ten working days.
              </p>

              {/* Buttons — horizontal on mobile too */}
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                <Link
                  href="/start-brief"
                  className="group inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] text-[13px] sm:text-sm tracking-wide hover:bg-[#f5d6a8] transition-colors duration-300 whitespace-nowrap"
                >
                  Start a brief
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="mailto:hello@iwgconsult.com"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-[var(--color-cream)]/30 text-[var(--color-cream)] text-[13px] sm:text-sm tracking-wide hover:bg-[var(--color-cream)]/10 transition-colors duration-300 whitespace-nowrap"
                >
                  Email instead
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}