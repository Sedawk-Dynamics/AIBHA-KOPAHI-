"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";

export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/** Props every homepage story slide receives from the slider. */
export type SlideProps = {
  /** This slide is the one on screen. */
  active: boolean;
  /** 0 → 1 over the slide's on-screen time (paused while autoplay is paused). */
  progress: MotionValue<number>;
  /** The visitor is exploring this slide — hold autoplay until they move on. */
  onHold: () => void;
};

/**
 * The one backdrop behind chapters 2–6: a still from the hero film under the
 * Our Story overlay. It stays put while the chapters slide across it (the
 * hero chapter covers it with the film itself).
 */
export function StoryBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-(--color-moss-dark)">
      <Image src="/story-backdrop.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-(--color-moss-dark)/95 via-(--color-moss-dark)/80 to-(--color-moss-dark)/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-(--color-moss-dark)/70 via-transparent to-(--color-moss-dark)/30" />
      <div className="absolute inset-0 grain" />
    </div>
  );
}

/** Horizontal gutter that clears the slider's side arrows. */
export const SLIDE_X = "px-5 md:px-24 xl:px-32";

/**
 * Full-height content frame for a slide: clears the fixed header above and the
 * slider controls below, and lets content scroll inside the slide on very
 * short screens instead of being cut off.
 */
export function SlideFrame({
  children,
  className = "",
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "end";
}) {
  return (
    <div
      data-lenis-prevent
      className="relative z-10 h-full overflow-y-auto no-scrollbar"
    >
      <div
        className={`mx-auto flex min-h-full w-full max-w-shell flex-col ${
          align === "end" ? "justify-end" : "justify-center"
        } pt-20 pb-20 lg:pt-28 lg:pb-24 ${SLIDE_X} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Fades a block in when its slide arrives (after the slide has mostly slid
 * into place) and out when it leaves. On first paint the active slide's
 * content fades in too.
 */
export function Reveal({
  show,
  delay = 0,
  y = 18,
  className = "",
  children,
}: {
  show: boolean;
  delay?: number;
  y?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={show ? { opacity: 0, y } : false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: show ? 0.7 : 0.3,
        ease: EASE,
        delay: show ? 0.35 + delay : 0,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow with the short gold rule underneath, as in the story mockups. */
export function RuledEyebrow({
  children,
  tone = "dark",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <div>
      <p
        className={`font-body text-[11px] font-medium uppercase tracking-[0.24em] ${
          tone === "dark" ? "text-(--color-gold)" : "text-(--color-gold-dark)"
        }`}
      >
        {children}
      </p>
      <span aria-hidden="true" className="mt-3 block h-px w-14 bg-(--color-gold)/70" />
    </div>
  );
}
