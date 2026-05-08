import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";

const allOrders = [
  { id: "KP-2847", customer: "Rahul Sharma", product: "Assam Tea Premium 250g", qty: 3, amount: "₹1,499", status: "Processing", date: "26 Apr 2026" },
  { id: "KP-2841", customer: "Meera Iyer", product: "Assam Tea Gift Pack", qty: 1, amount: "₹2,299", status: "Shipped", date: "25 Apr 2026" },
  { id: "KP-2839", customer: "Vikram Singh", product: "Green Tea 500g", qty: 1, amount: "₹899", status: "Delivered", date: "24 Apr 2026" },
  { id: "KP-2835", customer: "Anjali Roy", product: "Masala Chai Blend", qty: 1, amount: "₹649", status: "Delivered", date: "23 Apr 2026" },
  { id: "KP-2832", customer: "Rohan Kapoor", product: "White Tea Reserve", qty: 2, amount: "₹2,998", status: "Pending", date: "22 Apr 2026" },
  { id: "KP-2828", customer: "Divya Patel", product: "Green Tea 500g", qty: 1, amount: "₹899", status: "Delivered", date: "21 Apr 2026" },
];

export default function VendorOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = allOrders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered"];

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">Orders</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">{allOrders.length} total orders · {allOrders.filter((o) => o.status === "Pending" || o.status === "Processing").length} need attention</p>
        </div>
        <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 md:px-5 py-2.5 rounded-xl font-medium text-sm inline-flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export
        </button>
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

        <div className="lg:hidden divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">No orders match your filters.</p>
          ) : (
            filtered.map((o) => (
              <div key={o.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">#{o.id}</p>
                    <p className="text-xs text-gray-500 truncate">{o.product} × {o.qty}</p>
                  </div>
                  <p className="font-bold text-gray-900">{o.amount}</p>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm text-gray-600">{o.customer} · {o.date}</p>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">No orders match your filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Order</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                  <th className="text-left px-6 py-3 font-medium">Qty</th>
                  <th className="text-left px-6 py-3 font-medium">Amount</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">#{o.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{o.product}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{o.customer}</td>
                    <td className="px-6 py-4 text-gray-500">{o.date}</td>
                    <td className="px-6 py-4 text-gray-600">{o.qty}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{o.amount}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
