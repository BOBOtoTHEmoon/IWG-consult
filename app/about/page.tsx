import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import Consultant from "@/components/Consultant";
import Stats from "@/components/Stats";

export const metadata = {
  title: "About — IWG Consult",
};

export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-40 lg:pt-48 pb-16 lg:pb-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[var(--color-stone)] mb-5">
              About
            </p>
            <h1 className="text-5xl lg:text-8xl leading-[0.95] tracking-[-0.03em] max-w-4xl">
              Built around one
              <br />
             <span className="text-[var(--color-ochre)] font-medium">
                idea
              </span> 
              : sourcing
              <br />
              should feel like trust.
            </h1>
            <div className="mt-12 grid lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[var(--color-ink-soft)] text-lg leading-relaxed">
                  IWG Consult started in 2018 as a side venture between a UK
                  importer and a freight specialist who were tired of watching
                  good clients get burned by faceless agents. Today we run
                  end-to-end sourcing for hundreds of clients — same principle,
                  same one-consultant-per-brief promise.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Stats />
        <Consultant />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
