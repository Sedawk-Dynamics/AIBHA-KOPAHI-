export default function StatCallout({
  value,
  label,
  tone = "ink",
}: {
  value: string;
  label: string;
  tone?: "ivory" | "ink";
}) {
  const numberClass =
    tone === "ivory" ? "text-(--color-ivory)" : "text-(--color-ink)";
  const labelClass =
    tone === "ivory" ? "text-(--color-ivory)/70" : "text-(--color-ink)/60";
  return (
    <div className="flex flex-col items-start gap-2">
      {/* v7 density — number caps at 4rem (~64px), down from 6rem (~96px). */}
      <span className={`font-display font-light leading-none text-[clamp(2.5rem,4.2vw,4rem)] ${numberClass}`}>
        {value}
      </span>
      <span className="h-px w-8 bg-(--color-gold)" aria-hidden="true" />
      <span className={`text-[0.8125rem] leading-snug max-w-[14ch] uppercase tracking-[0.18em] ${labelClass}`}>{label}</span>
    </div>
  );
}
