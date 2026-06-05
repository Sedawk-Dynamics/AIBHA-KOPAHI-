"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Eyebrow from "../components/marketing/Eyebrow";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;
const GST_RATE = 0.05;

function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function countStates(items: { category?: string }[]) {
  // We don't carry per-item state on the cart shape, so use category as a
  // proxy for "stories" diversity. Reads naturally in the subhead.
  return new Set(items.map((i) => i.category ?? "—")).size;
}

export default function CartPage() {
  const router = useRouter();
  const { items, setQuantity, remove, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = coupon ? coupon.discount : 0;
  const taxable = Math.max(0, subtotal - discount);
  const shipping = subtotal === 0 || taxable >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const gst = Math.round(taxable * GST_RATE);
  const total = taxable + shipping + gst;

  const handleApply = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      await applyCoupon(code);
      setCouponInput("");
    } catch (err) {
      setCouponError(err instanceof ApiError ? err.message : "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const stories = countStates(items);

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink) min-h-screen">
        {/* HERO — compact ~30vh */}
        <section className="pt-28 sm:pt-32 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ Your basket</Eyebrow>
            <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-(--color-ink) max-w-3xl">
              Considered <span className="accent-italic">choices,</span> on their way.
            </h1>
            <p className="mt-6 font-display italic text-(--color-bamboo) text-lg">
              {items.length === 0
                ? "An empty basket is a quiet kind of choice, too."
                : `${itemCount} ${itemCount === 1 ? "item" : "items"} · ${stories} ${stories === 1 ? "story" : "stories"} from across the seven states.`}
            </p>
          </div>
        </section>


        {/* BODY */}
        <section className="pb-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-5">
                  {items.map((it) => (
                    <article
                      key={it.productId}
                      className="rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-5 sm:p-6 transition-shadow hover:shadow-md"
                    >
                      <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[96px_1fr_auto_auto] gap-5 items-start">
                        <div className="relative h-24 w-24 overflow-hidden border border-(--color-bamboo)/30 bg-(--color-ivory)">
                          {it.image && (
                            <Image src={it.image} alt={it.name} fill sizes="96px" className="object-cover" />
                          )}
                        </div>

                        <div className="min-w-0">
                          {it.category && (
                            <p className="eyebrow text-(--color-bamboo)">→ {it.category}</p>
                          )}
                          <h2 className="mt-2 font-display text-xl sm:text-2xl text-(--color-ink) leading-tight">
                            {it.name}
                          </h2>
                          <div className="mt-3 sm:hidden">
                            <QuantityStepper qty={it.quantity} onChange={(q) => setQuantity(it.productId, q)} />
                          </div>
                          <div className="mt-3 sm:hidden flex items-baseline gap-3">
                            <p className="font-display text-(--color-moss) text-xl">
                              {it.price > 0 ? inr(it.price * it.quantity) : "On request"}
                            </p>
                            {it.price > 0 && (
                              <p className="text-xs text-(--color-bamboo)">{inr(it.price)} each</p>
                            )}
                          </div>
                        </div>

                        <div className="hidden sm:block">
                          <QuantityStepper qty={it.quantity} onChange={(q) => setQuantity(it.productId, q)} />
                        </div>

                        <div className="hidden sm:flex flex-col items-end justify-between min-h-24">
                          <p className="font-display text-(--color-moss) text-xl sm:text-2xl">
                            {it.price > 0 ? inr(it.price * it.quantity) : "On request"}
                          </p>
                          {it.price > 0 && (
                            <p className="text-xs text-(--color-bamboo)">{inr(it.price)} each</p>
                          )}
                          <button
                            type="button"
                            onClick={() => remove(it.productId)}
                            className="mt-2 font-display italic text-sm text-(--color-bamboo) hover:text-(--color-chilli) transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="sm:hidden mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove(it.productId)}
                          className="font-display italic text-sm text-(--color-bamboo) hover:text-(--color-chilli) transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                  <p className="font-display italic text-(--color-bamboo) pt-4">
                    Heads up: shipping windows are 3–7 working days for in-stock origins.
                  </p>
                </div>

                <aside className="lg:col-span-4">
                  <div className="lg:sticky lg:top-28 rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-7">
                    <Eyebrow>→ Order summary</Eyebrow>
                    <h2 className="mt-4 font-display text-2xl text-(--color-ink)">Your total</h2>

                    <dl className="mt-6 space-y-3 text-sm">
                      <Row label="Subtotal" value={inr(subtotal)} />
                      {coupon && (
                        <Row
                          label={`Discount · ${coupon.code}`}
                          value={`− ${inr(discount)}`}
                          tone="gold"
                          action={
                            <button
                              type="button"
                              onClick={() => removeCoupon()}
                              className="ml-2 text-xs italic text-(--color-bamboo) hover:text-(--color-chilli)"
                            >
                              remove
                            </button>
                          }
                        />
                      )}
                      <Row
                        label="Shipping"
                        value={
                          shipping === 0 ? (
                            <span className="font-display italic text-(--color-moss)">Free</span>
                          ) : (
                            inr(shipping)
                          )
                        }
                      />
                      <Row label={`GST (${Math.round(GST_RATE * 100)}%)`} value={inr(gst)} />
                    </dl>

                    <div className="mt-6 pt-5 border-t border-(--color-bamboo)/25 flex items-baseline justify-between">
                      <span className="eyebrow">Total</span>
                      <span className="font-display text-3xl text-(--color-moss)">{inr(total)}</span>
                    </div>
                    <span className="block mt-1 h-px w-16 bg-(--color-gold) ml-auto" aria-hidden="true" />

                    {/* Promo */}
                    <div className="mt-6">
                      <label htmlFor="promo" className="eyebrow block mb-2">
                        Promo code
                      </label>
                      <div className="flex items-center border-b border-(--color-bamboo)/40 focus-within:border-(--color-gold) transition-colors">
                        <input
                          id="promo"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          placeholder="WELCOME10"
                          className="flex-1 bg-transparent py-2.5 text-(--color-ink) placeholder:text-(--color-ink)/40 outline-none uppercase tracking-[0.08em]"
                        />
                        <button
                          type="button"
                          onClick={handleApply}
                          disabled={couponLoading || !couponInput.trim()}
                          className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) disabled:opacity-40 transition-colors px-2"
                        >
                          {couponLoading ? "…" : "Apply"}
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-2 text-xs text-(--color-chilli)">{couponError}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckout}
                      className="mt-7 w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                    >
                      Proceed to checkout <span aria-hidden="true">→</span>
                    </button>
                    <Link
                      href="/products"
                      className="mt-3 block text-center text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) py-2"
                    >
                      Continue shopping
                    </Link>

                    <ul className="mt-7 pt-6 border-t border-(--color-bamboo)/20 space-y-2 text-xs uppercase tracking-[0.18em] text-(--color-bamboo)">
                      {["Secure checkout", "FSSAI certified", "7-day returns"].map((c) => (
                        <li key={c} className="flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-(--color-gold)">
                            <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" />
                          </svg>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}

function Row({
  label,
  value,
  tone = "ink",
  action,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: "ink" | "gold";
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-(--color-ink)/70 text-sm flex items-center">
        {label}
        {action}
      </dt>
      <dd className={`font-display ${tone === "gold" ? "text-(--color-gold-dark)" : "text-(--color-ink)"}`}>
        {value}
      </dd>
    </div>
  );
}

function QuantityStepper({ qty, onChange }: { qty: number; onChange: (q: number) => void }) {
  return (
    <div className="inline-flex items-center border-b border-(--color-bamboo)/40">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, qty - 1))}
        aria-label="Decrease quantity"
        className="h-9 w-9 text-(--color-ink)/80 hover:text-(--color-moss) transition-colors"
      >
        −
      </button>
      <span className="px-3 font-display text-(--color-ink) min-w-7 text-center">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label="Increase quantity"
        className="h-9 w-9 text-(--color-ink)/80 hover:text-(--color-moss) transition-colors"
      >
        +
      </button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="py-20 text-center">
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
      <p className="mt-8 font-display italic text-(--color-bamboo) text-2xl sm:text-3xl leading-snug max-w-md mx-auto">
        Your basket is quiet. Let&apos;s change that.
      </p>
      <p className="mt-4 text-sm text-(--color-ink)/65 max-w-md mx-auto leading-relaxed">
        Begin with a single origin — first-flush tea from Naharani, perhaps. Each tile carries a story.
      </p>
      <Link
        href="/products"
        className="mt-10 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
      >
        Discover products <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
