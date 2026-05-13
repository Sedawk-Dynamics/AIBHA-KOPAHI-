"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EditorialShell from "../components/dashboard/EditorialShell";
import { DashStat, DashCard, StatusPill } from "../components/dashboard/DashPrimitives";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

type ApiOrder = {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  items?: { name: string; quantity: number; image?: string }[];
};

function loyaltyTier(spent: number) {
  if (spent >= 50000) return "Gold";
  if (spent >= 15000) return "Silver";
  if (spent > 0) return "Bronze";
  return "—";
}

function inr(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get<{ orders: ApiOrder[] }>("/api/orders/mine", { auth: true })
      .then((res) => setOrders(res.orders || []))
      .catch((err) => setFetchError(err?.message || "Could not load orders"));
  }, [user]);

  const firstName = (user?.name ?? "Friend").split(" ")[0];
  const totalSpent = (orders || [])
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((s, o) => s + o.totalPrice, 0);
  const recent = (orders || []).slice(0, 5);

  return (
    <EditorialShell
      eyebrow={`→ Welcome back, ${firstName}`}
      title={
        <>
          Your <span className="accent-italic">Kopahi</span> at a glance.
        </>
      }
      actions={
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
        >
          Continue browsing →
        </Link>
      }
    >
      {fetchError && (
        <div className="mb-8 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
          Couldn&apos;t load your orders just now ({fetchError}). The rest of the dashboard is fine.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashStat label="Orders placed" value={orders ? String(orders.length) : "—"} href="/dashboard/orders" />
        <DashStat label="Lifetime spend" value={orders ? inr(totalSpent) : "—"} />
        <DashStat label="Items saved" value="—" href="/dashboard/wishlist" />
        <DashStat label="Loyalty tier" value={loyaltyTier(totalSpent)} />
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashCard
          className="lg:col-span-2"
          title="Recent orders"
          action={
            <Link href="/dashboard/orders" className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold)">
              View all
            </Link>
          }
        >
          {orders === null ? (
            <p className="py-10 text-center text-(--color-bamboo) italic">Reading the books…</p>
          ) : recent.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-display italic text-(--color-bamboo) text-lg">No orders yet.</p>
              <p className="text-sm text-(--color-ink)/60 mt-2 max-w-sm mx-auto">
                Begin with a single origin. Each tile carries a story.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 mt-6 px-5 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Browse origins →
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.22em] text-(--color-bamboo)">
                  <th className="py-3 pr-4 font-medium">Order</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o._id} className="border-t border-(--color-bamboo)/15">
                    <td className="py-4 pr-4">
                      <p className="font-display text-(--color-ink)">#{o._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-(--color-bamboo) italic mt-0.5">{o.items?.[0]?.name ?? "—"}</p>
                    </td>
                    <td className="py-4 pr-4 text-(--color-ink)/75">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 pr-4 font-display text-(--color-moss)">{inr(o.totalPrice)}</td>
                    <td className="py-4"><StatusPill status={o.orderStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DashCard>

        <DashCard title="Quick links">
          <ul className="space-y-1">
            {[
              { href: "/products", label: "Continue browsing" },
              { href: "/dashboard/orders", label: "My orders" },
              { href: "/dashboard/wishlist", label: "Wishlist" },
              { href: "/dashboard/addresses", label: "Addresses" },
              { href: "/dashboard/account", label: "Account settings" },
              { href: "/contact", label: "Need help?" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex items-center justify-between py-3 border-b border-(--color-bamboo)/15 text-(--color-ink) hover:text-(--color-moss) transition-colors group"
                >
                  <span className="font-display">{l.label}</span>
                  <span className="text-(--color-gold) opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </DashCard>
      </div>

      <div className="mt-10">
        <DashCard
          title="A note from Kopahi"
          action={
            <Link href="/journal" className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold)">
              The journal
            </Link>
          }
        >
          <p className="font-display italic text-(--color-bamboo) text-xl leading-snug max-w-2xl">
            “Every leaf has a name. Every name has a face.”
          </p>
          <p className="mt-4 text-(--color-ink)/75 leading-relaxed max-w-2xl">
            Each order you place helps support a verified grower across the seven sister states. We publish what we
            know — when we know it.
          </p>
        </DashCard>
      </div>
    </EditorialShell>
  );
}
