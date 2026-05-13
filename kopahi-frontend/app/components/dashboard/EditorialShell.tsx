"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Role = "user" | "vendor" | "admin";

type NavItem = { href: string; label: string; badge?: number };

const CUSTOMER_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "My Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/addresses", label: "Addresses" },
  { href: "/dashboard/account", label: "Account" },
];

const VENDOR_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "My Products" },
  { href: "/add-product", label: "Add Product" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/inventory", label: "Inventory" },
  { href: "/dashboard/payouts", label: "Payouts" },
  { href: "/dashboard/account", label: "Store Settings" },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/approvals", label: "Product Approvals" },
  { href: "/dashboard/vendors", label: "Vendors" },
  { href: "/dashboard/customers", label: "Customers" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/farmers", label: "Farmers Directory" },
  { href: "/dashboard/account", label: "Settings" },
];

function navFor(role: Role): NavItem[] {
  if (role === "vendor") return VENDOR_NAV;
  if (role === "admin") return ADMIN_NAV;
  return CUSTOMER_NAV;
}

function initialsOf(name?: string | null) {
  if (!name) return "K";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "K";
}

export default function EditorialShell({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-(--color-ivory) flex items-center justify-center text-(--color-bamboo)">
        <p className="font-display italic text-xl">Loading your dashboard…</p>
      </main>
    );
  }

  const nav = navFor(user.role);
  const initials = initialsOf(user.name);
  const roleLabel = user.role === "user" ? "Customer" : user.role === "vendor" ? "Vendor" : "Admin";

  return (
    <div className="min-h-screen bg-(--color-ivory) text-(--color-ink) flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:sticky inset-y-0 left-0 z-40 w-72 bg-(--color-moss-dark) text-(--color-ivory) flex flex-col grain transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        aria-label="Dashboard navigation"
      >
        <div className="px-6 pt-7 pb-6 flex items-center justify-between">
          <Link href="/" className="font-display text-xl text-(--color-ivory)">
            Kopahi<span className="text-(--color-gold)">.</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden text-(--color-ivory)/80"
          >
            ×
          </button>
        </div>
        <div className="mx-6 h-px bg-(--color-gold)/30" />

        <div className="px-6 py-6 flex items-center gap-3 border-b border-(--color-ivory)/10">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) text-xs font-medium tracking-[0.08em]">
            {initials}
          </span>
          <div>
            <p className="font-display text-lg leading-tight">{user.name ?? "Welcome"}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--color-gold)">{roleLabel}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-2.5 text-[13px] uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "bg-(--color-moss)/60 text-(--color-ivory)"
                        : "text-(--color-ivory)/75 hover:text-(--color-ivory) hover:bg-(--color-moss)/40"
                    }`}
                  >
                    {active && (
                      <span aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-[3px] bg-(--color-gold)" />
                    )}
                    {active && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-(--color-gold)" aria-hidden="true">
                        <path d="M12 3c0 6 3 9 9 9-6 0-9 3-9 9 0-6-3-9-9-9 6 0 9-3 9-9z" />
                      </svg>
                    )}
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) text-[10px] font-medium px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-6 py-5 border-t border-(--color-ivory)/10 flex items-center justify-between text-[12px] uppercase tracking-[0.22em] text-(--color-ivory)/70">
          <Link href="/" className="hover:text-(--color-gold) transition-colors">← Site</Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="font-display italic text-(--color-bamboo-light) hover:text-(--color-gold) transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-(--color-moss-dark)/40 lg:hidden"
        />
      )}

      {/* MAIN */}
      <main className="flex-1 min-w-0">
        <header className="bg-(--color-ivory) px-6 sm:px-10 py-5 flex items-center justify-between border-b border-(--color-bamboo)/15">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden h-9 w-9 inline-flex items-center justify-center border border-(--color-bamboo)/30 text-(--color-ink)"
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
              <path d="M0 1h16M0 6h16M0 11h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <p className="text-xs uppercase tracking-[0.22em] text-(--color-bamboo)">{roleLabel} dashboard</p>
          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.22em] text-(--color-gold-dark) hover:text-(--color-gold) transition-colors"
          >
            Browse origins →
          </Link>
        </header>

        <div className="px-6 sm:px-10 py-10">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h1 className="mt-4 font-display font-light tracking-tight text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] text-(--color-ink)">
                {title}
              </h1>
            </div>
            {actions}
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
