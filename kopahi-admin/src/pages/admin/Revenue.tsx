import { useEffect, useMemo, useState } from "react";
import DashboardShell, { PageHeader } from "../../components/DashboardShell";
import { getMonthlyRevenue } from "../../lib/resources/analytics";
import type { MonthlyRevenueRow } from "../../lib/resources/analytics";
import { ApiError } from "../../lib/api";

const formatINR = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN")}`;

const formatMonth = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export default function AdminRevenue() {
  const [monthly, setMonthly] = useState<MonthlyRevenueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getMonthlyRevenue(12)
      .then(setMonthly)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load revenue")
      )
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(
    () => ({
      gross: monthly.reduce((s, m) => s + m.gross, 0),
      commission: monthly.reduce((s, m) => s + m.commission, 0),
      net: monthly.reduce((s, m) => s + m.net, 0),
    }),
    [monthly]
  );

  // Newest month first for the table display.
  const monthlyDesc = useMemo(() => [...monthly].reverse(), [monthly]);

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Revenue"
        desc={
          loading
            ? "Loading…"
            : `Breakdown across ${monthly.length || 0} month${monthly.length === 1 ? "" : "s"} (paid orders only)`
        }
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Revenue" }]}
      />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Gross Revenue</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {loading ? "…" : formatINR(totals.gross)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Platform Commission (10%)</p>
          <p className="text-3xl font-bold text-green-700 tracking-tight">
            {loading ? "…" : formatINR(totals.commission)}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Vendor Payouts</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            {loading ? "…" : formatINR(totals.net)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Monthly Breakdown</h2>
        </div>
        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading…</p>
        ) : monthlyDesc.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No paid orders yet. Revenue rows show up once orders are marked Paid.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Month</th>
                <th className="text-right px-6 py-3 font-medium">Orders</th>
                <th className="text-right px-6 py-3 font-medium">Gross Revenue</th>
                <th className="text-right px-6 py-3 font-medium">Commission (10%)</th>
                <th className="text-right px-6 py-3 font-medium">Vendor Payout</th>
              </tr>
            </thead>
            <tbody>
              {monthlyDesc.map((m) => (
                <tr key={m.month} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{formatMonth(m.month)}</td>
                  <td className="px-6 py-4 text-right text-gray-700">{m.orders}</td>
                  <td className="px-6 py-4 text-right text-gray-900">{formatINR(m.gross)}</td>
                  <td className="px-6 py-4 text-right text-green-700 font-semibold">
                    {formatINR(m.commission)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">{formatINR(m.net)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
