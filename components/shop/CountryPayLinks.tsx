"use client";

import Link from "next/link";
import { useState } from "react";
import { countryName } from "@/lib/countries";
import type { ShopProduct } from "@/lib/product-types";

// For products Goody sells through one Stripe payment link per country.
export default function CountryPayLinks({ product }: { product: ShopProduct }) {
  const [country, setCountry] = useState("");
  const link = product.paymentLinks.find((l) => l.country === country);
  const soldOut = product.options.length > 0 ? product.options.every((o) => o.stock <= 0) : product.stock <= 0;

  if (soldOut) {
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

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        Where should we deliver it?
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-14 w-full rounded-xl border-[1.5px] border-line-strong bg-paper px-4 text-base font-normal"
        >
          <option value="" disabled>
            Choose your country
          </option>
          {product.paymentLinks.map((l) => (
            <option key={l.country} value={l.country}>
              {countryName(l.country)}
            </option>
          ))}
        </select>
      </label>

      <a
        href={link?.url}
        aria-disabled={!link}
        onClick={(e) => {
          if (!link) e.preventDefault();
        }}
        className={`flex h-14 items-center justify-center rounded-full bg-clay text-base font-semibold text-white transition-colors ${
          link ? "hover:bg-clay-dark" : "pointer-events-none opacity-50"
        }`}
      >
        {link ? `Pay securely for delivery to ${countryName(link.country)}` : "Choose your country to continue"}
      </a>

      <p className="text-sm text-subtle">
        You&apos;ll see the full price with delivery on Stripe&apos;s secure checkout. Country not listed?{" "}
        <Link href="/contact" className="font-semibold underline">
          Ask Goody
        </Link>
        .
      </p>
    </div>
  );
}
