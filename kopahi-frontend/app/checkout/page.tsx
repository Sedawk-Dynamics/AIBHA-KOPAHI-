"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Eyebrow from "../components/marketing/Eyebrow";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

const GST_RATE = 0.05;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

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
    // user is hydrated async — seed name/phone once it lands.
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((f) => ({
        ...f,
        fullName: f.fullName || user.name || "",
        phone: f.phone || user.phone || "",
      }));
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-(--color-ivory) flex items-center justify-center font-display italic text-(--color-bamboo)">
        Loading…
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <LenisProvider>
        <MarketingHeader />
        <main className="bg-(--color-ivory) text-(--color-ink) min-h-screen">
          <section className="pt-28 pb-16 text-center">
            <div className="mx-auto max-w-2xl px-6">
              <Eyebrow>→ Checkout</Eyebrow>
              <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-(--color-ink)">
                Your basket is <span className="accent-italic">quiet.</span>
              </h1>
              <p className="mt-6 font-display italic text-(--color-bamboo) text-lg">
                Add a few origins first — we&apos;ll meet you back here.
              </p>
              <Link
                href="/products"
                className="mt-10 inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Browse origins →
              </Link>
            </div>
          </section>
          <MarketingFooter />
        </main>
        <WhatsAppFab />
      </LenisProvider>
    );
  }

  const discount = coupon?.discount ?? 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(discountedSubtotal * GST_RATE);
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
    <LenisProvider>
      <MarketingHeader />
      <main className="bg-(--color-ivory) text-(--color-ink) min-h-screen">
        {/* HERO */}
        <section className="pt-28 sm:pt-32 pb-10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>→ Checkout</Eyebrow>
            <h1 className="mt-6 font-display font-light tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-(--color-ink) max-w-3xl">
              One last <span className="accent-italic">step.</span>
            </h1>
            <p className="mt-5 font-display italic text-(--color-bamboo)">
              We&apos;ll confirm by email within minutes, ship within a working day.
            </p>
          </div>
        </section>


        <section className="pb-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* FORM */}
            <form onSubmit={placeOrder} className="lg:col-span-8 space-y-10">
              <div className="rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-7 sm:p-8">
                <Eyebrow>→ 01 · Shipping address</Eyebrow>
                <h2 className="mt-3 font-display text-2xl text-(--color-ink)">Where it&apos;s going</h2>

                {error && (
                  <div role="alert" className="mt-5 border border-(--color-chilli)/30 bg-(--color-chilli)/10 px-4 py-3 text-sm text-(--color-chilli)">
                    {error}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field id="fullName" label="Full name" className="sm:col-span-2">
                    <input id="fullName" value={form.fullName} onChange={update("fullName")} autoComplete="name" className="kp-input" />
                  </Field>
                  <Field id="phone" label="Phone">
                    <input id="phone" type="tel" value={form.phone} onChange={update("phone")} autoComplete="tel" className="kp-input" />
                  </Field>
                  <Field id="pincode" label="PIN code">
                    <input
                      id="pincode"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      value={form.pincode}
                      onChange={update("pincode")}
                      autoComplete="postal-code"
                      className="kp-input"
                    />
                  </Field>
                  <Field id="address" label="Address — house, street" className="sm:col-span-2">
                    <input id="address" value={form.address} onChange={update("address")} autoComplete="street-address" className="kp-input" />
                  </Field>
                  <Field id="city" label="City">
                    <input id="city" value={form.city} onChange={update("city")} autoComplete="address-level2" className="kp-input" />
                  </Field>
                  <Field id="state" label="State">
                    <input id="state" value={form.state} onChange={update("state")} autoComplete="address-level1" className="kp-input" />
                  </Field>
                </div>
              </div>

              <div className="rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-7 sm:p-8">
                <Eyebrow>→ 02 · Payment</Eyebrow>
                <h2 className="mt-3 font-display text-2xl text-(--color-ink)">How you&apos;d like to settle</h2>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      { value: "COD", label: "Cash on delivery", body: "Pay the rider on receipt." },
                      { value: "Online", label: "Online · Razorpay", body: "Cards, UPI, netbanking." },
                    ] as const
                  ).map((p) => {
                    const active = paymentMethod === p.value;
                    return (
                      <label
                        key={p.value}
                        className={`block cursor-pointer p-5 border transition-colors ${
                          active
                            ? "border-(--color-gold) bg-(--color-gold)/10"
                            : "border-(--color-bamboo)/30 hover:border-(--color-bamboo)/60"
                        }`}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={active}
                          onChange={() => setPaymentMethod(p.value)}
                        />
                        <p className={`font-display text-lg ${active ? "text-(--color-moss)" : "text-(--color-ink)"}`}>
                          {p.label}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-(--color-bamboo)">{p.body}</p>
                      </label>
                    );
                  })}
                </div>
                {paymentMethod === "Online" && (
                  <p className="mt-3 text-xs italic text-(--color-bamboo)">
                    Razorpay integration pending — you can place a COD order today.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors disabled:opacity-60"
              >
                {submitting ? "Placing order…" : <>Place order · {inr(total)}<span aria-hidden="true">→</span></>}
              </button>
            </form>

            {/* SUMMARY */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28 rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm) p-7">
                <Eyebrow>→ Your basket</Eyebrow>
                <h2 className="mt-3 font-display text-2xl text-(--color-ink)">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </h2>

                <ul className="mt-6 divide-y divide-(--color-bamboo)/15">
                  {items.map((it) => (
                    <li key={it.productId} className="py-4 flex items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-(--color-ivory) border border-(--color-bamboo)/25">
                        {it.image && <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-(--color-ink) leading-tight">{it.name}</p>
                        <p className="text-xs text-(--color-bamboo) mt-0.5">× {it.quantity}</p>
                      </div>
                      <p className="font-display text-(--color-moss)">
                        {it.price > 0 ? inr(it.price * it.quantity) : "—"}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 space-y-2.5 text-sm">
                  <Row label="Subtotal" value={inr(subtotal)} />
                  {coupon && <Row label={`Discount · ${coupon.code}`} value={`− ${inr(discount)}`} tone="gold" />}
                  <Row
                    label="Shipping"
                    value={shipping === 0 ? <span className="font-display italic text-(--color-moss)">Free</span> : inr(shipping)}
                  />
                  <Row label={`GST (${Math.round(GST_RATE * 100)}%)`} value={inr(tax)} />
                </dl>

                <div className="mt-5 pt-5 border-t border-(--color-bamboo)/25 flex items-baseline justify-between">
                  <span className="eyebrow">Total</span>
                  <span className="font-display text-3xl text-(--color-moss)">{inr(total)}</span>
                </div>
                <span className="block mt-1 h-px w-16 bg-(--color-gold) ml-auto" aria-hidden="true" />

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

                <Link
                  href="/cart"
                  className="mt-6 block text-center text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) py-2"
                >
                  ← Back to basket
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <MarketingFooter />
      </main>
      <WhatsAppFab />

      <style jsx>{`
        :global(.kp-input) {
          width: 100%;
          background: transparent;
          border-bottom: 1px solid color-mix(in srgb, var(--color-bamboo) 45%, transparent);
          padding: 0.75rem 0;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s;
        }
        :global(.kp-input:focus) {
          border-color: var(--color-gold);
        }
      `}</style>
    </LenisProvider>
  );
}

function Field({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block eyebrow mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ label, value, tone = "ink" }: { label: React.ReactNode; value: React.ReactNode; tone?: "ink" | "gold" }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-(--color-ink)/70">{label}</dt>
      <dd className={`font-display ${tone === "gold" ? "text-(--color-gold-dark)" : "text-(--color-ink)"}`}>
        {value}
      </dd>
    </div>
  );
}
