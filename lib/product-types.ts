// Shared product types and helpers. Safe to use in both server and client code.

export type ProductStatus = "draft" | "live";

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
  colours: { name: string; hex: string }[];
  imagePaths: string[]; // paths inside the product-images bucket
  images: string[]; // public URLs for those paths
  createdAt: string;
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
  colours: { name: string; hex: string }[] | null;
  images: string[] | null;
  created_at: string;
};

export const PRODUCT_COLUMNS =
  "id, slug, name, description, price, stock, category, weight_grams, status, tag, tint, colours, images, created_at";

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
    colours: row.colours ?? [],
    imagePaths,
    images: imagePaths.map(productImageUrl),
    createdAt: row.created_at,
  };
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