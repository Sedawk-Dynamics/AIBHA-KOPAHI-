"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import InlineNav from "../components/InlineNav";

export default function B2BPage() {
  const [stats, setStats] = useState({
    farmers: 0,
    tons: 0,
    partners: 0,
    countries: 0,
  });
  const statsRef = useRef<HTMLDivElement | null>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (!statsRef.current) return;
    const targets = { farmers: 500, tons: 1200, partners: 80, countries: 12 };
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
                tons: Math.round(targets.tons * eased),
                partners: Math.round(targets.partners * eased),
                countries: Math.round(targets.countries * eased),
              });
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const industries = [
    {
      title: "HoReCa & Restaurants",
      desc: "Premium teas, spices and rice for chefs, hotel chains and cloud kitchens — supplied in restaurant-grade packaging.",
      img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    },
    {
      title: "Modern Retail",
      desc: "Shelf-ready, GI-tagged catalogues for organic stores, supermarket chains, and quick-commerce partners.",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    },
    {
      title: "Export & Global Trade",
      desc: "Documentation, FSSAI/Spice Board certification and consolidated shipping for buyers across 12+ countries.",
      img: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=80",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Share Requirements",
      desc: "Tell us volumes, products, target markets and timelines.",
    },
    {
      n: "02",
      title: "Custom Quote",
      desc: "Receive a tailored bulk quote within 24 hours, with sample dispatch.",
    },
    {
      n: "03",
      title: "Sourcing & QC",
      desc: "We source directly from verified farmers and run lab-grade QC on every batch.",
    },
    {
      n: "04",
      title: "Pack & Ship",
      desc: "Packaging, paperwork, cold-chain logistics — handled end-to-end.",
    },
  ];

  const partners = [
    "Tata Harvest",
    "BlueOrigin Foods",
    "Northeast Café",
    "Saffron Hotels",
    "GreenLeaf Mart",
    "Pacific Exports",
    "Kettle & Brew",
    "OrganicFirst",
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900 antialiased">
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: fadeUp 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .float-slow {
          animation: float 7s ease-in-out infinite;
        }

        @keyframes orbDrift {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 20px) scale(0.95);
          }
        }
        .orb {
          animation: orbDrift 14s ease-in-out infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(220%);
          }
        }
        .shine::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 65%
          );
          transform: translateX(-120%);
        }
        .shine:hover::after {
          animation: shine 1.1s ease forwards;
        }

        @keyframes scrollX {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .marquee {
          animation: scrollX 32s linear infinite;
          width: max-content;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .float-slow,
          .orb,
          .marquee {
            animation: none !important;
          }
        }
      `}</style>

      <InlineNav active="B2B" />

      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 text-white overflow-hidden py-24 md:py-32 px-6">
        {/* animated orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500/30 rounded-full blur-3xl orb"></div>
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl orb"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-lime-400/15 rounded-full blur-3xl orb"
          style={{ animationDelay: "6s" }}
        ></div>

        {/* grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <p className="uppercase tracking-[0.35em] text-green-200 font-semibold text-sm mb-4">
              Wholesale & Business
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">
              Bulk Orders &
              <span className="block text-green-300 mt-1">
                B2B Partnerships
              </span>
            </h1>

            
            <p className="text-lg text-green-100 leading-relaxed max-w-xl">
              Source premium agricultural products directly from trusted
              vendors, farmers and regional producers across North East India —
              wholesale rates, custom packaging, end-to-end logistics.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#quote"
                className="shine relative overflow-hidden bg-white text-green-800 hover:bg-green-50 px-7 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Request Quote
              </a>
              <a
                href="#how"
                className="border-2 border-white/70 backdrop-blur-sm bg-white/5 px-7 py-3.5 rounded-xl hover:bg-white hover:text-green-800 transition-all font-semibold"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-green-100">
              {[
                "FSSAI Certified",
                "GI-Tagged Catalogue",
                "Pan-India Logistics",
                "Export Ready",
              ].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Image collage — premium tea cup, paddy field, ginger */}
          <div className="relative h-[460px] hidden lg:block">
            <div className="absolute top-0 right-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 float-slow">
              <img
                src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1400&q=90"
                alt="Premium Assam tea cup"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 left-0 w-72 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 float-slow"
              style={{ animationDelay: "1.5s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1400&q=90"
                alt="Paddy field at sunrise"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-1/3 left-1/3 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 float-slow"
              style={{ animationDelay: "3s" }}
            >
              <img
                src="/products/assam-tea.jpg"
                alt="Fresh ginger root"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section
        ref={statsRef}
        className="bg-white py-12 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {[
            { val: `${stats.farmers}+`, label: "Verified Farmers" },
            { val: `${stats.tons}T`, label: "Annual Volume" },
            { val: `${stats.partners}+`, label: "Business Partners" },
            { val: `${stats.countries}`, label: "Export Countries" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-700 tabular-nums tracking-tight">
                {s.val}
              </p>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY PARTNER ================= */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Why Partner <span className="text-green-700">With Kopahi?</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              From sourcing to shipping, we handle every step so you can focus
              on selling. Built for buyers who care about authenticity,
              traceability, and consistency.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Direct from verified farmers",
                  desc: "Every batch is traceable to its origin farm.",
                },
                {
                  title: "GI-tagged & premium regional catalogue",
                  desc: "Authenticated North East produce, including Assam Tea, Lakadong Turmeric, Bhut Jolokia.",
                },
                {
                  title: "Custom bulk pricing",
                  desc: "Volume-based tiers with annual contract discounts.",
                },
                {
                  title: "End-to-end logistics",
                  desc: "Cold-chain, FSSAI documentation, customs paperwork — fully handled.",
                },
                {
                  title: "Export & wholesale opportunities",
                  desc: "Active partners across HoReCa, retail and 12+ countries.",
                },
              ].map((b) => (
                <div key={b.title} className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-700 group-hover:text-white transition">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{b.title}</p>
                    <p className="text-gray-600 text-sm">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image grid — high-resolution Assam scenes */}
          <div className="grid grid-cols-2 gap-4 h-[600px]">
            <div className="rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="/products/assam-tea.jpg"
                alt="Assam tea garden plucker at sunrise"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl group mt-12">
              <img
                src="/products/tea-garden.jpg"
                alt="Tea estate in the rolling hills"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1400&q=90"
                alt="Paddy fields under monsoon sky"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl group mt-12">
              <img
                src="https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=1400&q=90"
                alt="GI-tagged spices and turmeric"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how"
        className="py-24 px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-green-50/40 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              From inquiry to your warehouse — in 4 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-700 to-green-500 text-white flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold mt-6 mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>

                {i < steps.length - 1 && (
                  <svg
                    className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= INDUSTRIES ================= */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Built For
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Industry-Specific Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {industries.map((it) => (
              <div
                key={it.title}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <img
                  src={it.img}
                  alt={it.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                    {it.title}
                  </h3>
                  <p className="text-gray-200 leading-relaxed text-sm opacity-90 max-h-0 overflow-hidden group-hover:max-h-40 group-hover:mt-2 transition-all duration-500">
                    {it.desc}
                  </p>
                  <p className="text-green-300 font-semibold text-sm mt-3 inline-flex items-center gap-1.5 opacity-100 group-hover:opacity-100">
                    Learn more
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRUSTED PARTNERS MARQUEE ================= */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-white to-green-50/50 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-green-700 font-semibold mb-8">
          Trusted By Buyers Across India & Beyond
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-green-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-green-50 to-transparent z-10 pointer-events-none"></div>

          <div className="marquee flex gap-12 px-8">
            {partners.concat(partners).map((p, i) => (
              <div
                key={i}
                className="shrink-0 px-7 py-4 rounded-2xl bg-white shadow-md border border-gray-100 text-gray-700 font-bold text-lg tracking-tight whitespace-nowrap hover:text-green-700 hover:border-green-200 transition"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= QUOTE FORM ================= */}
      <section
        id="quote"
        className="py-24 px-6 lg:px-8 bg-gradient-to-br from-green-900 via-green-800 to-green-900 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl orb"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl orb"
          style={{ animationDelay: "4s" }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-green-200 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
              Get Started
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Request a Custom Quote
            </h2>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              Share your requirements and we'll respond within 24 hours with a
              tailored proposal — including sample dispatch, pricing tiers and
              lead times.
            </p>

            <ul className="space-y-3 text-green-100">
              {[
                "24-hour response window",
                "Free product samples",
                "Dedicated account manager",
                "Volume-based discounts",
              ].map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <h3 className="text-2xl font-bold mb-6 tracking-tight">
              Tell us about your business
            </h3>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company name"
                  className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                />
                <input
                  type="text"
                  placeholder="Contact person"
                  className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                />
              </div>

              <input
                type="email"
                placeholder="Business email"
                className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
              />

              <input
                type="tel"
                placeholder="Phone number"
                className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
              />

              <select className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition text-gray-700">
                <option>Required products</option>
                <option>Tea (Black / Green / Specialty)</option>
                <option>Honey (Wild / Forest / Mustard)</option>
                <option>Spices (Turmeric / Chillies)</option>
                <option>Rice (Black / Joha / Aromatic)</option>
                <option>Mixed catalogue</option>
              </select>

              <textarea
                rows={4}
                placeholder="Order quantity, target markets, special requirements..."
                className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition resize-none"
              ></textarea>

              <button
                type="submit"
                className="shine relative overflow-hidden w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Submit Inquiry
              </button>

              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to our terms. We never share your data.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section className="bg-white py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Built For Growing Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {[
              {
                title: "Reliable Supply",
                desc: "Consistent sourcing from verified farmer networks, with multi-region failover for monsoon resilience.",
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
              },
              {
                title: "Better Margins",
                desc: "Wholesale tiers, annual contracts and direct-from-farm pricing — typical savings of 18-30% vs distributors.",
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                ),
              },
              {
                title: "Premium Packaging",
                desc: "Retail-ready, e-commerce-ready and export-ready — with private-label options for partners over 1 ton/month.",
                icon: (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-white to-green-50/40 rounded-3xl p-8 shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-2 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-green-50 text-green-700 mb-5 group-hover:bg-green-700 group-hover:text-white transition">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
