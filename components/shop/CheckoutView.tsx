"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gbp } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { productImageUrl } from "@/lib/product-types";
import { BagIcon, TruckIcon } from "../Icons";
import ProductImage from "../ProductImage";
import { useBasket, type BasketItem } from "./BasketProvider";
import QuantityStepper from "./QuantityStepper";

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7";

// TODO (delivery rates step): load these from the admin's delivery settings.
const methods = [
  { id: "uk-standard", title: "UK Standard, Royal Mail", note: "[X to Y] working days" },
  { id: "uk-tracked", title: "UK Tracked, Royal Mail", note: "Tracking number sent by email once posted" },
  { id: "intl", title: "International, Royal Mail", note: "Shown when the delivery country is outside the UK", disabled: true },
];

export default function CheckoutView() {
  const { items, subtotal, ready, setQty, remove, replace } = useBasket();
  const [checked, setChecked] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);

  // Check the basket against live stock and prices once it has loaded.
  useEffect(() => {
    if (!ready || checked) return;
    setChecked(true);
    if (items.length === 0) return;

    (async () => {
      const supabase = createClient();
      const ids = [...new Set(items.map((i) => i.productId))];
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, stock, images, options")
        .eq("status", "live")
        .in("id", ids);
      if (error || !data) return;

      const live = new Map(data.map((p) => [p.id, p]));
      const notes: string[] = [];
      const next: BasketItem[] = [];

      for (const item of items) {
        const p = live.get(item.productId);
        const label = item.variant ? `${item.name} (${item.variant})` : item.name;
        if (!p) {
          notes.push(`${label} is no longer available and was removed.`);
          continue;
        }
        // Stock for this option if it has one, otherwise for the product.
        const options = (p.options ?? []) as { name: string; stock?: number }[];
        const option = item.variant ? options.find((o) => o.name === item.variant) : undefined;
        if (item.variant && !option) {
          notes.push(`${label} is no longer available and was removed.`);
          continue;
        }
        const stock = option ? (option.stock ?? p.stock) : p.stock;
        if (stock <= 0) {
          notes.push(`${label} is sold out and was removed.`);
          continue;
        }
        const qty = Math.min(item.qty, stock);
        if (qty < item.qty) notes.push(`Only ${stock} of ${label} left, so we've updated your quantity.`);
        const price = Number(p.price);
        if (price !== item.price) notes.push(`The price of ${item.name} has changed to ${gbp(price)}.`);
        next.push({
          ...item,
          qty,
          price,
          stock,
          name: p.name,
          image: p.images?.[0] ? productImageUrl(p.images[0]) : item.image,
        });
      }

      if (notes.length) {
        replace(next);
        setChanges(notes);
      }
    })();
  }, [ready, checked, items, replace]);

  if (!ready) {
    return <div className="mx-auto max-w-[1440px] px-5 py-20 text-center text-muted">Loading your basket...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[520px] flex-col items-center gap-4 px-5 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-clay">
          <BagIcon size={28} />
        </span>
        <h1 className="font-display text-3xl">Your basket is empty</h1>
        <p className="text-muted">Add something you love, then come back here to check out.</p>
        {changes.length > 0 && (
          <ul className="w-full rounded-[14px] bg-[#f1e6c8] p-4 text-left text-sm text-[#6e5316]">
            {changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
        <Link href="/shop" className="mt-2 flex h-12 items-center rounded-full bg-clay px-6 font-semibold text-white">
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mx-auto flex max-w-[1440px] flex-col-reverse items-start gap-8 px-5 pb-20 pt-8 sm:px-10 lg:flex-row lg:gap-12 lg:px-20 lg:pt-12"
    >
      <div className="flex w-full flex-1 flex-col gap-5">
        <h1 className="mb-2 hidden font-display text-[44px] tracking-[-0.015em] lg:block">Checkout</h1>

        <section className={card}>
          <h2 className="text-xl font-bold">Contact</h2>
          <label className={label}>
            Email address
            <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" className={input} />
          </label>
          <label className="flex min-h-8 items-center gap-2.5 text-[15px]">
            <input type="checkbox" name="newsletter" className="h-[18px] w-[18px] accent-clay" />
            Email me when new stock lands
          </label>
        </section>

        <section className={card}>
          <h2 className="text-xl font-bold">Delivery address</h2>
          <label className={label}>
            Country
            <select name="country" autoComplete="country-name" className={input}>
              <option>United Kingdom</option>
              <option>Ireland</option>
              <option>Nigeria</option>
              <option>United States</option>
              <option>Other country</option>
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>First name<input name="firstName" required autoComplete="given-name" className={input} /></label>
            <label className={label}>Last name<input name="lastName" required autoComplete="family-name" className={input} /></label>
          </div>
          <label className={label}>Address<input name="address1" required autoComplete="address-line1" className={input} /></label>
          <label className={label}>
            Flat, suite, etc. <span className="font-normal text-subtle">(optional)</span>
            <input name="address2" autoComplete="address-line2" className={input} />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={label}>Town or city<input name="city" required autoComplete="address-level2" className={input} /></label>
            <label className={label}>Postcode<input name="postcode" required autoComplete="postal-code" className={input} /></label>
            <label className={label}>Phone<input name="phone" type="tel" autoComplete="tel" className={input} /></label>
          </div>
        </section>

                <section className={card} role="radiogroup" aria-labelledby="delivery-method-heading">
          <h2 id="delivery-method-heading" className="text-xl font-bold">Delivery method</h2>
          {methods.map((m, i) => (
            <label
              key={m.id}
              className={`flex cursor-pointer items-start gap-3.5 rounded-[14px] border-[1.5px] border-line-strong bg-white px-4 py-4 has-[:checked]:border-2 has-[:checked]:border-ink sm:items-center sm:px-[18px] ${
                m.disabled ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              <input
                type="radio"
                name="shipping"
                value={m.id}
                defaultChecked={i === 0}
                disabled={m.disabled}
                className="mt-0.5 h-5 w-5 shrink-0 accent-clay sm:mt-0"
              />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold">{m.title}</span>
                  <span className="text-sm text-muted">{m.note}</span>
                </span>
                <span className="mt-1 text-sm font-semibold text-subtle sm:mt-0 sm:shrink-0">Rate coming soon</span>
              </span>
            </label>
          ))}
        </section>

        <section className={card}>
          <h2 className="text-xl font-bold">Payment</h2>
          <p className="text-[15px] leading-relaxed text-muted">
            You will finish paying securely with PayPal. Use your PayPal balance, or pay by debit or credit card without an account.
          </p>
          {/* TODO (PayPal step): replace with PayPal buttons. The server re-checks stock and prices before taking payment. */}
          <button type="submit" disabled className="h-[58px] rounded-full bg-paypal text-[17px] font-bold text-ink opacity-60">
            Pay with PayPal (coming soon)
          </button>
          <span className="text-center text-[13px] text-subtle">
            By placing your order you agree to our{" "}
            <Link href="/terms" className="underline">terms</Link> and{" "}
            <Link href="/returns" className="underline">returns policy</Link>.
          </span>
        </section>
      </div>

      <aside className="flex w-full flex-col gap-5 rounded-3xl border border-line bg-white p-6 sm:p-7 lg:sticky lg:top-8 lg:mt-[72px] lg:w-[460px] lg:shrink-0">
        <h2 className="text-xl font-bold">Order summary</h2>

        {changes.length > 0 && (
          <ul role="status" className="flex flex-col gap-1 rounded-[14px] bg-[#f1e6c8] p-4 text-sm text-[#6e5316]">
            {changes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}

        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3.5">
              <ProductImage src={item.image} alt={item.name} tint={item.tint} className="h-20 w-[68px] shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[15px] font-semibold">{item.name}</span>
                  <span className="shrink-0 text-[15px] font-semibold">{gbp(item.price * item.qty)}</span>
                </div>
               {item.variant && (
  <span className="text-[13px] text-subtle">
    {item.variantLabel ?? "Option"}: {item.variant}
  </span>
)}
                <div className="mt-1 flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    value={item.qty}
                    max={item.stock}
                    onChange={(q) => setQty(item.key, q)}
                    label={`quantity of ${item.name}`}
                  />
                  <button type="button" onClick={() => remove(item.key)} className="h-10 px-2 text-sm font-semibold text-clay-dark hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-[#ece3d5] pt-4 text-[15px]">
          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{gbp(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Delivery</span><span className="text-subtle">Calculated next</span></div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#ece3d5] pt-4">
          <span className="text-[17px] font-bold">Total so far</span>
          <span className="font-display text-3xl">{gbp(subtotal)}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-[14px] bg-cream px-4 py-3.5 text-sm text-muted">
          <TruckIcon size={18} className="shrink-0 text-jade" />
          Posted from the UK. You will get an email when it ships.
        </div>
      </aside>
    </form>
  );
}