"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";

type Form = {
  name: string;
  business: string;
  email: string;
  phone: string;
  type: string;
  location: string;
  products: string;
  about: string;
};

const initial: Form = {
  name: "",
  business: "",
  email: "",
  phone: "",
  type: "",
  location: "",
  products: "",
  about: "",
};

export default function JoinPage() {
  const [form, setForm] = useState<Form>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const update = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.business.trim() || !form.type) {
      setStatus("error");
      setMessage("Please fill in name, business name and type.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    if (!/^[\d\s+()-]{8,}$/.test(form.phone.trim())) {
      setStatus("error");
      setMessage("Please enter a valid phone number.");
      return;
    }
    setStatus("loading");
    setMessage("");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setMessage("Application received! Our partnerships team will reach out within 48 hours.");
    setForm(initial);
  };

  const benefits = [
    {
      title: "Pan-India reach",
      desc: "Access 10,000+ buyers and 30+ cities through our marketplace and partner channels.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      title: "Weekly payouts",
      desc: "Settlements every Friday with full transparency — no chasing for cheques.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" /></svg>,
    },
    {
      title: "Free onboarding",
      desc: "We help you build your catalogue, photograph products, and write copy.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    },
    {
      title: "Logistics support",
      desc: "Bulk pickup, cold-chain, and FSSAI-compliant packaging — handled.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg>,
    },
  ];

  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="relative bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-24 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/15 rounded-full blur-3xl"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <p className="uppercase tracking-[0.35em] text-green-200 font-semibold text-sm mb-3">
              Vendor & Farmer Program
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.05]">
              Join the Kopahi family.
              <span className="block text-green-300 mt-2">Grow with us.</span>
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you grow tea on a hectare or run a regional FPO — start selling on India's premium agri-marketplace and reach customers who value authenticity.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group bg-gradient-to-br from-white to-green-50/40 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 text-green-700 mb-4 group-hover:bg-green-700 group-hover:text-white transition">
                  {b.icon}
                </div>
                <h3 className="font-bold tracking-tight mb-1">{b.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 px-6 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
                Registration
              </span>
              <h2 className="text-4xl font-bold tracking-tight">Tell us about your business</h2>
              <p className="text-gray-600 mt-3">Takes 2 minutes. We'll respond within 48 hours.</p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Full name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    placeholder="e.g. Anjali Borah"
                    autoComplete="name"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Business / Farm name</label>
                  <input
                    type="text"
                    value={form.business}
                    onChange={update("business")}
                    placeholder="e.g. Borah Tea Estate"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Type</label>
                  <select
                    value={form.type}
                    onChange={update("type")}
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70 text-gray-700"
                  >
                    <option value="">Select type</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Farmer">Farmer</option>
                    <option value="FPO">FPO / Co-operative</option>
                    <option value="Wholesaler">Wholesaler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={update("location")}
                    placeholder="District, State"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Products you sell</label>
                  <input
                    type="text"
                    value={form.products}
                    onChange={update("products")}
                    placeholder="e.g. CTC tea, orthodox tea, green tea"
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition disabled:opacity-70"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Tell us about your business</label>
                  <textarea
                    rows={5}
                    value={form.about}
                    onChange={update("about")}
                    placeholder="Years in operation, monthly volume, certifications, anything else we should know."
                    disabled={status === "loading" || status === "success"}
                    className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition resize-none disabled:opacity-70"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="mt-8 w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting…" : status === "success" ? "Application sent" : "Submit Registration"}
              </button>

              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-4 text-sm text-center ${
                    status === "error" ? "text-red-600" : "text-green-700 font-medium"
                  }`}
                >
                  {message}
                </p>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to our{" "}
                <Link href="/terms" className="text-green-700 font-semibold hover:underline">Terms</Link> and{" "}
                <Link href="/privacy" className="text-green-700 font-semibold hover:underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
