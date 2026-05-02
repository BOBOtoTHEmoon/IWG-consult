import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Pricing — Import with Goody",
};

const tiers = [
  {
    name: "Souvenirs & Co",
    fee: "£150",
    tag: "Events & gifting",
    blurb: "Custom & non-custom souvenirs, weddings, corporate gifting.",
    features: [
      "Bulk order management",
      "Logo coordination",
      "Price negotiation",
      "Shipping coordination",
    ],
  },
  {
    name: "Expecting Mum",
    fee: "£180",
    tag: "New parents",
    blurb: "Verified, safety-first baby gear at factory prices.",
    features: [
      "Cribs, strollers, feeding, toys",
      "Safety-vetted suppliers",
      "Sample coordination",
      "UK shipping & customs",
    ],
  },
  {
    name: "Wardrobe Package",
    fee: "£150",
    tag: "Personal style",
    blurb: "Unique pieces sourced direct — clothes, shoes, bags, accessories.",
    features: [
      "Direct-from-supplier sourcing",
      "Pieces in your exact size & taste",
      "Quality verified before shipping",
      "Discreet packaging & delivery",
    ],
  },
  {
    name: "Sourcing for Business",
    fee: "£250",
    tag: "Importers & brands",
    blurb: "End-to-end factory sourcing for entrepreneurs scaling imports.",
    features: [
      "Supplier sourcing & negotiation",
      "MOQ & sample handling",
      "Production follow-up",
      "Air or sea freight",
    ],
  },
  {
    name: "Home & Décor",
    fee: "£300",
    tag: "Homeowners & hosts",
    blurb: "Furniture, lighting, appliances for homes, Airbnbs, brands.",
    features: [
      "Furniture, lighting, décor",
      "Material confirmation",
      "Export packaging",
      "Consolidation & delivery",
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-40 lg:pt-48 pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-5">
              Pricing
            </p>
            <h1 className="text-5xl lg:text-8xl leading-[0.95] tracking-[-0.03em] max-w-4xl">
              Transparent fees.
              <br />
              <span className="text-[var(--color-ochre)] font-medium">
                No hidden margins.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-[var(--color-ink-soft)] text-lg leading-relaxed">
              One sourcing fee per brief, plus 5% commission on goods value.
              You see every supplier quote we receive — no markup, no surprises.
            </p>
          </div>
        </section>

        <section className="pb-20 lg:pb-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl p-7 flex flex-col bg-[var(--color-paper)] border border-[var(--color-line)]"
                >
                  <p className="text-[10px] tracking-[0.18em] uppercase mb-3 text-[var(--color-stone)]">
                    {t.tag}
                  </p>
                  <h3 className="text-2xl tracking-[-0.02em] mb-2">{t.name}</h3>
                  <p className="text-sm leading-relaxed mb-6 text-[var(--color-ink-soft)]">
                    {t.blurb}
                  </p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="number-display text-5xl">{t.fee}</span>
                    <span className="text-xs text-[var(--color-stone)]">
                      + 5%
                    </span>
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {t.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-[var(--color-ink-soft)]"
                      >
                        <Check className="w-4 h-4 mt-0.5 text-[var(--color-ochre)] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/start-brief"
                    className="mt-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full text-sm transition-colors duration-300 bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-ochre)]"
                  >
                    Get started
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-[var(--color-cream-dark)] rounded-2xl p-7 lg:p-10 grid lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8">
                <h3 className="text-2xl lg:text-3xl tracking-[-0.02em] mb-2">
                  Need something custom?
                </h3>
                <p className="text-[var(--color-ink-soft)] text-sm leading-relaxed">
                  Large or recurring orders, multi-category briefs, or ongoing
                  retainers — we'll quote a tailored arrangement.
                </p>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <Link
                  href="/start-brief"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm hover:bg-[var(--color-ochre)] transition-colors"
                >
                  Talk to a consultant
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}