import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";
import { listProducts } from "../../lib/resources/products";
import type { ApiProduct } from "../../lib/types";
import { ApiError } from "../../lib/api";

const PAGE_SIZE = 50;

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listProducts({ includeVendor: true, all: true, page: 1, pageSize: PAGE_SIZE })
      .then((res) => {
        setProducts(res.products);
        setCount(res.count);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load products")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => {
      const vendorName =
        p.vendor?.businessName ?? p.vendor?.name ?? "";
      return (
        p.name.toLowerCase().includes(q) ||
        vendorName.toLowerCase().includes(q)
      );
    });
  }, [products, search]);

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Products"
        desc={
          loading
            ? "Loading products..."
            : `${count} total products listed across the marketplace`
        }
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
          {error ? (
            <div className="text-center py-16 text-sm text-red-600">{error}</div>
          ) : loading ? (
            <div className="text-center py-16 text-sm text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              {products.length === 0
                ? "No products yet."
                : "No products match your search."}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-medium">Vendor</th>
                  <th className="text-left px-6 py-3 font-medium">Price</th>
                  <th className="text-left px-6 py-3 font-medium">Stock</th>
                  <th className="text-left px-6 py-3 font-medium">Category</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const vendorLabel =
                    p.vendor?.businessName ?? p.vendor?.name ?? "—";
                  const stockNum = Number(p.stock) || 0;
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] ?? ""}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <p className="font-semibold text-gray-900">{p.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{vendorLabel}</td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
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
