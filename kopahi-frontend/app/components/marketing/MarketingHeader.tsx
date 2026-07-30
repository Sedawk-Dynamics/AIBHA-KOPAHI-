"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* WordPress shop base URL — swap to https://shop.kopahi.com at cutover. */
const SHOP = "https://staging.kopahi.sedawk.cloud";

type NavItem = { href: string; label: string; external?: boolean };

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: `${SHOP}/shop/`, label: "Product", external: true },
  { href: "/b2b", label: "B2B" },
  { href: `${SHOP}/blog/`, label: "Journal", external: true },
  { href: "/contact", label: "Contact" },
];

const ACCOUNT_URL = `${SHOP}/my-account/`;
const SEARCH_URL = `${SHOP}/my-account/`;
const WISHLIST_URL = `${SHOP}/wishlist/`;
const CART_URL = `${SHOP}/cart/`;

function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.7-9.3-9.2C1.4 8 3.4 4.9 6.6 4.9c2 0 3.6 1.1 4.4 2.7h2c.8-1.6 2.4-2.7 4.4-2.7 3.2 0 5.2 3.1 3.9 6.4-1.8 4.5-9.3 9.2-9.3 9.2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  );
}

/** Active when the path matches exactly, or (for non-root nav) is a nested route. */
function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MarketingHeader({ overHero = false }: { overHero?: boolean } = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid (readable cream) header unless we're sitting transparently over a
  // dark hero AND haven't scrolled yet. Pages without a dark hero pass
  // overHero={false} (default) so the nav is always visible.
  const solid = scrolled || !overHero;

  const navColor = solid
    ? "text-(--color-ink)/80 hover:text-(--color-moss)"
    : "text-(--color-ivory)/85 hover:text-(--color-ivory)";

  const toolColor = solid
    ? "text-(--color-moss) hover:text-(--color-gold-dark)"
    : "text-(--color-ivory) hover:text-(--color-gold)";

  const navLinkClass = (active: boolean) =>
    `relative font-body text-[0.8125rem] font-medium tracking-wide transition-colors group ${
      active ? (solid ? "text-(--color-moss)" : "text-(--color-ivory)") : navColor
    }`;

  const underline = (active: boolean) => (
    <span
      className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px bg-(--color-gold) transition-all duration-300 ${
        active ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
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
            if (n.external) {
              return (
                <a key={n.href} href={n.href} className={navLinkClass(false)}>
                  {n.label}
                  {underline(false)}
                </a>
              );
            }
            const active = isActivePath(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={navLinkClass(active)}
              >
                {n.label}
                {underline(active)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <a
            href={ACCOUNT_URL}
            className={`font-body text-[0.8125rem] font-medium uppercase tracking-[0.08em] transition-colors ${navColor}`}
          >
            My Account
          </a>
          <a href={SEARCH_URL} aria-label="Search" className={`transition-colors ${toolColor}`}>
            <SearchIcon />
          </a>
          <a href={WISHLIST_URL} aria-label="Wishlist" className={`transition-colors ${toolColor}`}>
            <HeartIcon />
          </a>
          <a href={CART_URL} aria-label="Cart" className={`transition-colors ${toolColor}`}>
            <CartIcon />
          </a>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-sm border ${
            solid ? "border-(--color-bamboo)/30 text-(--color-ink)" : "border-(--color-ivory)/40 text-(--color-ivory)"
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
              const active = !n.external && isActivePath(pathname, n.href);
              const itemClass = `text-[14px] uppercase tracking-[0.22em] font-medium py-2 border-b flex items-center justify-between ${
                active
                  ? "text-(--color-moss) border-(--color-gold)"
                  : "text-(--color-ink) border-(--color-bamboo)/15"
              }`;
              if (n.external) {
                return (
                  <a key={n.href} href={n.href} onClick={() => setOpen(false)} className={itemClass}>
                    {n.label}
                  </a>
                );
              }
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={itemClass}
                >
                  {n.label}
                  {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" />}
                </Link>
              );
            })}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={ACCOUNT_URL}
                onClick={() => setOpen(false)}
                className="col-span-2 text-center text-[13px] uppercase tracking-[0.22em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
              >
                My Account
              </a>
              <a
                href={WISHLIST_URL}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.22em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
              >
                <HeartIcon /> Wishlist
              </a>
              <a
                href={CART_URL}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.22em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
              >
                <CartIcon /> Cart
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
