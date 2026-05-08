"use client";

import Link from "next/link";
import PageShell from "../../components/PageShell";
import Footer from "../../components/Footer";

type Farmer = {
  name: string;
  role: string;
  region: string;
  image: string;
  story: string;
  product: string;
  yearsWith: number;
};

const farmers: Farmer[] = [
  {
    name: "Rina Borah",
    role: "Tea Plucker",
    region: "Dibrugarh, Assam",
    image: "/products/assam-tea.jpg",
    story:
      "Rina has plucked tea on the same Brahmaputra-side estate for 19 years. Two leaves and a bud, before the dew lifts.",
    product: "Assam Black Tea",
    yearsWith: 4,
  },
  {
    name: "Khrieliezo Dawhuo",
    role: "Chilli Farmer",
    region: "Kohima, Nagaland",
    image: "/products/bhut-jolokia.jpg",
    story:
      "Khrieliezo grows Bhut Jolokia on terraced plots above 1,200m. He pickles, smokes and sun-dries each batch the way his grandmother taught him.",
    product: "Bhut Jolokia",
    yearsWith: 3,
  },
  {
    name: "Lalremruati Chhangte",
    role: "Spice Cultivator",
    region: "Aizawl, Mizoram",
    image: "/products/black-cardamom.jpg",
    story:
      "Lalremruati's family has grown black cardamom in the Mizoram hills for four generations. She also runs a small cooperative for 22 women growers.",
    product: "Black Cardamom",
    yearsWith: 2,
  },
  {
    name: "Bireswar Hazarika",
    role: "Rice Farmer",
    region: "Sivasagar, Assam",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=85",
    story:
      "Bireswar grows the aromatic Joha rice on his 4-acre farm using his ancestral seed-bank. No hybrids, no pesticides — only patience and his grandfather's notes.",
    product: "Joha Rice",
    yearsWith: 5,
  },
  {
    name: "Pohor Phukan",
    role: "Ginger Cooperative Lead",
    region: "Karbi Anglong, Assam",
    image: "/products/karbi-anglong-ginger.jpg",
    story:
      "Pohor coordinates 38 ginger growers from the Karbi Hills. He negotiates fair pricing, runs lab tests for quality, and makes sure every kg ships to Kopahi the day it&apos;s pulled.",
    product: "Karbi Anglong Ginger",
    yearsWith: 3,
  },
  {
    name: "Phulmoni Devi",
    role: "Muga Silk Weaver",
    region: "Sualkuchi, Assam",
    image: "/products/muga-silk-stole.jpg",
    story:
      "Phulmoni runs a single loom in her family home. One stole takes 8 days. The thread comes from her sister&apos;s sericulture farm 20 km away — fully traceable.",
    product: "Muga Silk Stoles",
    yearsWith: 6,
  },
  {
    name: "Th. Ibemcha",
    role: "Lemon Grower",
    region: "Ukhrul, Manipur",
    image: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=900&q=85",
    story:
      "Ibemcha&apos;s Kachai lemon grove sits at the edge of the Shirui hills. Every fruit is hand-picked when fragrance peaks, never before.",
    product: "Kachai Lemon",
    yearsWith: 2,
  },
  {
    name: "Tonkho Marak",
    role: "Pineapple Farmer",
    region: "Garo Hills, Meghalaya",
    image: "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=1200&q=85",
    story:
      "Tonkho cultivates Queen pineapple on terraced slopes — the variety so sweet it earned Tripura its GI tag and now thrives in Garo soil too.",
    product: "Queen Pineapple",
    yearsWith: 1,
  },
];

export default function AboutFarmersPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell active="About">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/products/tea-garden.jpg"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/farmers.mp4" type="video/mp4" />
            <source src="/farmer.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-black/80"></div>

          <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
            <div className="max-w-4xl text-white">
              <p className="text-green-300 font-semibold text-sm mb-5 uppercase tracking-[0.3em]">
                The People Behind The Produce
              </p>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
                Farmer Stories
                <span className="block text-green-400 mt-2">Of North East India</span>
              </h1>
              <p className="mt-7 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
                Every Kopahi product is grown, picked, cured or woven by a real person with a real address. Here are some of them.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-br from-green-700 to-green-800 text-white py-14">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
            {[
              { val: "500+", label: "Verified Farmers" },
              { val: "180+", label: "Women Growers" },
              { val: "7", label: "States Covered" },
              { val: "100%", label: "Direct Payouts" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">{s.val}</p>
                <p className="text-green-100 mt-1 text-sm md:text-base">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stories grid */}
        <section className="py-20 px-6 flex-1 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                Meet Our Farmers
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stories from the field</h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
                Each portrait is a partnership — verified, paid weekly, and proud to be on the label.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {farmers.map((f) => (
                <article
                  key={f.name}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500 flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 md:p-7 flex flex-col flex-1">
                    <p className="text-green-700 font-bold text-xs tracking-[0.25em] uppercase mb-1">{f.region}</p>
                    <h3 className="text-xl font-bold tracking-tight">{f.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{f.role} · {f.yearsWith} year{f.yearsWith === 1 ? "" : "s"} with Kopahi</p>
                    <p className="text-gray-600 leading-relaxed text-sm mb-5">{f.story}</p>
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Grows for</span>
                      <span className="text-sm font-semibold text-green-700">{f.product}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Direct payout strip */}
        <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-white to-green-50/40">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-green-100 text-center">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              How we pay
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Zero middlemen. Weekly settlements.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Every farmer on the Kopahi network is paid directly into their bank or UPI within seven days of dispatch. Each payment is itemised, traceable, and visible on a private dashboard.
            </p>
            <Link href="/join" className="inline-block bg-gradient-to-r from-green-700 to-green-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all">
              Join as a vendor
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Buy what they grow</h2>
              <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
                Support these farmers directly — every order shows the farmer it came from.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/products/gi-tagged" className="bg-white text-green-800 hover:bg-green-50 px-7 py-3.5 rounded-xl font-bold transition shadow-lg">
                  Shop GI-tagged
                </Link>
                <Link href="/products/non-gi-tagged" className="border-2 border-white/80 backdrop-blur-sm bg-white/10 px-7 py-3.5 rounded-xl hover:bg-white hover:text-green-800 transition font-bold">
                  Shop everyday
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
