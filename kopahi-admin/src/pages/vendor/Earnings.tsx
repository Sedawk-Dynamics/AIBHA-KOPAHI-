import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { getVendorEarnings } from "../../lib/resources/analytics";
import type { VendorEarnings } from "../../lib/resources/analytics";
import { ApiError } from "../../lib/api";

const formatINR = (n: number) => {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export default function VendorEarnings() {
  const { user } = useAuth();
  const [data, setData] = useState<VendorEarnings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getVendorEarnings()
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load earnings")
      )
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    if (!data) return [];
    const thisMonth = data.monthly[data.monthly.length - 1];
    const lastMonth = data.monthly[data.monthly.length - 2];
    const avgOrder =
      data.ordersFulfilled > 0
        ? data.totalRevenue / data.ordersFulfilled
        : 0;
    return [
      { label: "Total Earned", value: formatINR(data.totalRevenue), desc: "Lifetime, paid orders" },
      {
        label: "This Month",
        value: thisMonth ? formatINR(thisMonth.revenue) : "₹0",
        desc: thisMonth ? formatMonth(thisMonth.month) : "—",
      },
      {
        label: "Last Month",
        value: lastMonth ? formatINR(lastMonth.revenue) : "₹0",
        desc: lastMonth ? formatMonth(lastMonth.month) : "—",
      },
      {
        label: "Avg Order Value",
        value: formatINR(avgOrder),
        desc: `${data.ordersFulfilled} fulfilled`,
      },
    ];
  }, [data]);

  // 10% platform commission, matches the Revenue page placeholder.
  const monthlyRows = useMemo(() => {
    if (!data) return [];
    return [...data.monthly].reverse().map((m) => {
      const commission = Math.round(m.revenue * 0.1);
      return { ...m, commission, net: m.revenue - commission };
    });
  }, [data]);

  return (
    <DashboardShell
      role="Vendor"
      userName={user?.businessName || user?.name}
      userEmail={user?.email}
    >
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Earnings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">
          {loading ? "Loading…" : "Track your revenue, commissions, and top products."}
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.label} className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Monthly Breakdown</h2>
            <p className="text-xs text-gray-500 mt-1">Last 12 months (paid orders only)</p>
          </div>
          {monthlyRows.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              {loading
                ? "Loading…"
                : "No paid orders yet — share your products to start earning."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Month</th>
                  <th className="text-right px-5 py-3 font-medium">Revenue</th>
                  <th className="text-right px-5 py-3 font-medium">Commission</th>
                  <th className="text-right px-5 py-3 font-medium">Payout</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRows.map((m) => (
                  <tr key={m.month} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-900">{formatMonth(m.month)}</td>
                    <td className="px-5 py-3 text-right">{formatINR(m.revenue)}</td>
                    <td className="px-5 py-3 text-right text-amber-700">
                      −{formatINR(m.commission)}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {formatINR(m.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Products</h2>
            <p className="text-xs text-gray-500 mt-1">By revenue, paid orders only</p>
          </div>
          {(data?.topProducts?.length ?? 0) === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">
              {loading ? "Loading…" : "No product sales yet."}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {data!.topProducts.map((p, i) => (
                <li key={p.productId} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      #{i + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.units} units</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">{formatINR(p.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
