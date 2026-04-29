"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
    name: "Adaeze O.",
    role: "Event planner, Birmingham",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop",
    tag: "Souvenirs",
  },
  {
    quote:
      "The thing that stood out: she actually answered messages. Sounds basic, but anyone who's worked with sourcing agents knows it's rare. We've now done three orders together.",
    name: "Marcus W.",
    role: "Founder, home goods brand",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    tag: "Business",
  },
  {
    quote:
      "Furnished a four-bedroom Airbnb top to bottom — sofas, beds, lighting, decor — for less than half what I'd budgeted locally. Quality matched the photos.",
    name: "Tunde K.",
    role: "Short-stay host, Manchester",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
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
    name: "Chika E.",
    role: "Operations lead, retail brand",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
    tag: "Business",
  },
];

const AUTO_ROTATE_MS = 6000;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = (i: number) => {
    setDirection(i > active ? 1 : -1);
    setActive(i);
  };
  const next = () => {
    setDirection(1);
    setActive((a) => (a + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, active]);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) next();
      else prev();
    }
  };

  const t = testimonials[active];

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  return (
    <section
      id="testimonials"
      className="py-14 lg:py-24 bg-[var(--color-paper)] border-y border-[var(--color-line)]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-12">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
            Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.025em]">
            Words from people who've{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              ordered
            </span>
            .
          </h2>
        </div>

        {/* Aggregate rating bar */}
        <div className="flex items-center justify-center gap-4 mb-8 lg:mb-10">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-[var(--color-ochre)] text-[var(--color-ochre)]"
              />
            ))}
          </div>
          <div className="h-5 w-px bg-[var(--color-line)]" />
          <p className="text-xs sm:text-sm text-[var(--color-ink-soft)]">
            <span className="number-display text-[var(--color-ochre)]">4.9</span>{" "}
            from{" "}
            <span className="number-display text-[var(--color-ink)]">200+</span>{" "}
            reviews
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Card */}
          <div className="relative bg-[var(--color-cream)] border border-[var(--color-line)] rounded-2xl p-6 sm:p-8 lg:p-10 min-h-[280px] lg:min-h-[320px] overflow-hidden">
            {/* Decorative quote mark */}
            <Quote
              className="absolute top-5 right-5 w-10 h-10 lg:w-14 lg:h-14 text-[var(--color-ochre)]/10"
              aria-hidden
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 280, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="relative flex flex-col h-full"
              >
                {/* Top row: stars + tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[var(--color-ochre)] text-[var(--color-ochre)]"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] px-2.5 py-1 rounded-full border border-[var(--color-line)]">
                    {t.tag}
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="font-display text-xl sm:text-2xl lg:text-3xl leading-[1.3] tracking-[-0.015em] text-[var(--color-ink)] flex-1 mb-6">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <figcaption className="flex items-center gap-3 pt-5 border-t border-[var(--color-line)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--color-ink)] font-medium">
                      {t.name}
                    </p>
                    <p className="text-xs text-[var(--color-stone)]">{t.role}</p>
                  </div>
                </figcaption>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop arrow buttons */}
          <button
            onClick={prev}
            aria-label="Previous review"
            className="hidden lg:grid absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] hover:border-[var(--color-ink)] transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next review"
            className="hidden lg:grid absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] place-items-center text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] hover:border-[var(--color-ink)] transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Pager dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-6 bg-[var(--color-ochre)]"
                    : "w-1.5 bg-[var(--color-line)] hover:bg-[var(--color-stone)]"
                }`}
              />
            ))}
          </div>

          {/* Swipe hint on mobile */}
          <p className="lg:hidden text-center text-[10px] text-[var(--color-stone)] mt-3">
            Swipe to see more →
          </p>
        </div>
      </div>
    </section>
  );
}