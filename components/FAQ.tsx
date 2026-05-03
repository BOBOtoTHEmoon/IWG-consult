"use client";

import { useState } from "react";
import { Plus, ArrowUpRight, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const faqs = [
  {
    q: "What does the sourcing fee cover?",
    a: "The sourcing fee covers supplier research, factory verification, price negotiation, sample coordination where required, and communication with manufacturers. It does not include product cost or shipping.",
  },
  {
    q: "How long does the sourcing process take?",
    a: "Supplier sourcing typically takes 3–5 working days depending on the product category and complexity. The timeline allows us to properly verify each manufacturer before proceeding. We assess their legitimacy, reliability, and product quality to ensure you're connected with trusted suppliers only. Production timelines vary by manufacturer, but we provide estimated timelines before you make any payment decisions.",
  },
  {
    q: "How much will everything cost?",
    a: "Pricing depends on the specific product you're sourcing and the quality grade you choose. We provide direct manufacturer pricing with full transparency and prioritize securing the best possible rates to help you maximize savings for yourself or your business.",
  },
  {
    q: "How long does shipping take?",
    a: "Shipping timelines vary depending on the selected shipping method and destination country. Air freight typically takes 7–12 working days. Sea freight typically takes 40–70 days, depending on port destination and customs processing. Estimated delivery timelines will always be confirmed before shipment to ensure clarity and proper planning.",
  },
  {
    q: "Do you handle shipping and customs clearance?",
    a: "We work with trusted freight partners who oversee inspection and secure packaging to minimize the risk of damage or loss in transit. We also guide you through air or sea freight options, full cost breakdowns, duties, and delivery timelines, so you can make well-informed, profitable shipping decisions.",
  },
  {
    q: "Is the sourcing fee refundable?",
    a: "If we cannot find suppliers that meet your brief within 14 days, the fee is fully refunded. Otherwise, the fee becomes non-refundable once supplier work begins.",
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen
          ? "bg-[#5C1D05] text-[var(--color-cream)]"
          : "bg-[#f5d6a8] text-[var(--color-ink)] hover:brightness-95"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className={`text-[14px] lg:text-[15px] font-medium leading-snug pr-1 ${
            isOpen ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"
          }`}
        >
          {q}
        </span>
        <span
          className={`shrink-0 w-6 h-6 grid place-items-center transition-all duration-300 ${
            isOpen ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]"
          }`}
        >
          {isOpen ? (
            <Minus className="w-3.5 h-3.5" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[13px] lg:text-[14px] text-[var(--color-cream)]/85 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Centered header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.025em]">
            Frequently asked{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              questions
            </span>
            .
          </h2>
        </div>

        {/* FAQ grid — 2 columns on desktop */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-3 lg:gap-4 items-start">
          {faqs.map((f, i) => (
            <FAQItem
              key={f.q}
              q={f.q}
              a={f.a}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-5xl mx-auto mt-10 lg:mt-12 pt-8 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
          <p className="text-[var(--color-ink-soft)] text-sm">
            Still have questions?
          </p>
          <Link
            href="/start-brief"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[13px] tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
          >
            Talk to a consultant
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}