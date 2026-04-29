"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Consultant() {
  return (
    <section className="py-14 lg:py-24 bg-[var(--color-cream)] text-[var(--color-ink)] relative overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Image — smaller, narrower aspect */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 relative max-w-[280px] sm:max-w-[320px] mx-auto lg:max-w-none"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://framerusercontent.com/images/DZhxlzW05Siwjlu5sS2wcLdKGk0.jpg?width=900&height=1100"
                alt="Goodness Omotolani Olanrewaju"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 lg:-right-6 bg-[var(--color-ochre)] text-[var(--color-cream)] rounded-lg px-3.5 py-2.5">
              <p className="text-[9px] tracking-[0.2em] uppercase opacity-80 mb-0.5">
                Founder & lead
              </p>
              <p className="font-display text-base lg:text-lg">Import Expert</p>
            </div>
          </motion.div>

          {/* Right — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
              Meet the consultant
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.025em] mb-5 lg:mb-6">
              Goodness Omotolani{" "}
              <span className="text-[var(--color-ochre)] font-medium">
                Olanrewaju
              </span>
            </h2>

            <p className="text-[var(--color-ink)]/75 text-[14px] lg:text-base leading-relaxed max-w-xl">
              Seven years between UK importers and Asian manufacturers taught me
              one thing: most sourcing problems are communication problems. Every
              brief I take on, I treat as if I were the one waiting for the
              container to land.
            </p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 mt-7 lg:mt-8 pt-6 lg:pt-7 border-t border-[var(--color-ink)]/15 max-w-md">
              <div>
                <p className="number-display text-2xl lg:text-3xl text-[var(--color-ochre)]">
                  7+
                </p>
                <p className="text-[9px] lg:text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-0.5">
                  Years
                </p>
              </div>
              <div>
                <p className="number-display text-2xl lg:text-3xl text-[var(--color-ochre)]">
                  200+
                </p>
                <p className="text-[9px] lg:text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-0.5">
                  Factories
                </p>
              </div>
              <div>
                <p className="number-display text-2xl lg:text-3xl text-[var(--color-ochre)]">
                  £100k+
                </p>
                <p className="text-[9px] lg:text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-0.5">
                  Managed
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="mt-7 lg:mt-8 inline-flex items-center gap-1.5 text-sm tracking-wide underline-grow"
            >
              Read the full story
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}