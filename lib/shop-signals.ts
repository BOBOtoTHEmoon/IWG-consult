import "server-only";
import { cache } from "react";
import type { ShopProduct } from "@/lib/product-types";
import { createPublicClient } from "@/lib/supabase/public";

// Real sales signals for the shop: "23 sold", the Best seller badge and "Someone in London bought this".
// Everything here comes from real orders. Cancelled orders are not counted.

export type BadgeSettings = {
  showSoldCounts: boolean; // "23 sold" and the Best seller badge
  soldCountMin: number; // only show a count once a product has sold at least this many
  showRecentPurchases: boolean; // the "Someone in London bought this" pop-ups
};

export const BADGE_DEFAULTS: BadgeSettings = { showSoldCounts: true, soldCountMin: 10, showRecentPurchases: true };
const BEST_SELLERS = 3; // how many top products get the Best seller badge

export const getBadgeSettings = cache(async (): Promise<BadgeSettings> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("show_sold_counts, sold_count_min, show_recent_purchases")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("getBadgeSettings:", error.message);
    return BADGE_DEFAULTS;
  }
  return {
    showSoldCounts: data.show_sold_counts ?? BADGE_DEFAULTS.showSoldCounts,
    soldCountMin: Math.max(1, Number(data.sold_count_min ?? BADGE_DEFAULTS.soldCountMin)),
    showRecentPurchases: data.show_recent_purchases ?? BADGE_DEFAULTS.showRecentPurchases,
  };
});

// Units sold per product id.
const getSales = cache(async (): Promise<Map<string, number>> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("product_sales");
  if (error) {
    console.error("product_sales:", error.message);
    return new Map();
  }
  return new Map(((data ?? []) as { product_id: string; sold: number | string }[]).map((r) => [r.product_id, Number(r.sold)]));
});

// Adds the sold count and Best seller badge to products, following Goody's settings.
export async function withSalesSignals(products: ShopProduct[]): Promise<ShopProduct[]> {
  if (products.length === 0) return products;
  const [settings, sales] = await Promise.all([getBadgeSettings(), getSales()]);
  if (!settings.showSoldCounts) return products;

  const best = new Set(
    [...sales.entries()]
      .filter(([, n]) => n >= settings.soldCountMin)
      .sort((a, b) => b[1] - a[1])
      .slice(0, BEST_SELLERS)
      .map(([id]) => id)
  );
  return products.map((p) => {
    const sold = sales.get(p.id) ?? 0;
    return { ...p, sold: sold >= settings.soldCountMin ? sold : 0, bestSeller: best.has(p.id) };
  });
}