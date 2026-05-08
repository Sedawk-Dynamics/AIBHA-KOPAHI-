"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

type WishProduct = {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
};

export default function WishlistPage() {
  const { user } = useAuth();
  const { add } = useCart();
  const [items, setItems] = useState<WishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get<{ success: boolean; items: WishProduct[] }>(
          "/api/wishlist",
          { auth: true }
        );
        if (!cancelled) setItems(res.items || []);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "Could not load wishlist");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const removeItem = async (id: string) => {
    setItems((cur) => cur.filter((i) => i._id !== id));
    try {
      await api.del(`/api/wishlist/${id}`, { auth: true });
    } catch {
      // best-effort; reload on next visit will repair state
    }
  };

  const moveAllToCart = () => {
    const inStock = items.filter((i) => i.stock > 0);
    inStock.forEach((p) =>
      add({
        productId: p._id,
        name: p.name,
        image: p.images?.[0] || "",
        price: p.price,
        category: p.category,
      })
    );
    Promise.all(inStock.map((p) => api.del(`/api/wishlist/${p._id}`, { auth: true }).catch(() => {})));
    setItems((cur) => cur.filter((i) => i.stock <= 0));
  };

  const addOne = (p: WishProduct) => {
    if (p.stock <= 0) return;
    add({
      productId: p._id,
      name: p.name,
      image: p.images?.[0] || "",
      price: p.price,
      category: p.category,
    });
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-md">
          <h2 className="text-xl font-bold mb-3">Sign in to view your wishlist</h2>
          <Link href="/login?next=/dashboard/wishlist" className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <DashboardShell role="Customer" userName={user.name} userEmail={user.email}>
      <div className="mb-6 md:mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/dashboard" className="hover:text-green-700">Dashboard</Link>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-900 font-medium">Wishlist</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">My Wishlist</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            {items.length} items saved · {items.filter((i) => i.stock > 0).length} ready to order
          </p>
        </div>
        {items.filter((i) => i.stock > 0).length > 0 && (
          <button onClick={moveAllToCart} className="bg-green-700 hover:bg-green-800 text-white px-4 md:px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md inline-flex items-center gap-2 text-sm whitespace-nowrap">
            Move all to cart
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Save items you love so you can find them easily later.</p>
          <Link href="/products" className="inline-block bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((item) => {
            const inStock = item.stock > 0;
            const discount =
              item.originalPrice && item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;
            return (
              <div
                key={item._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={item.images?.[0] || ""}
                    alt={item.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!inStock ? "opacity-60" : ""}`}
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-red-500 text-white">
                      -{discount}%
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-red-50 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  {!inStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <p className="text-base md:text-lg font-bold text-gray-900">₹{item.price}</p>
                    {item.originalPrice ? (
                      <p className="text-xs text-gray-400 line-through">₹{item.originalPrice}</p>
                    ) : null}
                  </div>
                  <button
                    disabled={!inStock}
                    onClick={() => addOne(item)}
                    className="w-full bg-gray-900 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-500 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors"
                  >
                    {inStock ? "Add to cart" : "Notify me"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
