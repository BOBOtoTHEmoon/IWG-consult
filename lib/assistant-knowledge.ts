import "server-only";
import { gbp } from "@/lib/data";
import { categoryName } from "@/lib/data";
import { getLiveProducts } from "@/lib/products";
import { getShippingSetup } from "@/lib/shipping";
import { deliveryTime, kg } from "@/lib/shipping-types";
import { countryName } from "@/lib/countries";
import { site } from "@/lib/site";

// The pages the assistant reads, so its answers always match the live website.
const PAGES = [
  { path: "/about", title: "About" },
  { path: "/sourcing", title: "Sourcing service" },
  { path: "/delivery", title: "Delivery" },
  { path: "/returns", title: "Returns and refunds" },
  { path: "/faqs", title: "FAQs" },
  { path: "/contact", title: "Contact" },
  { path: "/terms", title: "Terms" },
];

const MAX_PAGE_CHARS = 7000;
const CACHE_MS = 10 * 60 * 1000; // re-read the website every 10 minutes

let cache: { text: string; at: number; origin: string } | null = null;

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&pound;/g, "£");

// Turns a page's HTML into readable text, keeping only the main content (no menu or footer).
function pageText(html: string) {
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  return decode(
    main
      .replace(/<(script|style|svg|noscript|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<(br|\/p|\/li|\/h[1-6]|\/tr|\/div|\/summary|\/dt|\/dd)[^>]*>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, MAX_PAGE_CHARS);
}

async function readPages(origin: string) {
  const parts = await Promise.all(
    PAGES.map(async (p) => {
      try {
        const res = await fetch(`${origin}${p.path}`, { headers: { "x-assistant-read": "1" }, cache: "no-store" });
        if (!res.ok) return "";
        return `### ${p.title} page (${p.path})\n${pageText(await res.text())}`;
      } catch {
        return "";
      }
    })
  );
  return parts.filter(Boolean).join("\n\n");
}

async function productsText() {
  const products = await getLiveProducts();
  if (products.length === 0) return "There are no products in the shop right now.";
  return products
    .map((p) => {
      const stock = p.options.length
        ? p.options.map((o) => `${o.name}: ${o.stock > 0 ? `${o.stock} in stock` : "sold out"}`).join(", ")
        : p.stock > 0
          ? `${p.stock} in stock`
          : "sold out";
      const desc = p.description ? ` Description: ${p.description.replace(/\s+/g, " ").slice(0, 280)}` : "";
      return `- ${p.name} | ${gbp(p.price)} | ${categoryName(p.category)} | ${p.options.length ? `${p.optionLabel} options: ` : ""}${stock}${
        p.freeShipping ? " | free delivery" : ""
      } | link: /product/${p.slug}.${desc}`;
    })
    .join("\n");
}

async function deliveryText() {
  const { zones, methods } = await getShippingSetup();
  const active = methods.filter((m) => m.active);
  const lines = zones
    .map((z) => {
      const zm = active.filter((m) => m.zoneId === z.id);
      if (zm.length === 0) return "";
      const where = z.restOfWorld ? "every other country" : z.countries.map(countryName).join(", ");
      const opts = zm
        .map((m) => {
          const price =
            m.pricing === "flat"
              ? m.price === 0
                ? "free"
                : gbp(m.price)
              : m.weightBands.map((b) => `up to ${kg(b.upTo)} ${gbp(b.price)}`).join(", ");
          return `  - ${m.name}: ${price}${m.freeOver != null ? `, free on orders over ${gbp(m.freeOver)}` : ""}${
            deliveryTime(m) ? `, usually ${deliveryTime(m)}` : ""
          }`;
        })
        .join("\n");
      return `${z.name} (${where}):\n${opts}`;
    })
    .filter(Boolean);
  return lines.length ? lines.join("\n") : "Delivery prices are shown at checkout.";
}

export async function getAssistantKnowledge(origin: string) {
  if (cache && cache.origin === origin && Date.now() - cache.at < CACHE_MS) return cache.text;

  const [pages, products, delivery] = await Promise.all([readPages(origin), productsText(), deliveryText()]);
  const contact = [
    site.email && `Email: ${site.email}`,
    site.whatsappDisplay && !site.whatsappDisplay.startsWith("[") && `WhatsApp: ${site.whatsappDisplay}`,
    `Website: ${site.url}`,
  ]
    .filter(Boolean)
    .join("\n");

  const text = `## Products in the shop right now
${products}

## Delivery options and prices (set by Goody, used at checkout)
${delivery}

## Contact details
${contact}

## Website pages
${pages}`;

  cache = { text, at: Date.now(), origin };
  return text;
}