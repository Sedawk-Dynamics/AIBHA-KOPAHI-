"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

type ApiOrder = {
  _id: string;
  items: { name: string; quantity: number; image?: string }[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
};

/* ============================================================
   CUSTOMER MY ORDERS
   File: app/dashboard/orders/page.tsx
============================================================ */

const orders = [
  { id: "KP-2847", date: "26 Apr, 2026", product: "Assam Tea Premium 250g", qty: 3, amount: "₹1,499", status: "Shipped", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80" },
  { id: "KP-2812", date: "18 Apr, 2026", product: "Wild Forest Honey 500g", qty: 1, amount: "₹899", status: "Delivered", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=80" },
  { id: "KP-2789", date: "10 Apr, 2026", product: "Black Rice 5kg + Turmeric", qty: 1, amount: "₹3,495", status: "Delivered", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80" },
  { id: "KP-2734", date: "28 Mar, 2026", product: "Bhut Jolokia Spice Pack", qty: 2, amount: "₹1,299", status: "Delivered", image: "https://images.unsplash.com/photo-1583286814430-1c2f9af2716b?w=200&q=80" },
  { id: "KP-2698", date: "15 Mar, 2026", product: "Lakadong Turmeric 250g", qty: 1, amount: "₹649", status: "Delivered", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80" },
  { id: "KP-2654", date: "2 Mar, 2026", product: "Tulsi Herbal Tea", qty: 1, amount: "₹349", status: "Cancelled", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80" },
];

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [liveOrders, setLiveOrders] = useState<ApiOrder[] | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login?next=/dashboard/orders"); return; }

    api
      .get<{ orders: ApiOrder[] }>("/api/orders/mine", { auth: true })
      .then((res) => setLiveOrders(res.orders || []))
      .catch((err) => setFetchError(err.message || "Could not load orders"));
  }, [authLoading, user, router]);

  const sourceOrders = liveOrders
    ? liveOrders.map((o) => ({
        id: o._id.slice(-6).toUpperCase(),
        date: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        product: o.items.map((i) => i.name).join(", ") || "—",
        qty: o.items.reduce((s, i) => s + i.quantity, 0),
        amount: `₹${o.totalPrice.toLocaleString("en-IN")}`,
        status: o.orderStatus,
        image: o.items[0]?.image || "https://placehold.co/200x200/14532d/ffffff?text=Kopahi",
      }))
    : orders;

  const filtered = sourceOrders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Shipped", "Delivered", "Cancelled"];

  return (
    <DashboardShell role="Customer" userName={user?.name} userEmail={user?.email}>
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/dashboard" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">My Orders</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">{sourceOrders.length} total orders · {sourceOrders.filter((o) => o.status === "Shipped").length} arriving soon</p>
        {fetchError && <p className="text-xs text-red-600 mt-1">{fetchError}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-green-700 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="font-semibold text-gray-900">No orders found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filtered.map((o) => (
              <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="block p-4 md:p-5 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <img src={o.image} alt={o.product} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm md:text-base font-bold text-gray-900">#{o.id}</p>
                          <StatusBadge status={o.status} />
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-1">{o.product}</p>
                      </div>
                      <p className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">{o.amount}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                      <p className="text-xs text-gray-500">Qty: {o.qty} · Ordered on {o.date}</p>
                      <span className="text-xs font-medium text-green-700 inline-flex items-center gap-1">
                        {o.status === "Shipped" ? "Track order" : "View details"}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}