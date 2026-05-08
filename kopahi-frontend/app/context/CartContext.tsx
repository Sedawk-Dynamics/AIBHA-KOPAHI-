"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { api, tokenStore } from "../lib/api";

export type CartItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  category?: string;
  quantity: number;
};

export type AppliedCoupon = {
  code: string;
  percentDiscount: number;
  description?: string;
  discount: number;
};

type CartState = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  /* coupon */
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
};

const STORAGE_KEY = "kopahi_cart";
const COUPON_KEY = "kopahi_coupon";

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const lastSyncedRef = useRef<string>("");

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    try {
      const raw = localStorage.getItem(COUPON_KEY);
      if (raw) setCoupon(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  // persist locally
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon, hydrated]);

  // server sync — when authed, push cart changes (debounced)
  useEffect(() => {
    if (!hydrated) return;
    if (!tokenStore.get()) return;
    const payload = JSON.stringify(items.map((i) => ({ product: i.productId, quantity: i.quantity })));
    if (payload === lastSyncedRef.current) return;
    const handle = setTimeout(() => {
      lastSyncedRef.current = payload;
      api.put("/api/cart", {
        items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
      }, { auth: true }).catch(() => {});
    }, 600);
    return () => clearTimeout(handle);
  }, [items, hydrated]);

  // recompute coupon discount whenever items change (subtotal changes)
  useEffect(() => {
    if (!coupon) return;
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const recalculated = Math.round((subtotal * coupon.percentDiscount) / 100);
    if (recalculated !== coupon.discount) {
      setCoupon({ ...coupon, discount: recalculated });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const add = useCallback<CartState["add"]>((item) => {
    const qty = Math.max(1, item.quantity || 1);
    setItems((cur) => {
      const existing = cur.find((c) => c.productId === item.productId);
      if (existing) {
        return cur.map((c) =>
          c.productId === item.productId
            ? { ...c, quantity: Math.min(50, c.quantity + qty) }
            : c
        );
      }
      return [
        ...cur,
        {
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          category: item.category,
          quantity: qty,
        },
      ];
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((cur) => cur.filter((c) => c.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    setItems((cur) =>
      cur
        .map((c) =>
          c.productId === productId ? { ...c, quantity: Math.max(1, Math.min(50, qty)) } : c
        )
        .filter((c) => c.quantity > 0)
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback(async (code: string) => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const res = await api.post<{
      success: boolean;
      coupon: { code: string; percentDiscount: number; description?: string };
      discount: number;
    }>("/api/orders/coupon/validate", { code, subtotal });
    setCoupon({
      code: res.coupon.code,
      percentDiscount: res.coupon.percentDiscount,
      description: res.coupon.description,
      discount: res.discount,
    });
  }, [items]);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    return { items, count, subtotal, add, remove, setQuantity, clear, coupon, applyCoupon, removeCoupon };
  }, [items, add, remove, setQuantity, clear, coupon, applyCoupon, removeCoupon]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
