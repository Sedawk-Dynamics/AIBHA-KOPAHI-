import PageShell from "../components/PageShell";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "How Kopahi collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-50 via-white to-green-50/40 py-16 px-6 text-center">
          <p className="uppercase tracking-[0.35em] text-green-700 font-semibold text-sm mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">Last updated: April 1, 2026</p>
        </section>

        <section className="py-16 px-6 flex-1">
          <article className="prose prose-green max-w-3xl mx-auto text-gray-700 leading-relaxed">
            <h2 className="text-2xl font-bold text-gray-900 mt-0 mb-3">1. Introduction</h2>
            <p>
              Kopahi (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This policy explains what information we collect when you visit kopahi.com, place an order, register as a vendor, or contact our support team — and how we use it.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">2. Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> name, email, phone, delivery addresses.</li>
              <li><strong>Order data:</strong> items purchased, payment confirmation (we do not store card details), shipping events.</li>
              <li><strong>Vendor data:</strong> business name, GST/FSSAI registration, bank details for payouts.</li>
              <li><strong>Usage data:</strong> device, browser, pages visited, referral source — collected via standard analytics cookies.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">3. How we use it</h2>
            <p>
              To process orders, ship products, run our marketplace, send transactional and marketing emails (you can opt out at any time), prevent fraud, and meet legal obligations under Indian e-commerce and food safety regulations.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">4. Sharing</h2>
            <p>
              We share data with payment processors, courier partners, vendors fulfilling your order, and analytics providers — only to the extent necessary. We never sell your personal data to third parties.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">5. Your rights</h2>
            <p>
              You can request access, correction, or deletion of your data by emailing <a href="mailto:privacy@kopahi.com" className="text-green-700 font-semibold">privacy@kopahi.com</a>. We respond within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">6. Cookies</h2>
            <p>
              We use cookies for authentication, cart persistence, and aggregate analytics. You can disable non-essential cookies via your browser; some features may not work without them.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3">7. Updates</h2>
            <p>
              We may update this policy periodically. Material changes will be notified by email or a banner on the homepage.
            </p>

            <p className="mt-12 text-sm text-gray-500">
              Questions? Email us at <a href="mailto:privacy@kopahi.com" className="text-green-700 font-semibold">privacy@kopahi.com</a>.
            </p>
          </article>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
