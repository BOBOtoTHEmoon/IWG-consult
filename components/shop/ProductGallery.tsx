"use client";

import { useState } from "react";
import ProductImage from "../ProductImage";

export default function ProductGallery({ images, tint, name }: { images: string[]; tint: string; name: string }) {
  const [active, setActive] = useState(0);
  // With no photos yet, show a single placeholder.
  const slides = images.length > 0 ? images : [undefined];

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {slides.length > 1 && (
        <div className="flex gap-3 overflow-x-auto lg:flex-col">
          {slides.map((src, i) => (
            <button
              key={src ?? i}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`h-[80px] w-[68px] shrink-0 overflow-hidden rounded-[14px] sm:h-[108px] sm:w-[92px] ${
                active === i ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "opacity-80 hover:opacity-100"
              }`}
            >
              <ProductImage src={src} alt="" tint={tint} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
      <ProductImage
        src={slides[active]}
        alt={name}
        tint={tint}
        label="Product photo"
        eager
        className="h-[420px] w-full rounded-3xl sm:h-[600px] lg:h-[760px] lg:w-[620px]"
      />
    </div>
  );
}