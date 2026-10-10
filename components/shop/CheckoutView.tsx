"use client";

import Link from "next/link";
   import { useRouter } from "next/navigation";
   import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, countryName } from "@/lib/countries";
import { gbp } from "@/lib/data";
import { productImageUrl } from "@/lib/product-types";
import {
  METHOD_COLUMNS,
  ZONE_COLUMNS,
  deliveryTime,
  quoteDelivery,
  toMethod,
  toZone,
  zoneForCountry,
  type ShippingMethod,
  type ShippingZone,
} from "@/lib/shipping-types";
import { createClient } from "@/lib/supabase/client";
import { BagIcon, InfoIcon, TruckIcon } from "../Icons";
import ProductImage from "../ProductImage";
import { useBasket, type BasketItem } from "./BasketProvider";
   import PayPalPay from "./PayPalPay";
import QuantityStepper from "./QuantityStepper";

const input = "h-[52px] rounded-xl border-[1.5px] border-line-strong bg-white px-4 text-base font-normal";
const label = "flex flex-col gap-2 text-sm font-semibold";
const card = "flex flex-col gap-4 rounded-[20px] border border-line bg-paper p-5 sm:p-7";

// Delivery details for each product, loaded fresh at checkout.
type ProductDelivery = { weightGrams: number | null; freeShipping: boolean; allowedMethodIds: string[] };

export default function CheckoutView() {
   const router = useRouter();
   const formRef = useRef<HTMLFormElement>(null);
   const { items, subtotal, ready, setQty, remove, replace, clear } = useBasket();
  const [checked, setChecked] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);
  const [country, setCountry] = useState("GB");
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [productDelivery, setProductDelivery] = useState<Map<string, ProductDelivery>>(new Map());
  const [deliveryLoaded, setDeliveryLoaded] = useState(false);
  const [methodId, setMethodId] = useState("");

  // Check the basket against live stock and prices, and load the delivery settings.
  useEffect(() => {
    if (!ready || checked) return;
    setChecked(true);
    if (items.length === 0) return;

    (async () => {
      const supabase = createClient();
      const ids = [...new Set(items.map((i) => i.productId))];
      const [productsRes, zonesRes, methodsRes] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, price, stock, images, options, weight_grams, free_shipping, shipping_method_ids")
          .eq("status", "live")
          .in("id", ids),
        supabase.from("shipping_zones").select(ZONE_COLUMNS).order("sort_order"),
        supabase.from("shipping_methods").select(METHOD_COLUMNS).eq("active", true).order("sort_order"),
      ]);

      setZones((zonesRes.data ?? []).map(toZone));
      setMethods((methodsRes.data ?? []).map(toMethod));
      setDeliveryLoaded(true);

      const data = productsRes.data;
      if (productsRes.error || !data) return;

      setProductDelivery(
        new Map(
          data.map((p) => [
            p.id,
            { weightGrams: p.weight_grams, freeShipping: p.free_shipping ?? false, allowedMethodIds: p.shipping_method_ids ?? [] },
          ])
        )
      );

      const live = new Map(data.map((p) => [p.id, p]));
      const notes: string[] = [];
      const next: BasketItem[] = [];

      for (const item of items) {
        const p = live.get(item.productId);
        const name = item.variant ? `${item.name} (${item.variant})` : item.name;
        if (!p) {
          notes.push(`${name} is no longer available and was removed.`);
          continue;
        }
        // Stock for this option if it has one, otherwise for the product.
        const options = (p.options ?? []) as { name: string; stock?: number }[];
        const option = item.variant ? options.find((o) => o.name === item.variant) : undefined;
        if (item.variant && !option) {
          notes.push(`${name} is no longer available and was removed.`);
          continue;
        }
        const stock = option ? (option.stock ?? p.stock) : p.stock;
        if (stock <= 0) {
          notes.push(`${name} is sold out and was removed.`);
          continue;
        }
        const qty = Math.min(item.qty, stock);
        if (qty < item.qty) notes.push(`Only ${stock} of ${name} left, so we've updated your quantity.`);
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

  // Delivery options for the chosen country and what's in the basket.
  const zone = useMemo(() => zoneForCountry(zones, country), [zones, country]);
  const quotes = useMemo(() => {
    if (!zone) return [];
    return quoteDelivery(
      methods.filter((m) => m.zoneId === zone.id),
      items.map((i) => {
        const d = productDelivery.get(i.productId);
        return {
          quantity: i.qty,
          unitPrice: i.price,
          weightGrams: d?.weightGrams ?? null,
          freeShipping: d?.freeShipping ?? false,
          allowedMethodIds: d?.allowedMethodIds ?? [],
        };
      })
    );
  }, [zone, methods, items, productDelivery]);

  const available = quotes.filter((q) => q.available);
  const selected = available.find((q) => q.method.id === methodId) ?? available[0];

  // Keep the chosen option valid when the country or basket changes.
  useEffect(() => {
    if (selected && selected.method.id !== methodId) setMethodId(selected.method.id);
  }, [selected, methodId]);

     // Everything the server needs to work out the order. Returns null if the form isn't complete.
   function checkoutPayload() {
     const form = formRef.current;
     if (!form || !selected) return null;
     if (!form.reportValidity()) return null;
     const f = new FormData(form);
     const get = (k: string) => String(f.get(k) ?? "");
     return {
       items: items.map((i) => ({ productId: i.productId, variant: i.variant, quantity: i.qty })),
       methodId: selected.method.id,
       newsletter: f.get("newsletter") === "on",
       customer: {
         email: get("email"),
         firstName: get("firstName"),
         lastName: get("lastName"),
         phone: get("phone"),
         address1: get("address1"),
         address2: get("address2"),
         city: get("city"),
         postcode: get("postcode"),
         country,
       },
     };
   }

  const deliveryPrice = selected?.price ?? 0;
  const total = subtotal + deliveryPrice;

  // Products that block every option in this zone, so we can say which one to remove.
  const blockers = useMemo(() => {
    if (!zone || available.length > 0) return [];
    const zoneMethodIds = methods.filter((m) => m.zoneId === zone.id).map((m) => m.id);
    return items.filter((i) => {
      const allowed = productDelivery.get(i.productId)?.allowedMethodIds ?? [];
      return allowed.length > 0 && !allowed.some((id) => zoneMethodIds.includes(id));
    });
  }, [zone, available.length, methods, items, productDelivery]);

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
         ref={formRef}
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
            <select name="country" autoComplete="country" value={country} onChange={(e) => setCountry(e.target.value)} className={input}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
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
            <label className={label}>Postcode<input name="postcode" required={country === "GB"} autoComplete="postal-code" className={input} /></label>
            <label className={label}>Phone<input name="phone" type="tel" autoComplete="tel" className={input} /></label>
          </div>
        </section>

        <section className={card} role="radiogroup" aria-labelledby="delivery-method-heading">
          <h2 id="delivery-method-heading" className="text-xl font-bold">Delivery method</h2>

          {!deliveryLoaded ? (
            <p className="text-[15px] text-muted">Loading delivery options...</p>
          ) : !zone || quotes.length === 0 ? (
            <Notice>
              Sorry, we don&apos;t deliver to {countryName(country)} yet. <Link href="/contact" className="font-semibold underline">Get in touch</Link> and
              we&apos;ll see what we can do.
            </Notice>
          ) : available.length === 0 ? (
            <Notice>
              {blockers.length > 0 ? (
                <>
                  {blockers.map((b) => b.name).join(", ")} can&apos;t be delivered to {countryName(country)}. Remove{" "}
                  {blockers.length === 1 ? "it" : "them"} from your basket to continue.
                </>
              ) : (
                <>
                  None of our delivery options suit this order for {countryName(country)}. It may be too heavy.{" "}
                  <Link href="/contact" className="font-semibold underline">Get in touch</Link> and we&apos;ll sort it out.
                </>
              )}
            </Notice>
          ) : (
            quotes.map((q) => (
              <label
                key={q.method.id}
                className={`flex items-start gap-3.5 rounded-[14px] border-[1.5px] border-line-strong bg-white px-4 py-4 has-[:checked]:border-2 has-[:checked]:border-ink sm:items-center sm:px-[18px] ${
                  q.available ? "cursor-pointer" : "cursor-not-allowed opacity-55"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  value={q.method.id}
                  checked={selected?.method.id === q.method.id}
                  disabled={!q.available}
                  onChange={() => setMethodId(q.method.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-clay sm:mt-0"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="flex flex-col gap-0.5">
                    <span className="text-base font-semibold">{q.method.name}</span>
                    <span className="text-sm text-muted">
                      {q.available
                        ? [deliveryTime(q.method), q.freeBecause === "threshold" ? `Free on orders over ${gbp(q.method.freeOver!)}` : ""]
                            .filter(Boolean)
                            .join(". ") || "\u00a0"
                        : q.reason}
                    </span>
                  </span>
                  {q.available && (
                    <span className={`mt-1 text-base font-semibold sm:mt-0 sm:shrink-0 ${q.price === 0 ? "text-jade" : ""}`}>
                      {q.price === 0 ? "Free" : gbp(q.price)}
                    </span>
                  )}
                </span>
              </label>
            ))
          )}
        </section>

        <section className={card}>
          <h2 className="text-xl font-bold">Payment</h2>
          <p className="text-[15px] leading-relaxed text-muted">
            You will finish paying securely with PayPal. Use your PayPal balance, or pay by debit or credit card without an account.
          </p>
                      <PayPalPay
               createUrl="/api/checkout/create"
               captureUrl="/api/checkout/capture"
               createBody={checkoutPayload}
               captureBody={(paypalOrderId) => ({ paypalOrderId })}
               onPaid={(result) => {
                 clear();
                 router.push(result.ref ? `/order/${result.ref}` : "/shop");
               }}
               disabled={!selected}
               refreshKey={[selected?.method.id, total, country]}
             />
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
                {productDelivery.get(item.productId)?.freeShipping && <span className="text-[13px] font-semibold text-jade">Free delivery</span>}
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
          <div className="flex justify-between gap-4">
            <span className="text-muted">Delivery{selected ? `, ${selected.method.name}` : ""}</span>
            <span className={`shrink-0 ${selected?.price === 0 ? "font-semibold text-jade" : ""}`}>
              {selected ? (selected.price === 0 ? "Free" : gbp(selected.price)) : "Not available"}
            </span>
          </div>
        </div>
        <div className="flex items-baseline justify-between border-t border-[#ece3d5] pt-4">
          <span className="text-[17px] font-bold">Total</span>
          <span className="font-display text-3xl">{gbp(total)}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-[14px] bg-cream px-4 py-3.5 text-sm text-muted">
          <TruckIcon size={18} className="shrink-0 text-jade" />
          Posted from the UK. You will get an email when it ships.
        </div>
      </aside>
    </form>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-3 rounded-[14px] bg-[#f1e6c8] px-4 py-3.5 text-[15px] leading-relaxed text-[#6e5316]">
      <InfoIcon size={20} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}