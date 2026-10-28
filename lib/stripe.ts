import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

// One shared Stripe client. The secret key lives in STRIPE_SECRET_KEY (never in the browser).
export function getStripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");
    client = new Stripe(key);
  }
  return client;
}

export const stripeReady = () => Boolean(process.env.STRIPE_SECRET_KEY);

// Stripe works in pence.
export const toPence = (pounds: number) => Math.round(pounds * 100);

// The payment id on a Checkout Session, whichever form Stripe returns it in.
export const paymentIntentId = (s: Stripe.Checkout.Session) =>
  typeof s.payment_intent === "string" ? s.payment_intent : (s.payment_intent?.id ?? null);