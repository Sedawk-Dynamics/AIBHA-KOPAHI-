"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type SubItem = { href: string; label: string; description?: string };
type NavItem = { href: string; label: string; submenu?: SubItem[] };

const navLinks: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    submenu: [
      { href: "/about", label: "About Kopahi", description: "Mission, vision and journey" },
      { href: "/about/farmers", label: "About Farmers", description: "Farmer stories from the field" },
    ],
  },
  {
    href: "/products",
    label: "Products",
    submenu: [
      { href: "/products/gi-tagged", label: "GI Tagged Products", description: "Authenticated regional produce" },
      { href: "/products/non-gi-tagged", label: "Non-GI Products", description: "Curated everyday essentials" },
    ],
  },
  { href: "/b2b", label: "B2B" },
  { href: "/contact", label: "Contact" },
];

export default function PageShell({
  active,
  children,
}: {
  active?: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click and on Escape
  useEffect(() => {
    if (!openSub) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenSub(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSub(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSub]);

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white text-[13px] tracking-wide">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-10 flex items-center justify-between">
            <p className="hidden md:block font-medium">Open Doors To A World Of Indigenous Food</p>
            <div className="flex items-center gap-5 text-sm">
              <Link href="/track-order" className="hover:text-green-200 transition">Track Order</Link>
              <Link href="/contact" className="hover:text-green-200 transition">Support</Link>
              <Link href="/b2b" className="hover:text-green-200 transition">Bulk Orders</Link>
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="h-[112px] flex items-center justify-between">
              <Link href="/" className="group flex items-center gap-4">
                <div className="relative h-[88px] w-[220px]">
                  <Image src="/Logo1.png" alt="Kopahi Logo" fill sizes="220px" priority className="object-contain group-hover:scale-105 transition" />
                </div>
                <div className="hidden xl:block">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-green-700 font-semibold">Truly Indigenous</p>
                  <p className="text-xs text-gray-500 mt-1">North East Farms To Your Home</p>
                </div>
              </Link>

              <div ref={dropdownRef} className="hidden lg:flex items-center gap-10">
                {navLinks.map((item) => {
                  const isActive = item.label === active;
                  if (item.submenu) {
                    const isOpen = openSub === item.label;
                    return (
                      <div key={item.label} className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenSub(isOpen ? null : item.label)}
                          className={`relative text-[15px] font-semibold transition group inline-flex items-center gap-1 ${
                            isActive ? "text-green-700" : "text-gray-700 hover:text-green-700"
                          }`}
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                        >
                          {item.label}
                          <svg className="w-3.5 h-3.5 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span className={`absolute left-0 -bottom-2 h-[2px] transition-all duration-300 ${isActive ? "w-full bg-green-700" : "w-0 bg-green-700 group-hover:w-full"}`}></span>
                        </button>

                        {isOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                            {item.submenu.map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                onClick={() => setOpenSub(null)}
                                className="block px-4 py-3 rounded-xl hover:bg-green-50 transition group/item"
                              >
                                <p className="font-semibold text-gray-900 group-hover/item:text-green-700">{s.label}</p>
                                {s.description && <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative text-[15px] font-semibold transition group ${
                        isActive ? "text-green-700" : "text-gray-700 hover:text-green-700"
                      }`}
                    >
                      {item.label}
                      <span className={`absolute left-0 -bottom-2 h-[2px] transition-all duration-300 ${isActive ? "w-full bg-green-700" : "w-0 bg-green-700 group-hover:w-full"}`}></span>
                    </Link>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <Link href="/login" className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">Login</Link>
                <Link href="/signup" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-green-600 text-white text-sm font-bold shadow-lg hover:shadow-2xl transition">Sign Up</Link>
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Open menu"
                className="lg:hidden w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl">
              <div className="px-6 py-6 flex flex-col gap-1">
                {navLinks.map((item) => {
                  if (item.submenu) {
                    return (
                      <details key={item.label} className="group">
                        <summary className="text-gray-700 font-semibold py-3 border-b border-gray-100 hover:text-green-700 cursor-pointer flex items-center justify-between list-none">
                          {item.label}
                          <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="pl-4 py-2 flex flex-col gap-2 border-b border-gray-100">
                          {item.submenu.map((s) => (
                            <Link key={s.href} href={s.href} onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-green-700 py-1.5 text-sm">
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </details>
                    );
                  }
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-gray-700 font-semibold py-3 border-b border-gray-100 hover:text-green-700"
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Link href="/login" className="text-center py-3 rounded-xl border border-gray-200 font-semibold">Login</Link>
                  <Link href="/signup" className="text-center py-3 rounded-xl bg-green-700 text-white font-semibold">Sign Up</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {children}
    </>
  );
}
