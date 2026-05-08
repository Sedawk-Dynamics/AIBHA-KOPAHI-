"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type Role = "Admin" | "Vendor" | "Customer";

const rolePaths: Record<Role, { profile: string; settings: string; search: string }> = {
  Admin: { profile: "/admin/profile", settings: "/admin/settings", search: "/admin/search" },
  Vendor: { profile: "/vendor", settings: "/settings", search: "/vendor/products" },
  Customer: { profile: "/dashboard/account", settings: "/settings", search: "/products" },
};

const navByRole: Record<Role, { label: string; icon: string; href: string }[]> = {
  Admin: [
    { label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", href: "/admin" },
    { label: "Orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", href: "/admin/orders" },
  ],
  Vendor: [
    { label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", href: "/vendor" },
  ],
  Customer: [
    { label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", href: "/dashboard" },
    { label: "My Orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", href: "/dashboard/orders" },
    { label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", href: "/dashboard/wishlist" },
    { label: "Addresses", icon: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z", href: "/dashboard/addresses" },
    { label: "Account", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", href: "/dashboard/account" },
  ],
};

const roleColors: Record<Role, string> = {
  Admin: "bg-purple-600",
  Vendor: "bg-amber-600",
  Customer: "bg-green-700",
};

export default function DashboardShell({ role, userName, userEmail, children }: { role: Role; userName?: string; userEmail?: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const nav = navByRole[role];
  const paths = rolePaths[role];
  const displayName = userName || user?.name || `${role} User`;
  const displayEmail = userEmail || user?.email || `${role.toLowerCase()}@kopahi.com`;

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (pathname === href) return true;
    const roots = ["/admin", "/vendor", "/dashboard"];
    if (roots.includes(href)) return false;
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 z-50 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-gray-100">
          <Link
            href="/"
            className="block text-2xl font-bold text-green-700 tracking-tight leading-none"
          >
            Kopahi<span className="text-green-500">.</span>
          </Link>
          <span
            className={`mt-2 inline-block text-[10px] uppercase tracking-wider font-bold text-white px-2 py-0.5 rounded ${roleColors[role]}`}
          >
            {role}
          </span>
        </div>

        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-700" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div ref={profileRef} className="relative ml-auto">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-3 pr-2 py-1 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${roleColors[role]}`}>{role.charAt(0)}</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{displayName}</p>
                <p className="text-xs text-gray-500">{displayEmail}</p>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
                <div className="p-1">
                  <Link href={paths.profile} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Profile</Link>
                  <Link href={paths.settings} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Settings</Link>
                </div>
                <div className="border-t border-gray-100 p-1">
                  <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Sign out</button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Delivered: "bg-green-50 text-green-700",
    Shipped: "bg-blue-50 text-blue-700",
    Processing: "bg-amber-50 text-amber-700",
    Pending: "bg-gray-100 text-gray-700",
    Active: "bg-green-50 text-green-700",
    Inactive: "bg-gray-100 text-gray-700",
    Approved: "bg-green-50 text-green-700",
    Rejected: "bg-red-50 text-red-700",
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export function PageHeader({ title, desc, breadcrumbs, action }: { title: string; desc?: string; breadcrumbs?: { label: string; href?: string }[]; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
      <div>
        {breadcrumbs && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.href ? <Link href={b.href} className="hover:text-green-700">{b.label}</Link> : <span className="text-gray-900 font-medium">{b.label}</span>}
                {i < breadcrumbs.length - 1 && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {desc && <p className="text-gray-600 mt-1">{desc}</p>}
      </div>
      {action}
    </div>
  );
}
