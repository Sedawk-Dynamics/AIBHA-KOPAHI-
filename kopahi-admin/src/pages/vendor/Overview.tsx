import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardShell, { StatusBadge } from "../../components/DashboardShell";

export default function VendorOverview() {
  const navigate = useNavigate();
  const [orderSearch, setOrderSearch] = useState("");

  const stats = [
    { label: "Total Sales", value: "₹1,84,500", change: "+22.4%", positive: true, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", to: "/vendor/earnings" },
    { label: "Active Products", value: "42", change: "+3", positive: true, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", to: "/vendor/products" },
    { label: "Pending Orders", value: "18", change: "+8.1%", positive: true, icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", to: "/vendor/orders" },
    { label: "Avg Rating", value: "4.8", change: "+0.2", positive: true, icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", to: "/vendor/reviews" },
  ];

  const recentOrders = [
    { id: "KP-2847", customer: "Rahul Sharma", product: "Assam Tea Premium 250g", amount: "₹1,499", status: "Processing" },
    { id: "KP-2841", customer: "Meera Iyer", product: "Assam Tea Gift Pack", amount: "₹2,299", status: "Shipped" },
    { id: "KP-2839", customer: "Vikram Singh", product: "Green Tea 500g", amount: "₹899", status: "Delivered" },
    { id: "KP-2835", customer: "Anjali Roy", product: "Masala Chai Blend", amount: "₹649", status: "Delivered" },
  ];

  const topProducts = [
    { name: "Assam Tea Premium 250g", sold: 142, revenue: "₹70,858", trend: "up", trendValue: "12%" },
    { name: "Assam Tea Gift Pack", sold: 89, revenue: "₹2,04,611", trend: "up", trendValue: "12%" },
    { name: "Green Tea 500g", sold: 67, revenue: "₹60,233", trend: "down", trendValue: "4%" },
    { name: "Masala Chai Blend", sold: 54, revenue: "₹35,046", trend: "up", trendValue: "12%" },
  ];

  const filteredOrders = recentOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.product.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <DashboardShell role="Vendor" userName="Brahmaputra Tea Co." userEmail="vendor@kopahi.com">
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Vendor Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Track your sales, orders, and inventory at a glance.</p>
        </div>
        <Link
          to="/vendor/products/new"
          className="bg-green-700 hover:bg-green-800 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="group bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} />
                </svg>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  s.positive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {s.change}
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{s.value}</p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-xs md:text-sm text-gray-500">{s.label}</p>
              <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <p className="text-xs text-gray-500 mt-1">By revenue this month</p>
            </div>
            <Link to="/vendor/products" className="text-xs font-medium text-green-700 hover:text-green-800 hidden sm:block">
              See all
            </Link>
          </div>
          <div className="p-3">
            {topProducts.map((p, i) => (
              <Link
                key={p.name}
                to="/vendor/products"
                className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sold} sold</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{p.revenue}</p>
                  <p className={`text-xs font-medium ${p.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                    {p.trend === "up" ? "↑" : "↓"} {p.trendValue}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 md:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/vendor/orders" className="text-sm font-medium text-green-700 hover:text-green-800 inline-flex items-center gap-1 group">
                View all
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <div className="lg:hidden">
            {filteredOrders.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-500">No orders match your search.</p>
            ) : (
              filteredOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/vendor/orders/${o.id}`}
                  className="block p-4 border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">#{o.id}</p>
                      <p className="text-xs text-gray-500 truncate">{o.product}</p>
                    </div>
                    <p className="font-bold text-gray-900">{o.amount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{o.customer}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <p className="text-center py-12 text-sm text-gray-500">No orders match your search.</p>
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
                  {filteredOrders.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/vendor/orders/${o.id}`)}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">#{o.id}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.product}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{o.customer}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{o.amount}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
