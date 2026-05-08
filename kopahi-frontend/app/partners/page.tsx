import Link from "next/link";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";

export const metadata = {
  title: "Partners",
  description: "Co-branded partnerships, retail tie-ups, and export collaborations with Kopahi.",
};

const partners = [
  { name: "Tata Harvest", type: "Retail · Pan-India", since: "2024" },
  { name: "BlueOrigin Foods", type: "Export · UAE", since: "2024" },
  { name: "Northeast Café", type: "HoReCa · Mumbai", since: "2025" },
  { name: "Saffron Hotels", type: "Hospitality · Bengaluru", since: "2025" },
  { name: "GreenLeaf Mart", type: "Modern Retail · Delhi NCR", since: "2024" },
  { name: "Pacific Exports", type: "Export · Singapore", since: "2025" },
  { name: "Kettle & Brew", type: "Specialty Tea · UK", since: "2025" },
  { name: "OrganicFirst", type: "D2C · India", since: "2024" },
];

export default function PartnersPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen flex flex-col">
      <PageShell>
        <section className="bg-gradient-to-br from-green-700 via-green-800 to-green-900 text-white py-20 px-6 text-center">
          <p className="uppercase tracking-[0.35em] text-green-200 font-semibold text-sm mb-3">Partnerships</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Building the North East together</h1>
          <p className="text-green-100 max-w-2xl mx-auto mt-4 text-lg">
            Retailers, restaurants, and exporters bringing authentic Assam produce to their customers.
          </p>
        </section>

        <section className="py-20 px-6 flex-1">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-700 to-green-500 text-white flex items-center justify-center font-bold text-lg mb-4">
                    {p.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg tracking-tight">{p.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{p.type}</p>
                  <p className="text-xs text-green-700 font-semibold mt-3">Partner since {p.since}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-br from-green-50 via-white to-green-50/40 rounded-3xl p-10 md:p-14 text-center border border-green-100">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Want to partner with us?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-7">
                Whether you run a retail chain, restaurant group, or export house — we'd love to talk volumes, pricing, and private-label options.
              </p>
              <Link
                href="/b2b"
                className="inline-block bg-gradient-to-r from-green-700 to-green-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                Request a partnership call
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
