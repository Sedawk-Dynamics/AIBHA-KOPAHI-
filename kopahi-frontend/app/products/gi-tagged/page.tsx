"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PageShell from "../../components/PageShell";
import Footer from "../../components/Footer";
import { useCart } from "../../context/CartContext";

type Product = {
  id: string;
  name: string;
  category: "Agri" | "Handcraft";
  region: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  rating: number;
  giNote: string;
};

const giProducts: Product[] = [
  {
    id: "joha-rice",
    name: "Joha Rice",
    category: "Agri",
    region: "Assam",
    price: 699,
    originalPrice: 849,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=900&q=85",
    description: "Aromatic short-grain Joha — the pride of Assamese kitchens. Pairs with kheer, pithas and the slow-simmered curries it was bred for.",
    rating: 4.9,
    giNote: "GI Tag · Assam · 2018",
  },
  {
    id: "assam-tea",
    name: "Assam Tea",
    category: "Agri",
    region: "Dibrugarh, Assam",
    price: 499,
    originalPrice: 599,
    image: "/products/assam-tea.jpg",
    description: "Bold, malty, full-bodied Assam black tea hand-plucked from estates along the Brahmaputra. A true breakfast tea.",
    rating: 4.9,
    giNote: "GI Tag · Assam · 2007",
  },
  {
    id: "karbi-anglong-ginger",
    name: "Karbi Anglong Ginger",
    category: "Agri",
    region: "Assam",
    price: 349,
    image: "/products/karbi-anglong-ginger.jpg",
    description: "High-pungency, low-fibre ginger from the hills of Karbi Anglong. Powerful in marinades, gentle in tea.",
    rating: 4.7,
    giNote: "GI Tag · Assam · 2013",
  },
  {
    id: "kachai-lemon",
    name: "Kachai Lemon",
    category: "Agri",
    region: "Manipur",
    price: 279,
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=900&q=85",
    description: "Manipur's small, fragrant Kachai lemon — incredibly juicy, used for sherbets, pickles and Vitamin-C-rich teas.",
    rating: 4.6,
    giNote: "GI Tag · Manipur · 2014",
  },
  {
    id: "lychee",
    name: "Lychee",
    category: "Agri",
    region: "Bihar / Assam",
    price: 399,
    image: "/products/lychee.jpg",
    description: "Plump, fragrant summer lychee — rushed from orchard to your fridge while still snapping with sweetness.",
    rating: 4.7,
    giNote: "GI Tag · Muzaffarpur · 2018",
  },
  {
    id: "judima",
    name: "Judima Rice Wine",
    category: "Agri",
    region: "Dima Hasao, Assam",
    price: 999,
    image: "/products/judima.jpg",
    description: "A traditional rice wine of the Dimasa community — fermented with herbs in earthen vessels. India's first traditional brew with a GI tag.",
    rating: 4.8,
    giNote: "GI Tag · Assam · 2021",
  },
  {
    id: "bhut-jolokia",
    name: "Bhut Jolokia (Naga Chilli)",
    category: "Agri",
    region: "Nagaland / Assam",
    price: 399,
    image: "/products/bhut-jolokia.jpg",
    description: "One of the world's hottest chillies — a deep smoky heat that builds before it bites. Use sparingly; respect always.",
    rating: 4.8,
    giNote: "GI Tag · 2008",
  },
  {
    id: "lakadong-turmeric",
    name: "Lakadong Turmeric",
    category: "Agri",
    region: "Jaintia Hills, Meghalaya",
    price: 349,
    image: "/products/lakadong-turmeric.jpg",
    description: "7–9% curcumin — among the highest in the world. Earthy, deeply golden, irreplaceable in any modern kitchen.",
    rating: 4.9,
    giNote: "GI Tag · Meghalaya · 2024",
  },
  {
    id: "muga-silk-thread",
    name: "Muga Silk Thread",
    category: "Handcraft",
    region: "Sualkuchi, Assam",
    price: 2499,
    image: "/products/muga-silk-thread.jpg",
    description: "The golden yarn that only Assam produces — woven into the heritage Mekhela Chador for centuries.",
    rating: 4.9,
    giNote: "GI Tag · Assam · 2007",
  },
  {
    id: "tripura-pineapple",
    name: "Tripura Queen Pineapple",
    category: "Agri",
    region: "Tripura",
    price: 249,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=900&q=85",
    description: "Sweet, low-acid, fragrant. The Queen of pineapples — and now exported across Asia and the EU.",
    rating: 4.6,
    giNote: "GI Tag · Tripura · 2015",
  },
  {
    id: "muga-stole",
    name: "Muga Silk Stole",
    category: "Handcraft",
    region: "Sualkuchi, Assam",
    price: 4599,
    image: "/products/muga-silk-stole.jpg",
    description: "Hand-woven Muga stole with a natural golden lustre that deepens with age — a true generational heirloom.",
    rating: 4.9,
    giNote: "GI Tag · Assam · 2007",
  },
  {
    id: "cane-baskets",
    name: "Cane & Bamboo Basket Set",
    category: "Handcraft",
    region: "Tripura / Mizoram",
    price: 1299,
    image: "/products/cane-baskets.jpg",
    description: "Hand-tied storage baskets from the bamboo belts of Tripura and Mizoram — light, sturdy and quietly beautiful.",
    rating: 4.7,
    giNote: "GI Tag · 2014",
  },
];

export default function GITaggedProductsPage() {
  const [filter, setFilter] = useState<"All" | "Agri" | "Handcraft">("All");
  const [search, setSearch] = useState("");
  const { add } = useCart();

  const filtered = useMemo(() => {
    let items = filter === "All" ? giProducts : giProducts.filter((p) => p.category === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
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
              GI Tagged Catalogue
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Authenticated produce.
              <span className="block text-green-300 mt-2">Protected by origin.</span>
            </h1>
            <p className="text-green-100 max-w-2xl mx-auto mt-6 text-lg leading-relaxed">
              A Geographical Indication is a legal seal that ties a product to the land that grew it. Every item below is GI-tagged — sourced directly from the region that holds the tag.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white py-6 border-b border-gray-100 sticky top-[152px] lg:top-[152px] z-30">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(["All", "Agri", "Handcraft"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-5 py-2 rounded-full font-semibold text-sm transition border ${
                    filter === c
                      ? "bg-green-700 text-white border-green-700 shadow-md"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  }`}
                >
                  {c === "All" ? "All GI Products" : c === "Agri" ? "Agri Products" : "Handcrafts"}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.3-4.3m1.3-5.2a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, region…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-14 px-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-gray-600 mb-6">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span> GI-tagged{" "}
              {filter === "All" ? "products" : filter.toLowerCase()}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => (
                <article key={p.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500 flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute top-3 left-3 bg-green-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">GI Tagged</span>
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-green-700 font-bold mb-1">{p.region}</p>
                    <h3 className="font-bold text-base md:text-lg tracking-tight mb-1.5 line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-gray-500 italic mb-2">{p.giNote}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                    <div className="flex items-baseline gap-2 mb-3 mt-auto">
                      <p className="text-lg font-bold text-green-700">₹{p.price.toLocaleString("en-IN")}</p>
                      {p.originalPrice && <p className="text-xs text-gray-400 line-through">₹{p.originalPrice}</p>}
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

            {filtered.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 py-16 px-6 text-center max-w-xl mx-auto">
                <h3 className="text-xl font-semibold mb-2">No products match</h3>
                <p className="text-gray-500 mb-5">Try a different keyword or filter.</p>
                <button onClick={() => { setSearch(""); setFilter("All"); }} className="px-5 py-2.5 rounded-xl bg-green-700 text-white font-semibold">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* GI explainer */}
        <section className="bg-gradient-to-br from-gray-50 via-white to-green-50/30 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              What is a GI tag?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              A legal promise from a place to a product
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A Geographical Indication is granted by the Government of India when a product&apos;s reputation, quality or characteristics are tied to its place of origin. It protects farmers from imitation, ensures premium pricing, and guarantees authenticity for the buyer.
            </p>
            <Link href="/about" className="inline-block mt-8 px-7 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-semibold transition">
              Read our sourcing story
            </Link>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
