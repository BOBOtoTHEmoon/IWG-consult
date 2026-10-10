"use client";

import { useEffect } from "react";
import { CloseIcon } from "../Icons";

// A panel that slides up on phones and appears in the middle on desktop.
export default function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[92vh] w-full flex-col rounded-t-[28px] bg-cream shadow-[0_24px_60px_rgba(26,24,20,0.25)] sm:max-w-[560px] sm:rounded-[28px]"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pl-5 pr-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 flex-col gap-2 border-t border-line bg-paper px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 sm:rounded-b-[28px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}