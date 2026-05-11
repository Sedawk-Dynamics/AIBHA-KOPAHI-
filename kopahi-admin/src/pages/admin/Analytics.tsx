import { useEffect, useMemo, useState } from "react";
import DashboardShell, { PageHeader } from "../../components/DashboardShell";
import { getAdminAnalytics, getMonthlyRevenue } from "../../lib/resources/analytics";
import type {
  AdminAnalytics,
  CategoryRow,
  MonthlyRevenueRow,
  TopProductRow,
} from "../../lib/resources/analytics";
import { ApiError } from "../../lib/api";

const CATEGORY_COLORS = [
  "bg-green-600",
  "bg-amber-500",
  "bg-red-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
];

const formatINR = (n: number) => {
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};

const monthShort = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short" });
};

export default function AdminAnalytics() {
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [monthly, setMonthly] = useState<MonthlyRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([getAdminAnalytics(), getMonthlyRevenue(12)])
      .then(([analytics, m]) => {
        setData(analytics);
        setMonthly(m);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load analytics")
      )
      .finally(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Revenue (30d)",
        value: formatINR(data.kpis.revenue30d),
        change: data.kpis.revenueDeltaPct,
      },
      {
        label: "Orders (30d)",
        value: data.kpis.orders30d.toLocaleString("en-IN"),
        change: data.kpis.ordersDeltaPct,
      },
      {
        label: "Avg Order Value",
        value:
          data.kpis.orders30d > 0
            ? formatINR(data.kpis.revenue30d / data.kpis.orders30d)
            : "—",
        change: null,
      },
      {
        label: "Active Customers (30d)",
        value: data.kpis.customers30d.toLocaleString("en-IN"),
        change: null,
      },
    ];
  }, [data]);

  const totalCategorySales = useMemo(
    () => (data?.categories ?? []).reduce((a: number, c: CategoryRow) => a + c.sales, 0),
    [data]
  );

  const maxMonthlyRevenue = useMemo(
    () => Math.max(1, ...monthly.map((m) => m.gross)),
    [monthly]
  );

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Analytics"
        desc={loading ? "Loading…" : "Performance overview for the last 30 days"}
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Analytics" }]}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">{k.label}</p>
              {k.change !== null && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    k.change >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {k.change >= 0 ? "+" : ""}
                  {k.change}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {loading ? "…" : k.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue Trend</h2>
          <p className="text-xs text-gray-500 mb-5">Paid orders, last 12 months</p>
          {monthly.length === 0 ? (
            <p className="text-sm text-gray-500 py-12 text-center">
              {loading ? "Loading…" : "No paid orders yet."}
            </p>
          ) : (
            <>
              <div className="flex items-end gap-2 h-48">
                {monthly.map((m) => (
                  <div
                    key={m.month}
                    className="flex-1 bg-gradient-to-t from-green-700 to-green-400 rounded-t-lg hover:from-green-800 hover:to-green-500 transition-colors relative group"
                    style={{
                      height: `${Math.max(2, (m.gross / maxMonthlyRevenue) * 100)}%`,
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatINR(m.gross)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                {monthly.map((m) => (
                  <span key={m.month}>{monthShort(m.month)}</span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue by Category</h2>
          <p className="text-xs text-gray-500 mb-5">Across all paid orders</p>
          {(data?.categories?.length ?? 0) === 0 ? (
            <p className="text-sm text-gray-500 py-12 text-center">
              {loading ? "Loading…" : "No category data yet."}
            </p>
          ) : (
            <div className="space-y-4">
              {data!.categories.map((c, i) => {
                const pct =
                  totalCategorySales > 0
                    ? Math.round((c.sales / totalCategorySales) * 100)
                    : 0;
                return (
                  <div key={c.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900">
                          {c.category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatINR(c.sales)} · {c.orders} orders
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Top Products</h2>
        <p className="text-xs text-gray-500 mb-5">By revenue, paid orders only</p>
        {(data?.topProducts?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500 py-8 text-center">
            {loading ? "Loading…" : "No sales yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-right px-4 py-3 font-medium">Units sold</th>
                <th className="text-right px-4 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data!.topProducts.map((p: TopProductRow) => (
                <tr key={p.productId} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{p.unitsSold}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatINR(p.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
