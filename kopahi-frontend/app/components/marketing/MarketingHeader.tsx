"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SHOP_URL, SHOP_LINKS } from "../../lib/shop";

/* Mirrors the WoodMart header on the WordPress side:
   desktop  — logo | nav | Login / Register · search · wishlist · cart (count + subtotal)
   mobile   — Menu opener | centered logo | cart (count badge), left slide-in drawer
   behavior — sticky, solid ivory, shadow, hides on scroll-down / reveals on scroll-up */

type NavItem = { href: string; label: string; external?: boolean };

const NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: SHOP_LINKS.shop, label: "Product", external: true },
  { href: "/b2b", label: "B2B" },
  { href: SHOP_LINKS.blog, label: "Journal", external: true },
  { href: "/contact", label: "Contact" },
];

function SearchIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/** Best-effort live cart from the WooCommerce Store API. Falls back to 0 / ₹0.00
    when the browser won't share the shop session cross-domain. */
function useWooCart() {
  const [count, setCount] = useState(0);
  const [subtotal, setSubtotal] = useState("₹0.00");

  useEffect(() => {
    let cancelled = false;
    fetch(`${SHOP_URL}/wp-json/wc/store/v1/cart`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((cart) => {
        if (cancelled || !cart?.totals) return;
        const minor = cart.totals.currency_minor_unit ?? 2;
        const symbol = cart.totals.currency_symbol ?? "₹";
        const total = Number(cart.totals.total_price ?? 0) / 10 ** minor;
        setCount(cart.items_count ?? 0);
        setSubtotal(`${symbol}${total.toFixed(2)}`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return { count, subtotal };
}

/** Active when the path matches exactly, or (for non-root nav) is a nested route. */
function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SearchForm({ autoFocus = false, large = false }: { autoFocus?: boolean; large?: boolean }) {
  return (
    <form action={SHOP_URL} method="get" role="search" className="flex w-full">
      <input
        type="search"
        name="s"
        autoFocus={autoFocus}
        placeholder="Search for products"
        className={`min-w-0 flex-1 bg-white border border-(--color-bamboo)/30 border-r-0 text-(--color-ink) placeholder:text-(--color-ink)/45 focus:outline-none focus:border-(--color-gold) ${
          large ? "px-5 py-4 text-lg" : "px-4 py-3"
        }`}
      />
      <input type="hidden" name="post_type" value="product" />
      <button
        type="submit"
        aria-label="Search"
        className={`shrink-0 inline-flex items-center justify-center bg-(--color-gold) text-(--color-moss-dark) hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors ${
          large ? "px-6" : "px-4"
        }`}
      >
        <SearchIcon size={large ? 20 : 17} />
      </button>
    </form>
  );
}

export default function MarketingHeader({ overHero: _overHero = false }: { overHero?: boolean } = {}) {
  const pathname = usePathname();
  const { count, subtotal } = useWooCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // WoodMart "hide on scroll": hide going down past the header, reveal going up.
      setHidden(y > 150 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, searchOpen]);

  const navLinkClass = (active: boolean) =>
    `relative font-body text-[0.8125rem] font-medium tracking-wide transition-colors group ${
      active ? "text-(--color-moss)" : "text-(--color-ink)/80 hover:text-(--color-moss)"
    }`;

  const underline = (active: boolean) => (
    <span
      className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-px bg-(--color-gold) transition-all duration-300 ${
        active ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );

  const toolClass =
    "inline-flex items-center text-(--color-moss) hover:text-(--color-gold-dark) transition-colors";

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 bg-(--color-ivory) border-b border-(--color-bamboo)/25 transition-all duration-300 ${
          scrolled ? "shadow-[0_2px_16px_rgba(46,59,42,0.12)]" : ""
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {/* ================= Desktop ================= */}
        <div
          className={`hidden lg:flex mx-auto max-w-shell px-5 lg:px-8 items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "h-16" : "h-20 lg:h-24"
          }`}
        >
          <Link href="/" aria-label="Kopahi — home" className="flex items-center">
            <Image
              src="/kopahi-mark.png"
              alt="Kopahi — home"
              width={1168}
              height={874}
              priority
              className={`w-auto max-w-[205px] object-contain transition-all duration-300 ${
                scrolled ? "h-12" : "h-16 lg:h-20"
              }`}
            />
          </Link>

          <nav className="flex items-center gap-7" aria-label="Primary">
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

          <div className="flex items-center gap-5">
            <a
              href={SHOP_LINKS.account}
              className="font-body text-[0.8125rem] font-medium tracking-wide text-(--color-ink)/80 hover:text-(--color-moss) transition-colors whitespace-nowrap"
            >
              Login / Register
            </a>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={toolClass}
            >
              <SearchIcon />
            </button>
            <a href={SHOP_LINKS.wishlist} aria-label="Wishlist" className={toolClass}>
              <HeartIcon />
            </a>
            <a
              href={SHOP_LINKS.cart}
              aria-label={`Cart, ${count} items, ${subtotal}`}
              className="inline-flex items-center gap-2 text-(--color-moss) hover:text-(--color-gold-dark) transition-colors"
            >
              <span className="relative inline-flex">
                <CartIcon />
                <span className="absolute -top-2.5 -right-2.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) text-[10px] font-medium px-1">
                  {count}
                </span>
              </span>
              <span className="font-body text-[0.8125rem] font-medium text-(--color-ink)/80">
                {subtotal}
              </span>
            </a>
          </div>
        </div>

        {/* ================= Mobile ================= */}
        <div
          className={`lg:hidden mx-auto px-4 grid grid-cols-3 items-center transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <button
            type="button"
            aria-label="Open mobile menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="justify-self-start inline-flex items-center gap-2 text-(--color-ink)"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
              <path d="M0 1h18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 7h18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 13h18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="text-[13px] font-medium">Menu</span>
          </button>

          <Link href="/" aria-label="Kopahi — home" className="justify-self-center flex items-center">
            <Image
              src="/kopahi-mark.png"
              alt="Kopahi — home"
              width={1168}
              height={874}
              priority
              className="h-12 w-auto max-w-[179px] object-contain"
            />
          </Link>

          <a
            href={SHOP_LINKS.cart}
            aria-label={`Cart, ${count} items`}
            className="justify-self-end relative inline-flex text-(--color-moss)"
          >
            <CartIcon />
            <span className="absolute -top-2.5 -right-2.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) text-[10px] font-medium px-1">
              {count}
            </span>
          </a>
        </div>
      </header>

      {/* ================= Full-screen search (desktop tool) ================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-(--color-ivory)">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="absolute top-6 right-6 inline-flex h-10 w-10 items-center justify-center text-(--color-ink) hover:text-(--color-moss)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="mx-auto max-w-2xl px-6 pt-[28vh]">
            <p className="eyebrow mb-4">Search the shop</p>
            <SearchForm autoFocus large />
          </div>
        </div>
      )}

      {/* ================= Mobile drawer (slides from left) ================= */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className="absolute inset-0 bg-(--color-moss-dark)/50"
        />
        <div
          className={`absolute top-0 left-0 h-full w-[85vw] max-w-[340px] bg-(--color-ivory) shadow-2xl flex flex-col transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-(--color-bamboo)/15 flex items-center gap-3">
            <div className="flex-1">
              <SearchForm />
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="shrink-0 inline-flex h-9 w-9 items-center justify-center text-(--color-ink)"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M2 2l16 16M18 2L2 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile navigation">
            {NAV.map((n) => {
              const active = !n.external && isActivePath(pathname, n.href);
              const itemClass = `text-[14px] uppercase tracking-[0.12em] font-medium py-3.5 border-b flex items-center justify-between ${
                active
                  ? "text-(--color-moss) border-(--color-gold)"
                  : "text-(--color-ink) border-(--color-bamboo)/15"
              }`;
              if (n.external) {
                return (
                  <a key={n.href} href={n.href} onClick={() => setDrawerOpen(false)} className={itemClass}>
                    {n.label}
                  </a>
                );
              }
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setDrawerOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={itemClass}
                >
                  {n.label}
                  {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-5 border-t border-(--color-bamboo)/15 flex flex-col gap-3">
            <a
              href={SHOP_LINKS.account}
              className="text-center text-[13px] uppercase tracking-[0.18em] font-medium px-4 py-3 bg-(--color-gold) text-(--color-moss-dark)"
            >
              Login / Register
            </a>
            <a
              href={SHOP_LINKS.wishlist}
              className="inline-flex items-center justify-center gap-2 text-[13px] uppercase tracking-[0.18em] font-medium px-4 py-3 border border-(--color-bamboo)/30 text-(--color-ink)"
            >
              <HeartIcon /> Wishlist
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
