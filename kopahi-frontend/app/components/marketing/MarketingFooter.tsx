import Link from "next/link";

type SocialIcon = { label: string; href: string; path: React.ReactNode };

const SOCIALS: SocialIcon[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/kopahi",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/kopahi",
    path: (
      <>
        <path
          d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43A2.06 2.06 0 1 1 5.35 3.3a2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@kopahi",
    path: (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="3" />
        <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919181016660",
    path: (
      <path
        d="M20.5 3.48A11.93 11.93 0 0 0 12.04 0C5.5 0 .17 5.32.17 11.86c0 2.09.55 4.13 1.59 5.93L.07 24l6.4-1.67a11.86 11.86 0 0 0 5.57 1.4h.01c6.54 0 11.86-5.31 11.87-11.85a11.78 11.78 0 0 0-3.48-8.4zm-8.46 18.24h-.01c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.87 9.87 0 1 1 18.32-5.24 9.78 9.78 0 0 1-9.93 9.87zm5.43-7.39c-.3-.15-1.76-.87-2.04-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.49-.5-.66-.51-.17-.01-.37-.01-.57-.01-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.44s1.05 2.83 1.19 3.03c.15.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.55-.08 1.7-.7 1.95-1.37.24-.67.24-1.24.17-1.37-.07-.13-.27-.2-.57-.35z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/kopahi",
    path: (
      <path
        d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.75 8.44-4.91 8.44-9.93z"
        fill="currentColor"
        stroke="none"
      />
    ),
  },
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
            <ul className="mt-8 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Kopahi on ${s.label}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-(--color-ivory)/25 text-(--color-ivory)/70 hover:border-(--color-gold) hover:text-(--color-gold) transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {s.path}
                    </svg>
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
