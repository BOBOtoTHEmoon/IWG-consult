import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import Link from "next/link";
import {
  Baby,
  Building2,
  Sofa,
  Gift,
  Shirt,
  ArrowUpRight,
  Check,
  ClipboardList,
  Search,
  Truck,
} from "lucide-react";

export const metadata = {
  title: "Services — Import with Goody",
};

const services = [
  {
    id: "expecting",
    icon: Baby,
    name: "Expecting Mum Package",
    tag: "For new parents",
    image: "/services/expecting.jpg",
    tagline: "Ideal for parents who want safe, quality baby items at factory prices.",
    fee: "£180",
    commission: "5%",
    steps: [
      {
        icon: ClipboardList,
        title: "How to get started",
        body:
          "Complete the intake form and select the Expecting Mums Package. List the baby products you want — cribs, strollers, feeding items, clothing, toys — and upload reference images if available. If you're unsure, we offer limited curated product suggestions. Sourcing begins once the form is submitted and the fee is paid.",
      },
      {
        icon: Search,
        title: "Supplier sourcing & verification",
        body:
          "Factories are verified for safety, quality and export readiness. Pricing, production timelines and order details are confirmed before product options are shared. You review the options, approve your selection, then pay for the products plus the service fee.",
      },
      {
        icon: Truck,
        title: "Shipping & delivery",
        body:
          "Packaging and shipping are coordinated according to your location and timeline, with air or sea options available. Your items are delivered directly to your doorstep.",
      },
    ],
  },
  {
    id: "business",
    icon: Building2,
    name: "Sourcing & Shipping for Business",
    tag: "For importers & brands",
    image: "/services/business.jpg",
    tagline: "Best for first-time importers and growing brands.",
    fee: "£250",
    commission: "5%",
    featured: true,
    steps: [
      {
        icon: ClipboardList,
        title: "How to get started",
        body:
          "Complete the intake form and select the Business Sourcing & Shipping package. Provide product details — quantity, target price range, reference images or links. Curated product suggestions are available if needed. Sourcing begins once the form is submitted and the fee is paid.",
      },
      {
        icon: Search,
        title: "Supplier sourcing & verification",
        body:
          "We identify and verify reliable manufacturers, confirm minimum order quantities, and clarify production timelines. Prices and order conditions are negotiated directly with factories. You receive clear product options by email to review and approve before moving forward.",
      },
      {
        icon: Check,
        title: "Order confirmation & production",
        body:
          "After approval, you pay for the products plus the service fee. Production begins with structured weekly communication to ensure clarity and accountability throughout.",
      },
      {
        icon: Truck,
        title: "Shipping & delivery",
        body:
          "Packaging, labeling and shipping are coordinated. Air and sea freight options are available depending on your timeline and budget. Goods are delivered directly to your preferred location.",
      },
    ],
  },
  {
    id: "home",
    icon: Sofa,
    name: "Home Furnishings, Appliances & Décor",
    tag: "For homeowners & hosts",
    image: "/services/home.jpg",
    tagline: "Perfect for home projects and bulk imports.",
    fee: "£300",
    commission: "5%",
    steps: [
      {
        icon: ClipboardList,
        title: "How to get started",
        body:
          "Complete the intake form and select the Home Furnishings, Appliances & Décor package. Share details of items you want to source — quantities, reference images, special requirements. Curated product suggestions are available if needed. Sourcing begins once the form is submitted and the fee is paid.",
      },
      {
        icon: Search,
        title: "Supplier sourcing & verification",
        body:
          "We identify and verify reliable manufacturers, confirm materials, production timelines and order conditions. Product options are selected based on quality, design and export readiness. You receive clear options with prices and timelines to review and approve.",
      },
      {
        icon: Check,
        title: "Order confirmation & production",
        body:
          "After approval, you pay for the products plus the service fee. Production begins with structured communication to ensure accuracy and accountability.",
      },
      {
        icon: Truck,
        title: "Shipping & delivery",
        body:
          "Packaging and freight are coordinated based on your timeline and location, with air and sea options available. Items arrive directly at your address.",
      },
    ],
  },
  {
    id: "souvenirs",
    icon: Gift,
    name: "Souvenirs & Co",
    tag: "For events & gifting",
    image: "/services/souvenirs.jpg",
    tagline: "Ideal for weddings, corporate gifts & special events.",
    fee: "£150",
    commission: "5%",
    steps: [
      {
        icon: ClipboardList,
        title: "How it works",
        body:
          "Complete the intake form and select the Souvenirs & Co package. Provide item details, quantities, reference images, and any design or logo requirements. Curated product suggestions are available if needed. Sourcing begins once the form is submitted and the fee is paid.",
      },
      {
        icon: Search,
        title: "Supplier verification & options",
        body:
          "Suppliers are carefully verified for quality, production capability and export readiness. Pricing, timelines and order conditions are confirmed before options are shared. You receive product choices with costs and delivery timelines to review and approve.",
      },
      {
        icon: Truck,
        title: "Production & delivery",
        body:
          "After approval, you pay for the selected items plus the service fee. Packaging, labeling and shipping are coordinated, with air or sea options available depending on your timeline. Items are delivered directly to your doorstep.",
      },
    ],
  },
  {
    id: "wardrobe",
    icon: Shirt,
    name: "Wardrobe Package",
    tag: "Personal style",
    image: "/services/wardrobe.jpg",
    tagline:
      "For individuals who want to upgrade their wardrobe — clothes, shoes, bags and accessories for personal use.",
    fee: "£200",
    commission: "5%",
    steps: [
      {
        icon: ClipboardList,
        title: "How to get started",
        body:
          "Complete the intake form and select the Wardrobe Package. Share what you're looking for — pieces you've seen, your sizes, style preferences, and budget. Reference images and links are very helpful here.",
      },
      {
        icon: Search,
        title: "Sourcing & verification",
        body:
          "We source unique pieces directly from suppliers — not from high street markups. Quality is verified before shipping. You receive options with photos and prices to review and approve.",
      },
      {
        icon: Truck,
        title: "Discreet packaging & delivery",
        body:
          "Items are packaged discreetly and shipped to your address with tracking. Air freight is the standard for personal wardrobe orders.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 lg:pt-40 pb-12 lg:pb-16">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold mb-4">
              Our Services
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl tracking-[-0.025em] leading-[1] max-w-4xl">
              Five packages.{" "}
              <span className="text-[var(--color-ochre)] font-medium">
                One promise
              </span>
              .
            </h1>
            <p className="mt-6 lg:mt-8 max-w-xl text-[var(--color-ink-soft)] text-base lg:text-lg leading-relaxed">
              Whatever you're sourcing — baby gear, business inventory, home
              furnishings, souvenirs, or your personal wardrobe — you get the
              same disciplined process and a single consultant from quote to
              delivery.
            </p>
          </div>
        </section>

        {/* Quick links */}
        <section className="pb-10 lg:pb-12">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap gap-2 pb-6 border-b border-[var(--color-line)]">
              {services.map((s) => (
                <Link
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] text-[12px] text-[var(--color-ink-soft)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] hover:border-[var(--color-ink)] transition-all duration-300"
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.name.split(" ")[0]}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Each service detail */}
        {services.map((s, idx) => (
          <section
            key={s.id}
            id={s.id}
            className={`scroll-mt-24 py-16 lg:py-24 ${
              idx % 2 === 0
                ? "bg-[var(--color-cream)]"
                : "bg-[var(--color-paper)] border-y border-[var(--color-line)]"
            }`}
          >
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
              {/* Header row */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-10 lg:mb-14">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-ochre)]/10 grid place-items-center">
                      <s.icon className="w-4 h-4 text-[var(--color-ochre)]" />
                    </div>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--color-stone)] font-semibold">
                      {s.tag}
                    </span>
                    {s.featured && (
                      <span className="text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-[var(--color-ochre)] text-[var(--color-cream)] font-semibold">
                        Most popular
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl tracking-[-0.025em] leading-[1.05] mb-4">
                    {s.name}
                  </h2>
                  <p className="text-[var(--color-ink-soft)] text-[15px] lg:text-base leading-relaxed italic max-w-xl">
                    {s.tagline}
                  </p>

                  {/* Pricing strip */}
                  <div className="mt-6 lg:mt-8 inline-flex items-baseline gap-5 lg:gap-6 p-4 lg:p-5 rounded-xl bg-[var(--color-cream-dark)] border border-[var(--color-line)]">
                    <div>
                      <p className="text-[9px] lg:text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mb-1">
                        Sourcing fee
                      </p>
                      <p className="number-display text-2xl lg:text-3xl text-[var(--color-ochre)]">
                        {s.fee}
                      </p>
                    </div>
                    <div className="border-l border-[var(--color-line)] pl-5 lg:pl-6">
                      <p className="text-[9px] lg:text-[10px] tracking-[0.16em] uppercase text-[var(--color-stone)] mb-1">
                        Commission
                      </p>
                      <p className="number-display text-2xl lg:text-3xl text-[var(--color-ochre)]">
                        {s.commission}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--color-cream-dark)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 mb-8 lg:mb-10">
                {s.steps.map((step, i) => (
                  <div
                    key={step.title}
                    className="bg-[var(--color-cream)] border border-[var(--color-line)] rounded-xl p-5 lg:p-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="number-display text-sm text-[var(--color-stone)]">
                        0{i + 1}
                      </span>
                      <step.icon className="w-3.5 h-3.5 text-[var(--color-ochre)]" />
                    </div>
                    <h3 className="font-display text-lg lg:text-xl tracking-[-0.015em] mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-[var(--color-ink-soft)] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/start-brief"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-sm tracking-wide hover:bg-[var(--color-ochre)] transition-colors duration-300"
              >
                Start brief for {s.name.split(" ")[0]}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </section>
        ))}

        <CTA />
      </main>
      <Footer />
    </>
  );
}