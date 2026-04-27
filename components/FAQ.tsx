"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  {
    q: "What does the sourcing fee cover?",
    a: "It covers supplier discovery, factory verification, sample coordination, price negotiation, production follow-up and quality checks. The commission applies to the value of goods shipped — never on quotes that don't proceed.",
  },
  {
    q: "How long does the sourcing process take?",
    a: "From brief to first quote: typically 5–10 working days. Full sourcing-to-delivery timelines depend on your product, volume and shipping mode — most orders land 4–10 weeks after sample approval.",
  },
  {
    q: "How much will everything cost?",
    a: "You pay a one-time sourcing fee (£150–£300 depending on package), our 5% commission on goods value, plus the actual cost of the products and freight. No hidden margins — you see every quote we receive.",
  },
  {
    q: "How will we communicate during the process?",
    a: "WhatsApp or email — your choice. You'll have direct contact with your consultant throughout the brief. Major milestones get a written update with photos or video where relevant.",
  },
  {
    q: "Do you handle shipping and customs clearance?",
    a: "Yes. We coordinate sea or air freight with our forwarding partners, prepare commercial paperwork, and connect you with a UK customs broker for duties and VAT.",
  },
  {
    q: "How long does shipping take?",
    a: "Air freight typically 5–10 days from despatch. Sea freight 25–40 days depending on origin port and consolidation schedule. We confirm exact ETAs once your booking is locked.",
  },
  {
    q: "Is the sourcing fee refundable?",
    a: "If we can't find suppliers that meet your brief within 14 days, the fee is fully refunded. Otherwise it's non-refundable once supplier work begins, since the time has already been invested on your behalf.",
  },
  {
    q: "Do you work with verified suppliers only?",
    a: "Always. Every factory in our network has been audited for business registration, production capability, and export track record. New suppliers go through a vetting cycle before they're recommended.",
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-[var(--color-cream)] border-[var(--color-ochre)]/40 shadow-[0_12px_28px_-16px_rgba(184,84,42,0.18)]"
          : "bg-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-ink)]/25"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-5 px-5 lg:px-6 py-5 text-left"
      >
        <span className="text-[15px] lg:text-base font-medium text-[var(--color-ink)] pr-2">
          {q}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full grid place-items-center transition-all duration-300 ${
            isOpen
              ? "bg-[var(--color-ochre)] text-[var(--color-cream)] rotate-45"
              : "border border-[var(--color-ink)]/20 text-[var(--color-ink)]"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 lg:px-6 pb-5 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
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
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Centered header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-5">
            FAQ
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em]">
            Frequently asked{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              questions
            </span>
            .
          </h2>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mt-8 max-w-xl mx-auto">
            Anything we haven't covered? Drop us a line and we'll answer within
            one working day.
          </p>
        </div>

        {/* FAQ list */}
        <div className="max-w-3xl mx-auto space-y-3">
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

        {/* Bottom CTA strip */}
        <div className="max-w-3xl mx-auto mt-12 pt-10 border-t border-[var(--color-line)] text-center">
          <p className="text-[var(--color-ink-soft)] text-sm mb-4">
            Still have questions?
          </p>
          <a
            href="/start-brief"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
          >
            Talk to a consultant
          </a>
        </div>
      </div>
    </section>
  );
}