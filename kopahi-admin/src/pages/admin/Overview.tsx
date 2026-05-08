import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";
import { getAdminStats } from "../../lib/resources/dashboard";
import { listOrders } from "../../lib/resources/orders";
import { ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import type { AdminDashboard, ApiOrder } from "../../lib/types";

export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [recentOrders, setRecentOrders] = useState<ApiOrder[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err: unknown) =>
        setLoadError(err instanceof ApiError ? err.message : "Could not load stats")
      );

    listOrders({ page: 1, pageSize: 5 })
      .then((res) => setRecentOrders(res.orders))
      .catch(() => {
        // Recent orders are non-critical — silently leave the list empty.
      });
  }, []);

  const fmt = (n?: number) => (n === undefined ? "—" : n.toLocaleString("en-IN"));
  const fmtCurrency = (n?: number) =>
    n === undefined ? "—" : `₹${n.toLocaleString("en-IN")}`;

  const cards = [
    { label: "Total Revenue", value: fmtCurrency(stats?.revenue), to: "/admin/revenue" },
    { label: "Total Orders", value: fmt(stats?.totalOrders), to: "/admin/orders" },
    { label: "Active Vendors", value: fmt(stats?.totalVendors), to: "/admin/vendors" },
    { label: "Total Customers", value: fmt(stats?.totalUsers), to: "/admin/customers" },
  ];

  return (
    <DashboardShell role="Admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back{user?.name ? `, ${user.name}` : ""}. Here's what's happening across Kopahi.
        </p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3">
          Could not load live stats: {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all"
          >
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight mt-2">{c.value}</p>
            <p className="mt-3 text-xs text-green-700 group-hover:underline">View details →</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-green-700 hover:text-green-800">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-500">
                No orders yet. They'll appear here as customers place them.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Order</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Amount</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.items[0]?.name ?? "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{o.user?.name ?? o.user?.email ?? "—"}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹{Number(o.totalPrice).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.orderStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Catalogue</h2>
            <p className="text-xs text-gray-500 mt-1">Manage what's in the store</p>
          </div>
          <div className="p-4 space-y-2">
            <Link
              to="/admin/products/new"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              + Add product
            </Link>
            <Link
              to="/admin/products"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              All products ({fmt(stats?.totalProducts)})
            </Link>
            <Link
              to="/admin/orders"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Orders ({fmt(stats?.totalOrders)})
            </Link>
            <Link
              to="/admin/vendors"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Vendors
            </Link>
            <Link
              to="/admin/customers"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Customers ({fmt(stats?.totalUsers)})
            </Link>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
