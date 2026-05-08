import { useEffect, useMemo, useState } from "react";
import DashboardShell, { StatusBadge, PageHeader } from "../../components/DashboardShell";
import { listVendors, listVendorStats } from "../../lib/resources/vendors";
import type { ApiUser, VendorStatRow } from "../../lib/types";
import { ApiError } from "../../lib/api";

const formatJoinedMonth = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

const formatINR = (amount: number) => {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

export default function AdminVendors() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState<ApiUser[]>([]);
  const [stats, setStats] = useState<Record<string, VendorStatRow>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([listVendors(), listVendorStats().catch(() => [] as VendorStatRow[])])
      .then(([vendorList, statRows]) => {
        const map: Record<string, VendorStatRow> = {};
        for (const s of statRows) map[s.vendorId] = s;
        setVendors(vendorList);
        setStats(map);
      })
      .catch((err: unknown) =>
        setError(err instanceof ApiError ? err.message : "Could not load vendors")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        (v.businessName ?? "").toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
    );
  }, [vendors, search]);

  const activeCount = vendors.filter((v) => v.emailVerified).length;
  const inactiveCount = vendors.length - activeCount;

  return (
    <DashboardShell role="Admin">
      <PageHeader
        title="Vendors"
        desc={
          loading
            ? "Loading vendors..."
            : `${activeCount} active · ${inactiveCount} pending verification`
        }
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
          {error ? (
            <div className="text-center py-16 text-sm text-red-600">{error}</div>
          ) : loading ? (
            <div className="text-center py-16 text-sm text-gray-500">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-gray-500">
              {vendors.length === 0
                ? "No vendors yet. Use the create-vendor endpoint to onboard one."
                : "No vendors match your search."}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Vendor</th>
                  <th className="text-left px-6 py-3 font-medium">Email</th>
                  <th className="text-left px-6 py-3 font-medium">Products</th>
                  <th className="text-left px-6 py-3 font-medium">Sales (Paid)</th>
                  <th className="text-left px-6 py-3 font-medium">Joined</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const s = stats[v.id];
                  const displayName = v.businessName?.trim() || v.name;
                  return (
                    <tr
                      key={v.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{displayName}</p>
                            {v.businessName && v.name !== v.businessName && (
                              <p className="text-xs text-gray-500">{v.name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{v.email}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {s?.productCount ?? 0}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {formatINR(s?.salesTotal ?? 0)}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {formatJoinedMonth(v.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={v.emailVerified ? "Active" : "Pending"}
                        />
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
