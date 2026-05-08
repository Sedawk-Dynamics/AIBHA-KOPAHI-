"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import InlineNav from "../components/InlineNav";

export default function AboutPage() {
  const [stats, setStats] = useState({ farmers: 0, products: 0, cities: 0, customers: 0 });
  const statsRef = useRef<HTMLDivElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!statsRef.current) return;
    const targets = { farmers: 500, products: 120, cities: 30, customers: 10000 };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const duration = 1600;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setStats({
                farmers: Math.round(targets.farmers * eased),
                products: Math.round(targets.products * eased),
                cities: Math.round(targets.cities * eased),
                customers: Math.round(targets.customers * eased),
              });
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const milestones = [
    { year: "2025", title: "Idea", desc: "Born out of a simple realisation — North East India's finest produce rarely reaches mainstream tables. The Kopahi idea took shape." },
    { year: "2026", title: "Implementation / Start-Up", desc: "Kopahi launches. First cohort of growers onboarded across Assam tea gardens, paddy fields, ginger plots and bee farms." },
    { year: "2027", title: "PAN India Launch", desc: "D2C marketplace shipping nationwide with FSSAI-certified packaging and a 30+ city last-mile network." },
    { year: "2028", title: "Exports & B2B", desc: "Wholesale, HoReCa, and international export channels open for GI-tagged catalogues across Asia, EU and the Middle East." },
  ];

  const neStates = [
    {
      name: "Assam",
      title: "Tea, silk and the mighty Brahmaputra",
      desc: "Home to the world-famous Assam tea estates and the golden Muga silk — a textile so rare only Assam can grow the silkworm.",
      img: "/products/tea-garden.jpg",
    },
    {
      name: "Arunachal Pradesh",
      title: "Land of the dawn-lit mountains",
      desc: "26 major tribes, monasteries hugged by clouds, and orange groves that supply some of India's sweetest winter fruit.",
      img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=85",
    },
    {
      name: "Manipur",
      title: "Black rice and the Loktak lake",
      desc: "Chak-hao black rice, indigenous Sangai deer, and a textile tradition that turns kitchen looms into community heirlooms.",
      img: "/products/black-rice.jpg",
    },
    {
      name: "Meghalaya",
      title: "Living root bridges and Lakadong gold",
      desc: "Khasi, Jaintia and Garo communities. Lakadong turmeric here measures 7–9% curcumin — among the highest on earth.",
      img: "/products/lakadong-turmeric.jpg",
    },
    {
      name: "Mizoram",
      title: "Bamboo crafts and the bird's-eye chilli",
      desc: "Tightly-knit bamboo handicrafts, fiery Bird's Eye chillies, and one of the cleanest rice harvests in the country.",
      img: "/products/cane-baskets.jpg",
    },
    {
      name: "Nagaland",
      title: "Naga chilli, smoked pork and Hornbill heritage",
      desc: "Sixteen Naga tribes, the world's hottest chilli (Bhut Jolokia) and the Hornbill Festival that turns Kohima into a cultural mosaic.",
      img: "/products/bhut-jolokia.jpg",
    },
    {
      name: "Tripura",
      title: "Pineapple, bamboo and the Ujjayanta palace",
      desc: "The Queen pineapple — a GI-tagged variety, prized globally for its sweetness — grows on Tripura's terraced hillsides.",
      img: "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=1200&q=85",
    },
  ];

  const farmerScenes = [
    { src: "/products/assam-tea.jpg",            caption: "Tea pluckers at first light · Dibrugarh, Assam" },
    { src: "/products/lakadong-turmeric.jpg",    caption: "Drying turmeric · Lakadong, Meghalaya" },
    { src: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=900&q=85", caption: "Hand-rolling green tea · Sivasagar" },
    { src: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=900&q=85", caption: "Paddy harvest · Joha rice fields, Assam" },
    { src: "/products/ginger-fresh.jpg",         caption: "Karbi Anglong ginger sorting" },
    { src: "/products/tea-garden.jpg",           caption: "Inspecting fresh leaf · Jorhat" },
    { src: "/products/muga-silk-thread.jpg",     caption: "Muga silk weaver · Sualkuchi" },
    { src: "/products/cane-baskets.jpg",         caption: "Cane craft workshop · Tripura" },
  ];

  return (
    <main className="bg-white text-gray-900 antialiased">
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .float-slow { animation: float 7s ease-in-out infinite; }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 0.85; transform: scale(1.05); }
        }
        .pulse-glow { animation: pulseGlow 6s ease-in-out infinite; }

        @keyframes scrollX {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee { animation: scrollX 38s linear infinite; width: max-content; }

        html { scroll-behavior: smooth; }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .float-slow, .pulse-glow, .marquee { animation: none !important; }
        }
      `}</style>

      <InlineNav active="About" />

      {/* ================= HERO (VIDEO) ================= */}
      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/farmer.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/60 to-black/80"></div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-16 w-72 h-72 bg-green-500/20 rounded-full blur-3xl pulse-glow"></div>
        <div className="absolute bottom-1/4 -right-16 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "2s" }}></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl text-white reveal">
            <p className="text-green-300 font-semibold text-sm md:text-base mb-5 uppercase tracking-[0.3em]">
              Our Story
            </p>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
              Connecting North East Farms
              <span className="block text-green-400 mt-2">To Every Home</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
              Kopahi is a premium agri-commerce platform championing authentic, GI-tagged and natural products from across the seven sister states — with Assam at its heart.
            </p>

            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <a href="#mission" className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all font-medium">
                Discover Our Mission
              </a>
              <Link href="/products" className="border-2 border-white/80 backdrop-blur-sm bg-white/5 px-8 py-4 rounded-xl hover:bg-white hover:text-black transition-all font-medium">
                Explore Products
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <div className="float-slow w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section ref={statsRef} className="bg-gradient-to-br from-green-700 to-green-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-8 relative z-10">
          {[
            { val: `${stats.farmers}+`, label: "Verified Farmers", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            { val: `${stats.products}+`, label: "Premium Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { val: `${stats.cities}+`, label: "Cities Served", icon: "M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" },
            { val: `${(stats.customers / 1000).toFixed(stats.customers >= 10000 ? 0 : 1)}K+`, label: "Happy Customers", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight tabular-nums">{s.val}</h2>
              <p className="text-green-100 mt-1 text-sm md:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MISSION / VISION ================= */}
      <section id="mission" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              What Drives Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Mission & Vision</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              The why and the where-to of everything we build at Kopahi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1400&q=80"
                alt="Tea garden in Assam"
                className="w-full h-full object-cover min-h-[460px] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-green-300 font-semibold text-xs uppercase tracking-[0.3em] mb-2">Live On The Ground</p>
                <p className="text-xl font-semibold leading-relaxed">
                  Hand-picked at sunrise across Assam, Meghalaya, Manipur and beyond. Packed the same day. Shipped within 48 hours.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-700 text-white mb-5 group-hover:scale-110 transition">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Connect farmers, vendors and customers through a trusted marketplace — and put North East India's finest produce, with Assam leading, on every premium table in the country.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-700 text-white mb-5 group-hover:scale-110 transition">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To become India's leading agriculture-first multi-vendor platform — and a global doorway to indigenous, GI-tagged Indian produce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOURNEY / TIMELINE ================= */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-green-50/40 relative overflow-hidden">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-green-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              Our Journey
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">From Idea to Pan-India</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              A short timeline of the milestones that shaped Kopahi.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-300 via-green-500 to-green-700 md:-translate-x-1/2"></div>

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-green-700 ring-4 ring-white shadow-lg z-10 mt-2"></div>

                  <div className="md:w-1/2 pl-12 md:pl-0 md:px-12">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-1">
                      <p className="text-green-700 font-bold text-sm tracking-[0.25em] uppercase mb-2">{m.year}</p>
                      <h3 className="text-2xl font-bold mb-3 tracking-tight">{m.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY STARTED (PARALLAX) ================= */}
      <section className="relative py-32 px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1600&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-green-950/90"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-green-200 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 border border-white/20">
            Why We Started
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Empowering Hidden Farmers <br className="hidden md:block" />
            <span className="text-green-400">& Regional Products</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Many of North East India's most authentic products never reach mainstream shelves. Kopahi was built to fix that — through technology, branding, transparent sourcing and direct farmer access.
          </p>

          <blockquote className="mt-12 max-w-2xl mx-auto border-l-4 border-green-400 pl-6 text-left">
            <p className="text-xl italic text-gray-100 leading-relaxed">
              "Every jar of honey, every leaf of tea, every grain of rice we ship carries a story — and a fair payout to the family who grew it."
            </p>
            <footer className="mt-4 text-green-300 font-semibold text-sm">— The Kopahi Team</footer>
          </blockquote>
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Our Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">What Makes Kopahi Different</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Five values we use as a daily filter when making decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Authenticity",
                desc: "Real products from trusted regional farmers — every batch traceable to its origin garden, paddy field, or apiary.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
              },
              {
                title: "Fair Trade",
                desc: "Better payouts and transparent sourcing — farmers see exactly what they earn, with zero middlemen and weekly settlements.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
              {
                title: "Premium Quality",
                desc: "FSSAI-certified, GI-tagged where applicable, and packaged for modern retail with end-to-end cold-chain support.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.518-4.674z" /></svg>,
              },
              {
                title: "Sustainable Sourcing",
                desc: "Organic-first, low-impact farming partners. Plastic-minimised packaging and carbon-conscious logistics.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
              },
              {
                title: "Customer Trust",
                desc: "Honest reviews, accurate ETAs, easy returns. We earn loyalty by treating every order like the first one.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
              },
              {
                title: "Indigenous Pride",
                desc: "We celebrate North East India's culture in every label, story, and shipment we send across the country.",
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 text-green-700 mb-5 group-hover:bg-green-700 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7 NORTH EAST STATES — HERITAGE & CULTURE ================= */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Heritage & Culture
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">The Seven Sister States</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Each of the seven sisters carries its own cuisine, weaves, festivals and farms. Kopahi sources from all of them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {neStates.map((s) => (
              <article
                key={s.name}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={s.img}
                    alt={`Heritage of ${s.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <p className="text-green-700 font-bold text-xs tracking-[0.25em] uppercase mb-2">{s.name}</p>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-10 max-w-2xl mx-auto">
            Sikkim — though sometimes counted with the seven — is also part of our wider sourcing horizon for organic produce and Himalayan honey.
          </p>
        </div>
      </section>

      {/* ================= BEHIND THE SCENES — FARMERS PHOTOS & VIDEOS ================= */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-green-50/30 overflow-hidden">
        <div className="text-center mb-14 px-6">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            Behind The Scenes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Farmers Behind Every Jar</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
            Real photos and clips from the people who grow, pick, dry, weave and pack everything you order.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Featured video */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 aspect-video bg-black">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/products/tea-garden.jpg"
              className="w-full h-full object-cover"
            >
              {/* Drop a real farmer-portrait video at /public/farmers.mp4 */}
              <source src="/farmers.mp4" type="video/mp4" />
              <source src="/farmer.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-green-200 text-xs uppercase tracking-[0.3em] font-semibold mb-1">Featured story</p>
              <p className="text-xl md:text-2xl font-bold tracking-tight">Sunrise at the Dibrugarh tea garden</p>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {farmerScenes.map((scene, i) => (
              <figure
                key={i}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
              >
                <img
                  src={scene.src}
                  alt={scene.caption}
                  loading="lazy"
                  className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 text-white text-xs font-medium leading-snug">
                  {scene.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to taste the North East?</h2>
            <p className="text-green-100 mb-8 text-lg">
              Join 10,000+ households already buying authentic, GI-tagged produce directly from North East farmers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/products" className="bg-white text-green-800 hover:bg-green-50 px-8 py-4 rounded-xl font-bold transition shadow-lg">
                Shop Products
              </Link>
              <Link href="/join" className="border-2 border-white/80 backdrop-blur-sm bg-white/10 px-8 py-4 rounded-xl hover:bg-white hover:text-green-800 transition font-bold">
                Become a Vendor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
