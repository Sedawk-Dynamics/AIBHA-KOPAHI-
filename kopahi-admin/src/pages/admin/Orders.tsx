import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";
import { listOrders } from "../../lib/resources/orders";
import type { ApiOrder, OrderStatus } from "../../lib/types";
import { ApiError } from "../../lib/api";

const STATUS_OPTIONS: ReadonlyArray<"All" | OrderStatus> = [
  "All",
  "Placed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAGE_SIZE = 20;

const formatINR = (amount: number | string) =>
  `₹${Number(amount).toLocaleString("en-IN")}`;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [page, setPage] = useState(1);

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listOrders({ status: statusFilter, page, pageSize: PAGE_SIZE })
      .then((res) => {
        setOrders(res.orders);
        setTotalCount(res.count);
        setPages(res.pages);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load orders")
      )
      .finally(() => setLoading(false));
  }, [statusFilter, page]);

  // Search filters client-side over the page already on screen.
  const filtered = useMemo(() => {
    if (!search.trim()) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => {
      const idMatch = o._id.toLowerCase().includes(q);
      const customerMatch =
        (o.user?.name ?? "").toLowerCase().includes(q) ||
        (o.user?.email ?? "").toLowerCase().includes(q);
      const productMatch = o.items.some((i) => i.name.toLowerCase().includes(q));
      return idMatch || customerMatch || productMatch;
    });
  }, [orders, search]);

  const needsAttentionCount = useMemo(
    () =>
      orders.filter(
        (o) => o.orderStatus === "Placed" || o.orderStatus === "Processing"
      ).length,
    [orders]
  );

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Orders"
        desc={
          loading
            ? "Loading orders..."
            : `${totalCount} total orders · ${needsAttentionCount} on this page need attention`
        }
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Orders" }]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search this page..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
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
          {error ? (
            <div className="text-center py-16 text-sm text-red-600">{error}</div>
          ) : loading ? (
            <div className="text-center py-16 text-sm text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              {orders.length === 0
                ? "No orders yet. They'll appear here as customers place them."
                : "No orders match your search on this page."}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Order</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o._id}
                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        #{o._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {o.items[0]?.name ?? "—"}
                        {o.items.length > 1 ? ` + ${o.items.length - 1} more` : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{o.user?.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{o.user?.email ?? ""}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(o.createdAt)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatINR(o.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.orderStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <svg className="w-4 h-4 text-gray-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            <span>
              Page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
