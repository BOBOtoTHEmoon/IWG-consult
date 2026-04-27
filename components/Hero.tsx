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
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=2400&h=1600&fit=crop&q=85"
          alt="Global shipping logistics"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Warm ochre tint — image still visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(184,84,42,0.55) 0%, rgba(140,61,30,0.45) 45%, rgba(26,24,20,0.65) 100%)",
          }}
        />
        {/* Bottom darken for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full text-center text-[var(--color-cream)] pt-24 pb-16">
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-[6.5rem] leading-[0.98] tracking-[-0.025em] max-w-5xl mx-auto"
        >
          We source,{" "}
          <span className="text-[#f5d6a8] font-medium">verify</span> &amp;
          <br />
          ship the world's best.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-xl mx-auto text-[var(--color-cream)]/85 text-base lg:text-lg leading-relaxed"
        >
          From verified factories across Asia and Europe — straight to your door.
          Seven years of supply chain expertise, one consultant who handles every
          detail.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/start-brief"
            className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--color-cream)] text-[var(--color-ink)] text-sm tracking-wide hover:bg-[#f5d6a8] transition-colors duration-300"
          >
            Start a sourcing brief
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-[var(--color-cream)]/50 text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors duration-300"
          >
            Browse services
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex items-center justify-center gap-4"
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
                  className="w-3.5 h-3.5 fill-[#f5d6a8] text-[#f5d6a8]"
                />
              ))}
              <span className="ml-1.5 text-xs font-medium">4.9/5</span>
            </div>
            <p className="text-xs text-[var(--color-cream)]/70 mt-0.5">
              Trusted by 200+ importers worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}