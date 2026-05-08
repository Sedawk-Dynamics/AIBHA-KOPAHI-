"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, coupon } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?next=/checkout");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, fullName: f.fullName || user.name || "", phone: f.phone || user.phone || "" }));
  }, [user]);

  if (authLoading || !user) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen flex flex-col">
        <PageShell>
          <section className="py-24 px-6 text-center">
            <h1 className="text-3xl font-bold mb-3">No items to checkout</h1>
            <p className="text-gray-600 mb-6">Add something to your cart first.</p>
            <Link href="/products" className="inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-bold">
              Browse products
            </Link>
          </section>
        </PageShell>
        <Footer />
      </main>
    );
  }

  const discount = coupon?.discount ?? 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal >= 999 ? 0 : 99;
  const tax = Math.round(discountedSubtotal * 0.05);
  const total = discountedSubtotal + shipping + tax;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    for (const k of ["fullName", "phone", "address", "city", "state", "pincode"] as const) {
      if (!form[k].trim()) {
        setError("Please fill in all shipping fields.");
        return;
      }
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; order: { _id: string } }>(
        "/api/orders",
        {
          items: items.map((i) => ({ product: i.productId, quantity: i.quantity })),
          shippingAddress: form,
          paymentMethod,
          couponCode: coupon?.code,
        },
        { auth: true }
      );
      clear();
      router.push(`/dashboard/orders?placed=${res.order._id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not place order. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-50 via-white to-green-50/40 py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <p className="uppercase tracking-[0.35em] text-green-700 font-semibold text-sm mb-2">Checkout</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Complete your order</h1>
          </div>
        </section>

        <section className="py-10 px-6 flex-1">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            <form onSubmit={placeOrder} className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="font-bold text-lg mb-5">Shipping address</h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <input value={form.fullName} onChange={update("fullName")} placeholder="Full name" className="border border-gray-200 px-4 py-3 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                <input value={form.phone} onChange={update("phone")} placeholder="Phone" className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300" />
                <input value={form.pincode} onChange={update("pincode")} placeholder="PIN code" className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300" />
                <input value={form.address} onChange={update("address")} placeholder="Address (house, street)" className="border border-gray-200 px-4 py-3 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
                <input value={form.city} onChange={update("city")} placeholder="City" className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300" />
                <input value={form.state} onChange={update("state")} placeholder="State" className="border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300" />
              </div>

              <h2 className="font-bold text-lg mt-8 mb-3">Payment</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["COD", "Online"] as const).map((p) => (
                  <label key={p} className={`border rounded-xl p-4 cursor-pointer transition ${paymentMethod === p ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" className="sr-only" checked={paymentMethod === p} onChange={() => setPaymentMethod(p)} />
                    <p className="font-semibold">{p === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}</p>
                    <p className="text-xs text-gray-500 mt-1">{p === "COD" ? "Pay when you receive your order" : "Pay securely via Razorpay (if configured)"}</p>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-8 bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Place order · ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>

            <aside className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-7 lg:sticky lg:top-[120px] h-fit">
              <h2 className="font-bold text-lg mb-4">Order summary</h2>
              <ul className="divide-y divide-gray-100 -mx-6 mb-4">
                {items.map((i) => (
                  <li key={i.productId} className="px-6 py-3 flex gap-3 items-center">
                    <img src={i.image} alt={i.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{i.name}</p>
                      <p className="text-xs text-gray-500">Qty {i.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums">₹{(i.price * i.quantity).toLocaleString("en-IN")}</p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span></div>
                {coupon && (
                  <div className="flex justify-between text-green-700">
                    <span>Coupon ({coupon.code})</span>
                    <span className="font-semibold">−₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax (5%)</span><span className="font-semibold">₹{tax}</span></div>
                <div className="flex justify-between text-base pt-2 border-t border-gray-100">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-green-700">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
