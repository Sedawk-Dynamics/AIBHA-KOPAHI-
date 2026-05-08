"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardShell, { StatusBadge } from "../components/DashboardShell";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

type ApiOrder = {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
  items?: { name: string; quantity: number; image?: string }[];
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login?next=/dashboard"); return; }
    api.get<{ orders: ApiOrder[] }>("/api/orders/mine", { auth: true })
      .then((res) => setOrders(res.orders || []))
      .catch((err) => setFetchError(err?.message || "Could not load orders"));
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <main className="min-h-screen flex items-center justify-center text-gray-500">Loading…</main>;
  }

  const recent = (orders || []).slice(0, 5);
  const totalSpent = (orders || [])
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((s, o) => s + o.totalPrice, 0);

  const stats = [
    { label: "Total orders", value: orders ? String(orders.length) : "—", href: "/dashboard/orders" },
    { label: "Total spent", value: orders ? `₹${totalSpent.toLocaleString("en-IN")}` : "—", href: "/dashboard/orders" },
    { label: "Wishlist", value: "—", href: "/dashboard/wishlist" },
    { label: "Addresses", value: "—", href: "/dashboard/addresses" },
  ];

  return (
    <DashboardShell role="Customer">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {user.name}</h1>
        <p className="text-gray-600 mt-1">Track your orders, manage addresses, and continue shopping.</p>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          Could not load your orders: {fetchError}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-2">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent orders</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            {orders === null ? (
              <div className="text-center py-12 text-sm text-gray-500">Loading orders…</div>
            ) : recent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-gray-700 font-medium">No orders yet</p>
                <p className="text-xs text-gray-500 mt-1">Browse products to place your first order.</p>
                <Link href="/products" className="inline-block mt-4 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-800 text-white text-sm font-semibold">
                  Browse products
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Order</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-left px-6 py-3 font-medium">Total</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.items?.[0]?.name || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{o.totalPrice.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4"><StatusBadge status={o.orderStatus} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick links</h2>
          </div>
          <div className="p-4 space-y-2">
            <Link href="/products" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700">
              Continue shopping
            </Link>
            <Link href="/dashboard/addresses" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Manage addresses
            </Link>
            <Link href="/dashboard/wishlist" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              View wishlist
            </Link>
            <Link href="/dashboard/account" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Account settings
            </Link>
            <Link href="/contact" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
