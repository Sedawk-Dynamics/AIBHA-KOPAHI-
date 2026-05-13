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
    <div className="flex flex-col items-start gap-3">
      <span className={`font-display font-light leading-none text-[clamp(3rem,8vw,6rem)] ${numberClass}`}>
        {value}
      </span>
      <span className="h-px w-12 bg-(--color-gold)" aria-hidden="true" />
      <span className={`text-sm sm:text-base leading-snug max-w-[18ch] ${labelClass}`}>{label}</span>
    </div>
  );
}
