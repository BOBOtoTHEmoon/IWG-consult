"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-[var(--color-cream)] overflow-hidden">
      {/* Subtle ochre glows for depth */}
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-ochre) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--color-ochre) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 lg:px-10 w-full pt-28 pb-16 lg:py-32 text-center">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-[7rem] leading-[1] tracking-[-0.03em] text-[var(--color-ink)]"
        >
          We source,{" "}
          <span className="text-[var(--color-ochre)] font-medium">
            verify
          </span>{" "}
          &amp;
          <br />
          ship the world's best.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7 max-w-xl mx-auto text-[var(--color-ink-soft)] text-base lg:text-lg leading-relaxed"
        >
          From verified factories straight to your
          door. Seven years of supply chain expertise, one consultant who
          handles every detail.
        </motion.p>

        {/* Buttons — always inline, even on mobile */}
        <motion.div
          {...fadeUp}
          transition={{
            duration: 0.9,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-row items-center justify-center gap-2.5 sm:gap-3"
        >
          <Link
            href="/start-brief"
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[13px] sm:text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300 whitespace-nowrap"
          >
            Get started
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-7 py-3.5 sm:py-4 rounded-full border border-[var(--color-ink)]/20 text-[var(--color-ink)] text-[13px] sm:text-sm tracking-wide hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] hover:border-[var(--color-ink)] transition-colors duration-300 whitespace-nowrap"
          >
            Browse services
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp}
          transition={{
            duration: 0.9,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 flex items-center justify-center gap-4"
        >
          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
            ].map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-cream)]"
              />
            ))}
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[var(--color-ochre)] text-[var(--color-ochre)]"
                />
              ))}
              <span className="ml-1.5 text-xs font-medium text-[var(--color-ink)]">
                4.9/5
              </span>
            </div>
            <p className="text-xs text-[var(--color-stone)] mt-0.5">
              Trusted by 200+ importers worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}