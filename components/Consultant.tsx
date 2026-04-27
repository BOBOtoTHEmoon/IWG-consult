"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Consultant() {
  return (
    <section className="py-20 lg:py-32 bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
  

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://framerusercontent.com/images/DZhxlzW05Siwjlu5sS2wcLdKGk0.jpg?width=900&height=1100"
                alt="Goodness Omotolani Olanrewaju"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 lg:-right-8 bg-[var(--color-ochre)] text-[var(--color-cream)] rounded-xl px-5 py-4">
              <p className="text-[10px] tracking-[0.2em] uppercase opacity-80 mb-1">
                Founder & lead
              </p>
              <p className="font-display text-xl">Import Expert</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-5">
              Meet the consultant
            </p>
            <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em] mb-8">
              Goodness Omotolani
              <br />
              <span className="italic text-[var(--color-ochre)]">Olanrewaju</span>
            </h2>

            <div className="space-y-5 text-[var(--color-cream)]/80 text-[15px] leading-relaxed max-w-xl">
              <p>
                Seven years working between UK importers and Asian manufacturers
                taught me one thing: most sourcing problems aren't sourcing
                problems — they're communication problems.
              </p>
              <p>
                IWG exists because clients deserve a consultant who treats their
                deposit like their own money. Every brief I take on, I treat as
                if I were the one waiting for the container to land.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-[var(--color-cream)]/15 max-w-xl">
              <div>
                <p className="number-display text-4xl">7+</p>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-1">
                  Years
                </p>
              </div>
              <div>
                <p className="number-display text-4xl">200+</p>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-1">
                  Factories
                </p>
              </div>
              <div>
                <p className="number-display text-4xl">£100k+</p>
                <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mt-1">
                  Managed
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm tracking-wide underline-grow"
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
