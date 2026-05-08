import { useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";

const products = [
  { id: 1, name: "Assam Tea Premium", vendor: "Brahmaputra Tea Co.", price: 499, stock: 142, sold: 312, status: "Active", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80" },
  { id: 2, name: "Black Rice (Chak-hao)", vendor: "Manipur Spices", price: 699, stock: 38, sold: 89, status: "Active", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80" },
  { id: 3, name: "Wild Forest Honey", vendor: "Naga Honey Co.", price: 599, stock: 22, sold: 156, status: "Active", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=80" },
  { id: 4, name: "Lakadong Turmeric", vendor: "Hills Organic Farm", price: 299, stock: 0, sold: 203, status: "Inactive", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80" },
  { id: 5, name: "Bhut Jolokia Pack", vendor: "Manipur Spices", price: 399, stock: 67, sold: 124, status: "Active", image: "https://images.unsplash.com/photo-1583286814430-1c2f9af2716b?w=200&q=80" },
  { id: 6, name: "Tulsi Herbal Tea", vendor: "Brahmaputra Tea Co.", price: 349, stock: 91, sold: 54, status: "Active", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80" },
];

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Products"
        desc={`${products.length} total products listed across the marketplace`}
        breadcrumbs={[{ label: "Dashboard", to: "/admin" }, { label: "Products" }]}
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
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Product</th>
                <th className="text-left px-6 py-3 font-medium">Vendor</th>
                <th className="text-left px-6 py-3 font-medium">Price</th>
                <th className="text-left px-6 py-3 font-medium">Stock</th>
                <th className="text-left px-6 py-3 font-medium">Sold</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <p className="font-semibold text-gray-900">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.vendor}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        p.stock === 0 ? "text-red-600" : p.stock < 30 ? "text-amber-600" : "text-gray-900"
                      }`}
                    >
                      {p.stock}
                    </span>
                    {p.stock === 0 && (
                      <span className="ml-2 text-[10px] font-bold uppercase text-red-600">Out</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.sold}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
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
