"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Truck,
  Plane,
  Anchor,
} from "lucide-react";

const steps = [
  {
    n: "01",
    icon: ClipboardList,
    meta: "Stage 01",
    title: "Select & submit your brief",
    body:
      "Choose your package, submit product references, target volumes and delivery window through our intake form.",
    duration: "~3 min",
    durationLabel: "One form",
    accent: "Quote within 24 hours",
  },
  {
    n: "02",
    icon: Search,
    meta: "Stage 02",
    title: "Sourcing & verification",
    body:
      "We match your brief to factories from our verified network, negotiate pricing, request samples and audit production capability.",
    duration: "5–10 days",
    durationLabel: "Audit + quotes",
    accent: "3 supplier options",
  },
  {
    n: "03",
    icon: CheckCircle2,
    meta: "Stage 03",
    title: "Approval & production",
    body:
      "You approve samples, we supervise production, run mid-line inspections and send weekly photo updates to your inbox.",
    duration: "2–6 weeks",
    durationLabel: "Manufacturing",
    accent: "Mid-line inspection",
  },
  {
    n: "04",
    icon: Truck,
    meta: "Stage 04",
    title: "Logistics & delivery",
    body:
      "Freight booking, customs paperwork and last-mile coordination. Tracking link from despatch until the boxes hit your door.",
    duration: "5–40 days",
    durationLabel: "Air or sea freight",
    accent: "Live tracking",
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Track which steps are "reached" based on scroll
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.15) setActiveStep(-1);
      else if (v < 0.4) setActiveStep(0);
      else if (v < 0.6) setActiveStep(1);
      else if (v < 0.85) setActiveStep(2);
      else setActiveStep(3);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Centered header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-5">
            How it works
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em]">
            Your journey from{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              factory
            </span>{" "}
            to front door.
          </h2>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mt-8 max-w-xl mx-auto">
            Four stages. One consultant. Full visibility from quote to delivery —
            every brief follows the same disciplined process.
          </p>
        </div>

        {/* Tracker */}
        <div
          ref={containerRef}
          className="relative max-w-4xl mx-auto"
        >
          {/* Background line */}
          <div className="absolute left-[27px] lg:left-[31px] top-4 bottom-4 w-[2px] bg-[var(--color-line)]" />

          {/* Animated ochre fill line */}
          <motion.div
            className="absolute left-[27px] lg:left-[31px] top-4 w-[2px] bg-[var(--color-ochre)] origin-top"
            style={{ height: lineHeight }}
          />

          {/* Steps */}
          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => {
              const isReached = i <= activeStep;
              const isCurrent = i === activeStep;

              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative grid grid-cols-[60px_1fr] lg:grid-cols-[68px_1fr_180px] gap-4 lg:gap-8 items-start"
                >
                  {/* Dot */}
                  <div className="relative pt-1.5 z-10">
                    <motion.div
                      className="relative w-[18px] h-[18px] rounded-full grid place-items-center"
                      animate={{
                        backgroundColor: isReached ? "#b8542a" : "#f5f0e8",
                        borderColor: isReached ? "#b8542a" : "#d9cfbf",
                        boxShadow: isCurrent
                          ? "0 0 0 6px rgba(184,84,42,0.18)"
                          : "0 0 0 0px rgba(184,84,42,0)",
                      }}
                      transition={{ duration: 0.5 }}
                      style={{ borderWidth: 2, borderStyle: "solid" }}
                    >
                      {isReached && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="w-1.5 h-1.5 rounded-full bg-[var(--color-cream)]"
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Main content */}
                  <div className="min-w-0 pt-0.5">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-3.5 h-3.5 text-[var(--color-ochre)]" />
                      <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-stone)]">
                        {step.meta}
                        {isCurrent && (
                          <span className="ml-2 inline-flex items-center gap-1 text-[var(--color-ochre)]">
                            <span className="w-1 h-1 rounded-full bg-[var(--color-ochre)] animate-pulse" />
                            in progress
                          </span>
                        )}
                      </p>
                    </div>
                    <h3 className="text-2xl lg:text-3xl tracking-[-0.02em] leading-tight mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-ink-soft)] text-[14px] lg:text-[15px] leading-relaxed max-w-xl">
                      {step.body}
                    </p>
                    {/* Accent chip */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-paper)] border border-[var(--color-line)] text-[11px] text-[var(--color-ink-soft)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ochre)]" />
                      {step.accent}
                    </div>
                  </div>

                  {/* Time/right column — desktop only */}
                  <div className="hidden lg:block text-right pt-1">
                    <p className="number-display text-2xl text-[var(--color-ochre)] leading-none">
                      {step.duration}
                    </p>
                    <p className="text-[11px] text-[var(--color-stone)] mt-1.5 tracking-wide">
                      {step.durationLabel}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom destination marker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-[60px_1fr] lg:grid-cols-[68px_1fr_180px] gap-4 lg:gap-8 items-center mt-10 lg:mt-14 pt-8 border-t border-dashed border-[var(--color-line)]"
          >
            <div className="relative pt-1 z-10">
              <div className="w-[18px] h-[18px] rounded-full grid place-items-center bg-[var(--color-ink)] border-2 border-[var(--color-ink)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ochre)]" />
              </div>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-1">
                Destination
              </p>
              <h3 className="text-2xl lg:text-3xl tracking-[-0.02em]">
                Your front door.
              </h3>
            </div>
            <div className="hidden lg:flex items-center justify-end gap-3 text-[var(--color-stone)]">
              <Plane className="w-4 h-4" />
              <Anchor className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}