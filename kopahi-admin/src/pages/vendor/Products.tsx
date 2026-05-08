import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  sold: number;
  status: "Active" | "Inactive" | "Draft";
  image: string;
};

export default function VendorProducts() {
  const [products] = useState<Product[]>([
    { id: 1, name: "Assam Tea Premium 250g", price: 499, stock: 142, sold: 312, status: "Active", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80" },
    { id: 2, name: "Assam Tea Gift Pack", price: 2299, stock: 38, sold: 89, status: "Active", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80" },
    { id: 3, name: "Green Tea 500g", price: 899, stock: 22, sold: 67, status: "Active", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80" },
    { id: 4, name: "Masala Chai Blend", price: 649, stock: 0, sold: 54, status: "Inactive", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=200&q=80" },
    { id: 5, name: "White Tea Reserve", price: 1499, stock: 12, sold: 18, status: "Active", image: "https://images.unsplash.com/photo-1597318181436-bd0d49edaaaa?w=200&q=80" },
    { id: 6, name: "Tulsi Herbal Blend", price: 349, stock: 67, sold: 0, status: "Draft", image: "https://images.unsplash.com/photo-1545848977-9d1f06f4a8a4?w=200&q=80" },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["All", "Active", "Inactive", "Draft"];

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">My Products</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Products</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">{products.length} products listed · {products.filter((p) => p.status === "Active").length} active</p>
        </div>
        <Link
          to="/vendor/products/new"
          className="bg-green-700 hover:bg-green-800 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statuses.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === s ? "bg-green-700 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="lg:hidden divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">No products match your filters.</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{p.price}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      <span>Stock: <span className={p.stock === 0 ? "text-red-600 font-semibold" : p.stock < 30 ? "text-amber-600 font-semibold" : "text-gray-900 font-semibold"}>{p.stock}</span></span>
                      <span>Sold: <span className="font-semibold text-gray-900">{p.sold}</span></span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">No products match your filters.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Stock</th>
                  <th className="text-left px-6 py-3 font-medium">Sold</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                        <p className="font-semibold text-gray-900">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">₹{p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${p.stock === 0 ? "text-red-600" : p.stock < 30 ? "text-amber-600" : "text-gray-900"}`}>{p.stock}</span>
                      {p.stock === 0 && <span className="ml-2 text-[10px] font-bold uppercase text-red-600">Out</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.sold}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-green-700 hover:text-green-800">Edit</button>
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
