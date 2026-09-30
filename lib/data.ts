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
