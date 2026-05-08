"use client";

import { useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  category: "Tea" | "Spices" | "Rice" | "Herbal";
  price: number;
  image: string;
  description: string;
  rating: number;
};



const products: Product[] = [
  {
    id: "purple-rice",
    name: "Purple Rice",
    category: "Rice",
    price: 599,
    image: "/products/purple-rice.jpg",
    description:
      "Indigenous purple rice with a nutty bite — high in anthocyanins, beautiful on the plate.",
    rating: 4.6,
  },
  {
    id: "pepper-powder",
    name: "Pepper Powder",
    category: "Spices",
    price: 249,
    image: "/products/pepper-powder.jpg",
    description:
      "Stone-milled black pepper, sealed within hours of grinding to lock in piperine and aroma.",
    rating: 4.5,
  },
  {
    id: "black-cardamom",
    name: "Black Cardamom",
    category: "Spices",
    price: 449,
    image: "/products/black-cardamom.jpg",
    description:
      "Smoky, resinous black cardamom from the Eastern Himalayas — built for biryanis and slow daals.",
    rating: 4.7,
  },
  {
    id: "black-tea",
    name: "Black Tea",
    category: "Tea",
    price: 329,
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=900&q=85",
    description:
      "Bold, full-bodied estate black tea — your everyday cup, only better.",
    rating: 4.6,
  },
  {
    id: "blue-tea",
    name: "Blue Tea (Butterfly Pea)",
    category: "Tea",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=900&q=85",
    description:
      "Vivid indigo brew that turns purple with lemon — caffeine-free and rich in antioxidants.",
    rating: 4.7,
  },
  {
    id: "hibiscus-tea",
    name: "Hibiscus Tea",
    category: "Tea",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=900&q=85",
    description:
      "Tart, ruby-red infusion from sun-dried hibiscus petals. Wonderful iced.",
    rating: 4.6,
  },
  {
    id: "mint-tea",
    name: "Mint Tea",
    category: "Tea",
    price: 279,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=85",
    description:
      "Cool peppermint blended with green tea base — a clean, refreshing finish.",
    rating: 4.5,
  },
  {
    id: "rose-tea",
    name: "Rose Tea",
    category: "Tea",
    price: 349,
    image: "/products/rose-tea.jpg",
    description:
      "Hand-picked rose petals layered over a soft black tea — fragrant, romantic, calming.",
    rating: 4.7,
  },
  {
    id: "chamomile-tea",
    name: "Chamomile Tea",
    category: "Tea",
    price: 329,
    image: "/products/chamomile-tea.jpg",
    description: "Whole chamomile flowers — a slow, golden bedtime brew.",
    rating: 4.6,
  },
  {
    id: "tengamora-phul",
    name: "Tengamora Phul",
    category: "Herbal",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=900&q=85",
    description:
      "Sun-dried Tengamora flowers — used across Assamese kitchens for tangy fish curries and herbal infusions.",
    rating: 4.5,
  },
];

export default function NonGITaggedProductsPage() {
  const [filter, setFilter] = useState<"All" | Product["category"]>("All");
  const [search, setSearch] = useState("");
  const { add } = useCart();

  const filtered = useMemo(() => {
    let items =
      filter === "All"
        ? products
        : products.filter((p) => p.category === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [filter, search]);

  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell active="Products">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 text-white py-20 md:py-28 px-6 overflow-hidden">
          <div className="absolute top-10 -left-16 w-96 h-96 bg-green-500/25 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 -right-16 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-green-200 rounded-full text-xs font-bold uppercase tracking-[0.3em] mb-5 border border-white/20">
              Everyday Essentials
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Non-GI Products.
              <span className="block text-green-300 mt-2">
                Curated for every kitchen.
              </span>
            </h1>
            <p className="text-green-100 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
              Carefully curated teas, spices, rice and herbal infusions from the
              same trusted farmer network — for every kitchen, every day.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white py-6 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(["All", "Tea", "Spices", "Rice", "Herbal"] as const).map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`px-5 py-2 rounded-full font-semibold text-sm transition border ${
                      filter === c
                        ? "bg-green-700 text-white border-green-700 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }`}
                  >
                    {c}
                  </button>
                ),
              )}
            </div>

            <div className="relative w-full md:w-80">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-14 px-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-gray-600 mb-6">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filtered.length}
              </span>{" "}
              products
              {filter !== "All" && (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-green-700">{filter}</span>
                </>
              )}
              .
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-gray-900/85 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-base md:text-lg tracking-tight mb-1.5 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex items-baseline gap-2 mb-3 mt-auto">
                      <p className="text-lg font-bold text-green-700">
                        ₹{p.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        add({
                          productId: p.id,
                          name: p.name,
                          image: p.image,
                          price: p.price,
                          category: p.category,
                        })
                      }
                      className="w-full bg-gray-900 hover:bg-green-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
