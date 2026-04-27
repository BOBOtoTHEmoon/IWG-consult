"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Baby, Building2, Sofa, Gift, Check } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "business",
    icon: Building2,
    name: "Sourcing for Business",
    tag: "Importers & brands",
    image:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=900&fit=crop&q=85",
    description:
      "End-to-end supplier discovery, negotiation, and freight management for entrepreneurs scaling their imports.",
    features: [
      "Supplier sourcing & price negotiation",
      "MOQ clarification + samples",
      "Production follow-up",
      "Air or sea freight coordination",
    ],
    fee: "£250",
    commission: "5%",
    href: "/start-brief",
    featured: true,
  },
  {
    id: "home",
    icon: Sofa,
    name: "Home, Décor & Appliances",
    tag: "Homeowners & hosts",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=900&fit=crop&q=85",
    description:
      "Furniture, lighting and appliances for homeowners, Airbnb hosts and interior brands sourced bulk-direct.",
    features: [
      "Furniture, lighting & décor sourcing",
      "Material & sample confirmation",
      "Export-ready packaging",
      "Consolidation & delivery",
    ],
    fee: "£300",
    commission: "5%",
    href: "/start-brief",
  },
  {
    id: "baby",
    icon: Baby,
    name: "Expecting Mum",
    tag: "New parents",
    image:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1200&h=900&fit=crop&q=85",
    description:
      "Quality, safety-first baby items at factory prices — sourced from manufacturers we've personally vetted.",
    features: [
      "Cribs, strollers, feeding & toys",
      "Verified, safety-focused suppliers",
      "Sample coordination",
      "UK shipping & customs guidance",
    ],
    fee: "£180",
    commission: "5%",
    href: "/start-brief",
  },
  {
    id: "souvenirs",
    icon: Gift,
    name: "Souvenirs & Gifting",
    tag: "Events & brands",
    image:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1200&h=900&fit=crop&q=85",
    description:
      "Custom and non-custom souvenirs for weddings, corporate gifting, and branded merchandise — at scale.",
    features: [
      "Custom & non-custom sourcing",
      "Logo & design coordination",
      "Bulk order management",
      "Shipping coordination",
    ],
    fee: "£150",
    commission: "5%",
    href: "/start-brief",
  },
];

export default function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId)!;

  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-[var(--color-paper)] border-y border-[var(--color-line)]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Centered header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-5">
            Procurement Packages
          </p>
          <h2 className="text-4xl lg:text-6xl leading-[1] tracking-[-0.025em]">
            Built for the way you actually{" "}
            <span className="text-[var(--color-ochre)] font-medium">
              import
            </span>
            .
          </h2>
          <p className="text-[var(--color-ink-soft)] text-base leading-relaxed mt-8 max-w-xl mx-auto">
            Four focused packages, transparent pricing, and a single point of
            contact from quote to doorstep.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-[var(--color-cream-dark)] border border-[var(--color-line)] overflow-x-auto max-w-full no-scrollbar">
            {services.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={`relative flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[12px] lg:text-[13px] tracking-wide whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--color-cream)]"
                      : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <s.icon className="w-3.5 h-3.5" />
                    {s.name.split(" ")[0]}
                    {s.featured && (
                      <span
                        className={`hidden lg:inline-block w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-[#f5d6a8]" : "bg-[var(--color-ochre)]"
                        }`}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showcase panel */}
        <div className="relative rounded-2xl overflow-hidden border border-[var(--color-line)] bg-[var(--color-cream)] shadow-[0_24px_60px_-30px_rgba(26,24,20,0.2)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid lg:grid-cols-[1.1fr_1fr]"
            >
              {/* Image */}
              <div className="relative h-[260px] lg:h-auto lg:min-h-[480px] overflow-hidden">
                <motion.img
                  key={active.image}
                  initial={{ scale: 1.08, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  src={active.image}
                  alt={active.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Top-left tag */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-cream)]/90 backdrop-blur-sm">
                  <active.icon className="w-3.5 h-3.5 text-[var(--color-ochre)]" />
                  <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-ink)] font-semibold">
                    {active.tag}
                  </span>
                </div>

                {/* Featured badge */}
                {active.featured && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-ochre)] text-[var(--color-cream)] text-[10px] tracking-[0.16em] uppercase font-semibold"
                  >
                    Most popular
                  </motion.div>
                )}
              </div>

              {/* Info */}
              <div className="p-7 lg:p-10 xl:p-12 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <h3 className="text-3xl lg:text-4xl xl:text-5xl tracking-[-0.025em] leading-[1.05] mb-4">
                    {active.name}
                  </h3>
                  <p className="text-[var(--color-ink-soft)] text-[15px] leading-relaxed mb-7 max-w-md">
                    {active.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8">
                    {active.features.map((f, i) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.25 + i * 0.06,
                        }}
                        className="flex items-start gap-2.5 text-[14px] text-[var(--color-ink-soft)]"
                      >
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-[var(--color-ochre)]/15 grid place-items-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-[var(--color-ochre)]" />
                        </span>
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Pricing footer */}
                <div className="mt-auto pt-6 border-t border-[var(--color-line)] flex flex-wrap items-end justify-between gap-4">
                  <div className="flex items-baseline gap-6">
                    <div>
                      <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mb-1">
                        Sourcing fee
                      </p>
                      <p className="number-display text-3xl text-[var(--color-ochre)]">
                        {active.fee}
                      </p>
                    </div>
                    <div className="border-l border-[var(--color-line)] pl-6">
                      <p className="text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mb-1">
                        Commission
                      </p>
                      <p className="number-display text-3xl text-[var(--color-ochre)]">
                        {active.commission}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={active.href}
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
                  >
                    Get started
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Helper note */}
        <p className="text-center text-xs text-[var(--color-stone)] mt-6">
          Click a package above to see the details
        </p>
      </div>
    </section>
  );
}