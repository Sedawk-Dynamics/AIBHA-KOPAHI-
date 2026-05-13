"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Optional second line rendered in italic muga-gold (the "Not Over It" treatment) */
  accent?: ReactNode;
  /** h1 by default; pass another tag for downstream sections */
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** When true, words stagger-in. */
  animate?: boolean;
  /** Force tone: 'ink' (default) for light bg, 'ivory' for dark bg */
  tone?: "ink" | "ivory";
};

function splitWords(node: ReactNode): string[] {
  if (typeof node !== "string") return [];
  return node.split(/(\s+)/).filter(Boolean);
}

export default function Headline({
  children,
  accent,
  as = "h2",
  className = "",
  animate = true,
  tone = "ink",
}: Props) {
  const Tag = as as keyof React.JSX.IntrinsicElements;
  const reduce = useReducedMotion();
  const words = splitWords(children);
  const accentWords = splitWords(accent);

  const baseColor = tone === "ivory" ? "text-(--color-ivory)" : "text-(--color-ink)";
  const size =
    as === "h1"
      ? "text-[clamp(3rem,8vw,7rem)] leading-[0.95]"
      : as === "h2"
      ? "text-[clamp(2.25rem,5.5vw,4.5rem)] leading-[1.02]"
      : "text-[clamp(1.5rem,3vw,2.5rem)] leading-tight";

  const renderWords = (arr: string[], italic = false) =>
    arr.map((w, i) =>
      /^\s+$/.test(w) ? (
        <span key={`s-${i}`}>{w}</span>
      ) : (
        <motion.span
          key={`${italic ? "a" : "n"}-${i}`}
          className={`inline-block ${italic ? "accent-italic" : ""}`}
          initial={reduce || !animate ? false : { opacity: 0, y: "0.4em" }}
          whileInView={reduce || !animate ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.8, 0.2, 1],
            delay: i * 0.04,
          }}
        >
          {w}
        </motion.span>
      )
    );

  return (
    <Tag className={`font-display font-light tracking-tight ${size} ${baseColor} ${className}`}>
      {words.length > 0 ? renderWords(words) : children}
      {accent && (
        <>
          {accentWords.length > 0 ? <br /> : null}
          {accentWords.length > 0 ? renderWords(accentWords, true) : <span className="accent-italic">{accent}</span>}
        </>
      )}
    </Tag>
  );
}
