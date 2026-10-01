// Sample data used until Supabase is connected.
// Replace these with database queries in the backend phase.

export type Category = { slug: string; name: string; tint: string };

export type Product = {
  slug: string;
  name: string;
  category: string; // category slug
  price: number; // GBP
  tint: string; // placeholder colour until real photos are uploaded
  tag?: string;
  description?: string;
  colours?: { name: string; hex: string }[];
};

export type OrderStatus = "To pack" | "Packed" | "Shipped" | "Delivered";

export type Order = {
  id: string;
  customer: string;
  destination: string;
  items: number;
  total: number;
  status: OrderStatus;
  international?: boolean;
  tint: string;
};

export const categories: Category[] = [
  { slug: "homeware", name: "Homeware", tint: "#e6d3bf" },
  { slug: "fashion", name: "Fashion", tint: "#e9cfc6" },
  { slug: "baby", name: "Baby", tint: "#d8dfd0" },
  { slug: "gifts", name: "Souvenirs & gifts", tint: "#efdcb5" },
  { slug: "everyday", name: "Everyday goods", tint: "#ddd5c9" },
];

export const products: Product[] = [
  {
    slug: "stoneware-breakfast-set",
    name: "Stoneware breakfast set",
    category: "homeware",
    price: 38,
    tint: "#e6d3bf",
    tag: "New",
    description:
      "A four-piece reactive glaze set: two plates and two bowls with a soft speckled finish. Sturdy enough for every day, pretty enough to set out for guests.",
    colours: [
      { name: "Oat", hex: "#e2d4bd" },
      { name: "Clay", hex: "#b8542a" },
      { name: "Charcoal", hex: "#3b3733" },
    ],
  },
  { slug: "pleated-linen-midi-skirt", name: "Pleated linen midi skirt", category: "fashion", price: 29.5, tint: "#e9cfc6", tag: "New" },
  { slug: "muslin-swaddle-trio", name: "Muslin swaddle trio", category: "baby", price: 18, tint: "#d8dfd0" },
  { slug: "hand-painted-fan-set", name: "Hand-painted fan set", category: "gifts", price: 12, tint: "#efdcb5", tag: "Low stock" },
  { slug: "rattan-storage-basket", name: "Rattan storage basket", category: "homeware", price: 24, tint: "#ddd0bc" },
  { slug: "silk-hair-scarf", name: "Silk hair scarf", category: "fashion", price: 14, tint: "#e4c9c2" },
  { slug: "bamboo-baby-cutlery-set", name: "Bamboo baby cutlery set", category: "baby", price: 11.5, tint: "#d2dccd" },
  { slug: "porcelain-tea-cup-pair", name: "Porcelain tea cup pair", category: "homeware", price: 22, tint: "#e8dcc8", tag: "Gift idea" },
  { slug: "embroidered-canvas-tote", name: "Embroidered canvas tote", category: "everyday", price: 16, tint: "#ddd5c9" },
];

export const orders: Order[] = [
  { id: "IWG-1042", customer: "Amara O.", destination: "London, UK", items: 2, total: 62.5, status: "To pack", tint: "#e6d3bf" },
  { id: "IWG-1041", customer: "Chloe B.", destination: "Manchester, UK", items: 1, total: 38, status: "Packed", tint: "#e9cfc6" },
  { id: "IWG-1040", customer: "Tunde A.", destination: "Lagos, Nigeria", items: 3, total: 84, status: "Packed", international: true, tint: "#d8dfd0" },
  { id: "IWG-1039", customer: "Sarah K.", destination: "Dublin, Ireland", items: 1, total: 29.5, status: "Shipped", international: true, tint: "#efdcb5" },
  { id: "IWG-1038", customer: "James P.", destination: "Leeds, UK", items: 1, total: 18, status: "Delivered", tint: "#ddd5c9" },
];

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? slug;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const statusTone: Record<OrderStatus, string> = {
  "To pack": "bg-[#f6ddd0] text-clay-dark",
  Packed: "bg-[#f1e6c8] text-[#6e5316]",
  Shipped: "bg-jade-soft text-jade",
  Delivered: "bg-[#e6e1d9] text-muted",
};
// ---------- Sourcing requests (sample data until Supabase is connected) ----------

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
// ---------- Order details (sample data until Supabase is connected) ----------

export type OrderLine = { slug: string; name: string; variant?: string; qty: number; price: number; tint: string };

export type OrderDetail = {
  placed: string;
  email: string;
  phone?: string;
  address: string[];
  shippingMethod: string;
  shippingPrice: number;
  tracking?: string;
  lines: OrderLine[];
};

export const orderDetails: Record<string, OrderDetail> = {
  "IWG-1042": {
    placed: "30 September, 10:14",
    email: "amara@example.com",
    phone: "+44 7700 900111",
    address: ["Amara Obi", "12 Elm Road", "London", "E8 1AB", "United Kingdom"],
    shippingMethod: "UK Standard, Royal Mail",
    shippingPrice: 2.5,
    lines: [
      { slug: "stoneware-breakfast-set", name: "Stoneware breakfast set", variant: "Oat", qty: 1, price: 38, tint: "#e6d3bf" },
      { slug: "porcelain-tea-cup-pair", name: "Porcelain tea cup pair", qty: 1, price: 22, tint: "#e8dcc8" },
    ],
  },
  "IWG-1041": {
    placed: "29 September, 18:02",
    email: "chloe@example.com",
    address: ["Chloe Brown", "4 Canal Street", "Manchester", "M1 3HE", "United Kingdom"],
    shippingMethod: "UK Tracked, Royal Mail",
    shippingPrice: 0,
    lines: [{ slug: "stoneware-breakfast-set", name: "Stoneware breakfast set", variant: "Clay", qty: 1, price: 38, tint: "#e6d3bf" }],
  },
  "IWG-1040": {
    placed: "29 September, 09:40",
    email: "tunde@example.com",
    phone: "+234 800 000 0000",
    address: ["Tunde Adebayo", "7 Admiralty Way", "Lekki", "Lagos", "Nigeria"],
    shippingMethod: "International, Royal Mail",
    shippingPrice: 22,
    lines: [
      { slug: "muslin-swaddle-trio", name: "Muslin swaddle trio", qty: 2, price: 18, tint: "#d8dfd0" },
      { slug: "hand-painted-fan-set", name: "Hand-painted fan set", qty: 1, price: 12, tint: "#efdcb5" },
      { slug: "silk-hair-scarf", name: "Silk hair scarf", qty: 1, price: 14, tint: "#e4c9c2" },
    ],
  },
  "IWG-1039": {
    placed: "27 September, 14:25",
    email: "sarah@example.com",
    address: ["Sarah Kelly", "22 Harbour View", "Dublin", "D02 X285", "Ireland"],
    shippingMethod: "International, Royal Mail",
    shippingPrice: 0,
    tracking: "LX123456789GB",
    lines: [{ slug: "pleated-linen-midi-skirt", name: "Pleated linen midi skirt", variant: "Size 12, sand", qty: 1, price: 29.5, tint: "#e9cfc6" }],
  },
  "IWG-1038": {
    placed: "25 September, 11:08",
    email: "james@example.com",
    address: ["James Parker", "9 Park Lane", "Leeds", "LS1 4AB", "United Kingdom"],
    shippingMethod: "UK Standard, Royal Mail",
    shippingPrice: 0,
    tracking: "RB987654321GB",
    lines: [{ slug: "muslin-swaddle-trio", name: "Muslin swaddle trio", qty: 1, price: 18, tint: "#d8dfd0" }],
  },
};

export const getOrder = (id: string) => {
  const order = orders.find((o) => o.id === id);
  const detail = orderDetails[id];
  return order && detail ? { ...order, ...detail } : undefined;
};

export type FullOrder = NonNullable<ReturnType<typeof getOrder>>;

// Sample stock until products come from Supabase.
export const sampleStock: Record<string, number> = {
  "stoneware-breakfast-set": 8,
  "pleated-linen-midi-skirt": 4,
  "muslin-swaddle-trio": 15,
  "hand-painted-fan-set": 2,
  "rattan-storage-basket": 12,
  "silk-hair-scarf": 1,
  "bamboo-baby-cutlery-set": 20,
  "porcelain-tea-cup-pair": 6,
  "embroidered-canvas-tote": 0,
};

export const royalMailTrackingUrl = (code: string) =>
  `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(code)}`;