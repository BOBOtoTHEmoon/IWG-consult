// Shared shop constants and helpers.
// Products, orders, homepage content and sign-ups now live in Supabase.

export type Category = { slug: string; name: string; tint: string };

// The shop's categories. Pictures, order and homepage visibility are set in the admin.
export const categories: Category[] = [
  { slug: "homeware", name: "Homeware", tint: "#e6d3bf" },
  { slug: "fashion", name: "Fashion", tint: "#e9cfc6" },
  { slug: "baby", name: "Baby", tint: "#d8dfd0" },
  { slug: "gifts", name: "Souvenirs & gifts", tint: "#efdcb5" },
  { slug: "everyday", name: "Everyday goods", tint: "#ddd5c9" },
];

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

// ---------- Sourcing requests (sample data until sourcing moves to Supabase) ----------

export type SourcingStatus = "New" | "Quote sent" | "Going ahead" | "Not proceeding";

export type SourcingItem = {
  name: string;
  qty: number;
  description: string;
  link?: string;
  hasPhoto?: boolean;
};

export type SourcingRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  submitted: string;
  status: SourcingStatus;
  budget?: number;
  deadline?: string;
  notes?: string;
  items: SourcingItem[];
  quote?: { productCost: number; shipping: number };
};

export const sourcingRequests: SourcingRequest[] = [
  {
    id: "SR-2031",
    name: "Funmi Adeyemi",
    email: "funmi@example.com",
    phone: "+44 7700 900123",
    country: "United Kingdom",
    submitted: "29 September",
    status: "New",
    budget: 600,
    deadline: "15 November",
    notes: "Furnishing a new flat. Warm, natural materials please.",
    items: [
      { name: "Wooden dining chairs", qty: 6, description: "Solid oak or similar, cream cushion, seat height around 45 cm", hasPhoto: true },
      { name: "Rattan pendant lights", qty: 3, description: "Around 40 cm wide, UK fitting", link: "https://example.com/pendant" },
    ],
  },
  {
    id: "SR-2030",
    name: "Daniel Okafor",
    email: "daniel@example.com",
    country: "United Kingdom",
    submitted: "27 September",
    status: "Quote sent",
    items: [
      { name: "Branded canvas tote bags", qty: 200, description: "Natural colour, my logo printed on one side", hasPhoto: true },
    ],
    quote: { productCost: 480, shipping: 120 },
  },
  {
    id: "SR-2029",
    name: "Aisha Musa",
    email: "aisha@example.com",
    phone: "+44 7700 900456",
    country: "United Kingdom",
    submitted: "24 September",
    status: "Going ahead",
    items: [
      { name: "Glass baby bottle set", qty: 10, description: "Anti-colic, 3 sizes, BPA free" },
      { name: "Muslin blankets", qty: 20, description: "Plain colours, 120 x 120 cm" },
    ],
    quote: { productCost: 210, shipping: 65 },
  },
  {
    id: "SR-2027",
    name: "Kemi Bello",
    email: "kemi@example.com",
    country: "Ireland",
    submitted: "20 September",
    status: "Not proceeding",
    items: [{ name: "Wedding souvenir fans", qty: 150, description: "Hand fans with names and date printed" }],
    quote: { productCost: 350, shipping: 90 },
  },
];

export const sourcingTone: Record<SourcingStatus, string> = {
  New: "bg-[#f6ddd0] text-clay-dark",
  "Quote sent": "bg-[#f1e6c8] text-[#6e5316]",
  "Going ahead": "bg-jade-soft text-jade",
  "Not proceeding": "bg-[#e6e1d9] text-muted",
};

export const getSourcingRequest = (id: string) => sourcingRequests.find((r) => r.id === id);

// Goody's pricing: 10% of the product cost from China.
export const serviceCharge = (productCost: number) => Math.round(productCost * 0.1 * 100) / 100;