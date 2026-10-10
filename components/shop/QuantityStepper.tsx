"use client";

import { MinusIcon, PlusIcon } from "../Icons";

export default function QuantityStepper({
  value,
  max,
  onChange,
  size = "md",
  label = "quantity",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const box = size === "sm" ? "h-10" : "h-14";
  const btn = size === "sm" ? "h-10 w-10" : "h-[52px] w-[52px]";
  return (
    <div className={`flex ${box} items-center rounded-full border-[1.5px] border-line-strong bg-paper`}>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(value - 1)}
        className={`flex ${btn} items-center justify-center rounded-full disabled:opacity-40`}
      >
        <MinusIcon size={size === "sm" ? 16 : 18} />
      </button>
      <span className={`${size === "sm" ? "w-6 text-[15px]" : "w-8 text-[17px]"} text-center font-semibold`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={`flex ${btn} items-center justify-center rounded-full disabled:opacity-40`}
      >
        <PlusIcon size={size === "sm" ? 16 : 18} />
      </button>
    </div>
  );
}