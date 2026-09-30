"use client";

import { useState } from "react";
import PhotoPlaceholder from "../PhotoPlaceholder";
import { HeartIcon } from "../Icons";

const shots = ["Front view", "Place setting", "Close-up", "Styled"];
const shade = ["", "#ddd0bc", "#e9dccb", "#d9c6b0"];

export default function ProductGallery({ tint }: { tint: string }) {
  const [active, setActive] = useState(0);
  const tints = shots.map((_, i) => (i === 0 ? tint : shade[i]));

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      <div className="flex gap-3 lg:flex-col">
        {shots.map((s, i) => (
          <button
            key={s}
            aria-label={`Show ${s.toLowerCase()}`}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
            className={`h-[80px] w-[68px] rounded-[14px] sm:h-[108px] sm:w-[92px] ${
              active === i ? "border-2 border-ink" : "border border-line"
            }`}
            style={{ background: tints[i] }}
          />
        ))}
      </div>
      <div className="relative w-full lg:w-[620px]">
        <PhotoPlaceholder
          tint={tints[active]}
          label={`Product photo, ${shots[active].toLowerCase()}`}
          className="h-[420px] rounded-3xl sm:h-[600px] lg:h-[760px]"
        />
        <button
          aria-label="Save to wishlist"
          className="absolute right-[18px] top-[18px] flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink"
        >
          <HeartIcon />
        </button>
      </div>
    </div>
  );
}
