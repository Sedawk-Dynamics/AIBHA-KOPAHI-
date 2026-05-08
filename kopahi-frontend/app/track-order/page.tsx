"use client";

import { useState } from "react";
import Link from "next/link";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";

type Status = "idle" | "loading" | "found" | "notfound";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [order, setOrder] = useState<{
    id: string;
    placed: string;
    courier: string;
    eta: string;
    step: number;
  } | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));

    if (/^KP[A-Z0-9-]{4,}$/i.test(orderId.trim())) {
      setOrder({
        id: orderId.trim().toUpperCase(),
        placed: "Apr 26, 2026",
        courier: "Delhivery",
        eta: "May 02, 2026",
        step: 2,
      });
      setStatus("found");
    } else {
      setOrder(null);
      setStatus("notfound");
    }
  };

  const steps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="uppercase tracking-[0.35em] text-green-200 font-semibold text-sm mb-3">Order Tracking</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Where's my order?</h1>
            <p className="text-green-100 mt-4 max-w-xl mx-auto">
              Enter your order ID and email to see real-time status.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 flex-1">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleTrack} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10 -mt-24 relative z-10">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Track your order</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID (e.g. KP-12345)"
                  className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full border border-gray-200 px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
              >
                {status === "loading" ? "Looking up…" : "Track Order"}
              </button>
            </form>

            {status === "found" && order && (
              <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-md p-8">
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-green-700 font-semibold mb-1">Order ID</p>
                    <h3 className="text-2xl font-bold tracking-tight">{order.id}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="font-semibold text-green-700">{order.eta}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between relative">
                  <div className="absolute left-4 right-4 top-4 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${(order.step / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  {steps.map((s, i) => (
                    <div key={s} className="relative flex flex-col items-center w-1/5 text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                          i <= order.step ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <p className={`mt-2 text-[11px] md:text-xs font-medium ${i <= order.step ? "text-gray-900" : "text-gray-400"}`}>
                        {s}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Placed on</p>
                    <p className="font-semibold mt-1">{order.placed}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-500">Courier partner</p>
                    <p className="font-semibold mt-1">{order.courier}</p>
                  </div>
                </div>
              </div>
            )}

            {status === "notfound" && (
              <div className="mt-10 bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                <p className="font-semibold text-red-700">No order found with that ID.</p>
                <p className="text-sm text-red-600 mt-1">
                  Double-check the ID in your confirmation email, or{" "}
                  <Link href="/contact" className="underline font-semibold">contact support</Link>.
                </p>
              </div>
            )}
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
