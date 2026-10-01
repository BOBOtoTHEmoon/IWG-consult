import Link from "next/link";
import { categories } from "@/lib/data";
import { site } from "@/lib/site";
import { InstagramIcon, LinkedinIcon, MailIcon, WhatsappIcon } from "../Icons";
import Logo from "./Logo";

const shopLinks = [["All products", "/shop"], ...categories.map((c) => [c.name, `/shop?category=${c.slug}`])];
const helpLinks = [
  ["Delivery", "/delivery"],
  ["Returns", "/returns"],
  ["FAQs", "/faqs"],
  ["Contact us", "/contact"],
];
const companyLinks = [
  ["About Goody", "/about"],
  ["Sourcing services", "/sourcing"],
  ["Privacy policy", "/privacy"],
  ["Terms", "/terms"],
];

function Column({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <span className="font-semibold text-cream">{title}</span>
      {links.map(([label, href]) => (
        <Link key={label} href={href} className="text-[#d9cfc0] hover:text-cream">
          {label}
        </Link>
      ))}
    </div>
  );
}
  

export default function Footer() {
  const socials = [
    { label: "Instagram", href: site.instagramLink, icon: InstagramIcon },
    { label: "LinkedIn", href: site.linkedinLink, icon: LinkedinIcon },
    { label: "WhatsApp", href: site.whatsappLink, icon: WhatsappIcon },
    { label: "Email", href: `mailto:${site.email}`, icon: MailIcon },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-[#d9cfc0]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 pb-24 pt-10 sm:gap-12 sm:px-10 sm:pb-10 sm:pt-14 lg:px-20 lg:pt-[72px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-12">
          {/* Brand, contact and socials */}
          <div className="flex max-w-[380px] flex-col gap-4 sm:gap-5">
            <Logo light />
            <p className="text-sm leading-relaxed sm:text-[15px]">
              Hand-picked goods from China, sold and shipped from the UK. Custom sourcing on request.
            </p>
            {/* Contact lines show from tablet up; on phones the round buttons cover them. */}
            <div className="hidden flex-col gap-2.5 text-[15px] sm:flex">
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 text-[#d9cfc0] hover:text-cream">
                <MailIcon size={18} />
                {site.email}
              </a>
              {site.whatsappLink && (
                <a
                  href={site.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-[#d9cfc0] hover:text-cream"
                >
                  <WhatsappIcon size={18} />
                  {site.whatsappDisplay}
                </a>
              )}
            </div>
            <div className="flex gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3a342c] text-[#d9cfc0] transition-colors hover:border-cream hover:text-cream"
                >
                  <Icon size={19} />
                </a>
              ))}
            </div>
          </div>

          {/* Links. On phones, Help and Company stack in the right-hand column. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm sm:grid-cols-3 sm:gap-y-10 sm:text-[15px] lg:gap-x-20">
            <Column title="Shop" links={shopLinks} />
            <div className="flex flex-col gap-6 sm:contents">
              <Column title="Help" links={helpLinks} />
              <Column title="Company" links={companyLinks} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#3a342c] pt-5 text-[10px] sm:pt-6">
          <span>
            © {new Date().getFullYear()} {site.legalName}
          </span>
          <span>Payments secured by PayPal</span>
        </div>
      </div>
    </footer>
  );
}