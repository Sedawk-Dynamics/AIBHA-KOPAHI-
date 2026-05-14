import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LenisProvider from "../../components/marketing/LenisProvider";
import MarketingHeader from "../../components/marketing/MarketingHeader";
import MarketingFooter from "../../components/marketing/MarketingFooter";
import WhatsAppFab from "../../components/marketing/WhatsAppFab";
import Eyebrow from "../../components/marketing/Eyebrow";
import ProductCTAs from "./ProductCTAs";
import {
  PRODUCTS,
  getProductBySlug,
  getFarmerBySlug,
  type Product,
} from "../../lib/marketing";
import { getEssaysByProductSlug } from "../../lib/journal";

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Origin not found" };
  return {
    title: `${product.name} · ${product.origin}`,
    description: (product.shortDesc || product.story).slice(0, 160).replace(/\s+\S*$/, "") + "…",
    openGraph: {
      title: `${product.name} · Kopahi`,
      description: product.shortDesc || product.story.slice(0, 200),
      images: [product.image],
    },
  };
}

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function getRelated(current: Product): Product[] {
  // For GI products: prefer other GI products in the same state, then by category.
  // For non-GI: prefer other non-GI in the same category.
  const sameState = PRODUCTS.filter((p) => p.slug !== current.slug && p.state === current.state && p.gi === current.gi);
  const sameCategory = PRODUCTS.filter(
    (p) => p.slug !== current.slug && p.category === current.category && p.gi === current.gi
  );
  const combined = [...sameState, ...sameCategory];
  const seen = new Set<string>();
  const dedup: Product[] = [];
  for (const p of combined) {
    if (!seen.has(p.slug)) {
      seen.add(p.slug);
      dedup.push(p);
    }
    if (dedup.length >= 3) break;
  }
  // Fallback to any other product if we don't have 3.
  if (dedup.length < 3) {
    for (const p of PRODUCTS) {
      if (p.slug === current.slug || seen.has(p.slug)) continue;
      dedup.push(p);
      seen.add(p.slug);
      if (dedup.length >= 3) break;
    }
  }
  return dedup;
}

function buildJsonLd(product: Product) {
  const url = `https://kopahi.com/products/${product.slug}`;
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url,
    priceCurrency: "INR",
    price: product.sellingPrice ?? 0,
    availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
  };
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [`https://kopahi.com${product.image}`],
    description: product.shortDesc,
    sku: product.sku,
    brand: { "@type": "Brand", name: "Kopahi" },
    offers,
  };
  if (product.gi && product.giIdentifier && product.giYear) {
    ld.additionalProperty = {
      "@type": "PropertyValue",
      name: "Geographical Indication",
      value: `${product.giIdentifier} · ${product.giYear}`,
    };
  }
  return ld;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const farmer = product.farmerSlug ? getFarmerBySlug(product.farmerSlug) : undefined;
  const related = getRelated(product);
  const essaysAboutThis = getEssaysByProductSlug(product.slug);
  const savings =
    product.mrp && product.sellingPrice && product.mrp > product.sellingPrice
      ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
      : 0;

  const breadcrumbParent = product.gi
    ? { href: "/products/gi-tagged", label: "GI-Tagged" }
    : { href: "/products/non-gi-tagged", label: "Non-GI Products" };

  return (
    <LenisProvider>
      <MarketingHeader />

      <main className="bg-(--color-ivory) text-(--color-ink)">
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(product)) }}
        />

        <div className="pt-28 sm:pt-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* ============ STICKY IMAGE ============ */}
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {product.gi && (
                    <span className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-ivory)/95 text-(--color-moss) text-[10px] uppercase tracking-[0.2em] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" /> GI Tagged
                    </span>
                  )}
                  {product.imagePending && (
                    <span className="absolute bottom-4 left-4 px-3 py-1 bg-(--color-ivory)/95 text-(--color-bamboo) text-[10px] uppercase tracking-[0.2em] font-display italic">
                      → Photography in progress
                    </span>
                  )}
                </div>
                <p className="text-sm text-(--color-ink)/60 italic">
                  Photographed in season · {product.origin}
                </p>
              </div>
            </div>

            {/* ============ STORY ============ */}
            <article className="lg:col-span-6 py-4 lg:py-0">
              <nav className="text-xs uppercase tracking-[0.22em] text-(--color-ink)/55 mb-8 flex items-center gap-2 flex-wrap" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-(--color-moss)">Home</Link>
                <span aria-hidden="true">·</span>
                <Link href="/products" className="hover:text-(--color-moss)">Products</Link>
                <span aria-hidden="true">·</span>
                <Link href={breadcrumbParent.href} className="hover:text-(--color-moss)">{breadcrumbParent.label}</Link>
                <span aria-hidden="true">·</span>
                <span className="text-(--color-ink)/40">{product.name}</span>
              </nav>

              <Eyebrow>→ {(product.district ?? product.origin).toUpperCase()}, {product.state.toUpperCase()}</Eyebrow>
              <h1 className="font-display font-light tracking-tight text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02] mt-4 text-(--color-ink)">
                {product.name}
              </h1>
              {product.gi && product.giIdentifier && product.giYear && (
                <p className="mt-3 font-display italic text-(--color-bamboo) text-lg">
                  GI Tag · {product.giYear} · {product.giIdentifier}
                </p>
              )}
              {product.netWeight && (
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-(--color-ink)/55">
                  Net wt. {product.netWeight}
                </p>
              )}

              {product.shortDesc && (
                <p className="mt-7 font-display italic text-(--color-moss) text-xl sm:text-2xl leading-snug max-w-prose">
                  {product.shortDesc}
                </p>
              )}

              {/* Price block */}
              {product.sellingPrice !== undefined && (
                <div className="mt-7 flex items-baseline gap-4 flex-wrap">
                  <span className="font-display text-3xl sm:text-4xl text-(--color-moss)">{inr(product.sellingPrice)}</span>
                  {product.mrp && product.mrp > product.sellingPrice && (
                    <>
                      <span className="text-lg text-(--color-bamboo) line-through">{inr(product.mrp)}</span>
                      {savings > 0 && (
                        <span className="text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 bg-(--color-gold)/15 text-(--color-gold-dark)">
                          Save {savings}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}

              {product.warningLabel && (
                <p
                  role="alert"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 border border-(--color-chilli)/40 bg-(--color-chilli)/8 text-(--color-chilli) text-xs uppercase tracking-[0.18em]"
                >
                  <span aria-hidden="true">⚠</span> {product.warningLabel}
                </p>
              )}

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <section className="mt-12">
                  <p className="eyebrow">→ Formats</p>
                  <ul className="mt-5 space-y-3">
                    {product.variants.map((v) => (
                      <li
                        key={v.sku}
                        className="flex items-center justify-between gap-4 py-3 border-b border-(--color-bamboo)/20"
                      >
                        <div>
                          <p className="font-display text-(--color-ink)">{v.name}</p>
                          <p className="text-xs text-(--color-bamboo) mt-0.5">{v.sku}</p>
                        </div>
                        <p className="font-display text-(--color-moss) text-lg">{inr(v.price)}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mt-12">
                <p className="eyebrow">→ The Story</p>
                <p className="mt-5 text-base sm:text-lg leading-relaxed text-(--color-ink)/85 max-w-prose">
                  {product.story}
                </p>
              </section>

              <section className="mt-14">
                <p className="eyebrow">→ Tasting · Use Notes</p>
                <ul className="mt-5 space-y-3">
                  {product.notes.map((n) => (
                    <li key={n} className="flex gap-3 items-start text-(--color-ink)/85 leading-relaxed">
                      <span aria-hidden="true" className="mt-2.5 h-px w-4 bg-(--color-gold) shrink-0" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {product.nutritionPer100g && (
                <section className="mt-14 border-t border-(--color-bamboo)/25 pt-10">
                  <p className="eyebrow">→ Nutrition · per 100g</p>
                  <dl className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
                    {Object.entries(product.nutritionPer100g).map(([k, v]) => (
                      <div key={k} className="flex flex-col">
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-(--color-bamboo)">
                          {labelize(k)}
                        </dt>
                        <dd className="font-display text-(--color-ink) text-lg mt-1">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <section className="mt-12 text-sm text-(--color-ink)/70 leading-relaxed">
                <p className="eyebrow text-(--color-bamboo)">→ Storage</p>
                <p className="mt-2">
                  Store in a cool, dry place. Keep airtight after opening. Away from moisture and direct sunlight.
                </p>
              </section>

              {product.gi && (
                <section className="mt-12 border border-(--color-bamboo)/30 p-6 sm:p-7 bg-(--color-ivory-warm)">
                  <div className="flex items-start gap-5">
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-(--color-gold) text-(--color-moss-dark) font-display text-base shrink-0"
                      aria-hidden="true"
                    >
                      GI
                    </span>
                    <div>
                      <p className="eyebrow">→ Geographical Indication</p>
                      <h3 className="mt-2 font-display text-xl text-(--color-ink)">GI Certified by Government of India</h3>
                      <p className="mt-2 text-sm text-(--color-ink)/70 leading-relaxed">
                        Registry No. <span className="text-(--color-moss)">{product.giIdentifier}</span> · Granted {product.giYear}.
                        This product is legally tied to its geographic origin.
                      </p>
                      <Link
                        href="/journal/what-gi-protects-and-what-it-doesnt"
                        className="mt-3 inline-block text-(--color-gold-dark) hover:text-(--color-gold) text-xs uppercase tracking-[0.2em]"
                      >
                        View certificate →
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              {farmer && (
                <section className="mt-12 border-t border-(--color-bamboo)/25 pt-10">
                  <p className="eyebrow">→ Behind The Harvest</p>
                  <div className="mt-5 flex items-start gap-5">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-(--color-ivory-warm) shrink-0">
                      {farmer.image && (
                        <Image src={farmer.image} alt={farmer.name} fill sizes="96px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-(--color-ink)">{farmer.name}</h3>
                      <p className="font-display italic text-(--color-bamboo) text-sm mt-1">
                        {farmer.village}, {farmer.state} · {farmer.years} yrs partnered
                      </p>
                      <p className="mt-3 font-display italic text-(--color-ink)/85 max-w-prose">
                        &ldquo;{farmer.quote}&rdquo;
                      </p>
                      <Link
                        href={`/farmers#${farmer.slug}`}
                        className="mt-3 inline-block text-(--color-gold-dark) hover:text-(--color-gold) text-xs uppercase tracking-[0.2em]"
                      >
                        Meet {farmer.name.split(" ")[0]} →
                      </Link>
                    </div>
                  </div>
                </section>
              )}

              <ProductCTAs
                productId={product.slug}
                slug={product.slug}
                name={product.name}
                image={product.image}
                price={product.sellingPrice}
                category={product.category}
              />
            </article>
          </div>
        </div>

        {/* ============ RELATED ============ */}
        {related.length > 0 && (
          <section className="mt-32 pb-28">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <Eyebrow>→ You may also like</Eyebrow>
              <h2 className="font-display font-light text-3xl sm:text-4xl mt-4 text-(--color-ink)">
                Other <span className="accent-italic">origins</span> to consider
              </h2>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p) => (
                  <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                      />
                      {p.gi && (
                        <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--color-ivory)/95 text-(--color-moss) text-[10px] uppercase tracking-[0.2em] font-medium">
                          <span className="h-1.5 w-1.5 rounded-full bg-(--color-gold)" /> GI Tagged
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl text-(--color-ink) mt-4 group-hover:text-(--color-moss)">
                      {p.name}
                    </h3>
                    <p className="font-display italic text-sm text-(--color-bamboo) mt-1">{p.origin}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <MarketingFooter />
      </main>

      <WhatsAppFab />
    </LenisProvider>
  );
}

function labelize(key: string) {
  switch (key) {
    case "energy":
      return "Energy";
    case "protein":
      return "Protein";
    case "carbs":
      return "Carbohydrates";
    case "fat":
      return "Total Fat";
    case "fibre":
      return "Dietary Fibre";
    case "iron":
      return "Iron";
    case "vitaminA":
      return "Vitamin A";
    default:
      return key;
  }
}
