import DashboardShell, { PageHeader } from "../../components/DashboardShell";

export default function AdminRevenue() {
  const monthly = [
    { month: "Apr 2026", gross: 342000, commission: 34200, net: 307800 },
    { month: "Mar 2026", gross: 289000, commission: 28900, net: 260100 },
    { month: "Feb 2026", gross: 312000, commission: 31200, net: 280800 },
    { month: "Jan 2026", gross: 268000, commission: 26800, net: 241200 },
    { month: "Dec 2025", gross: 245000, commission: 24500, net: 220500 },
  ];

  const totals = {
    gross: monthly.reduce((s, m) => s + m.gross, 0),
    commission: monthly.reduce((s, m) => s + m.commission, 0),
    net: monthly.reduce((s, m) => s + m.net, 0),
  };

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Revenue"
        desc="Detailed breakdown of platform earnings"
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Revenue" }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Gross Revenue (5mo)</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            ₹{(totals.gross / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Total Commission</p>
          <p className="text-3xl font-bold text-green-700 tracking-tight">
            ₹{(totals.commission / 100000).toFixed(1)}L
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm text-gray-500 mb-1">Vendor Payouts</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">
            ₹{(totals.net / 100000).toFixed(1)}L
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Monthly Breakdown</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Month</th>
              <th className="text-right px-6 py-3 font-medium">Gross Revenue</th>
              <th className="text-right px-6 py-3 font-medium">Commission (10%)</th>
              <th className="text-right px-6 py-3 font-medium">Vendor Payout</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((m) => (
              <tr key={m.month} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{m.month}</td>
                <td className="px-6 py-4 text-right text-gray-900">₹{m.gross.toLocaleString("en-IN")}</td>
                <td className="px-6 py-4 text-right text-green-700 font-semibold">
                  ₹{m.commission.toLocaleString("en-IN")}
                </td>
                <td className="px-6 py-4 text-right text-gray-700">₹{m.net.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
