import Link from "next/link";
import ContactForm from "@/components/shop/ContactForm";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact us | Import with Goody",
  description: "Get in touch about an order, a return or a sourcing request.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-10 sm:px-10 lg:px-20 lg:pt-16">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        <div className="flex flex-col gap-6 lg:w-[420px] lg:shrink-0">
          <h1 className="font-display text-[40px] leading-[1.08] tracking-[-0.015em] sm:text-[56px]">Get in touch</h1>
          <p className="text-lg leading-relaxed text-muted">
            Questions about an order, a return or something you&apos;d like sourced? We reply {site.replyTime}.
          </p>
          <div className="flex flex-col gap-4 border-t border-line pt-6 text-base">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-subtle">Email</span>
              <a href={`mailto:${site.email}`} className="text-ink underline underline-offset-4">{site.email}</a>
            </div>
            {site.whatsappLink && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-subtle">WhatsApp</span>
                <a href={site.whatsappLink} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-4">
                  {site.whatsappDisplay}
                </a>
              </div>
            )}
            {site.instagramLink && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-subtle">Instagram</span>
                <a href={site.instagramLink} target="_blank" rel="noreferrer" className="text-ink underline underline-offset-4">
                  Message us on Instagram
                </a>
              </div>
            )}
          </div>
          <p className="text-[15px] leading-relaxed text-muted">
            Quick answers about delivery, returns and sourcing are on our <Link href="/faqs">FAQs page</Link>.
          </p>
        </div>
        <div className="flex-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}