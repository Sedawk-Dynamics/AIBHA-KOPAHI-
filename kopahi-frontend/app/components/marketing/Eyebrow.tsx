import { ReactNode } from "react";

export default function Eyebrow({
  children,
  className = "",
  tone = "bamboo",
}: {
  children: ReactNode;
  className?: string;
  tone?: "bamboo" | "gold" | "ivory";
}) {
  const colorClass =
    tone === "gold"
      ? "text-(--color-gold)"
      : tone === "ivory"
      ? "text-(--color-ivory)/80"
      : "text-(--color-bamboo)";
  return (
    <p
      className={`font-body text-[11px] font-medium uppercase tracking-[0.22em] ${colorClass} ${className}`}
    >
      {children}
    </p>
  );
}
