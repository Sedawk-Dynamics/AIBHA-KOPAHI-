import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { vendorOrders } from "../../lib/resources/orders";
import { vendorProducts } from "../../lib/resources/products";
import { ApiError } from "../../lib/api";
import type { ApiOrder, ApiProduct, OrderStatus } from "../../lib/types";

const STATUS_OPTIONS: ReadonlyArray<"All" | OrderStatus> = [
  "All",
  "Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatINR = (n: number | string) =>
  `₹${Number(n).toLocaleString("en-IN")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function VendorOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [vendorProductIds, setVendorProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      vendorOrders(),
      vendorProducts().catch((): ApiProduct[] => []),
    ])
      .then(([o, prods]) => {
        setOrders(o);
        setVendorProductIds(new Set(prods.map((p) => p.id)));
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load orders")
      )
      .finally(() => setLoading(false));
  }, []);

  // Per-order, sum only the line items belonging to this vendor's catalogue.
  const orderSubtotalForVendor = (o: ApiOrder): number => {
    let total = 0;
    for (const item of o.items) {
      const ownedById = item.productId && vendorProductIds.has(item.productId);
      const ownedByJoin =
        (item as { product?: { vendorId?: string | null } }).product?.vendorId ===
        user?.id;
      if (ownedById || ownedByJoin) {
        total += Number(item.price) * item.quantity;
      }
    }
    return total;
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        statusFilter === "All" || o.orderStatus === statusFilter;
      if (!matchStatus) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const idMatch = o._id.toLowerCase().includes(q);
      const customerMatch = (o.user?.name ?? "").toLowerCase().includes(q);
      const productMatch = o.items.some((i) => i.name.toLowerCase().includes(q));
      return idMatch || customerMatch || productMatch;
    });
  }, [orders, search, statusFilter]);

  const pendingCount = orders.filter(
    (o) => o.orderStatus === "Placed" || o.orderStatus === "Processing"
  ).length;

  return (
    <DashboardShell
      role="Vendor"
      userName={user?.businessName || user?.name}
      userEmail={user?.email}
    >
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">Orders</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {loading
              ? "Loading..."
              : `${orders.length} total · ${pendingCount} need attention`}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === s
                    ? "bg-green-700 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-12 text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">
              {orders.length === 0
                ? "No orders yet — they'll appear here as customers buy your products."
                : "No orders match your filters."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Order</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Your Items</th>
                  <th className="text-left px-6 py-3 font-medium">Subtotal</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const subtotal = orderSubtotalForVendor(o);
                  return (
                    <tr key={o._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.items[0]?.name ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{o.user?.name ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(o.createdAt)}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {o.items.filter((i) =>
                          (i.productId && vendorProductIds.has(i.productId)) ||
                          (i as { product?: { vendorId?: string | null } }).product?.vendorId === user?.id
                        ).reduce((sum, i) => sum + i.quantity, 0)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {formatINR(subtotal)}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={o.orderStatus} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
