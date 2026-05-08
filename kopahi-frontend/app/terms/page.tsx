import PageShell from "../components/PageShell";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of Kopahi's website, marketplace and vendor program.",
};

export default function TermsPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-50 via-white to-green-50/40 py-16 px-6 text-center">
          <p className="uppercase tracking-[0.35em] text-green-700 font-semibold text-sm mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">Last updated: April 1, 2026</p>
        </section>

        <section className="py-16 px-6 flex-1">
          <article className="max-w-3xl mx-auto text-gray-700 leading-relaxed space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Agreement</h2>
              <p>
                By accessing or using kopahi.com, you agree to these terms. If you do not agree, please do not use the site.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Account & eligibility</h2>
              <p>
                You must be at least 18 years old to place orders or register as a vendor. You are responsible for keeping your login credentials secure and for all activity under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Orders & payment</h2>
              <p>
                Orders are confirmed only after successful payment. Prices are inclusive of taxes unless stated otherwise. We reserve the right to cancel orders due to inventory issues, pricing errors, or suspected fraud — full refunds will be issued in such cases.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Shipping & delivery</h2>
              <p>
                Estimated delivery windows are best-effort and depend on courier capacity, location, and the nature of the product. Perishables ship under cold-chain conditions where applicable.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Returns</h2>
              <p>
                Sealed, non-perishable items are returnable within 7 days of delivery if defective or damaged in transit. Perishables are not eligible for return except in case of quality issues, which must be reported within 24 hours of delivery with photos.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Vendor terms</h2>
              <p>
                Vendors agree to ship within 48 hours of order confirmation, maintain the catalogue accuracy, comply with FSSAI standards, and accept the platform commission disclosed at sign-up. Payouts settle weekly.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Intellectual property</h2>
              <p>
                All content on this site — including logos, photography, copy, and product names — is the property of Kopahi or its licensors and may not be reproduced without written permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Limitation of liability</h2>
              <p>
                Our liability for any claim arising from your use of the site is limited to the amount paid for the relevant order. We are not liable for indirect or consequential losses.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Governing law</h2>
              <p>
                These terms are governed by the laws of India. Disputes will be resolved in the courts of Guwahati, Assam.
              </p>
            </div>

            <p className="text-sm text-gray-500 pt-4 border-t border-gray-100">
              Questions? Email <a href="mailto:legal@kopahi.com" className="text-green-700 font-semibold">legal@kopahi.com</a>.
            </p>
          </article>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
