import "server-only";
import { countryName } from "@/lib/countries";
import { METHOD_COLUMNS, ZONE_COLUMNS, quoteDelivery, toMethod, toZone, zoneForCountry } from "@/lib/shipping-types";
import { createAdminClient } from "@/lib/supabase/admin";

// What the browser sends. Prices are NOT trusted from the browser; they're looked up here.
export type CheckoutInput = {
  items: { productId: string; variant?: string; quantity: number }[];
  methodId: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address1: string;
    address2?: string;
    city: string;
    postcode?: string;
    country: string; // two-letter code
  };
  newsletter?: boolean;
};

export type ResolvedItem = {
  productId: string;
  slug: string;
  name: string;
  variant: string | null;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  imagePath: string | null;
};

export type ResolvedCheckout = {
  items: ResolvedItem[];
  customer: CheckoutInput["customer"] & { countryName: string };
  shippingMethod: { id: string; name: string };
  subtotal: number;
  shipping: number;
  total: number;
  newsletter: boolean;
};

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const pennies = (n: number) => Math.round(n * 100);
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Works out the real order from the database: live products, current prices, stock, and delivery.
export async function resolveCheckout(raw: unknown): Promise<{ ok: true; checkout: ResolvedCheckout } | { ok: false; error: string }> {
  const input = (raw ?? {}) as Partial<CheckoutInput>;
  const c = (input.customer ?? {}) as Partial<CheckoutInput["customer"]>;
  const customer = {
    email: clean(c.email, 254).toLowerCase(),
    firstName: clean(c.firstName, 80),
    lastName: clean(c.lastName, 80),
    phone: clean(c.phone, 40),
    address1: clean(c.address1, 200),
    address2: clean(c.address2, 200),
    city: clean(c.city, 100),
    postcode: clean(c.postcode, 20).toUpperCase(),
    country: clean(c.country, 2).toUpperCase(),
  };
  if (!EMAIL.test(customer.email)) return { ok: false, error: "Please enter a valid email address." };
  if (!customer.firstName || !customer.lastName || !customer.address1 || !customer.city || customer.country.length !== 2) {
    return { ok: false, error: "Please fill in your name and delivery address." };
  }
  if (customer.country === "GB" && !customer.postcode) return { ok: false, error: "Please add your postcode." };

  const wanted = (Array.isArray(input.items) ? input.items : [])
    .slice(0, 50)
    .map((i) => ({ productId: clean(i?.productId, 40), variant: clean(i?.variant, 60) || null, quantity: Math.floor(Number(i?.quantity)) }))
    .filter((i) => i.productId && i.quantity > 0 && i.quantity <= 1000);
  if (wanted.length === 0) return { ok: false, error: "Your basket is empty." };

  const supabase = createAdminClient();
  const [productsRes, zonesRes, methodsRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, slug, name, price, stock, status, images, options, option_label, weight_grams, free_shipping, shipping_method_ids")
      .in("id", [...new Set(wanted.map((w) => w.productId))]),
    supabase.from("shipping_zones").select(ZONE_COLUMNS),
    supabase.from("shipping_methods").select(METHOD_COLUMNS).eq("active", true),
  ]);
  if (productsRes.error || zonesRes.error || methodsRes.error) return { ok: false, error: "We couldn't load your basket. Please try again." };

  const products = new Map((productsRes.data ?? []).map((p) => [p.id, p]));
  const items: ResolvedItem[] = [];
  const delivery = [];

  for (const w of wanted) {
    const p = products.get(w.productId);
    if (!p || p.status !== "live") return { ok: false, error: "Something in your basket is no longer available. Please check your basket." };
  const options = (p.options ?? []) as { name: string; stock?: number; image?: string; price?: number | string | null }[];
    const option = w.variant ? options.find((o) => o.name === w.variant) : undefined;
    if (options.length > 0 && !option) return { ok: false, error: `Please choose an option for ${p.name}.` };
    const stock = option ? (option.stock ?? p.stock) : p.stock;
    // An option with its own price uses it; otherwise the product price.
    const unitPrice = option?.price != null && option.price !== "" ? Number(option.price) : Number(p.price);
    if (w.quantity > stock) {
      return { ok: false, error: stock > 0 ? `Only ${stock} of ${p.name}${option ? ` (${option.name})` : ""} left.` : `${p.name} has just sold out.` };
    }
    items.push({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      variant: option?.name ?? null,
      variantLabel: option ? p.option_label || "Option" : null,
      quantity: w.quantity,
      unitPrice,
      imagePath: option?.image ?? p.images?.[0] ?? null,
    });
    delivery.push({
      quantity: w.quantity,
      unitPrice,
      weightGrams: p.weight_grams,
      freeShipping: p.free_shipping ?? false,
      allowedMethodIds: p.shipping_method_ids ?? [],
    });
  }

  // Delivery: the chosen option must be in the customer's zone and suit everything in the basket.
  const zone = zoneForCountry((zonesRes.data ?? []).map(toZone), customer.country);
  const methods = (methodsRes.data ?? []).map(toMethod).filter((m) => m.zoneId === zone?.id);
  const quote = quoteDelivery(methods, delivery).find((q) => q.method.id === input.methodId);
  if (!zone || !quote || !quote.available) {
    return { ok: false, error: "That delivery option isn't available for your address. Please choose another." };
  }

  const subtotal = items.reduce((s, i) => s + pennies(i.unitPrice) * i.quantity, 0) / 100;
  const shipping = pennies(quote.price) / 100;
  return {
    ok: true,
    checkout: {
      items,
      customer: { ...customer, countryName: countryName(customer.country) },
      shippingMethod: { id: quote.method.id, name: quote.method.name },
      subtotal,
      shipping,
      total: (pennies(subtotal) + pennies(shipping)) / 100,
      newsletter: Boolean(input.newsletter),
    },
  };
}

// The stock function needs product id, option name, quantity and a name for error messages.
export const stockLines = (items: ResolvedItem[]) =>
  items.map((i) => ({ productId: i.productId, variant: i.variant, quantity: i.quantity, name: i.name }));