"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

export default function CartPage() {
  const router = useRouter();
  const { items, setQuantity, remove, subtotal, coupon: appliedCoupon, applyCoupon: applyCouponApi, removeCoupon } = useCart();
  const { user } = useAuth();

  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal === 0 || subtotal - discount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  const updateQty = (id: string, delta: number) => {
    const item = items.find((i) => i.productId === id);
    if (!item) return;
    setQuantity(id, item.quantity + delta);
  };

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponError("");
    if (!code) return;
    setCouponLoading(true);
    try {
      await applyCouponApi(code);
      setCoupon("");
    } catch (err: any) {
      setCouponError(err?.message || "Invalid coupon code.");
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

  const cartIsFromBackend = items.length > 0 && !items[0].productId.startsWith("fallback-");

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-50 via-white to-green-50/40 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="uppercase tracking-[0.35em] text-green-700 font-semibold text-sm mb-2">Your Cart</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
            </h1>
          </div>
        </section>

        <section className="py-12 px-6 flex-1">
          <div className="max-w-7xl mx-auto">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 3h2l1 5h13l2-5h-15zm3 8h12l-1 6H7l-1-6z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-3">Nothing here yet</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Browse our catalogue to discover authentic Assam tea, GI-tagged spices, and wild honey.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-gradient-to-r from-green-700 to-green-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 md:px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg">Items</h2>
                    <Link href="/products" className="text-sm font-semibold text-green-700 hover:underline">
                      + Add more
                    </Link>
                  </div>

                  <ul className="divide-y divide-gray-100">
                    {items.map((it) => (
                      <li key={it.productId} className="p-6 md:p-7 flex gap-5">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                          <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              {it.category && (
                                <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                                  {it.category}
                                </span>
                              )}
                              <h3 className="font-bold tracking-tight">{it.name}</h3>
                            </div>
                            <button
                              onClick={() => remove(it.productId)}
                              aria-label={`Remove ${it.name}`}
                              className="text-gray-400 hover:text-red-500 transition shrink-0 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                              </svg>
                            </button>
                          </div>

                          <div className="flex items-end justify-between mt-auto flex-wrap gap-3">
                            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                              <button
                                onClick={() => updateQty(it.productId, -1)}
                                aria-label="Decrease quantity"
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40"
                                disabled={it.quantity <= 1}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-10 text-center font-semibold tabular-nums">{it.quantity}</span>
                              <button
                                onClick={() => updateQty(it.productId, 1)}
                                aria-label="Increase quantity"
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-40"
                                disabled={it.quantity >= 50}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <p className="text-lg font-bold text-green-700 tabular-nums">
                              ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-7 lg:sticky lg:top-[148px]">
                  <h2 className="font-bold text-lg mb-5">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-700">
                        <span>
                          Discount ({appliedCoupon.code})
                          <button
                            onClick={removeCoupon}
                            className="ml-2 text-xs text-gray-400 hover:text-red-500 underline"
                          >
                            remove
                          </button>
                        </span>
                        <span className="font-semibold tabular-nums">−₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold tabular-nums">
                        {shipping === 0 ? <span className="text-green-700">FREE</span> : `₹${shipping}`}
                      </span>
                    </div>

                    {subtotal > 0 && subtotal - discount < SHIPPING_THRESHOLD && (
                      <p className="text-xs text-gray-500 leading-relaxed pt-1">
                        Add ₹{(SHIPPING_THRESHOLD - (subtotal - discount)).toLocaleString("en-IN")} more for free shipping.
                      </p>
                    )}
                  </div>

                  <hr className="my-5" />

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-bold">Total</span>
                    <span className="text-2xl font-bold text-green-700 tabular-nums">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {!appliedCoupon && (
                    <div className="mb-5">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Have a coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                          placeholder="WELCOME10"
                          className="flex-1 border border-gray-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition uppercase"
                        />
                        <button
                          onClick={applyCoupon}
                          disabled={couponLoading}
                          className="px-4 py-2.5 rounded-lg bg-gray-900 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm transition"
                        >
                          {couponLoading ? "…" : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
                      <p className="text-[11px] text-gray-500 mt-2">Try: WELCOME10 · ASSAM15 · FESTIVE25</p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={!cartIsFromBackend}
                    title={!cartIsFromBackend ? "Backend products are required to checkout" : undefined}
                    className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user ? "Proceed to Checkout" : "Log in & Checkout"}
                  </button>

                  {!cartIsFromBackend && (
                    <p className="text-[11px] text-amber-700 mt-2 text-center">
                      Some items are sample data. Refresh from the product page after seeding the backend to checkout.
                    </p>
                  )}

                  <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-[11px] text-gray-500">
                    {[
                      { label: "Secure", icon: "M12 15v2m0 0v2m0-2h2m-2 0h-2m-7-5a7 7 0 1114 0v3a7 7 0 11-14 0v-3z" },
                      { label: "Easy returns", icon: "M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6" },
                      { label: "Fast ship", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                    ].map((b) => (
                      <div key={b.label} className="flex flex-col items-center gap-1.5 text-center">
                        <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d={b.icon} />
                        </svg>
                        {b.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
