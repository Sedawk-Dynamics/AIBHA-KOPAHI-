import type { Metadata } from "next";
import { Suspense } from "react";

import LenisProvider from "../components/marketing/LenisProvider";
import MarketingHeader from "../components/marketing/MarketingHeader";
import MarketingFooter from "../components/marketing/MarketingFooter";
import WhatsAppFab from "../components/marketing/WhatsAppFab";
import Section from "../components/marketing/Section";
import Eyebrow from "../components/marketing/Eyebrow";
import Headline from "../components/marketing/Headline";
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

export default function ContactPage() {
  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* ============== HERO ============== */}
        <section className="pt-28 sm:pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <Eyebrow>Contact</Eyebrow>
            <Headline as="h1" className="mt-6 max-w-4xl" accent="A Working Day.">
              We Answer Within
            </Headline>
            <p className="mt-10 max-w-2xl font-display italic text-lg sm:text-xl text-(--color-bamboo) leading-relaxed">
              For partnership, export, stockist, sourcing or press — please use whichever route is closest to you.
            </p>
          </div>
        </section>


        <Section tone="ivory">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* ============ FORM ============ */}
            <div className="lg:col-span-7">
              <Suspense fallback={null}>
                <ContactForm />
              </Suspense>
            </div>

            {/* ============ CONTACT INFO ============ */}
            <aside className="lg:col-span-5">
              <div className="bg-(--color-moss) text-(--color-ivory) p-10 sm:p-12 grain relative">
                <Eyebrow tone="gold">Visit</Eyebrow>
                <p className="mt-5 font-display text-xl sm:text-2xl leading-snug">
                  Bye Lane 2, Suraj Nagar,<br />
                  NA Ali, Jorhat,<br />
                  Assam — 785001
                </p>
                <p className="mt-6 text-(--color-ivory)/70 text-sm">
                  Mon – Fri, 9:00 AM – 6:00 PM IST
                </p>
              </div>

              <div className="mt-6 space-y-5">
                {CONTACTS.map((c) => (
                  <div key={c.label} className="flex items-start justify-between gap-6 border-b border-(--color-bamboo)/30 pb-5">
                    <p className="eyebrow w-32 shrink-0">{c.label}</p>
                    <div className="text-right">
                      <a href={`tel:${c.phone.replace(/\s+/g, "")}`} className="block text-(--color-ink) hover:text-(--color-moss) transition-colors">
                        {c.phone}
                      </a>
                      <a href={`mailto:${c.email}`} className="block text-(--color-gold-dark) hover:text-(--color-gold) text-sm transition-colors">
                        {c.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 aspect-[4/3] w-full overflow-hidden border border-(--color-bamboo)/25">
                <iframe
                  title="Kopahi office in Jorhat, Assam"
                  src="https://www.google.com/maps?q=Jorhat,Assam&hl=en&z=12&output=embed"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </aside>
          </div>
        </Section>

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}
