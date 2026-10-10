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

