import { Link } from "react-router-dom";
import DashboardShell from "../../components/DashboardShell";

export default function VendorEarnings() {
  const summary = [
    { label: "Total Earned", value: "₹1,84,500", desc: "Lifetime" },
    { label: "This Month", value: "₹42,300", desc: "April 2026" },
    { label: "Pending Payout", value: "₹18,650", desc: "Releases May 5" },
    { label: "Last Payout", value: "₹38,420", desc: "April 5, 2026" },
  ];

  const monthly = [
    { month: "Apr 2026", gross: 42300, commission: 4230, net: 38070 },
    { month: "Mar 2026", gross: 38420, commission: 3842, net: 34578 },
    { month: "Feb 2026", gross: 41200, commission: 4120, net: 37080 },
    { month: "Jan 2026", gross: 35100, commission: 3510, net: 31590 },
    { month: "Dec 2025", gross: 27480, commission: 2748, net: 24732 },
  ];

  const payouts = [
    { id: "PYT-2026-04", date: "5 Apr 2026", amount: "₹38,420", method: "Bank Transfer", status: "Completed" },
    { id: "PYT-2026-03", date: "5 Mar 2026", amount: "₹37,080", method: "Bank Transfer", status: "Completed" },
    { id: "PYT-2026-02", date: "5 Feb 2026", amount: "₹31,590", method: "Bank Transfer", status: "Completed" },
  ];

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Earnings</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Earnings</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Track your revenue, commissions, and payouts.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.label} className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 bg-gradient-to-br from-green-700 to-green-900 text-white p-5 md:p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-200 mb-1">Next Payout</p>
            <p className="text-2xl md:text-3xl font-bold">₹18,650</p>
            <p className="text-sm text-green-100 mt-1">Will be released to your bank account on 5 May 2026</p>
          </div>
          <button className="bg-white text-green-800 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap">
            View Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 md:p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Monthly Breakdown</h2>
            <p className="text-xs text-gray-500 mt-1">Your earnings over the last 5 months</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Month</th>
                  <th className="text-right px-5 py-3 font-medium">Gross</th>
                  <th className="text-right px-5 py-3 font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-gray-900">{m.month}</td>
                    <td className="px-5 py-3 text-right text-gray-700">₹{m.gross.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3 text-right font-semibold text-green-700">₹{m.net.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 md:p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Payout History</h2>
            <p className="text-xs text-gray-500 mt-1">Past disbursements to your bank</p>
          </div>
          <div className="divide-y divide-gray-100">
            {payouts.map((p) => (
              <div key={p.id} className="p-4 md:p-5 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{p.id}</p>
                  <p className="text-xs text-gray-500">{p.method} · {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{p.amount}</p>
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
