"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gbp } from "@/lib/data";
import { BagIcon, CloseIcon } from "../Icons";
import ProductImage from "../ProductImage";
import { useBasket } from "./BasketProvider";
import QuantityStepper from "./QuantityStepper";

export default function BasketDrawer() {
  const { items, count, subtotal, isOpen, close, setQty, remove } = useBasket();
  const pathname = usePathname();

  // Close when the page changes.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  return (
    <div aria-hidden={!isOpen} inert={!isOpen} className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your basket"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-cream shadow-[-20px_0_60px_rgba(26,24,20,0.2)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line px-5">
          <h2 className="font-display text-2xl">
            Basket {count > 0 && <span className="text-subtle">({count})</span>}
          </h2>
          <button onClick={close} aria-label="Close basket" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-clay">
              <BagIcon size={28} />
            </span>
            <p className="text-lg font-semibold">Your basket is empty</p>
            <p className="text-[15px] text-muted">Have a look around and add something you love.</p>
            <Link href="/shop" onClick={close} className="mt-2 flex h-12 items-center rounded-full bg-clay px-6 font-semibold text-white">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3.5">
                  <Link href={`/product/${item.slug}`} onClick={close} className="shrink-0">
                    <ProductImage src={item.image} alt={item.name} tint={item.tint} className="h-24 w-20 rounded-xl" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/product/${item.slug}`} onClick={close} className="font-semibold text-ink hover:underline">
                        {item.name}
                      </Link>
                      <span className="shrink-0 font-semibold">{gbp(item.price * item.qty)}</span>
                    </div>
                    {item.colour && <span className="text-[13px] text-subtle">{item.colour}</span>}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QuantityStepper
                        size="sm"
                        value={item.qty}
                        max={item.stock}
                        onChange={(q) => setQty(item.key, q)}
                        label={`quantity of ${item.name}`}
                      />
                      <button onClick={() => remove(item.key)} className="h-10 px-2 text-sm font-semibold text-clay-dark hover:underline">
                        Remove
                      </button>
                    </div>
                    {item.qty >= item.stock && <span className="text-xs text-subtle">That&apos;s all we have in stock.</span>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex shrink-0 flex-col gap-3 border-t border-line bg-paper px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Subtotal</span>
                <span className="font-display text-2xl">{gbp(subtotal)}</span>
              </div>
              <p className="text-[13px] text-subtle">Delivery is added at checkout.</p>
              <Link href="/checkout" onClick={close} className="flex h-14 items-center justify-center rounded-full bg-clay text-base font-semibold text-white hover:bg-clay-dark">
                Go to checkout
              </Link>
              <button onClick={close} className="h-11 text-[15px] font-semibold text-ink">
                Keep shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}