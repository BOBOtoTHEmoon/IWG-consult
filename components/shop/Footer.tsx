import Link from "next/link";

const cols = [
  {
    title: "Shop",
    links: [
      ["All products", "/shop"],
      ["Homeware", "/shop?category=homeware"],
      ["Fashion", "/shop?category=fashion"],
      ["Baby", "/shop?category=baby"],
      ["Gifts", "/shop?category=gifts"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Delivery", "#"],
      ["Returns", "#"],
      ["FAQs", "#"],
      ["Contact", "#"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About Goody", "#"],
      ["Sourcing services", "/sourcing"],
      ["Privacy", "#"],
      ["Terms", "#"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-[#d9cfc0]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-5 pb-10 pt-16 sm:px-10 lg:px-20 lg:pt-[72px]">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex max-w-[360px] flex-col gap-3.5">
            <span className="font-display text-[26px] text-cream">Import with Goody</span>
            <span className="text-[15px] leading-relaxed">
              Hand-picked goods from China, sold and shipped from the UK.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-10 text-[15px] sm:grid-cols-3 lg:gap-24">
            {cols.map((c) => (
              <div key={c.title} className="flex flex-col gap-3">
                <span className="font-semibold text-cream">{c.title}</span>
                {c.links.map(([label, href]) => (
                  <Link key={label} href={href} className="text-[#d9cfc0] hover:text-cream">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-[#3a342c] pt-6 text-[13px] sm:flex-row">
          <span>© {new Date().getFullYear()} Import with Goody</span>
          <span>Payments secured by PayPal</span>
        </div>
      </div>
    </footer>
  );
}
