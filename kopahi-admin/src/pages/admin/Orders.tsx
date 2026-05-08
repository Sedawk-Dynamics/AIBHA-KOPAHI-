import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";

const allOrders = [
  { id: "KP-2847", customer: "Rahul Sharma", email: "rahul@example.com", product: "Assam Tea Premium", amount: "₹1,499", status: "Delivered", date: "26 Apr 2026" },
  { id: "KP-2846", customer: "Priya Das", email: "priya@example.com", product: "Wild Forest Honey", amount: "₹899", status: "Shipped", date: "26 Apr 2026" },
  { id: "KP-2845", customer: "Ankit Jain", email: "ankit@example.com", product: "Black Rice 5kg", amount: "₹3,495", status: "Processing", date: "25 Apr 2026" },
  { id: "KP-2844", customer: "Sneha Roy", email: "sneha@example.com", product: "Lakadong Turmeric", amount: "₹649", status: "Delivered", date: "25 Apr 2026" },
  { id: "KP-2843", customer: "Amit Verma", email: "amit@example.com", product: "Bhut Jolokia Pack", amount: "₹1,299", status: "Pending", date: "24 Apr 2026" },
  { id: "KP-2842", customer: "Meera Iyer", email: "meera@example.com", product: "Assam Tea Gift Pack", amount: "₹2,299", status: "Delivered", date: "24 Apr 2026" },
  { id: "KP-2841", customer: "Vikram Singh", email: "vikram@example.com", product: "Green Tea 500g", amount: "₹899", status: "Shipped", date: "23 Apr 2026" },
  { id: "KP-2840", customer: "Anjali Roy", email: "anjali@example.com", product: "Masala Chai Blend", amount: "₹649", status: "Processing", date: "23 Apr 2026" },
];

export default function AdminOrders() {
  const navigate = useNavigate();
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
    <DashboardShell role="Admin">
      <PageHeader
        title="Orders"
        desc={`${allOrders.length} total orders · ${allOrders.filter((o) => o.status === "Pending" || o.status === "Processing").length} need attention`}
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Orders" }]}
        action={
          <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        }
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
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === s ? "bg-green-700 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">No orders match your filters.</div>
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
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">#{o.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{o.product}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{o.customer}</p>
                      <p className="text-xs text-gray-500">{o.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{o.date}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{o.amount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
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
      </div>
    </DashboardShell>
  );
}
