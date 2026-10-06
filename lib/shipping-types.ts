// Delivery zones, options and the price calculation. Used by the admin, checkout and (later) the PayPal server check.

export type ShippingZone = {
  id: string;
  name: string;
  countries: string[];
  restOfWorld: boolean;
  sortOrder: number;
};

export type WeightBand = { upTo: number; price: number }; // upTo in grams

export type ShippingMethod = {
  id: string;
  zoneId: string;
  name: string;
  minDays: number | null;
  maxDays: number | null;
  pricing: "flat" | "weight";
  price: number;
  weightBands: WeightBand[];
  freeOver: number | null;
  active: boolean;
  sortOrder: number;
};

export const ZONE_COLUMNS = "id, name, countries, rest_of_world, sort_order";
export const METHOD_COLUMNS =
  "id, zone_id, name, min_days, max_days, pricing, price, weight_bands, free_over, active, sort_order";

type ZoneRow = { id: string; name: string; countries: string[] | null; rest_of_world: boolean; sort_order: number };
type MethodRow = {
  id: string;
  zone_id: string;
  name: string;
  min_days: number | null;
  max_days: number | null;
  pricing: "flat" | "weight";
  price: number | string;
  weight_bands: { upTo: number; price: number | string }[] | null;
  free_over: number | string | null;
  active: boolean;
  sort_order: number;
};

export const toZone = (r: ZoneRow): ShippingZone => ({
  id: r.id,
  name: r.name,
  countries: r.countries ?? [],
  restOfWorld: r.rest_of_world,
  sortOrder: r.sort_order,
});

export const toMethod = (r: MethodRow): ShippingMethod => ({
  id: r.id,
  zoneId: r.zone_id,
  name: r.name,
  minDays: r.min_days,
  maxDays: r.max_days,
  pricing: r.pricing,
  price: Number(r.price),
  weightBands: (r.weight_bands ?? []).map((b) => ({ upTo: Number(b.upTo), price: Number(b.price) })).sort((a, b) => a.upTo - b.upTo),
  freeOver: r.free_over === null ? null : Number(r.free_over),
  active: r.active,
  sortOrder: r.sort_order,
});

// The zone for a country: the zone that lists it, otherwise "rest of the world".
export function zoneForCountry(zones: ShippingZone[], country: string): ShippingZone | null {
  return zones.find((z) => !z.restOfWorld && z.countries.includes(country)) ?? zones.find((z) => z.restOfWorld) ?? null;
}

export const deliveryTime = (m: Pick<ShippingMethod, "minDays" | "maxDays">) => {
  if (m.minDays == null && m.maxDays == null) return "";
  if (m.minDays != null && m.maxDays != null && m.minDays !== m.maxDays) return `${m.minDays} to ${m.maxDays} working days`;
  const d = m.maxDays ?? m.minDays!;
  return `${d} working ${d === 1 ? "day" : "days"}`;
};

export const kg = (grams: number) => `${(grams / 1000).toLocaleString("en-GB", { maximumFractionDigits: 2 })} kg`;

// What each basket line needs for delivery.
export type DeliveryItem = {
  quantity: number;
  unitPrice: number;
  weightGrams: number | null;
  freeShipping: boolean;
  allowedMethodIds: string[]; // empty = every option
};

export type DeliveryQuote = {
  method: ShippingMethod;
  available: boolean;
  price: number; // 0 when free
  reason?: string; // why it isn't available
  freeBecause?: "items" | "threshold";
};

/*
  The rules, in plain English:
  - Only options every item allows are offered.
  - Items with free delivery don't add to the delivery cost.
  - If every item has free delivery, delivery is free.
  - "Free over £X" uses the whole basket total.
  - Weight pricing uses the weight of the items that aren't free. Too heavy for the bands = not offered.
*/
export function quoteDelivery(methods: ShippingMethod[], items: DeliveryItem[]): DeliveryQuote[] {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const chargeable = items.filter((i) => !i.freeShipping);
  const weight = chargeable.reduce((g, i) => g + (i.weightGrams ?? 0) * i.quantity, 0);

  return methods
    .filter((m) => m.active)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((method) => {
      const blocked = items.some((i) => i.allowedMethodIds.length > 0 && !i.allowedMethodIds.includes(method.id));
      if (blocked) return { method, available: false, price: 0, reason: "Not available for everything in your basket" };

      if (chargeable.length === 0) return { method, available: true, price: 0, freeBecause: "items" as const };
      if (method.freeOver != null && subtotal >= method.freeOver) {
        return { method, available: true, price: 0, freeBecause: "threshold" as const };
      }

      if (method.pricing === "weight") {
        const band = method.weightBands.find((b) => weight <= b.upTo);
        if (!band) return { method, available: false, price: 0, reason: "Your order is too heavy for this option" };
        return { method, available: true, price: band.price };
      }
      return { method, available: true, price: method.price };
    });
}