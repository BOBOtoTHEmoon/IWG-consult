// The ways a customer can pay. Safe to use in both server and browser code.
export const PAYMENT_METHODS = ["paypal", "stripe"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

// The three choices staff see in the admin.
export const PAYMENT_CHOICES: { value: PaymentMethod[]; label: string }[] = [
  { value: ["paypal"], label: "PayPal only" },
  { value: ["stripe"], label: "Stripe only" },
  { value: ["paypal", "stripe"], label: "Both" },
];

// Cleans a saved value. Anything missing or unknown falls back to PayPal only.
export function toPaymentMethods(value: unknown, fallback: PaymentMethod[] = ["paypal"]): PaymentMethod[] {
  const list = Array.isArray(value) ? PAYMENT_METHODS.filter((m) => value.includes(m)) : [];
  return list.length ? list : fallback;
}

// The ways that can pay for every item at once. Empty means they can't be paid for together.
export const sharedMethods = (lists: PaymentMethod[][]): PaymentMethod[] =>
  PAYMENT_METHODS.filter((m) => lists.every((l) => l.includes(m)));

export const sameMethods = (a: PaymentMethod[], b: PaymentMethod[]) =>
  a.length === b.length && a.every((m) => b.includes(m));

// For customers: "with PayPal only", "by card only", "with PayPal or by card".
export function payPhrase(methods: PaymentMethod[]) {
  if (methods.length === 0) return "in different ways";
  if (methods.length === 2) return "with PayPal or by card";
  return methods[0] === "stripe" ? "by card only" : "with PayPal only";
}