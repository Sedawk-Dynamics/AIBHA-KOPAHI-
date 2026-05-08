import { useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";

const customers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", orders: 12, spent: "₹18,492", joined: "Jan 2025", status: "Active" },
  { id: 2, name: "Priya Das", email: "priya@example.com", orders: 8, spent: "₹9,847", joined: "Feb 2025", status: "Active" },
  { id: 3, name: "Ankit Jain", email: "ankit@example.com", orders: 15, spent: "₹24,310", joined: "Mar 2025", status: "Active" },
  { id: 4, name: "Sneha Roy", email: "sneha@example.com", orders: 6, spent: "₹7,290", joined: "Apr 2025", status: "Active" },
  { id: 5, name: "Amit Verma", email: "amit@example.com", orders: 3, spent: "₹4,120", joined: "Apr 2025", status: "Inactive" },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Customers"
        desc={`${customers.length} total registered customers`}
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
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{c.orders}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{c.spent}</td>
                  <td className="px-6 py-4 text-gray-500">{c.joined}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
