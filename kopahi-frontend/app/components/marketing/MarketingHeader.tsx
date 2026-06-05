"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/b2b", label: "B2B" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

function initialsOf(name?: string | null) {
  if (!name) return "K";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "K";
}

function AvatarMenu({
  initials,
  role,
  name,
  onSignOut,
}: {
  initials: string;
  role: "user" | "vendor" | "admin";
  name?: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const secondLabel = role === "vendor" ? "My Products" : role === "admin" ? "Approvals" : "Orders";
  const secondHref = role === "vendor" ? "/dashboard/products" : role === "admin" ? "/dashboard/approvals" : "/dashboard/orders";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-11 px-2 rounded-full border border-(--color-bamboo)/30 hover:border-(--color-gold) bg-(--color-ivory)/90 transition-colors"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--color-moss) text-(--color-ivory) text-xs font-medium tracking-[0.08em]">
          {initials}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" className={`mr-1 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-64 bg-(--color-ivory) border border-(--color-bamboo)/30 shadow-xl py-2"
        >
          <div className="px-4 py-3 border-b border-(--color-bamboo)/20">
            <p className="font-display text-base text-(--color-ink) leading-tight">{name ?? "Welcome"}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-(--color-bamboo) mt-1">{role}</p>
          </div>
          <MenuLink href="/dashboard" onClick={() => setOpen(false)}>My Profile</MenuLink>
          <MenuLink href={secondHref} onClick={() => setOpen(false)}>{secondLabel}</MenuLink>
          <MenuLink href="/dashboard/settings" onClick={() => setOpen(false)}>Settings</MenuLink>
          <div className="my-2 mx-4 h-px bg-(--color-bamboo)/30" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="w-full text-left px-4 py-2.5 font-display italic text-(--color-bamboo) hover:bg-(--color-ivory-warm) transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 font-display text-(--color-ink) hover:bg-(--color-ivory-warm) hover:text-(--color-moss) transition-colors"
    >
      {children}
    </Link>
  );
}

/** Active when the path matches exactly, or (for non-root nav) is a nested route. */
function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MarketingHeader() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navColor = scrolled
    ? "text-(--color-ink)/80 hover:text-(--color-moss)"
    : "text-(--color-ivory)/85 hover:text-(--color-ivory)";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-(--color-ivory) border-b border-(--color-bamboo)/25 shadow-[0_2px_16px_rgba(46,59,42,0.12)]"
          : "bg-transparent"
      }`}
    >
      <div className={`mx-auto max-w-shell px-5 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "h-16" : "h-20 lg:h-24"}`}>
        <Link href="/" aria-label="Kopahi — home" className="flex items-center">
          <Image
            src="/kopahi-mark.png"
            alt="Kopahi — home"
            width={1168}
            height={874}
            priority
            className={`w-auto object-contain transition-all duration-300 ${
              scrolled ? "h-12" : "h-16 lg:h-20"
            }`}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV.map((n) => {
            const active = isActivePath(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative font-body text-[0.8125rem] font-medium tracking-wide transition-colors group ${
                  active
                    ? scrolled
                      ? "text-(--color-moss)"
                      : "text-(--color-ivory)"
                    : navColor
                }`}
              >
                {n.label}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px bg-(--color-gold) transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2.5">
          <Link
            href="/cart"
            aria-label={`Cart${count ? `, ${count} items` : ""}`}
            className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              scrolled
                ? "border-(--color-bamboo)/30 text-(--color-moss) hover:border-(--color-gold)"
                : "border-(--color-ivory)/40 text-(--color-ivory) hover:border-(--color-gold)"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 4h2l2.5 11h11L21 7H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) text-[10px] font-medium px-1">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[0.8125rem] font-medium px-3.5 py-1.5 rounded-sm bg-(--color-gold) text-(--color-moss-dark) hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Dashboard
              </Link>
              <AvatarMenu
                initials={initialsOf(user.name)}
                role={user.role}
                name={user.name}
                onSignOut={() => logout()}
              />
            </>
          ) : (
            <>
              <Link href="/login" className={`text-[0.8125rem] font-medium px-3 py-1.5 transition-colors ${navColor}`}>
                Login
              </Link>
              <Link href="/signup" className={`text-[0.8125rem] font-medium px-3 py-1.5 transition-colors ${navColor}`}>
                Sign up
              </Link>
              <Link
                href="/products"
                className="text-[0.8125rem] font-medium px-3.5 py-1.5 rounded-sm bg-(--color-gold) text-(--color-moss-dark) hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
              >
                Shop →
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-sm border ${
            scrolled ? "border-(--color-bamboo)/30 text-(--color-ink)" : "border-(--color-ivory)/40 text-(--color-ivory)"
          }`}
        >
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
            {open ? (
              <path d="M2 2l14 10M16 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <>
                <path d="M0 1h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 7h18" stroke="currentColor" strokeWidth="1.5" />
                <path d="M0 13h18" stroke="currentColor" strokeWidth="1.5" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-(--color-ivory) border-t border-(--color-bamboo)/15">
          <nav className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4" aria-label="Mobile navigation">
            {NAV.map((n) => {
              const active = isActivePath(pathname, n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`text-[14px] uppercase tracking-[0.22em] font-medium py-2 border-b flex items-center justify-between ${
                    active
                      ? "text-(--color-moss) border-(--color-gold)"
                      : "text-(--color-ink) border-(--color-bamboo)/15"
                  }`}
                >
                  {n.label}
                  {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" />}
                </Link>
              );
            })}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="col-span-2 inline-flex items-center justify-between px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink) text-[13px] uppercase tracking-[0.22em]"
              >
                Cart <span className="text-(--color-bamboo)">{count}</span>
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="col-span-2 text-center text-[13px] uppercase tracking-[0.22em] font-medium px-5 py-3 rounded-sm bg-(--color-gold) text-(--color-moss-dark)"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="col-span-2 px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink) text-[13px] uppercase tracking-[0.22em]"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-center text-[13px] uppercase tracking-[0.22em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="text-center text-[13px] uppercase tracking-[0.22em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setOpen(false)}
                    className="col-span-2 text-center text-[13px] uppercase tracking-[0.22em] font-medium px-5 py-3 rounded-sm bg-(--color-gold) text-(--color-moss-dark)"
                  >
                    Shop →
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
