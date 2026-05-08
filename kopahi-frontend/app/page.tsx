"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    // Switch to dark text once user scrolls past the hero section
    const onScroll = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleWishlist = (key: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus("error");
      setNewsletterMessage("Please enter a valid email address.");
      return;
    }
    setNewsletterStatus("loading");
    setNewsletterMessage("");
    // TODO: wire to real /api/newsletter endpoint when available
    await new Promise((r) => setTimeout(r, 700));
    setNewsletterStatus("success");
    setNewsletterMessage("You're in! Check your inbox for a 10% off code.");
    setNewsletterEmail("");
  };

  const giAgri = [
    { name: "Joha Rice", price: "₹699", tag: "GI Tagged", img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80", rating: 4.9 },
    { name: "Assam Tea", price: "₹499", oldPrice: "₹599", tag: "GI Tagged", img: "/products/assam-tea.jpg", rating: 4.9 },
    { name: "Karbi Anglong Ginger", price: "₹349", tag: "GI Tagged", img: "/products/karbi-anglong-ginger.jpg", rating: 4.7 },
    { name: "Kachai Lemon", price: "₹279", tag: "GI Tagged", img: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80", rating: 4.6 },
    { name: "Muzaffarpur Lychee", price: "₹399", tag: "GI Tagged", img: "/products/lychee.jpg", rating: 4.7 },
    { name: "Judima Rice Wine", price: "₹999", tag: "GI Tagged", img: "/products/judima.jpg", rating: 4.8 },
    { name: "Bhut Jolokia Chilli", price: "₹399", tag: "GI Tagged", img: "/products/bhut-jolokia.jpg", rating: 4.8 },
    { name: "Lakadong Turmeric", price: "₹349", tag: "GI Tagged", img: "/products/lakadong-turmeric.jpg", rating: 4.9 },
    { name: "Muga Silk Thread", price: "₹2,499", tag: "GI Tagged", img: "/products/muga-silk-thread.jpg", rating: 4.9 },
    { name: "Tripura Pineapple", price: "₹249", tag: "GI Tagged", img: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80", rating: 4.6 },
  ];

  const giCrafts = [
    { name: "Muga Silk Stole", price: "₹4,599", tag: "Handcraft", img: "/products/muga-silk-stole.jpg", rating: 4.9 },
    { name: "Cane Basket Set", price: "₹1,299", tag: "Handcraft", img: "/products/cane-baskets.jpg", rating: 4.7 },
  ];

  const nonGi = [
    { name: "Purple Rice", price: "₹599", img: "/products/purple-rice.jpg", rating: 4.6 },
    { name: "Pepper Powder", price: "₹249", img: "/products/pepper-powder.jpg", rating: 4.5 },
    { name: "Black Cardamom", price: "₹449", img: "/products/black-cardamom.jpg", rating: 4.7 },
    { name: "Black Tea", price: "₹329", img: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&q=80", rating: 4.6 },
    { name: "Blue Tea", price: "₹399", img: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80", rating: 4.7 },
    { name: "Hibiscus Tea", price: "₹299", img: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80", rating: 4.6 },
    { name: "Mint Tea", price: "₹279", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80", rating: 4.5 },
    { name: "Rose Tea", price: "₹349", img: "/products/rose-tea.jpg", rating: 4.7 },
    { name: "Chamomile Tea", price: "₹329", img: "/products/chamomile-tea.jpg", rating: 4.6 },
    { name: "Tengamora Phul", price: "₹229", img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80", rating: 4.5 },
  ];

  const reviews = [
    { name: "Rahul Sharma", location: "Bengaluru", text: "Excellent Assam tea. Truly authentic taste — exactly like my grandmother's garden." },
    { name: "Priya Das", location: "Mumbai", text: "Loved the honey packaging and fast delivery. Pure, raw, beautifully sealed." },
    { name: "Ankit Jain", location: "Delhi", text: "Best GI-tagged products I purchased online. Sourcing feels genuinely ethical." },
    { name: "Sneha Roy", location: "Kolkata", text: "Fresh turmeric and black rice quality is amazing. Smell the freshness instantly." },
    { name: "Amit Verma", location: "Pune", text: "A very premium marketplace experience. Curation and service feel thoughtful." },
    { name: "Kavya Iyer", location: "Chennai", text: "The bhut jolokia chillies are unreal — finally a brand that respects regional flavour." },
  ];

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

  return (
    <main className="bg-white text-gray-900 antialiased">
      <style jsx global>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: scroll-x 45s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: fadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        .float-slow { animation: float 6s ease-in-out infinite; }

        html { scroll-behavior: smooth; }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track, .reveal, .float-slow { animation: none !important; }
        }
      `}</style>

{/* ================= PREMIUM HEADER ================= */}
<nav className="fixed top-0 left-0 right-0 z-50">
  {/* TOP BAR - hidden on small screens to save vertical space */}
  <div className="hidden md:block bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white text-[13px] tracking-wide">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 lg:h-10 flex items-center justify-between">
      <p className="font-medium">
        Open Doors To A World Of Indigenous Food
      </p>

      <div className="flex items-center gap-5 text-sm">
        <Link href="/track-order" className="hover:text-green-200 transition">
          Track Order
        </Link>
        <Link href="/contact" className="hover:text-green-200 transition">
          Support
        </Link>
        <Link href="/b2b" className="hover:text-green-200 transition">
          Bulk Orders
        </Link>
      </div>
    </div>
  </div>

  {/* MAIN HEADER */}
  <div
    className={`transition-all duration-500 ${
      scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100"
        : "bg-white/85 backdrop-blur-lg shadow-xl"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-20 sm:h-24 lg:h-[112px] flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-3 sm:gap-4">
          <div className="relative h-14 w-[150px] sm:h-16 sm:w-[180px] lg:h-[88px] lg:w-[220px]">
            <Image
              src="/Logo1.png"
              alt="Kopahi Logo"
              fill
              sizes="(max-width:640px) 150px, (max-width:1024px) 180px, 220px"
              priority
              className="object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="hidden xl:block">
            <p className="text-[11px] uppercase tracking-[0.35em] text-green-700 font-semibold">
              Truly Indigenous
            </p>
            <p className="text-xs text-gray-500 mt-1">
              North East Farms To Your Home
            </p>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div ref={dropdownRef} className="hidden lg:flex items-center gap-10">
          {navLinks.map((item) => {
            if ("submenu" in item && item.submenu) {
              const isOpen = openSub === item.label;
              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenSub(isOpen ? null : item.label)}
                    className="relative text-[15px] font-semibold text-gray-700 hover:text-green-700 transition group inline-flex items-center gap-1"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <svg className="w-3.5 h-3.5 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {isOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                      {item.submenu.map((s) => (
                        <Link key={s.href} href={s.href} onClick={() => setOpenSub(null)} className="block px-4 py-3 rounded-xl hover:bg-green-50 transition group/item">
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
                className="relative text-[15px] font-semibold text-gray-700 hover:text-green-700 transition group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-green-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3">

          {/* SEARCH */}
          <Link
            href="/products"
            aria-label="Search products"
            className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-green-50 hover:border-green-200 transition flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
          </Link>

          {/* LOGIN */}
          <Link
            href="/login"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>

          {/* SIGNUP */}
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-green-600 text-white text-sm font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
          >
            Sign Up
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-green-50 transition flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l1 5h13l2-5h-15zm3 8h12l-1 6H7l-1-6zm3 9a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>

            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-700 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>
        </div>

        {/* MOBILE: cart + menu */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l1 5h13l2-5h-15zm3 8h12l-1 6H7l-1-6zm3 9a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-700 text-white text-[10px] font-bold flex items-center justify-center">
              3
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>

    {/* MOBILE MENU */}
    {mobileOpen && (
      <div className="lg:hidden border-t border-gray-100 bg-white shadow-xl">
        <div className="px-6 py-6 flex flex-col gap-4">

          {navLinks.map((item) => {
            if ("submenu" in item && item.submenu) {
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
            <Link
              href="/login"
              className="text-center py-3 rounded-xl border border-gray-200 font-semibold"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="text-center py-3 rounded-xl bg-green-700 text-white font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )}
  </div>
</nav>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/products/tea-garden.jpg"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/farmer.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75"></div>

        <div className="relative z-10 min-h-[100svh] flex items-center justify-center text-center px-5 sm:px-6 pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20">
          <div className="max-w-4xl text-white reveal">
            <p className="text-green-300 font-semibold text-xs sm:text-sm md:text-base mb-4 sm:mb-5 uppercase tracking-[0.22em] sm:tracking-[0.25em]">
              Farmer Stories of North East India
            </p>
            <h1 className="text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              From North East India
              <span className="block text-green-400 mt-2">To Your Home</span>
            </h1>
            <p className="mt-5 sm:mt-7 text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
              Authentic tea, honey, black rice, spices and silks sourced directly from trusted farmers across all seven sister states.
            </p>

            <div className="mt-7 sm:mt-10 flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Link href="/products" className="group bg-green-600 hover:bg-green-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 font-medium inline-flex items-center gap-2 text-sm sm:text-base">
                Shop Now
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/join" className="border-2 border-white/80 backdrop-blur-sm bg-white/5 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white hover:text-black transition-all font-medium text-sm sm:text-base">
                Become a Vendor
              </Link>
            </div>

            <div className="mt-10 sm:mt-14 flex flex-wrap justify-center gap-x-5 gap-y-3 sm:gap-6 text-[11px] sm:text-xs text-white/80">
              {["FSSAI Certified", "GI Tagged Products", "Direct Farmer Payout"].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <div className="float-slow w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="bg-gradient-to-br from-green-700 to-green-800 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-5 sm:px-8 relative z-10">
          {[
            { num: "500+", label: "Verified Farmers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { num: "120+", label: "Premium Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { num: "30+", label: "Cities Served", icon: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
            { num: "10K+", label: "Happy Customers", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{s.num}</h2>
              <p className="text-green-100 mt-1 text-xs sm:text-sm md:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SOURCING MAP ================= */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-10">
            Our Network
          </span>

          <div className="bg-gradient-to-br from-gray-50 to-green-50 p-3 sm:p-4 md:p-6 rounded-3xl shadow-xl border border-green-100">
            <img src="/map.png" alt="Kopahi sourcing map showing farmer networks across North East India" className="w-full rounded-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Featured
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Handpicked Products</h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base">
              Three curated catalogues — GI tagged agricultural produce, GI tagged handcrafts, and our everyday essentials.
            </p>
          </div>

          {[
            { title: "GI Tagged Agri Products", subtitle: "Authenticated produce from across the seven sister states", href: "/products/gi-tagged", items: giAgri },
            { title: "GI Tagged Handcrafts", subtitle: "Heritage textiles and handicrafts", href: "/products/gi-tagged", items: giCrafts },
            { title: "Non-GI Products", subtitle: "Everyday essentials curated by Kopahi", href: "/products/non-gi-tagged", items: nonGi },
          ].map((group) => (
            <div key={group.title} className="mb-14 last:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{group.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{group.subtitle}</p>
                </div>
                <Link href={group.href} className="text-green-700 font-semibold hover:text-green-800 inline-flex items-center gap-2 group text-sm sm:text-base">
                  View all
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
                {group.items.map((item: any, i) => (
                  <div key={`${group.title}-${i}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-gray-100">
                    <div className="relative overflow-hidden aspect-square bg-gray-100">
                      <img src={item.img} alt={item.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {item.tag && (
                        <span className="absolute top-3 left-3 bg-green-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {item.tag}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(item.name); }}
                        aria-pressed={wishlist.has(item.name)}
                        aria-label={wishlist.has(item.name) ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      >
                        <svg className={`w-4 h-4 transition-colors ${wishlist.has(item.name) ? "text-red-500" : "text-gray-700"}`} fill={wishlist.has(item.name) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="flex items-center gap-1 mb-1.5">
                        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">{item.rating}</span>
                      </div>
                      <h4 className="font-semibold text-sm md:text-base text-gray-900 mb-1 line-clamp-1">{item.name}</h4>
                      <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-green-700 font-bold text-base md:text-lg">{item.price}</p>
                        {"oldPrice" in item && item.oldPrice && <p className="text-gray-400 line-through text-xs">{item.oldPrice}</p>}
                      </div>
                      <Link href={group.href} className="block text-center w-full bg-gray-900 hover:bg-green-700 text-white py-2 rounded-lg transition-colors text-xs md:text-sm font-medium">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE KOPAHI ================= */}
      <section className="py-16 sm:py-20 md:py-24 px-5 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Why Kopahi
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Why Choose <span className="text-green-700">Kopahi?</span>
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
              We bridge the gap between North East farmers and conscious consumers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {[
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 21V8a5 5 0 0110 0v13m-10 0h10m-10 0H1m12 0h10m-10 0V11a4 4 0 014-4h2a4 4 0 014 4v10" /></svg>,
                title: "Direct from Farmers",
                desc: "Transparent sourcing from trusted Assam farmers with zero middlemen and fair payouts.",
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                title: "GI Tagged Quality",
                desc: "Premium verified products with authenticated North East origin and FSSAI certification.",
              },
              {
                icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
                title: "Fast & Safe Delivery",
                desc: "Pan-India shipping with premium packaging — your order tracked end to end.",
              },
            ].map((f, i) => (
              <div key={i} className="group bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 hover:border-green-200">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-green-50 text-green-700 mb-5 sm:mb-6 group-hover:bg-green-700 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 tracking-tight">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-green-50 via-white to-green-50/40 relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-green-100/40 rounded-full blur-3xl"></div>

        <div className="text-center mb-12 sm:mb-16 relative z-10 px-5 sm:px-6">
          <span className="inline-block px-4 py-1.5 bg-white text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            Verified Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            What Customers Say <span className="text-green-600">💚</span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto text-sm sm:text-base">Real stories from buyers who trust Kopahi for authentic produce.</p>
        </div>

        <div className="relative overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-green-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-green-50 to-transparent z-10 pointer-events-none"></div>

          <div className="marquee-track flex gap-4 sm:gap-6 px-5 sm:px-6">
            {[...reviews, ...reviews].map((item, i) => (
              <div key={i} className="w-[280px] sm:w-[340px] md:w-[380px] flex-shrink-0 bg-white p-5 sm:p-7 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 relative">
                <div className="absolute top-4 right-5 text-6xl text-green-100 font-serif leading-none select-none pointer-events-none">"</div>

                <div className="flex gap-0.5 mb-4 relative z-10">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-800 leading-relaxed mb-5 sm:mb-6 whitespace-normal min-h-[72px] sm:min-h-[80px] text-sm sm:text-base">"{item.text}"</p>

                <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-700">{item.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.7 6.3l-4.4 4.4a.8.8 0 01-1.1 0L4 8.5a.8.8 0 011.1-1.1L6.7 9l3.9-3.9a.8.8 0 011.1 1.2z" />
                      </svg>
                      Verified · {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER CTA ================= */}
      <section className="py-14 sm:py-20 px-5 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-7 sm:p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Join the Kopahi Family</h2>
            <p className="text-green-100 mb-6 sm:mb-8 text-base sm:text-lg">
              Get 10% off your first order, exclusive farmer stories, and early access to new harvests.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              noValidate
              aria-describedby="newsletter-status"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => {
                  setNewsletterEmail(e.target.value);
                  if (newsletterStatus !== "idle") {
                    setNewsletterStatus("idle");
                    setNewsletterMessage("");
                  }
                }}
                placeholder="your@email.com"
                autoComplete="email"
                disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                aria-invalid={newsletterStatus === "error"}
                aria-label="Email address"
                className={`flex-1 px-5 py-3.5 rounded-xl text-gray-900 bg-white/95 placeholder:text-gray-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                  newsletterStatus === "error"
                    ? "ring-2 ring-red-300 focus:ring-red-400"
                    : "focus:ring-green-300"
                }`}
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                className="bg-white text-green-800 hover:bg-green-50 px-7 py-3.5 rounded-xl font-semibold transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {newsletterStatus === "loading" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Subscribing…
                  </>
                ) : newsletterStatus === "success" ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
            <p
              id="newsletter-status"
              role="status"
              aria-live="polite"
              className={`text-xs mt-4 min-h-[1rem] ${
                newsletterStatus === "error"
                  ? "text-red-200"
                  : newsletterStatus === "success"
                  ? "text-green-100 font-medium"
                  : "text-green-200"
              }`}
            >
              {newsletterMessage || "No spam. Unsubscribe anytime."}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}