import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { PRICE_RANGES, PRODUCT_COLUMNS, toProduct, type ProductRow, type ShopProduct } from "@/lib/product-types";

// ---------- Shop (live products only) ----------
export type ProductQuery = {
  category?: string;
  limit?: number;
  search?: string;
  price?: string;
  inStock?: boolean;
  sort?: string;
};

export async function getLiveProducts(opts: ProductQuery = {}): Promise<ShopProduct[]> {
  const supabase = createPublicClient();
  let query = supabase.from("products").select(PRODUCT_COLUMNS).eq("status", "live");

  if (opts.category) query = query.eq("category", opts.category);
  if (opts.inStock) query = query.gt("stock", 0);

  const range = PRICE_RANGES.find((r) => r.value === opts.price);
  if (range?.min !== undefined) query = query.gte("price", range.min);
  if (range?.max !== undefined) query = query.lt("price", range.max);

  // Strip characters that have special meaning in the database filter.
  const term = (opts.search ?? "").replace(/[%,()*\\]/g, " ").trim();
  if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);

  if (opts.sort === "price-asc") query = query.order("price", { ascending: true });
  else if (opts.sort === "price-desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("getLiveProducts:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(toProduct);
}

export async function getLiveProduct(slug: string): Promise<ShopProduct | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  if (error) console.error("getLiveProduct:", error.message);
  return data ? toProduct(data as ProductRow) : null;
}

export async function getLiveProductById(id: string): Promise<ShopProduct | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("products").select(PRODUCT_COLUMNS).eq("id", id).eq("status", "live").maybeSingle();
  return data ? toProduct(data as ProductRow) : null;
}

// ---------- Admin (all products, needs a signed-in staff member) ----------

export async function getAllProducts(): Promise<ShopProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAllProducts:", error.message);
    return [];
  }
  return (data as ProductRow[]).map(toProduct);
}

export async function getProductForAdmin(slug: string): Promise<ShopProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).eq("slug", slug).maybeSingle();
  if (error) console.error("getProductForAdmin:", error.message);
  return data ? toProduct(data as ProductRow) : null;
}