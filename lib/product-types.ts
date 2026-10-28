// Shared product types and helpers. Safe to use in both server and client code.
import { toPaymentMethods, type PaymentMethod } from "@/lib/payment-methods";

export type ProductStatus = "draft" | "live";

// One choice of a product, e.g. the black version of a wig. Each has its own stock.
// With two option types (e.g. Size and Colour), each choice is one combination:
// name "Large / Black" and values ["Large", "Black"].
export type ProductOption = {
  name: string;
  values?: string[];
  hex?: string;
  stock: number;
  price?: number;
  image?: string;
  imageUrl?: string;
};
export const OPTION_LABELS = ["Colour", "Size", "Length", "Style"] as const;

// "Colour" -> "colours", "Length" -> "lengths"
export const optionPlural = (label: string, count: number) =>
  `${count} ${label.toLowerCase()}${count === 1 ? "" : "s"}`;

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  weightGrams: number | null;
  status: ProductStatus;
  tag: string | null;
  tint: string;
  optionLabel: string; // "Colour", "Size", "Length" or "Style"
  optionLabel2: string | null; // the second option type, when there are two
  options: ProductOption[]; // empty when the product has no options
  freeShipping: boolean;
  shippingMethodIds: string[]; // empty = every delivery option
  paymentMethods: PaymentMethod[]; // how customers can pay for it at checkout
  imagePaths: string[]; // paths inside the product-images bucket
  images: string[]; // public URLs for those paths
  createdAt: string;
  sold: number; // units sold, only filled in when it's shown in the shop
  bestSeller: boolean;
};

// Shape of a row in the products table.
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  weight_grams: number | null;
  status: ProductStatus;
  tag: string | null;
  tint: string;
  option_label: string | null;
  option_label_2: string | null;
  options: { name: string; values?: string[]; hex?: string; stock?: number; price?: number | string | null; image?: string }[] | null;
  free_shipping: boolean | null;
  shipping_method_ids: string[] | null;
  payment_methods: string[] | null;
  images: string[] | null;
  created_at: string;
};

export const PRODUCT_COLUMNS =
  "id, slug, name, description, price, stock, category, weight_grams, status, tag, tint, option_label, option_label_2, options, free_shipping, shipping_method_ids, payment_methods, images, created_at";
export const productImageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;

export function toProduct(row: ProductRow): ShopProduct {
  const imagePaths = row.images ?? [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    stock: row.stock,
    category: row.category,
    weightGrams: row.weight_grams,
    status: row.status,
    tag: row.tag,
    tint: row.tint,
    optionLabel: row.option_label || "Colour",
    optionLabel2: row.option_label_2 || null,
    // Older rows may have options without stock; treat those as sharing the product's stock.
    options: (row.options ?? []).map((o) => ({
      name: o.name,
      values: Array.isArray(o.values) && o.values.length === 2 ? o.values.map(String) : undefined,
      hex: o.hex,
      stock: o.stock ?? row.stock,
      price: o.price != null && o.price !== "" && Number.isFinite(Number(o.price)) ? Number(o.price) : undefined,
      image: o.image,
      imageUrl: o.image ? productImageUrl(o.image) : undefined,
    })),
    freeShipping: row.free_shipping ?? false,
    shippingMethodIds: row.shipping_method_ids ?? [],
    paymentMethods: toPaymentMethods(row.payment_methods),
    imagePaths,
    images: imagePaths.map(productImageUrl),
    createdAt: row.created_at,
    sold: 0,
    bestSeller: false,
  };
}

// Two option types (e.g. Size and Colour), each with its own list of choices.
export function optionGroups(p: Pick<ShopProduct, "optionLabel" | "optionLabel2" | "options">): { label: string; values: string[] }[] {
  if (p.optionLabel2 && p.options.length > 0 && p.options.every((o) => o.values?.length === 2)) {
    const unique = (i: number) => [...new Set(p.options.map((o) => o.values![i]))];
    return [
      { label: p.optionLabel, values: unique(0) },
      { label: p.optionLabel2, values: unique(1) },
    ];
  }
  return [{ label: p.optionLabel, values: p.options.map((o) => o.name) }];
}

// "Colour", or "Size / Colour" when there are two option types.
export const variantLabelOf = (p: Pick<ShopProduct, "optionLabel" | "optionLabel2">) =>
  p.optionLabel2 ? `${p.optionLabel} / ${p.optionLabel2}` : p.optionLabel;

// What a customer pays for one option. An option with no price of its own uses the product price.
export const optionPrice = (product: { price: number }, option?: { price?: number } | null) =>
  option?.price ?? product.price;

// Lowest and highest price across a product's options (just the product price when it has none).
export function priceRange(product: { price: number; options: { price?: number }[] }) {
  const prices = product.options.length ? product.options.map((o) => o.price ?? product.price) : [product.price];
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

// "Stoneware Breakfast Set!" -> "stoneware-breakfast-set"
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "product";

export const LOW_STOCK = 3;

// ---------- Shop filters ----------

export type SortOption = "newest" | "price-asc" | "price-desc";
export type PriceRange = "under-15" | "15-30" | "30-50" | "over-50";

export const PRICE_RANGES: { value: PriceRange; label: string; min?: number; max?: number }[] = [
  { value: "under-15", label: "Under £15", max: 15 },
  { value: "15-30", label: "£15 to £30", min: 15, max: 30 },
  { value: "30-50", label: "£30 to £50", min: 30, max: 50 },
  { value: "over-50", label: "Over £50", min: 50 },
];