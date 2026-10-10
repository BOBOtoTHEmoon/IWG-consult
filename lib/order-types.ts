// Shared order types and helpers. Safe to use in both server and client code.
import { productImageUrl } from "@/lib/product-types";

export type OrderStatus = "to_pack" | "packed" | "shipped" | "delivered" | "cancelled";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  to_pack: "To pack",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<OrderStatus, string> = {
  to_pack: "bg-[#f6ddd0] text-clay-dark",
  packed: "bg-[#f1e6c8] text-[#6e5316]",
  shipped: "bg-jade-soft text-jade",
  delivered: "bg-[#e6e1d9] text-muted",
  cancelled: "bg-[#e6e1d9] text-subtle",
};

export type OrderItem = {
  id: string;
  productSlug: string | null;
  name: string;
  variant: string | null;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  number: string;
  publicRef: string;
  status: OrderStatus;
  customerName: string;
  email: string;
  phone: string | null;
  addressLines: string[];
  city: string;
  country: string;
  shippingMethod: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  trackingNumber: string | null;
  createdAt: string;
  items: OrderItem[];
};

type ItemRow = {
  id: string;
  product_slug: string | null;
  name: string;
  variant: string | null;
  image_path: string | null;
  quantity: number;
  unit_price: number | string;
};

export type OrderRow = {
  id: string;
  number: string;
  public_ref: string;
  status: OrderStatus;
  customer_name: string;
  email: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string | null;
  country: string;
  shipping_method: string;
  shipping_price: number | string;
  subtotal: number | string;
  total: number | string;
  tracking_number: string | null;
  created_at: string;
  order_items: ItemRow[] | null;
};

export const ORDER_COLUMNS =
  "id, number, public_ref, status, customer_name, email, phone, address_line1, address_line2, city, postcode, country, shipping_method, shipping_price, subtotal, total, tracking_number, created_at, order_items (id, product_slug, name, variant, image_path, quantity, unit_price)";

export function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    number: row.number,
    publicRef: row.public_ref,
    status: row.status,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    addressLines: [row.customer_name, row.address_line1, row.address_line2, row.city, row.postcode, row.country].filter(
      (l): l is string => Boolean(l && l.trim())
    ),
    city: row.city,
    country: row.country,
    shippingMethod: row.shipping_method,
    shippingPrice: Number(row.shipping_price),
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    trackingNumber: row.tracking_number,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((i) => ({
      id: i.id,
      productSlug: i.product_slug,
      name: i.name,
      variant: i.variant,
      imageUrl: i.image_path ? productImageUrl(i.image_path) : null,
      quantity: i.quantity,
      unitPrice: Number(i.unit_price),
    })),
  };
}

// "Amara Obi" -> "Amara O."
export const shortName = (full: string) => {
  const [first, ...rest] = full.trim().split(/\s+/);
  return rest.length ? `${first} ${rest[rest.length - 1][0].toUpperCase()}.` : first;
};

export const destination = (o: Pick<Order, "city" | "country">) =>
  o.country === "United Kingdom" ? `${o.city}, UK` : `${o.city}, ${o.country}`;

export const itemCount = (o: Pick<Order, "items">) => o.items.reduce((n, i) => n + i.quantity, 0);

export const formatPlaced = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }).format(new Date(iso));

export const royalMailTrackingUrl = (code: string) =>
  `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(code)}`;