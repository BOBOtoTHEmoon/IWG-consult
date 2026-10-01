import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, toProduct, type ProductRow, type ShopProduct } from "@/lib/product-types";

// ---------- Shop (live products only) ----------

export async function getLiveProducts(opts: { category?: string; limit?: number } = {}): Promise<ShopProduct[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("status", "live")
    .order("created_at", { ascending: false });
  if (opts.category) query = query.eq("category", opts.category);
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