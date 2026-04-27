import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import Services from "@/components/Services";
import Process from "@/components/Process";

export const metadata = {
  title: "Services — IWG Consult",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-40 lg:pt-48 pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-5">
              Services
            </p>
            <h1 className="text-5xl lg:text-8xl leading-[0.95] tracking-[-0.03em] max-w-4xl">
              Four packages.
              <br />
              <span className="text-[var(--color-ochre)] font-medium">
                One promise
              </span>
              .
            </h1>
            <p className="mt-8 max-w-xl text-[var(--color-ink-soft)] text-lg leading-relaxed">
              Whatever you're sourcing — baby gear, business inventory, home
              furnishings, or branded gifts, you get the same disciplined
              process and a single consultant from quote to delivery.
            </p>
          </div>
        </section>
        <Services />
        <Process />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
