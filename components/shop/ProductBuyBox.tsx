"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gbp } from "@/lib/data";
import { PAYMENT_METHODS, payPhrase, sharedMethods } from "@/lib/payment-methods";
import { LOW_STOCK, optionGroups, optionPrice, priceRange, variantLabelOf, type ProductOption, type ShopProduct } from "@/lib/product-types";
import { CheckIcon } from "../Icons";
import { showProductPhoto } from "./ProductGallery";
import { basketKey, useBasket } from "./BasketProvider";
import QuantityStepper from "./QuantityStepper";

export default function ProductBuyBox({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const { add, items, open } = useBasket();
  const { options } = product;
  const hasOptions = options.length > 0;

  // One list of choices per option type: [Sizes] or [Sizes, Colours].
  const groups = optionGroups(product);
  const twoGroups = groups.length === 2;
  const valuesOf = (o: ProductOption) => (twoGroups ? o.values! : [o.name]);
  const findOption = (pick: string[]) => options.find((o) => valuesOf(o).every((v, i) => v === pick[i]));

  // Start on the first choice that's in stock.
  const [pick, setPick] = useState<string[]>(() => {
    if (!hasOptions) return [];
    const first = options.find((o) => o.stock > 0) ?? options[0];
    return valuesOf(first);
  });
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = hasOptions ? findOption(pick) : undefined;
  const choice = selected?.name;
  const price = optionPrice(product, selected);
  const range = priceRange(product);
  const pricesVary = range.min !== range.max;
  const stock = hasOptions ? (selected?.stock ?? 0) : product.stock;
  const allSoldOut = hasOptions ? options.every((o) => o.stock <= 0) : product.stock <= 0;

  if (allSoldOut) {
    return (
      <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-5">
        <span className="text-base font-semibold">Sold out for now</span>
        <span className="text-[15px] text-muted">Want one anyway? Goody can source it for you.</span>
        <Link
          href="/sourcing/request"
          className="mt-1 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-cream"
        >
          Request it through sourcing
        </Link>
      </div>
    );
  }

  // A choice can be picked if something with it is in stock. For the last option type,
  // it has to be in stock together with what's already picked (e.g. Large in Black).
  const available = (g: number, value: string) =>
    options.some((o) => {
      const vals = valuesOf(o);
      if (o.stock <= 0 || vals[g] !== value) return false;
      return g < groups.length - 1 || vals.every((v, i) => i === g || v === pick[i]);
    });

  function choose(g: number, value: string) {
    let next = [...pick];
    next[g] = value;
    // Picked a size whose current colour is sold out: jump to the first colour that's in stock.
    if (twoGroups && g === 0 && !(findOption(next)?.stock ?? 0)) {
      const inStock = options.find((o) => o.stock > 0 && valuesOf(o)[0] === value);
      if (inStock) next = valuesOf(inStock);
    }
    setPick(next);
    setQty(1);
    const photo = photoFor(g, value);
    if (photo) showProductPhoto(photo);
  }

  // Swatches and photos belong to the Colour choices (or to the only list of choices).
  const visualGroup = twoGroups ? Math.max(0, groups.findIndex((g) => g.label === "Colour")) : 0;
  const lookFor = (g: number, value: string) => {
    if (g !== visualGroup) return { hex: undefined, imageUrl: undefined };
    const o = options.find((x) => valuesOf(x)[g] === value);
    return { hex: o?.hex, imageUrl: o?.imageUrl };
  };
  const photoFor = (g: number, value: string) => lookFor(g, value).imageUrl;

  // Items paid only by PayPal and items paid only by card can't be in the same order.
  const basketMethods = sharedMethods(items.map((i) => i.payments ?? [...PAYMENT_METHODS]));
  const payConflict = items.length > 0 && sharedMethods([basketMethods, product.paymentMethods]).length === 0;

  // Don't let them add more than is left, counting what's already in the basket.
  const inBasket = items.find((i) => i.key === basketKey(product.id, choice))?.qty ?? 0;
  const canAdd = Math.max(0, stock - inBasket);

  function addToBasket() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variant: choice,
        variantLabel: hasOptions ? variantLabelOf(product) : undefined,
        price,
        image: selected?.imageUrl ?? product.images[0],
        tint: product.tint,
        stock,
        payments: product.paymentMethods,
      },
      Math.min(qty, canAdd)
    );
    setQty(1);
  }

  return (
    <div className="flex flex-col gap-5">
      {hasOptions &&
        groups.map((group, g) => (
          <fieldset key={group.label} className="flex flex-col gap-3">
            <legend className="mb-3 text-[15px] font-semibold">
              {group.label}: <span className="font-normal text-muted">{pick[g]}</span>
              {g === groups.length - 1 && selected && selected.stock > 0 && selected.stock <= LOW_STOCK && (
                <span className="ml-2 text-sm font-semibold text-clay">Only {selected.stock} left</span>
              )}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {group.values.map((value) => {
                const soldOut = !available(g, value);
                const on = pick[g] === value;
                const { hex, imageUrl } = lookFor(g, value);
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={on}
                    disabled={soldOut}
                    onClick={() => choose(g, value)}
                    aria-label={soldOut ? `${value}, sold out` : value}
                    className={`flex h-11 items-center gap-2.5 rounded-full bg-paper text-sm font-medium transition-colors ${
                      imageUrl || hex ? "pl-1.5 pr-4" : "px-4"
                    } ${on ? "border-2 border-ink" : "border-[1.5px] border-line-strong hover:border-ink"} ${
                      soldOut ? "cursor-not-allowed text-subtle line-through opacity-50 hover:border-line-strong" : ""
                    }`}
                  >
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" className="h-8 w-8 rounded-full border border-black/10 object-cover" />
                    ) : (
                      hex && <span className="h-7 w-7 rounded-full border border-black/10" style={{ background: hex }} />
                    )}
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

      {pricesVary && <p className="text-[28px] font-semibold">{gbp(price)}</p>}

      {payConflict ? (
        <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-5">
          <span className="text-[15px] font-semibold">This can&apos;t go in the same order as your basket</span>
          <span className="text-[15px] leading-relaxed text-muted">
            {product.name} can be paid {payPhrase(product.paymentMethods)}, but your basket can be paid {payPhrase(basketMethods)}.
            Please check out your basket first, then come back for this.
          </span>
          <button onClick={open} className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-cream">
            View basket
          </button>
        </div>
      ) : !selected && hasOptions ? (
        <div className="rounded-[18px] border border-line bg-paper p-5 text-[15px] text-muted">
          This combination isn&apos;t available. Please choose another.
        </div>
      ) : canAdd === 0 ? (
        <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-5">
          <span className="text-[15px] font-semibold">
            You have all {stock} {choice ? `in ${choice} ` : ""}in your basket
          </span>
          <button onClick={open} className="flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-cream">
            View basket
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3">
            <QuantityStepper value={qty} max={canAdd} onChange={(q) => setQty(Math.max(1, Math.min(canAdd, q)))} />
            <button
              onClick={() => {
                addToBasket();
                setAdded(true);
                open();
                setTimeout(() => setAdded(false), 2000);
              }}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-clay text-base font-semibold text-white transition-colors hover:bg-clay-dark"
            >
              {added ? (
                <>
                  <CheckIcon size={18} /> Added
                </>
              ) : (
                <>Add to basket · {gbp(price * qty)}</>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              addToBasket();
              router.push("/checkout");
            }}
            className="flex h-14 items-center justify-center rounded-full bg-paypal text-base font-bold text-ink"
          >
            Buy now
          </button>
          {inBasket > 0 && (
            <p className="text-sm text-subtle">
              You have {inBasket} {choice ? `in ${choice} ` : ""}in your basket. {canAdd} more available.
            </p>
          )}
        </>
      )}
    </div>
  );
}