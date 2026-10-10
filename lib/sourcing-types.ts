// Sourcing request types and helpers. Safe to use in both server and client code.

export type SourcingStatus = "awaiting_payment" | "new" | "quote_sent" | "going_ahead" | "not_proceeding";
export type FeeStatus = "unpaid" | "paid" | "refunded";

export const SOURCING_LABEL: Record<SourcingStatus, string> = {
  awaiting_payment: "Not paid yet",
  new: "New",
  quote_sent: "Quote sent",
  going_ahead: "Going ahead",
  not_proceeding: "Not proceeding",
};

export const SOURCING_TONE: Record<SourcingStatus, string> = {
  awaiting_payment: "bg-[#e6e1d9] text-subtle",
  new: "bg-[#f6ddd0] text-clay-dark",
  quote_sent: "bg-[#f1e6c8] text-[#6e5316]",
  going_ahead: "bg-jade-soft text-jade",
  not_proceeding: "bg-[#e6e1d9] text-muted",
};

export const SERVICE_RATE = 0.1;
export const serviceCharge = (productCost: number) => Math.round(productCost * SERVICE_RATE * 100) / 100;

export type SourcingItem = {
  id: string;
  name: string;
  quantity: number;
  description: string | null;
  link: string | null;
  imagePath: string | null;
  imageUrl: string | null; // short-lived link, staff only
};

export type SourcingRequest = {
  id: string;
  number: string;
  publicRef: string;
  status: SourcingStatus;
  feeStatus: FeeStatus;
  feeAmount: number;
  feePaidAt: string | null;
  feeReference: string | null;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  budget: string | null;
  deadline: string | null;
  notes: string | null;
  quoteProductCost: number | null;
  quoteShipping: number | null;
  quoteNotes: string | null;
  quoteSentAt: string | null;
  createdAt: string;
  items: SourcingItem[];
};

export const SOURCING_COLUMNS =
  "id, number, public_ref, status, fee_status, fee_amount, fee_paid_at, fee_reference, name, email, phone, country, budget, deadline, notes, quote_product_cost, quote_shipping, quote_notes, quote_sent_at, created_at, sourcing_items (id, position, name, quantity, description, link, image_path)";

type ItemRow = {
  id: string;
  position: number;
  name: string;
  quantity: number;
  description: string | null;
  link: string | null;
  image_path: string | null;
};

export type SourcingRow = {
  id: string;
  number: string;
  public_ref: string;
  status: SourcingStatus;
  fee_status: FeeStatus;
  fee_amount: number | string;
  fee_paid_at: string | null;
  fee_reference: string | null;
  name: string;
  email: string;
  phone: string | null;
  country: string;
  budget: string | null;
  deadline: string | null;
  notes: string | null;
  quote_product_cost: number | string | null;
  quote_shipping: number | string | null;
  quote_notes: string | null;
  quote_sent_at: string | null;
  created_at: string;
  sourcing_items: ItemRow[] | null;
};

const num = (v: number | string | null) => (v === null ? null : Number(v));

export function toSourcingRequest(r: SourcingRow, imageUrls: Record<string, string> = {}): SourcingRequest {
  return {
    id: r.id,
    number: r.number,
    publicRef: r.public_ref,
    status: r.status,
    feeStatus: r.fee_status,
    feeAmount: Number(r.fee_amount),
    feePaidAt: r.fee_paid_at,
    feeReference: r.fee_reference,
    name: r.name,
    email: r.email,
    phone: r.phone,
    country: r.country,
    budget: r.budget,
    deadline: r.deadline,
    notes: r.notes,
    quoteProductCost: num(r.quote_product_cost),
    quoteShipping: num(r.quote_shipping),
    quoteNotes: r.quote_notes,
    quoteSentAt: r.quote_sent_at,
    createdAt: r.created_at,
    items: (r.sourcing_items ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        description: i.description,
        link: i.link,
        imagePath: i.image_path,
        imageUrl: i.image_path ? (imageUrls[i.image_path] ?? null) : null,
      })),
  };
}

export const quoteTotal = (r: Pick<SourcingRequest, "quoteProductCost" | "quoteShipping">) =>
  r.quoteProductCost == null ? null : r.quoteProductCost + serviceCharge(r.quoteProductCost) + (r.quoteShipping ?? 0);

export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "Europe/London" }).format(new Date(iso));

// The prefilled WhatsApp message a customer sends Goody after paying. Opening lines are Goody's own wording.
export function whatsappMessage(r: Pick<SourcingRequest, "number" | "name" | "country" | "items" | "feeAmount">) {
  const lines = r.items.slice(0, 15).map((i, n) => {
    const desc = i.description ? `: ${i.description.length > 120 ? `${i.description.slice(0, 117)}...` : i.description}` : "";
    return `${n + 1}. ${i.name} (x${i.quantity})${desc}`;
  });
  if (r.items.length > 15) lines.push(`...and ${r.items.length - 15} more`);
  return [
    `Hi Import with Goody, I've just paid my £${r.feeAmount} sourcing deposit. I'm ready to send my list.`,
    `My name is ${r.name} and my request number is ${r.number}.`,
    "",
    "Here's what I've put down so far:",
    ...lines,
    "",
    `Deliver to: ${r.country}`,
  ].join("\n");
}

export const whatsappLink = (number: string, message: string) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;