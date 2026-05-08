"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import { api } from "../lib/api";
import { useCart } from "../context/CartContext";

type ApiProduct = {
  _id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images?: string[];
  rating?: number;
  numReviews?: number;
  featured?: boolean;
};

const FALLBACK_PRODUCTS: ApiProduct[] = [
  { _id: "fallback-1", name: "Assam Premium Tea", category: "Tea", price: 499, originalPrice: 599, stock: 100, images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80"], rating: 4.9, numReviews: 142 },
  { _id: "fallback-2", name: "Wild Forest Honey", category: "Honey", price: 599, originalPrice: 749, stock: 60, images: ["https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&q=80"], rating: 4.8, numReviews: 97 },
  { _id: "fallback-3", name: "Lakadong Turmeric", category: "Spices", price: 299, stock: 80, images: ["https://images.unsplash.com/photo-1615485290449-bd1d3ba66bf3?w=800&q=80"], rating: 4.9, numReviews: 203 },
  { _id: "fallback-4", name: "Organic Black Rice", category: "Rice", price: 699, stock: 50, images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"], rating: 4.7, numReviews: 88 },
];

export default function ProductsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { add, count: cartCount } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/b2b", label: "B2B" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<{ success: boolean; products: ApiProduct[] }>("/api/products?pageSize=50")
      .then((res) => {
        if (cancelled) return;
        if (res.products?.length) {
          setProducts(res.products);
          setUsingFallback(false);
        } else {
          setProducts(FALLBACK_PRODUCTS);
          setUsingFallback(true);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setProducts(FALLBACK_PRODUCTS);
        setUsingFallback(true);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const placeholder = (item: ApiProduct) =>
    `https://placehold.co/800x800/14532d/ffffff?text=${encodeURIComponent(item.name)}`;

  const filtered = useMemo(() => {
    let data =
      activeCategory === "All"
        ? products
        : products.filter((item) => item.category === activeCategory);
    if (search.trim()) {
      data = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    return data;
  }, [activeCategory, search, products]);

  const handleAdd = (item: ApiProduct) => {
    add({
      productId: item._id,
      name: item.name,
      image: item.images?.[0] || placeholder(item),
      price: item.price,
      category: item.category,
    });
    setAddedId(item._id);
    setTimeout(() => setAddedId((cur) => (cur === item._id ? null : cur)), 1200);
  };

  return (
    <main className="bg-gray-50 min-h-screen">

      <header className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 text-white text-sm">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between">
            <p className="hidden md:block font-medium">Premium Products Direct From Assam Farmers</p>
            <div className="flex items-center gap-5">
              <Link href="/contact" className="hover:text-green-200 transition">Support</Link>
              <Link href="/track-order" className="hover:text-green-200 transition">Track Order</Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-24 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-4">
                <div className="relative h-16 w-36">
                  <Image src="/Logo1.png" alt="Kopahi Logo" fill sizes="160px" priority className="object-contain" />
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs tracking-[0.35em] font-bold text-green-700 uppercase">Truly Indigenous</p>
                  <p className="text-sm text-gray-500 mt-1">Assam Farms To Your Home</p>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-10">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative font-semibold transition ${
                      item.label === "Products" ? "text-green-700" : "text-gray-700 hover:text-green-700"
                    }`}
                  >
                    {item.label}
                    {item.label === "Products" && <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-green-700" />}
                  </Link>
                ))}
              </nav>

              <div className="hidden lg:flex items-center gap-4">
                <Link href="/cart" className="relative text-gray-700 hover:text-green-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 3h2l1 5h13l2-5h-15zm3 8h12l-1 6H7l-1-6z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-green-700 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/login" className="font-semibold text-gray-700 hover:text-green-700 transition">Login</Link>
                <Link href="/signup" className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-green-600 text-white font-bold shadow-lg hover:shadow-2xl transition">Sign Up</Link>
              </div>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-3xl">☰</button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 px-6 py-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="font-semibold text-gray-700 hover:text-green-700" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </Link>
                ))}
                <hr />
                <Link href="/cart" className="font-semibold">Cart ({cartCount})</Link>
                <Link href="/login" className="font-semibold">Login</Link>
                <Link href="/signup" className="bg-green-700 text-white text-center py-3 rounded-xl font-semibold">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="uppercase tracking-[0.35em] text-green-200 font-semibold text-sm mb-4">Premium Collection</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-5">Our Authentic Products</h1>
          <p className="max-w-2xl mx-auto text-lg text-green-100 leading-8">
            Carefully sourced tea, honey, rice and spices directly from trusted farmers of North East India.
          </p>
          <div className="max-w-xl mx-auto mt-10 relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name (e.g. tea, honey, turmeric)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-2xl text-gray-900 placeholder:text-gray-500 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-6 border-b border-gray-100 sticky top-[136px] z-30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3 justify-center">
          {["All", "Tea", "Honey", "Rice", "Spices"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveCategory(item)}
              className={`px-5 py-2 rounded-full font-semibold transition border ${
                activeCategory === item
                  ? "bg-green-700 text-white border-green-700 shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {usingFallback && !loading && (
            <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              Showing sample products — backend at{" "}
              <code className="font-mono text-xs">{process.env.NEXT_PUBLIC_API_URL || "localhost:5000"}</code>{" "}
              is unreachable or empty. Run <code className="font-mono">npm run seed</code> in the backend to populate the catalogue.
            </div>
          )}

          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
              {activeCategory !== "All" && (<> in <span className="font-semibold text-green-700">{activeCategory}</span></>)}
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="aspect-square bg-gray-100" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-16 bg-gray-100 rounded-full" />
                    <div className="h-5 bg-gray-100 rounded w-2/3" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 py-20 px-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">Try a different search or clear the filters.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="px-6 py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {filtered.map((item) => {
                const inStock = (item.stock ?? 1) > 0;
                const justAdded = addedId === item._id;
                return (
                  <div key={item._id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-green-200 transition-all duration-500 hover:-translate-y-1 flex flex-col">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.images?.[0] || placeholder(item)}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          const t = e.currentTarget;
                          if (!t.dataset.fallback) {
                            t.dataset.fallback = "1";
                            t.src = placeholder(item);
                          }
                        }}
                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${!inStock ? "opacity-60" : ""}`}
                      />
                      {!inStock && (
                        <span className="absolute top-3 right-3 bg-white/95 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">Out of Stock</span>
                      )}
                      {item.featured && inStock && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Featured</span>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <span className="inline-block self-start px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-3">{item.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>

                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-medium text-gray-800">{(item.rating ?? 4.7).toFixed(1)}</span>
                        <span className="text-gray-400">·</span>
                        <span>{item.numReviews ?? 0} reviews</span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-5 mt-auto">
                        <span className="text-2xl font-bold text-green-700">₹{item.price}</span>
                        {item.originalPrice ? (
                          <span className="text-gray-400 line-through text-sm">₹{item.originalPrice}</span>
                        ) : null}
                      </div>

                      <button
                        disabled={!inStock}
                        onClick={() => handleAdd(item)}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                          !inStock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : justAdded
                            ? "bg-green-600 text-white"
                            : "bg-gray-900 hover:bg-green-700 text-white"
                        }`}
                      >
                        {!inStock ? "Notify Me" : justAdded ? "Added ✓" : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
