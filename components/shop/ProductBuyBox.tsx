"use client";

import Link from "next/link";
import { useState } from "react";
import { gbp } from "@/lib/data";
import { MinusIcon, PlusIcon } from "../Icons";

export default function ProductBuyBox({
  price,
  colours,
  stock,
}: {
  price: number;
  colours?: { name: string; hex: string }[];
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const [colour, setColour] = useState(colours?.[0]?.name);
  const soldOut = stock === 0;

  if (soldOut) {
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

  return (
    <div className="flex flex-col gap-5">
      {colours && colours.length > 0 && (
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

      <div className="flex gap-3">
        <div className="flex h-14 items-center rounded-full border-[1.5px] border-line-strong bg-paper">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
          >
            <MinusIcon size={18} />
          </button>
          <span className="w-8 text-center text-[17px] font-semibold" aria-live="polite">{qty}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
          >
            <PlusIcon size={18} />
          </button>
        </div>
        {/* TODO: add to basket state, then go to checkout */}
        <Link
          href="/checkout"
          className="flex h-14 flex-1 items-center justify-center rounded-full bg-clay text-base font-semibold text-white hover:bg-clay-dark"
        >
          Add to basket · {gbp(price * qty)}
        </Link>
      </div>
      <Link
        href="/checkout"
        className="flex h-14 items-center justify-center rounded-full bg-paypal text-base font-bold text-ink"
      >
        Buy now with PayPal
      </Link>
    </div>
  );
}