import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import { vendorProducts, deleteProduct } from "../../lib/resources/products";
import { ApiError } from "../../lib/api";
import type { ApiProduct } from "../../lib/types";

const STATUS_OPTIONS = ["All", "Active", "Inactive"] as const;

export default function VendorProducts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError("");
    vendorProducts()
      .then(setProducts)
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load products")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? p.isActive : !p.isActive);
      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  const handleDelete = async (p: ApiProduct) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setDeletingId(p.id);
    try {
      await deleteProduct(p.id);
      setProducts((cur) => cur.filter((x) => x.id !== p.id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardShell
      role="Vendor"
      userName={user?.businessName || user?.name}
      userEmail={user?.email}
    >
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/vendor" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">My Products</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Products</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {loading
              ? "Loading..."
              : `${products.length} products listed · ${products.filter((p) => p.isActive).length} active`}
          </p>
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

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
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
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  statusFilter === s
                    ? "bg-green-700 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-12 text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-500">
              {products.length === 0
                ? "You haven't added any products yet — click \"Add Product\" to start."
                : "No products match your filters."}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Stock</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const stockNum = Number(p.stock) || 0;
                  return (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] ?? ""}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <p className="font-semibold text-gray-900">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            stockNum === 0
                              ? "text-red-600"
                              : stockNum < 30
                              ? "text-amber-600"
                              : "text-gray-900"
                          }`}
                        >
                          {stockNum}
                        </span>
                        {stockNum === 0 && (
                          <span className="ml-2 text-[10px] font-bold uppercase text-red-600">
                            Out
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.category ?? "—"}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={p.isActive ? "Active" : "Inactive"} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/vendor/products/${p.id}/edit`)}
                          className="text-sm font-medium text-green-700 hover:text-green-800 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p.id}
                          className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === p.id ? "..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
