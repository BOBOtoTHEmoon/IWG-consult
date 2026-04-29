"use client";

import { useState } from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const faqs = [
 {
  q: "What does the sourcing fee cover?",
  a: "It covers supplier discovery, factory verification, sample coordination, price negotiation, production follow up, and quality checks. The 5% commission applies only to goods that are shipped and never to quotes that do not proceed.",
},
{
  q: "How long does the process take?",
  a: "The time from brief to first quote is typically 5 to 10 working days. Full sourcing and delivery timelines depend on your product and shipping method, but most orders arrive within 4 to 10 weeks after sample approval.",
},
{
  q: "How much will everything cost?",
  a: "Costs include a one time sourcing fee of £150 to £300 depending on the package, a 5% commission on goods value, plus the actual cost of products and freight. There are no hidden margins, and you will see every quote we receive.",
},
{
  q: "Do you handle shipping and customs?",
  a: "Yes. We coordinate sea or air freight, prepare commercial paperwork, and connect you with a UK customs broker for duties and VAT.",
},
{
  q: "How will we communicate?",
  a: "Communication is via WhatsApp or email, whichever you prefer. You will have direct contact with your consultant throughout the process, along with weekly photo updates during production.",
},
{
  q: "Is the sourcing fee refundable?",
  a: "If we cannot find suppliers that meet your brief within 14 days, the fee is fully refunded. Otherwise, the fee becomes non refundable once supplier work begins.",
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
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-[var(--color-cream)] border-[var(--color-ochre)]/40 shadow-[0_8px_20px_-12px_rgba(184,84,42,0.15)]"
          : "bg-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-ink)]/20"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-4 lg:px-5 py-3.5 lg:py-4 text-left"
      >
        <span className="text-[14px] lg:text-[15px] font-medium text-[var(--color-ink)] leading-snug pr-1">
          {q}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-full grid place-items-center transition-all duration-300 ${
            isOpen
              ? "bg-[var(--color-ochre)] text-[var(--color-cream)] rotate-45"
              : "border border-[var(--color-ink)]/15 text-[var(--color-ink)]"
          }`}
        >
          <Plus className="w-3 h-3" />
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
            <p className="px-4 lg:px-5 pb-4 text-[13px] lg:text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
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
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-10">
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

        {/* FAQ list */}
        <div className="max-w-2xl mx-auto space-y-2">
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
        <div className="max-w-2xl mx-auto mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
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