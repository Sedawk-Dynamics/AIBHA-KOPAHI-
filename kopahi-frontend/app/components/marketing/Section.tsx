"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Tone = "ivory" | "moss" | "white" | "bamboo";
type Size = "sm" | "default" | "lg" | "xl";
type Container = "measure" | "editorial" | "grid" | "shell";

export default function Section({
  children,
  tone = "ivory",
  size = "default",
  container = "grid",
  id,
  className = "",
  contained = true,
  padded = true,
  grain = false,
}: {
  children: ReactNode;
  tone?: Tone;
  /** v7 density patch — section Y-padding token. */
  size?: Size;
  /** v7 density patch — inner container width token. */
  container?: Container;
  id?: string;
  className?: string;
  /** Set false to render children full-bleed (no inner max-width container). */
  contained?: boolean;
  /** Set false to remove Y-padding entirely. */
  padded?: boolean;
  grain?: boolean;
}) {
  const reduce = useReducedMotion();

  const bg =
    tone === "moss"
      ? "bg-(--color-moss) text-(--color-ivory)"
      : tone === "bamboo"
      ? "bg-(--color-ivory-warm) text-(--color-ink)"
      : tone === "white"
      ? "bg-(--color-ivory-warm) text-(--color-ink)"
      : "bg-(--color-ivory) text-(--color-ink)";

  // v7 density — tighter section Y-padding by default.
  const padding = !padded
    ? ""
    : size === "sm"
    ? "section-y-sm"
    : size === "lg"
    ? "section-y-lg"
    : size === "xl"
    ? "section-y-xl"
    : "section-y";

  const innerWidth =
    container === "measure"
      ? "max-w-measure"
      : container === "editorial"
      ? "max-w-editorial"
      : container === "shell"
      ? "max-w-shell"
      : "max-w-grid";

  return (
    <section
      id={id}
      className={`relative ${bg} ${padding} ${grain ? "grain" : ""} ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        // amount: "some" (any pixel) — a fixed % can never be reached when
        // the section is taller than the viewport, leaving children invisible.
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={contained ? `mx-auto w-full ${innerWidth} px-5 lg:px-8` : ""}
      >
        {children}
      </motion.div>
    </section>
  );
}
