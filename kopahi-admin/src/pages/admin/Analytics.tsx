// TODO: This page currently displays mock data. Wire to real APIs in a future task.
import DashboardShell, { PageHeader } from "../../components/DashboardShell";

export default function AdminAnalytics() {
  const kpis = [
    { label: "Revenue (30d)", value: "₹3.42L", change: "+18.2%", sparkline: [40, 45, 50, 48, 55, 62, 58, 65, 72, 78, 75, 82] },
    { label: "Orders (30d)", value: "847", change: "+12.5%", sparkline: [22, 28, 25, 35, 30, 42, 38, 45, 52, 48, 56, 62] },
    { label: "Avg Order Value", value: "₹1,248", change: "+5.3%", sparkline: [60, 58, 62, 65, 60, 68, 70, 65, 72, 75, 70, 78] },
    { label: "Conversion Rate", value: "3.4%", change: "+0.8%", sparkline: [30, 32, 28, 35, 38, 36, 40, 42, 39, 44, 46, 48] },
  ];

  const revenueByCategory = [
    { name: "Tea", value: 142000, percent: 41 },
    { name: "Honey", value: 89000, percent: 26 },
    { name: "Spices", value: 67000, percent: 19 },
    { name: "Rice", value: 49000, percent: 14 },
  ];

  const colors = ["bg-green-600", "bg-amber-500", "bg-red-500", "bg-blue-500"];

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Analytics"
        desc="Performance overview for the last 30 days"
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Analytics" }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((k) => {
          const max = Math.max(...k.sparkline);
          return (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{k.label}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700">{k.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight mb-3">{k.value}</p>
              <svg viewBox={`0 0 ${k.sparkline.length * 10} 50`} className="w-full h-12">
                <polyline
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="2"
                  points={k.sparkline.map((v, i) => `${i * 10},${50 - (v / max) * 45}`).join(" ")}
                />
              </svg>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue Trend</h2>
          <p className="text-xs text-gray-500 mb-5">Last 12 months</p>
          <div className="flex items-end gap-2 h-48">
            {[42, 58, 65, 72, 80, 75, 88, 95, 82, 92, 105, 124].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-700 to-green-400 rounded-t-lg hover:from-green-800 hover:to-green-500 transition-colors relative group"
                style={{ height: `${(h / 124) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₹{h}K
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-2">
            {["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Revenue by Category</h2>
          <p className="text-xs text-gray-500 mb-5">Last 30 days</p>
          <div className="space-y-4">
            {revenueByCategory.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors[i]}`}></div>
                    <span className="text-sm font-medium text-gray-900">{c.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{(c.value / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors[i]} rounded-full transition-all`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
