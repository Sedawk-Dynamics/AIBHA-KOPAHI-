"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Tone = "ivory" | "moss" | "white" | "bamboo";

export default function Section({
  children,
  tone = "ivory",
  id,
  className = "",
  contained = true,
  padded = true,
  grain = false,
}: {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  contained?: boolean;
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

  return (
    <section
      id={id}
      className={`relative ${bg} ${padded ? "py-20 sm:py-28 md:py-32" : ""} ${grain ? "grain" : ""} ${className}`}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        // amount: "some" (any pixel) — a fixed % can never be reached when
        // the section is taller than the viewport, leaving children invisible.
        viewport={{ once: true, amount: "some" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={contained ? "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12" : ""}
      >
        {children}
      </motion.div>
    </section>
  );
}
