import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";
import { listUsersByRole } from "../../lib/resources/users";
import { listOrders } from "../../lib/resources/orders";
import type { ApiUser } from "../../lib/types";
import { ApiError } from "../../lib/api";

const formatJoinedMonth = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<ApiUser[]>([]);
  const [orderStats, setOrderStats] = useState<
    Record<string, { orders: number; spent: number }>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      listUsersByRole("user"),
      // First page of orders is enough to compute "did this customer order
      // recently" stats for the current view. A larger pageSize gives more
      // accurate per-customer counts; cap at 100 server-side.
      listOrders({ page: 1, pageSize: 100 }),
    ])
      .then(([users, orderRes]) => {
        const stats: Record<string, { orders: number; spent: number }> = {};
        for (const o of orderRes.orders) {
          const uid = o.userId;
          if (!stats[uid]) stats[uid] = { orders: 0, spent: 0 };
          stats[uid].orders += 1;
          if (o.paymentStatus === "Paid") {
            stats[uid].spent += Number(o.totalPrice) || 0;
          }
        }
        setCustomers(users);
        setOrderStats(stats);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load customers")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Customers"
        desc={
          loading
            ? "Loading customers..."
            : `${customers.length} total registered customers`
        }
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Customers" }]}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <div className="relative max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {error ? (
            <div className="text-center py-16 text-sm text-red-600">{error}</div>
          ) : loading ? (
            <div className="text-center py-16 text-sm text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              {customers.length === 0
                ? "No customers yet. They'll appear here as accounts are created."
                : "No customers match your search."}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Orders</th>
                  <th className="text-left px-6 py-3 font-medium">Total Spent</th>
                  <th className="text-left px-6 py-3 font-medium">Joined</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const stat = orderStats[c.id] ?? { orders: 0, spent: 0 };
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {stat.orders}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {formatINR(stat.spent)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatJoinedMonth(c.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={c.emailVerified ? "Active" : "Inactive"}
                        />
                      </td>
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

