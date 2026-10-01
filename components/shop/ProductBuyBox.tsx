"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gbp } from "@/lib/data";
import type { ShopProduct } from "@/lib/product-types";
import { CheckIcon } from "../Icons";
import { useBasket } from "./BasketProvider";
import QuantityStepper from "./QuantityStepper";

export default function ProductBuyBox({ product }: { product: ShopProduct }) {
  const router = useRouter();
  const { add, items, open } = useBasket();
  const { colours, stock, price } = product;
  const [qty, setQty] = useState(1);
  const [colour, setColour] = useState(colours[0]?.name);
  const [added, setAdded] = useState(false);

  if (stock === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-5">
        <span className="text-base font-semibold">Sold out for now</span>
        <span className="text-[15px] text-muted">Want one anyway? Goody can source it for you.</span>
        <Link
          href="/sourcing#request"
          className="mt-1 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-cream"
        >
          Request it through sourcing
        </Link>
      </div>
    );
  }

  // Don't let them add more than is left, counting what's already in the basket.
  const key = `${product.id}${colour ? `:${colour}` : ""}`;
  const inBasket = items.find((i) => i.key === key)?.qty ?? 0;
  const canAdd = Math.max(0, stock - inBasket);

  function addToBasket() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        colour,
        price,
        image: product.images[0],
        tint: product.tint,
        stock,
      },
      Math.min(qty, canAdd)
    );
    setQty(1);
  }

  return (
    <div className="flex flex-col gap-5">
      {colours.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-[15px] font-semibold">
            Colour: <span className="font-normal text-muted">{colour}</span>
          </span>
          <div className="flex flex-wrap gap-2.5">
            {colours.map((c) => (
              <button
                key={c.name}
                aria-pressed={colour === c.name}
                onClick={() => setColour(c.name)}
                className={`flex h-11 items-center gap-2.5 rounded-full bg-paper pl-2 pr-4 text-sm font-medium ${
                  colour === c.name ? "border-2 border-ink" : "border-[1.5px] border-line-strong"
                }`}
              >
                <span className="h-7 w-7 rounded-full" style={{ background: c.hex }} />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {canAdd === 0 ? (
        <div className="flex flex-col gap-3 rounded-[18px] border border-line bg-paper p-5">
          <span className="text-[15px] font-semibold">You have all {stock} in your basket</span>
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
              You have {inBasket} in your basket. {canAdd} more available.
            </p>
          )}
        </>
      )}
    </div>
  );
}