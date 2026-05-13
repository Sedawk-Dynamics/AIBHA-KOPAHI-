import Link from "next/link";

export function DashStat({
  label,
  value,
  trend,
  href,
}: {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string };
  href?: string;
}) {
  const body = (
    <div className="bg-(--color-ivory-warm) border border-(--color-bamboo)/20 p-6 sm:p-7 transition-colors hover:border-(--color-gold)">
      <p className="eyebrow">{label}</p>
      <p className="mt-4 font-display font-light text-[clamp(2rem,3.5vw,2.75rem)] leading-none text-(--color-ink)">
        {value}
      </p>
      {trend && (
        <p
          className={`mt-3 text-xs uppercase tracking-[0.2em] ${
            trend.direction === "up" ? "text-(--color-gold-dark)" : "text-(--color-chilli)"
          }`}
        >
          {trend.direction === "up" ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function DashCard({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-(--color-ivory-warm) border border-(--color-bamboo)/20 ${className}`}>
      {(title || action) && (
        <header className="px-6 sm:px-7 py-5 border-b border-(--color-bamboo)/15 flex items-baseline justify-between gap-4">
          {title && <h2 className="font-display text-xl sm:text-2xl text-(--color-ink)">{title}</h2>}
          {action}
        </header>
      )}
      <div className="px-6 sm:px-7 py-6">{children}</div>
    </section>
  );
}

const STATUS_TONES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-(--color-gold)/15", text: "text-(--color-gold-dark)" },
  pending_review: { bg: "bg-(--color-gold)/15", text: "text-(--color-gold-dark)" },
  approved: { bg: "bg-(--color-moss)/15", text: "text-(--color-moss)" },
  delivered: { bg: "bg-(--color-moss)/15", text: "text-(--color-moss)" },
  shipped: { bg: "bg-(--color-bamboo)/20", text: "text-(--color-bamboo)" },
  processing: { bg: "bg-(--color-bamboo)/20", text: "text-(--color-bamboo)" },
  rejected: { bg: "bg-(--color-chilli)/15", text: "text-(--color-chilli)" },
  cancelled: { bg: "bg-(--color-bamboo)/15", text: "text-(--color-bamboo)" },
};

export function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, "_");
  const tone = STATUS_TONES[key] ?? { bg: "bg-(--color-bamboo)/15", text: "text-(--color-bamboo)" };
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 text-[10px] uppercase tracking-[0.22em] ${tone.bg} ${tone.text}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
