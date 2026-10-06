import { createPublicClient } from "@/lib/supabase/public";
import { METHOD_COLUMNS, ZONE_COLUMNS, toMethod, toZone, type ShippingMethod, type ShippingZone } from "@/lib/shipping-types";

// Every zone and option, including switched-off ones (for the admin and product form).
export async function getShippingSetup(): Promise<{ zones: ShippingZone[]; methods: ShippingMethod[] }> {
  const supabase = createPublicClient();
  const [z, m] = await Promise.all([
    supabase.from("shipping_zones").select(ZONE_COLUMNS).order("sort_order"),
    supabase.from("shipping_methods").select(METHOD_COLUMNS).order("sort_order"),
  ]);
  if (z.error) console.error("shipping zones:", z.error.message);
  if (m.error) console.error("shipping methods:", m.error.message);
  return { zones: (z.data ?? []).map(toZone), methods: (m.data ?? []).map(toMethod) };
}