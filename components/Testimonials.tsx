"use client";

import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I tried sourcing from China twice on my own and got burned both times. Goodness found me a verified supplier, ran the inspection herself, and my first order arrived exactly as promised.",
    name: "Emily R.",
    role: "First-time importer, London",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    tag: "Sourcing",
  },
  {
    quote:
      "We needed 800 branded gift boxes for a corporate event with a tight 6-week window. IWG handled everything — sample approval, production, customs — landed two days early.",
    name: "Roy J. K.",
    role: "Event planner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    tag: "Souvenirs",
  },
  {
    quote:
      "The thing that stood out: she actually answered messages. Sounds basic, but anyone who's worked with sourcing agents knows it's rare. We've now done three orders together.",
    name: "Alex B.",
    role: "Founder, home goods brand",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    tag: "Business",
  },
  {
    quote:
      "Furnished a four-bedroom Airbnb top to bottom — sofas, beds, lighting, decor — for less than half what I'd budgeted locally. Quality matched the photos.",
    name: "Daniel J.",
    role: "Short-stay host, Manchester",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop",
    tag: "Home",
  },
  {
    quote:
      "Pregnant with our first and didn't want to spend half a salary on baby gear. Goodness found us safety-certified items at factory prices.",
    name: "Priya S.",
    role: "Expecting mum",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    tag: "Baby",
  },
  {
    quote:
      "Saved us roughly 35% on the BoM versus our previous local supplier — same quality, faster delivery. The freight visibility alone is worth the fee.",
    name: "Marcus W.",
    role: "Operations lead, retail brand",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    tag: "Business",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 bg-[var(--color-paper)] border-y border-[var(--color-line)]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Centered header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-5">
            Reviews
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em]">
            Words from people who've{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              ordered
            </span>
            .
          </h2>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mt-8 max-w-xl mx-auto">
            Real briefs, real outcomes. A handful of recent clients across our
            four service categories.
          </p>
        </div>

        {/* Aggregate rating bar */}
        <div className="flex items-center justify-center gap-6 mb-12 pb-10 border-b border-[var(--color-line)]">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-[var(--color-ochre)] text-[var(--color-ochre)]"
              />
            ))}
          </div>
          <div className="h-6 w-px bg-[var(--color-line)]" />
          <p className="text-sm text-[var(--color-ink-soft)]">
            <span className="number-display text-[var(--color-ochre)] text-base">
              4.9
            </span>{" "}
            average from{" "}
            <span className="number-display text-[var(--color-ink)]">200+</span>{" "}
            verified reviews
          </p>
        </div>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: (i % 3) * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group bg-[var(--color-cream)] border border-[var(--color-line)] rounded-xl p-5 lg:p-6 flex flex-col transition-all duration-500 hover:-translate-y-0.5 hover:border-[var(--color-ochre)]/40 hover:shadow-[0_16px_32px_-16px_rgba(26,24,20,0.12)]"
            >
              {/* Top: stars + tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-[var(--color-ochre)] text-[var(--color-ochre)]"
                    />
                  ))}
                </div>
                <span className="text-[9px] tracking-[0.16em] uppercase text-[var(--color-stone)] px-2 py-0.5 rounded-full border border-[var(--color-line)]">
                  {t.tag}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-[14px] leading-relaxed text-[var(--color-ink-soft)] flex-1 mb-5">
                <Quote className="w-3.5 h-3.5 text-[var(--color-ochre)]/60 inline-block mr-1 -mt-3" />
                {t.quote}
              </blockquote>

              {/* Author */}
              <figcaption className="pt-4 border-t border-[var(--color-line)] flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[13px] text-[var(--color-ink)] truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-stone)] truncate">
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}