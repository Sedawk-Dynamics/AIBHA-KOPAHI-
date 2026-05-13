"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditorialShell from "../../components/dashboard/EditorialShell";
import { DashCard } from "../../components/dashboard/DashPrimitives";
import { CART_OPEN_EVENT } from "../../components/marketing/CartDrawer";
import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

type WishProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
};

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function WishlistPage() {
  const { user } = useAuth();
  const { add } = useCart();
  const [items, setItems] = useState<WishProduct[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api
      .get<{ success: boolean; items: WishProduct[] }>("/api/wishlist", { auth: true })
      .then((res) => {
        if (!cancelled) setItems(res.items || []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load wishlist");
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const remove = async (id: string) => {
    setItems((cur) => (cur ? cur.filter((i) => i._id !== id) : cur));
    try {
      await api.del(`/api/wishlist/${id}`, { auth: true });
    } catch {
      /* best-effort */
    }
  };

  const addOne = (p: WishProduct) => {
    if (p.stock <= 0) return;
    add({
      productId: p._id,
      name: p.name,
      image: p.images?.[0] || "",
      price: p.price,
      category: p.category,
    });
    window.dispatchEvent(new Event(CART_OPEN_EVENT));
  };

  const moveAll = () => {
    const inStock = (items || []).filter((i) => i.stock > 0);
    inStock.forEach((p) =>
      add({
        productId: p._id,
        name: p.name,
        image: p.images?.[0] || "",
        price: p.price,
        category: p.category,
      })
    );
    Promise.all(
      inStock.map((p) => api.del(`/api/wishlist/${p._id}`, { auth: true }).catch(() => {}))
    );
    setItems((cur) => (cur ? cur.filter((i) => i.stock <= 0) : cur));
    if (inStock.length) window.dispatchEvent(new Event(CART_OPEN_EVENT));
  };

  const inStockCount = (items || []).filter((i) => i.stock > 0).length;

  return (
    <EditorialShell
      eyebrow="→ Wishlist"
      title={
        <>
          Origins, <span className="accent-italic">remembered.</span>
        </>
      }
      actions={
        items && items.length > 0 && inStockCount > 0 ? (
          <button
            type="button"
            onClick={moveAll}
            className="inline-flex items-center gap-2 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
          >
            Move all to basket →
          </button>
        ) : null
      }
    >
      {error && (
        <div className="mb-8 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
          {error}
        </div>
      )}

      {items === null ? (
        <p className="py-16 text-center font-display italic text-(--color-bamboo)">Reading your saved origins…</p>
      ) : items.length === 0 ? (
        <DashCard>
          <div className="py-12 text-center">
            <svg
              viewBox="0 0 120 120"
              className="mx-auto w-16 h-16 text-(--color-bamboo)/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <path d="M60 18C40 28 28 48 28 70c20 0 38-12 48-32" strokeLinecap="round" />
              <path d="M60 18C76 36 88 56 88 70c-18 0-36-10-48-32" strokeLinecap="round" />
              <path d="M60 18v82" strokeLinecap="round" />
            </svg>
            <p className="mt-6 font-display italic text-xl text-(--color-bamboo)">
              Nothing saved yet.
            </p>
            <p className="mt-3 text-sm text-(--color-ink)/65 max-w-md mx-auto">
              Save what catches your eye. We&apos;ll keep it here.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
            >
              Browse origins →
            </Link>
          </div>
        </DashCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p) => (
            <article
              key={p._id}
              className="group rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) overflow-hidden hover:border-(--color-gold) transition-colors"
            >
              <div className="relative aspect-square bg-(--color-ivory)">
                {p.images?.[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  />
                )}
                <button
                  type="button"
                  onClick={() => remove(p._id)}
                  aria-label={`Remove ${p.name} from wishlist`}
                  className="absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--color-ivory)/95 text-(--color-chilli) hover:bg-(--color-chilli) hover:text-(--color-ivory) transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 5.65-7 10-7 10" />
                  </svg>
                </button>
                {p.stock <= 0 && (
                  <span className="absolute bottom-3 left-3 px-3 py-1 bg-(--color-moss)/90 text-(--color-ivory) text-[10px] uppercase tracking-[0.22em]">
                    Out of season
                  </span>
                )}
              </div>
              <div className="p-5">
                <p className="eyebrow text-(--color-bamboo)">→ {p.category}</p>
                <h3 className="mt-2 font-display text-xl text-(--color-ink) leading-tight">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-3">
                  <p className="font-display text-(--color-moss) text-lg">{inr(p.price)}</p>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <p className="text-sm text-(--color-bamboo) line-through">{inr(p.originalPrice)}</p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={p.stock <= 0}
                  onClick={() => addOne(p)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {p.stock > 0 ? "Add to basket →" : "Notify when available"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </EditorialShell>
  );
}
