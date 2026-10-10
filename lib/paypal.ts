import "server-only";

// Talks to PayPal from the server. The Secret never reaches the browser.
const BASE = process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function accessToken() {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal keys are not set");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal sign-in failed (${res.status})`);
  return ((await res.json()) as { access_token: string }).access_token;
}

async function call<T>(path: string, init: { method: string; body?: unknown; requestId?: string }): Promise<{ ok: boolean; status: number; data: T }> {
  const token = await accessToken();
  const res = await fetch(`${BASE}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      // Makes retries safe: PayPal won't do the same thing twice for the same id.
      ...(init.requestId ? { "PayPal-Request-Id": init.requestId } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

const money = (n: number) => ({ currency_code: "GBP", value: n.toFixed(2) });

export type PayPalItem = { name: string; quantity: number; unitPrice: number; sku?: string };

export async function createPayPalOrder(opts: {
  reference: string;
  description: string;
  items: PayPalItem[];
  itemTotal: number;
  shipping: number;
  total: number;
  physical: boolean;
}) {
  const { ok, data } = await call<{ id?: string; details?: unknown }>("/v2/checkout/orders", {
    method: "POST",
    requestId: `create-${opts.reference}`,
    body: {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: opts.reference,
          custom_id: opts.reference,
          description: opts.description.slice(0, 127),
          amount: {
            ...money(opts.total),
            breakdown: { item_total: money(opts.itemTotal), shipping: money(opts.shipping) },
          },
          items: opts.items.map((i) => ({
            name: i.name.slice(0, 127),
            quantity: String(i.quantity),
            unit_amount: money(i.unitPrice),
            ...(i.sku ? { sku: i.sku.slice(0, 127) } : {}),
            category: opts.physical ? "PHYSICAL_GOODS" : "DIGITAL_GOODS",
          })),
        },
      ],
      application_context: {
        brand_name: "Import with Goody",
        locale: "en-GB",
        shipping_preference: "NO_SHIPPING", // we collect the delivery address ourselves
        user_action: "PAY_NOW",
      },
    },
  });
  if (!ok || !data.id) {
    console.error("PayPal create order failed:", JSON.stringify(data));
    throw new Error("PayPal couldn't start the payment");
  }
  return data.id;
}

type CaptureResponse = {
  status?: string;
  details?: { issue?: string }[];
  purchase_units?: { payments?: { captures?: { id: string; status: string; amount: { value: string } }[] } }[];
};

export type CaptureResult =
  | { ok: true; captureId: string; amount: number; pending: boolean }
  | { ok: false; declined: boolean; message: string };

export async function capturePayPalOrder(paypalOrderId: string): Promise<CaptureResult> {
  let { ok, data } = await call<CaptureResponse>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
    method: "POST",
    requestId: `capture-${paypalOrderId}`,
  });

  // Already captured earlier (e.g. a retry): look the payment up instead.
  if (!ok && data.details?.some((d) => d.issue === "ORDER_ALREADY_CAPTURED")) {
    ({ ok, data } = await call<CaptureResponse>(`/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, { method: "GET" }));
  }

  if (!ok) {
    const declined = Boolean(data.details?.some((d) => d.issue === "INSTRUMENT_DECLINED"));
    console.error("PayPal capture failed:", JSON.stringify(data));
    return { ok: false, declined, message: declined ? "Your payment method was declined." : "The payment didn't go through." };
  }

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || !["COMPLETED", "PENDING"].includes(capture.status)) {
    return { ok: false, declined: false, message: "The payment didn't go through." };
  }
  return { ok: true, captureId: capture.id, amount: Number(capture.amount.value), pending: capture.status === "PENDING" };
}