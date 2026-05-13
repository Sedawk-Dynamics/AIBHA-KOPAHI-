"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import EditorialShell from "../../components/dashboard/EditorialShell";
import { DashCard, StatusPill } from "../../components/dashboard/DashPrimitives";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

type ApiOrder = {
  _id: string;
  items: { name: string; quantity: number; image?: string }[];
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
};

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;
type Status = (typeof STATUSES)[number];

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function trackingStep(status: string): number {
  // Placed → Packed → Shipped → Delivered
  const s = status.toLowerCase();
  if (s.includes("deliver")) return 4;
  if (s.includes("ship")) return 3;
  if (s.includes("pack")) return 2;
  if (s.includes("cancel")) return 0;
  return 1;
}

const STEPS = ["Placed", "Packed", "Shipped", "Delivered"];

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [status, setStatus] = useState<Status>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api
      .get<{ orders: ApiOrder[] }>("/api/orders/mine", { auth: true })
      .then((res) => setOrders(res.orders || []))
      .catch((err) => setFetchError(err?.message || "Could not load orders"));
  }, [user]);

  const filtered = (orders || []).filter((o) => {
    const matchStatus = status === "All" || o.orderStatus.toLowerCase().includes(status.toLowerCase());
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      o._id.toLowerCase().includes(q) ||
      o.items.some((i) => i.name.toLowerCase().includes(q));
    return matchStatus && matchQuery;
  });

  return (
    <EditorialShell
      eyebrow="→ My Orders"
      title={
        <>
          Every order, <span className="accent-italic">remembered.</span>
        </>
      }
      actions={
        <div className="relative w-full sm:w-72">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order ID or item"
            className="w-full bg-transparent border-b border-(--color-bamboo)/40 focus:border-(--color-gold) outline-none py-2.5 text-(--color-ink) placeholder:text-(--color-ink)/40"
          />
        </div>
      }
    >
      {fetchError && (
        <div className="mb-8 border border-(--color-gold)/40 bg-(--color-gold)/10 px-5 py-4 text-sm text-(--color-moss)">
          {fetchError}
        </div>
      )}

      <div className="flex gap-1 mb-10 flex-wrap border-b border-(--color-bamboo)/15">
        {STATUSES.map((s) => {
          const active = status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`relative px-4 py-3 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                active ? "text-(--color-moss) font-display italic" : "text-(--color-ink)/60 hover:text-(--color-moss)"
              }`}
            >
              {s}
              {active && <span aria-hidden="true" className="absolute -bottom-px left-2 right-2 h-[2px] bg-(--color-gold)" />}
            </button>
          );
        })}
      </div>

      {orders === null ? (
        <p className="py-16 text-center font-display italic text-(--color-bamboo)">Reading the books…</p>
      ) : filtered.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-5">
          {filtered.map((o) => {
            const id = o._id.slice(-6).toUpperCase();
            const step = trackingStep(o.orderStatus);
            const isOpen = expanded === o._id;
            return (
              <article
                key={o._id}
                className="rounded-[2px] border border-(--color-bamboo)/25 bg-(--color-ivory-warm)"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : o._id)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-6 flex-wrap"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="flex -space-x-2">
                      {o.items.slice(0, 3).map((it, i) => (
                        <div
                          key={i}
                          className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-[2px] overflow-hidden bg-(--color-ivory) border border-(--color-bamboo)/30"
                        >
                          {it.image ? (
                            <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-display italic text-(--color-bamboo)">
                              ·
                            </span>
                          )}
                        </div>
                      ))}
                      {o.items.length > 3 && (
                        <span className="h-14 w-14 sm:h-16 sm:w-16 inline-flex items-center justify-center rounded-[2px] border border-(--color-bamboo)/30 bg-(--color-ivory) text-xs text-(--color-bamboo) uppercase tracking-[0.18em]">
                          +{o.items.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display italic text-lg sm:text-xl text-(--color-ink) leading-tight">
                        #{id}
                      </p>
                      <p className="eyebrow text-(--color-bamboo) mt-1">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <StatusPill status={o.orderStatus} />
                    <span className="font-display text-2xl text-(--color-moss)">{inr(o.totalPrice)}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className={`text-(--color-bamboo) transition-transform ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-(--color-bamboo)/20 px-6 sm:px-7 py-6 space-y-7">
                    {/* Tracking */}
                    {step > 0 && (
                      <div>
                        <p className="eyebrow mb-4">Tracking</p>
                        <div className="flex items-center">
                          {STEPS.map((label, i) => {
                            const active = i < step;
                            const isLast = i === STEPS.length - 1;
                            return (
                              <div key={label} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center">
                                  <span
                                    className={`h-3 w-3 rounded-full ${
                                      active ? "bg-(--color-gold)" : "bg-(--color-bamboo)/30"
                                    }`}
                                  />
                                  <span
                                    className={`mt-2 text-[10px] uppercase tracking-[0.22em] whitespace-nowrap ${
                                      active ? "text-(--color-moss)" : "text-(--color-bamboo)"
                                    }`}
                                  >
                                    {label}
                                  </span>
                                </div>
                                {!isLast && (
                                  <span
                                    aria-hidden="true"
                                    className={`flex-1 h-px mx-2 ${i + 1 < step ? "bg-(--color-gold)" : "bg-(--color-bamboo)/30"}`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Line items */}
                    <div>
                      <p className="eyebrow mb-3">Items</p>
                      <ul className="divide-y divide-(--color-bamboo)/15">
                        {o.items.map((it, i) => (
                          <li key={i} className="py-3 flex items-center justify-between">
                            <span className="font-display text-(--color-ink)">{it.name}</span>
                            <span className="text-sm text-(--color-bamboo)">× {it.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-(--color-gold) text-(--color-moss-dark) text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
                      >
                        Reorder →
                      </Link>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-(--color-moss)/40 text-(--color-moss) text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-moss) hover:text-(--color-ivory) transition-colors"
                      >
                        Download invoice
                      </button>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 font-display italic text-sm text-(--color-bamboo) hover:text-(--color-moss) transition-colors"
                      >
                        Contact vendor
                      </Link>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </EditorialShell>
  );
}

function EmptyOrders() {
  return (
    <DashCard>
      <div className="py-12 text-center">
        <svg
          viewBox="0 0 120 120"
          className="mx-auto w-16 h-16 text-(--color-bamboo)/40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          aria-hidden="true"
        >
          <path d="M60 18C40 28 28 48 28 70c20 0 38-12 48-32" strokeLinecap="round" />
          <path d="M60 18C76 36 88 56 88 70c-18 0-36-10-48-32" strokeLinecap="round" />
          <path d="M60 18v82" strokeLinecap="round" />
        </svg>
        <p className="mt-6 font-display italic text-xl text-(--color-bamboo)">
          No orders match that view yet.
        </p>
        <p className="mt-3 text-sm text-(--color-ink)/65 max-w-md mx-auto">
          Try a different status — or begin with a single origin.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-(--color-gold) text-(--color-moss-dark) text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors"
        >
          Browse origins →
        </Link>
      </div>
    </DashCard>
  );
}
