"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCart } from "../../context/CartContext";

// Open the drawer from anywhere by dispatching this event.
// ProductCTAs (and any future Add-to-cart trigger) fires it.
export const CART_OPEN_EVENT = "kopahi:cart-open";

function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer() {
  const reduce = useReducedMotion();
  const { items, subtotal, setQuantity, remove } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(CART_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CART_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-(--color-moss-dark)/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Your basket"
            aria-modal="true"
            initial={reduce ? false : { x: "100%" }}
            animate={reduce ? undefined : { x: 0 }}
            exit={reduce ? undefined : { x: "100%" }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full sm:w-[420px] bg-(--color-ivory) flex flex-col shadow-2xl"
          >
            <header className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-(--color-bamboo)/20">
              <div>
                <p className="eyebrow">Your basket</p>
                <p className="font-display text-2xl text-(--color-ink) mt-1">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close basket"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-(--color-bamboo)/30 text-(--color-ink) hover:border-(--color-gold) transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <p className="font-display italic text-(--color-bamboo) text-xl">Your basket is empty.</p>
                  <p className="mt-3 text-sm text-(--color-ink)/65 max-w-xs">
                    Begin with a single origin. Each tile carries a story.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                  >
                    Browse origins →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-(--color-bamboo)/20">
                  {items.map((item) => (
                    <li key={item.productId} className="px-6 sm:px-8 py-5 flex gap-4">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden bg-(--color-ivory-warm)">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="eyebrow text-(--color-bamboo)">{item.category ?? "Origin"}</p>
                        <h3 className="font-display text-lg text-(--color-ink) leading-tight mt-1">{item.name}</h3>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center border-b border-(--color-bamboo)/40">
                            <button
                              type="button"
                              aria-label="Decrease"
                              onClick={() => setQuantity(item.productId, Math.max(0, item.quantity - 1))}
                              className="h-8 w-8 text-(--color-ink)/80 hover:text-(--color-moss) transition-colors"
                            >
                              −
                            </button>
                            <span className="px-3 font-display text-(--color-ink) min-w-6 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase"
                              onClick={() => setQuantity(item.productId, item.quantity + 1)}
                              className="h-8 w-8 text-(--color-ink)/80 hover:text-(--color-moss) transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-display text-(--color-moss) text-lg">
                            {item.price > 0 ? inr(item.price * item.quantity) : "—"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => remove(item.productId)}
                        className="h-8 w-8 shrink-0 text-(--color-bamboo) hover:text-(--color-chilli) transition-colors"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-(--color-bamboo)/20 px-6 sm:px-8 py-6 space-y-4">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">Subtotal</p>
                  <p className="font-display text-3xl text-(--color-moss)">
                    {subtotal > 0 ? inr(subtotal) : "On request"}
                  </p>
                </div>
                <p className="text-xs italic text-(--color-ink)/55">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="block text-center px-6 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                >
                  Checkout →
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className="block text-center text-(--color-gold-dark) hover:text-(--color-gold) text-[12px] uppercase tracking-[0.22em] py-2"
                >
                  View full cart
                </Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
