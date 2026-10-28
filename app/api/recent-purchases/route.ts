import { NextResponse } from "next/server";
import { productImageUrl } from "@/lib/product-types";
import { getBadgeSettings } from "@/lib/shop-signals";
import { createAdminClient } from "@/lib/supabase/admin";

// Real purchases from the last 7 days for the "Someone in London bought this" pop-ups.
// Only the town (and country, outside the UK) is shared. Never names, emails or addresses.
export const revalidate = 60;

const DAYS = 7;
const tidy = (s: string | null) =>
  (s ?? "")
    .trim()
    .slice(0, 40)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export async function GET() {
  const settings = await getBadgeSettings();
  if (!settings.showRecentPurchases) return NextResponse.json({ items: [] });

  const supabase = createAdminClient();
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, city, country, created_at")
    .neq("status", "cancelled")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error || !orders?.length) return NextResponse.json({ items: [] });

  const { data: lines } = await supabase
    .from("order_items")
    .select("order_id, name, product_slug, image_path")
    .in("order_id", orders.map((o) => o.id));

  // Only point people at products that are still on sale.
  const slugs = [...new Set((lines ?? []).map((l) => l.product_slug).filter(Boolean))];
  const { data: live } = slugs.length
    ? await supabase.from("products").select("slug").eq("status", "live").in("slug", slugs)
    : { data: [] as { slug: string }[] };
  const liveSlugs = new Set((live ?? []).map((p) => p.slug));

  const items = orders
    .map((o) => {
      const line = (lines ?? []).find((l) => l.order_id === o.id && liveSlugs.has(l.product_slug));
      if (!line) return null;
      const city = tidy(o.city);
      const country = tidy(o.country);
      const place = city && country && country !== "United Kingdom" ? `${city}, ${country}` : city || country;
      if (!place) return null;
      return {
        key: `${line.product_slug}-${o.created_at}`,
        name: line.name,
        slug: line.product_slug,
        image: line.image_path ? productImageUrl(line.image_path) : null,
        place,
        at: o.created_at,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items });
}