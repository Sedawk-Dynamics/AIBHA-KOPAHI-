import Link from "next/link";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/kopahi" },
  { label: "LinkedIn", href: "https://linkedin.com/company/kopahi" },
  { label: "YouTube", href: "https://youtube.com/@kopahi" },
  { label: "WhatsApp", href: "https://wa.me/919181016660" },
  { label: "Facebook", href: "https://facebook.com/kopahi" },
];

export default function MarketingFooter() {
  return (
    <footer className="relative bg-(--color-moss-dark) text-(--color-ivory) overflow-hidden grain">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-24 pb-12">
        <p className="font-display italic font-light text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-(--color-ivory)/95">
          Authentic by Geography.
          <br />
          <span className="text-(--color-gold)">Pure by Nature.</span>
        </p>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* ============ Brand ============ */}
          <div className="max-w-sm">
            <p className="font-display text-2xl text-(--color-ivory)">
              Kopahi<span className="text-(--color-gold)">.</span>
            </p>
            <p className="mt-4 text-(--color-ivory)/80 leading-relaxed">
              An AIBA Agri NE LLP brand. Sourcing, processing, branding and exporting the GI-tagged heritage of seven Northeast Indian states.
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.22em] text-(--color-ivory)/70 hover:text-(--color-gold) transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ Explore ============ */}
          <div>
            <p className="eyebrow text-(--color-ivory)/60">Explore</p>
            <ul className="mt-4 space-y-3 text-(--color-ivory)/80">
              <li><Link href="/" className="hover:text-(--color-gold) transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-(--color-gold) transition-colors">About</Link></li>
              <li><Link href="/farmers" className="hover:text-(--color-gold) transition-colors">Farmers</Link></li>
              <li><Link href="/products" className="hover:text-(--color-gold) transition-colors">Products</Link></li>
              <li><Link href="/b2b" className="hover:text-(--color-gold) transition-colors">B2B</Link></li>
              <li><Link href="/journal" className="hover:text-(--color-gold) transition-colors">Journal</Link></li>
              <li><Link href="/contact" className="hover:text-(--color-gold) transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* ============ Reach Us ============ */}
          <div>
            <p className="eyebrow text-(--color-ivory)/60">Reach Us</p>
            <ul className="mt-4 space-y-3 text-(--color-ivory)/80">
              <li>
                <a href="mailto:info@kopahi.com" className="hover:text-(--color-gold) transition-colors">
                  info@kopahi.com
                </a>
              </li>
              <li>
                <a href="tel:+919181016660" className="hover:text-(--color-gold) transition-colors">
                  +91 91810 16660
                </a>
              </li>
              <li className="text-(--color-ivory)/70">Jorhat, Assam, India</li>
              <li className="text-(--color-ivory)/70">Mon – Sat, 9 AM – 6 PM IST</li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-(--color-ivory)/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-(--color-ivory)/70">
          <p>© {new Date().getFullYear()} Kopahi. All rights reserved.</p>
          <div className="flex items-center gap-3 font-display italic">
            <Link href="/privacy" className="hover:text-(--color-gold) transition-colors hover:underline underline-offset-4">
              Privacy
            </Link>
            <span aria-hidden="true" className="text-(--color-bamboo)/40">·</span>
            <Link href="/terms" className="hover:text-(--color-gold) transition-colors hover:underline underline-offset-4">
              Terms
            </Link>
            <span aria-hidden="true" className="text-(--color-bamboo)/40">·</span>
            <Link href="/products" className="hover:text-(--color-gold) transition-colors hover:underline underline-offset-4">
              Shop
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
