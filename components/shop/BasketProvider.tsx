"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PaymentMethod } from "@/lib/payment-methods";

export type BasketItem = {
  key: string; // productId plus option, so black and brown of one wig are separate lines
  productId: string;
  slug: string;
  name: string;
  variant?: string; // e.g. "Black"
  variantLabel?: string; // e.g. "Colour"
  price: number;
  image?: string;
  tint: string;
  stock: number; // stock when it was added, refreshed at checkout
  payments?: PaymentMethod[]; // how it can be paid; older saved baskets don't have this
  qty: number;
};

type AddInput = Omit<BasketItem, "key" | "qty">;

type BasketContext = {
  items: BasketItem[];
  count: number;
  subtotal: number;
  ready: boolean; // false until the saved basket has loaded in the browser
  add: (item: AddInput, qty: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  replace: (items: BasketItem[]) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "iwg-basket-v2";
const Ctx = createContext<BasketContext | null>(null);

export const basketKey = (productId: string, variant?: string) => `${productId}${variant ? `:${variant}` : ""}`;

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside <BasketProvider>");
  return ctx;
}

export default function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load the saved basket once, in the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // Ignore a broken or blocked saved basket.
    }
    setReady(true);
  }, []);

  // Save on every change after loading.
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private browsing can block storage. The basket still works for this visit.
    }
  }, [items, ready]);

  // Keep tabs in sync if the basket changes in another tab.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(e.newValue ? JSON.parse(e.newValue) : []);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((input: AddInput, qty: number) => {  
      const key = basketKey(input.productId, input.variant);
    setItems((current) => {
      const existing = current.find((i) => i.key === key);
      if (existing) {
        return current.map((i) =>
          i.key === key ? { ...i, ...input, qty: Math.min(input.stock, i.qty + qty) } : i
        );
      }
      return [...current, { ...input, key, qty: Math.min(input.stock, qty) }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((current) =>
      current.flatMap((i) => {
        if (i.key !== key) return [i];
        const next = Math.min(i.stock, Math.max(0, qty));
        return next === 0 ? [] : [{ ...i, qty: next }];
      })
    );
  }, []);

  const remove = useCallback((key: string) => setItems((current) => current.filter((i) => i.key !== key)), []);
  const replace = useCallback((next: BasketItem[]) => setItems(next), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<BasketContext>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.qty, 0),
      ready,
      add,
      setQty,
      remove,
      replace,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [items, ready, add, setQty, remove, replace, clear, isOpen]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}