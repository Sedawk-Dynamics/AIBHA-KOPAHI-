"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const LenisContext = createContext<React.RefObject<Lenis | null> | null>(null);

/** The page's Lenis instance (null under reduced motion) — read it in handlers, not render. */
export function useLenisRef() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
