"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gbp } from "@/lib/data";
import type { ShopProduct } from "@/lib/product-types";
import { CheckIcon } from "../Icons";
import { showProductPhoto } from "./ProductGallery";
import { basketKey, useBasket } from "./BasketProvider";
import QuantityStepper from "./QuantityStepper";

export default function ProductBuyBox({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const { add, items, open } = useBasket();
  const { options, optionLabel, price } = product;
  const hasOptions = options.length > 0;

  // Start on the first option that's in stock.
  const [choice, setChoice] = useState<string | undefined>(
    hasOptions ? (options.find((o) => o.stock > 0) ?? options[0]).name : undefined
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selected = hasOptions ? options.find((o) => o.name === choice) : undefined;
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
        variantLabel: hasOptions ? optionLabel : undefined,
        price,
                image: selected?.imageUrl ?? product.images[0],
        tint: product.tint,
        stock,
      },
      Math.min(qty, canAdd)
    );
    setQty(1);
  }

  return (
    <div className="flex flex-col gap-5">
      {hasOptions && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[15px] font-semibold">
            {optionLabel}: <span className="font-normal text-muted">{choice}</span>
            {selected && selected.stock > 0 && selected.stock <= 3 && (
              <span className="ml-2 text-sm font-semibold text-clay">Only {selected.stock} left</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {options.map((o) => {
              const soldOut = o.stock <= 0;
              const on = choice === o.name;
              return (
                <button
                  key={o.name}
                  type="button"
                  aria-pressed={on}
                  disabled={soldOut}
                                    onClick={() => {
                    setChoice(o.name);
                    setQty(1);
                    if (o.imageUrl) showProductPhoto(o.imageUrl);
                  }}
                  aria-label={soldOut ? `${o.name}, sold out` : o.name}
                  className={`flex h-11 items-center gap-2.5 rounded-full bg-paper text-sm font-medium transition-colors ${
                    o.imageUrl || o.hex ? "pl-1.5 pr-4" : "px-4"
                  } ${on ? "border-2 border-ink" : "border-[1.5px] border-line-strong hover:border-ink"} ${
                    soldOut ? "cursor-not-allowed text-subtle line-through opacity-50 hover:border-line-strong" : ""
                  }`}
                >
                  {o.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={o.imageUrl} alt="" className="h-8 w-8 rounded-full border border-black/10 object-cover" />
                  ) : (
                    o.hex && <span className="h-7 w-7 rounded-full border border-black/10" style={{ background: o.hex }} />
                  )}
                  {o.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {canAdd === 0 ? (
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