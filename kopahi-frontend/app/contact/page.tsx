import type { Metadata } from "next";
import { Suspense } from "react";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Eyebrow from "../components/marketing/Eyebrow";
import ContactForm from "./ContactForm";
import { buildMetadata } from "../lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Kopahi — Jorhat, Assam",
  description:
    "Reach Kopahi for orders, partnerships, exports or vendor signup. Jorhat office, Mon–Sat 9 am–6 pm IST. info@kopahi.com · +91 91810 16660.",
  path: "/contact",
});

const CONTACTS = [
  { label: "General", phone: "+91 91810 16660", email: "inquiry@kopahi.com" },
  { label: "Sales", phone: "+91 99019 72727", email: "sales@kopahi.com" },
  { label: "Sourcing & Ops", phone: "+91 93654 72113", email: "trideep@kopahi.com" },
  { label: "Partner / Export", phone: "+91 91810 16660", email: "partner@kopahi.com" },
];

const ADDRESS = "Bye Lane 2, Suraj Nagar, NA Ali, Jorhat, Assam 785001";
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

// Everything on this page fits one screen on desktop and laptop: heading and
// visit card on the left, the form and the department contacts on the right.
export default function ContactPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        <section className="flex min-h-svh items-center pt-24 pb-10 lg:pt-28 lg:pb-8">
          {/* Both columns share one height: the heading lines up with the top of
              the form, and the visit card (its map) fills down to the contacts. */}
          <div className="mx-auto grid w-full max-w-grid grid-cols-1 gap-10 px-5 lg:grid-cols-12 lg:items-stretch lg:gap-14 lg:px-8">
            {/* ============ LEFT — heading + visit ============ */}
            <div className="flex flex-col lg:col-span-5">
              <Eyebrow>Contact</Eyebrow>
              <h1 className="mt-3 font-display font-light tracking-tight text-[clamp(2rem,3.2vw,3rem)] leading-[1.06] short:text-[2.1rem]">
                We Answer Within
                <br />
                <span className="accent-italic">A Working Day.</span>
              </h1>
              <p className="mt-3 max-w-md font-display italic text-base leading-relaxed text-(--color-bamboo)">
                For partnership, export, stockist, sourcing or press — please use whichever route is closest to
                you.
              </p>

              <div className="relative mt-6 flex flex-1 flex-col overflow-hidden rounded-sm bg-(--color-moss) p-5 text-(--color-ivory) grain">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <Eyebrow tone="gold">Visit</Eyebrow>
                    <p className="mt-2 font-display text-lg leading-snug">
                      Bye Lane 2, Suraj Nagar, NA Ali,
                      <br />
                      Jorhat, Assam — 785001
                    </p>
                    <p className="mt-2 text-xs text-(--color-ivory)/70">Mon – Fri, 9:00 AM – 6:00 PM IST</p>
                  </div>
                  <a
                    href={DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative shrink-0 self-start text-[11px] font-medium uppercase tracking-[0.18em] text-(--color-gold) hover:text-(--color-ivory) transition-colors"
                  >
                    Directions <span aria-hidden="true">→</span>
                  </a>
                </div>
                <div className="relative mt-4 hidden min-h-[8rem] flex-1 overflow-hidden rounded-sm sm:block">
                  <iframe
                    title="Kopahi office in Jorhat, Assam"
                    src="https://www.google.com/maps?q=Jorhat,Assam&hl=en&z=12&output=embed"
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>

            {/* ============ RIGHT — form + departments ============ */}
            <div className="flex flex-col lg:col-span-7">
              <div className="rounded-sm border border-(--color-bamboo)/20 bg-(--color-ivory-warm)/60 p-6 sm:p-8 short:p-6">
                <Suspense fallback={null}>
                  <ContactForm />
                </Suspense>
              </div>

              <ul
                className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
                aria-label="Contacts by department"
              >
                {CONTACTS.map((c) => (
                  <li key={c.label} className="min-w-0 border-t border-(--color-bamboo)/30 pt-3">
                    <p className="eyebrow">{c.label}</p>
                    <a
                      href={`tel:${c.phone.replace(/\s+/g, "")}`}
                      className="mt-1.5 block text-sm text-(--color-ink) hover:text-(--color-moss) transition-colors"
                    >
                      {c.phone}
                    </a>
                    <a
                      href={`mailto:${c.email}`}
                      className="block truncate text-[13px] text-(--color-gold-dark) hover:text-(--color-gold) transition-colors"
                    >
                      {c.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
