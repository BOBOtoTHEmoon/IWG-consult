"use client";

import { useEffect, useState } from "react";
import ProductImage from "../ProductImage";

// Other parts of the product page (like picking a colour) can ask the gallery to show a photo.
export const SHOW_PHOTO_EVENT = "iwg:show-photo";
export const showProductPhoto = (url: string) =>
  window.dispatchEvent(new CustomEvent<string>(SHOW_PHOTO_EVENT, { detail: url }));

export default function ProductGallery({ images, tint, name }: { images: string[]; tint: string; name: string }) {
  const [active, setActive] = useState(0);
  // With no photos yet, show a single placeholder.
  const slides = images.length > 0 ? images : [undefined];

  useEffect(() => {
    const onShow = (e: Event) => {
      const i = images.indexOf((e as CustomEvent<string>).detail);
      if (i >= 0) setActive(i);
    };
    window.addEventListener(SHOW_PHOTO_EVENT, onShow);
    return () => window.removeEventListener(SHOW_PHOTO_EVENT, onShow);
  }, [images]);

  return (
    <div className="flex flex-col-reverse gap-3 lg:w-[54%] lg:shrink-0 lg:flex-row lg:gap-4 xl:w-auto">
      {slides.length > 1 && (
        <div className="flex shrink-0 gap-3 overflow-x-auto lg:max-h-[620px] lg:flex-col xl:max-h-[760px]">
          {slides.map((src, i) => (
            <button
              key={src ?? i}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={`h-[80px] w-[68px] shrink-0 overflow-hidden rounded-[14px] sm:h-[108px] sm:w-[92px] lg:h-[92px] lg:w-[76px] xl:h-[108px] xl:w-[92px] ${
                active === i ? "ring-2 ring-ink ring-offset-2 ring-offset-cream" : "opacity-80 hover:opacity-100"
              }`}
            >
              <ProductImage src={src} alt="" tint={tint} sizes="92px" className="h-full w-full" />
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
        sizes="(min-width: 1024px) 620px, 100vw"
        className="h-[420px] w-full rounded-3xl sm:h-[600px] lg:h-[620px] lg:w-auto lg:min-w-0 lg:flex-1 xl:h-[760px] xl:w-[620px] xl:flex-none"
      />
    </div>
  );
}