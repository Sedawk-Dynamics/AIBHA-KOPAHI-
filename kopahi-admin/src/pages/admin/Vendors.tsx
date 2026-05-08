import { useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";

const vendors = [
  { id: 1, name: "Brahmaputra Tea Co.", location: "Guwahati, Assam", products: 42, sales: "₹1.84L", status: "Active", joined: "Jan 2024" },
  { id: 2, name: "Hills Organic Farm", location: "Shillong, Meghalaya", products: 28, sales: "₹1.12L", status: "Active", joined: "Mar 2024" },
  { id: 3, name: "Naga Honey Co.", location: "Kohima, Nagaland", products: 14, sales: "₹68K", status: "Active", joined: "Jun 2024" },
  { id: 4, name: "Manipur Spices", location: "Imphal, Manipur", products: 22, sales: "₹95K", status: "Active", joined: "Aug 2024" },
  { id: 5, name: "Sikkim Gardens", location: "Gangtok, Sikkim", products: 18, sales: "₹52K", status: "Inactive", joined: "Sep 2024" },
  { id: 6, name: "Tripura Naturals", location: "Agartala, Tripura", products: 9, sales: "₹28K", status: "Active", joined: "Nov 2024" },
];

export default function AdminVendors() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Vendors"
        desc={`${vendors.filter((v) => v.status === "Active").length} active · ${vendors.filter((v) => v.status === "Inactive").length} inactive`}
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Vendors" }]}
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
              placeholder="Search vendors..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Vendor</th>
                <th className="text-left px-6 py-3 font-medium">Location</th>
                <th className="text-left px-6 py-3 font-medium">Products</th>
                <th className="text-left px-6 py-3 font-medium">Total Sales</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => navigate(`/admin/vendors/${v.id}`)}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                        {v.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-900">{v.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{v.location}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{v.products}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{v.sales}</td>
                  <td className="px-6 py-4 text-gray-500">{v.joined}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} />
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
