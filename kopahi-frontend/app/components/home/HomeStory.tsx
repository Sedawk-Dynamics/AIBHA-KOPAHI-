"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";

import { HeroSlide, JoinSlide, OurStorySlide, WhyNowSlide } from "./StorySlides";
import OriginsSlide from "./OriginsSlide";
import PillarsSlide, { PILLAR_COUNT, PILLAR_MS } from "./PillarsSlide";
import { SLIDE_X, StoryBackdrop, type SlideProps } from "./storyKit";

/* ------------------------------------------------------------------ */
/*  The homepage story: six full-screen chapters that slide left→right.
    Each chapter plays for its own duration, then the next slides in from
    the right. Visitors can also step through with the side arrows, the
    chapter tabs, the dots, a scroll/trackpad gesture, a swipe, or ←/→.   */
/* ------------------------------------------------------------------ */

type Slide = {
  /** Also the deep-link hash, e.g. /#our-story */
  id: string;
  label: string;
  /** Time on screen before the next chapter slides in (ms). */
  duration: number;
  /** Colour of what the controls sit on. */
  tone: "dark" | "light";
  /** Show the numbered chapter tabs along the bottom (desktop). */
  chapters: boolean;
  Component: (props: SlideProps) => React.ReactNode;
};

const SLIDES: Slide[] = [
  { id: "welcome", label: "Welcome", duration: 7000, tone: "dark", chapters: false, Component: HeroSlide },
  { id: "our-story", label: "Our Story", duration: 14000, tone: "dark", chapters: true, Component: OurStorySlide },
  { id: "why-now", label: "Why Now", duration: 14000, tone: "dark", chapters: true, Component: WhyNowSlide },
  { id: "origins", label: "Our Origins", duration: 15000, tone: "dark", chapters: true, Component: OriginsSlide },
  {
    id: "what-we-do",
    label: "What We Do",
    duration: PILLAR_MS * PILLAR_COUNT,
    tone: "dark",
    // This chapter carries its own numbered pillar tabs.
    chapters: false,
    Component: PillarsSlide,
  },
  { id: "join", label: "Join the Journey", duration: 12000, tone: "dark", chapters: true, Component: JoinSlide },
];

const LAST = SLIDES.length - 1;
const SLIDE_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const pad = (n: number) => String(n).padStart(2, "0");

/** Would this wheel gesture scroll something inside the slide first? */
function scrollsInside(target: EventTarget | null, root: HTMLElement, dy: number) {
  let node = target instanceof Element ? target : null;
  while (node && node !== root) {
    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1) {
      const oy = getComputedStyle(node).overflowY;
      if (oy === "auto" || oy === "scroll") {
        if (dy > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
        if (dy < 0 && node.scrollTop > 0) return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

function ArrowIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomeStory() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);

  // [on screen, previously on screen] — only these two animate on a change.
  const [[index, prev], setPair] = useState<[number, number]>([0, 0]);
  // Deep links jump straight to a chapter without sliding through the rest.
  const [instant, setInstant] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [ended, setEnded] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  const progress = useMotionValue(0);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);

  const go = useCallback((to: number) => {
    const target = Math.max(0, Math.min(LAST, to));
    setInstant(false);
    setHeld(false);
    setEnded(false);
    setPair((s) => (s[0] === target ? s : [target, s[0]]));
  }, []);

  const hold = useCallback(() => setHeld(true), []);

  // Latest values for the long-lived DOM listeners below.
  const indexRef = useRef(index);
  const goRef = useRef(go);
  const inViewRef = useRef(inView);
  useEffect(() => {
    indexRef.current = index;
    goRef.current = go;
    inViewRef.current = inView;
  });

  /* ---------------- autoplay clock ---------------- */

  const running = playing && !reduce && !held && inView && pageVisible;

  useEffect(() => {
    progress.jump(0);
    const controls = animate(progress, 1, {
      duration: SLIDES[index].duration / 1000,
      ease: "linear",
      onComplete: () => {
        if (index < LAST) {
          go(index + 1);
        } else {
          // The story has been told — stop on the call to action and offer a replay.
          setPlaying(false);
          setEnded(true);
        }
      },
    });
    controls.pause();
    controlsRef.current = controls;
    return () => controls.stop();
  }, [index, progress, go]);

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    if (running) c.play();
    else c.pause();
  }, [running, index]);

  /* ---------------- visibility ---------------- */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.6), {
      threshold: [0, 0.6, 1],
    });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /* ---------------- deep links (/#origins etc.) ---------------- */

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const i = SLIDES.findIndex((s) => s.id === id);
      if (i < 0) return;
      setInstant(true);
      setHeld(false);
      setEnded(false);
      setPair([i, i]);
      window.scrollTo({ top: 0 });
    };
    const raf = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", fromHash);
    };
  }, []);

  /* ---------------- scroll / trackpad → next chapter ---------------- */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let lockUntil = 0;
    let lastEvent = 0;
    let acc = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
      const delta = vertical ? e.deltaY : e.deltaX;
      if (delta === 0) return;
      // Only steer the story while it fills the screen (page at the top).
      if (Math.abs(el.getBoundingClientRect().top) > 2) return;

      const now = performance.now();
      const gap = now - lastEvent;
      lastEvent = now;

      // One gesture = one chapter. Swallow the rest of a gesture (trackpad
      // inertia) until it has gone quiet, even at either end of the story.
      if (now < lockUntil) {
        e.preventDefault();
        e.stopPropagation();
        if (gap < 160) lockUntil = Math.max(lockUntil, now + 160);
        return;
      }

      const i = indexRef.current;
      const forward = delta > 0;
      // First/last chapter: hand the gesture back to the page (e.g. on to the footer).
      if ((forward && i === LAST) || (!forward && i === 0)) return;
      if (vertical && scrollsInside(e.target, el, delta)) return;

      e.preventDefault();
      e.stopPropagation();
      if (gap > 220) acc = 0;
      acc += delta;
      if (Math.abs(acc) < 24) return;
      acc = 0;
      lockUntil = now + 950;
      goRef.current(i + (forward ? 1 : -1));
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  /* ---------------- swipe (touch) ---------------- */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let x0 = 0;
    let y0 = 0;
    let t0 = 0;
    let tracking = false;
    const start = (e: TouchEvent) => {
      tracking = e.touches.length === 1;
      if (!tracking) return;
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      t0 = performance.now();
    };
    const end = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3 || performance.now() - t0 > 900) return;
      goRef.current(indexRef.current + (dx < 0 ? 1 : -1));
    };
    const cancel = () => {
      tracking = false;
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    el.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", cancel);
    };
  }, []);

  /* ---------------- keyboard ←/→ ---------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goRef.current(indexRef.current + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goRef.current(indexRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------------- render ---------------- */

  const current = SLIDES[index];
  const dark = current.tone === "dark";

  const arrowCls = dark
    ? "border-(--color-ivory)/55 text-(--color-ivory) hover:bg-(--color-ivory) hover:text-(--color-moss-dark)"
    : "border-(--color-moss)/30 bg-(--color-ivory)/70 text-(--color-moss) hover:bg-(--color-moss) hover:text-(--color-ivory)";

  const togglePlay = () => {
    if (ended) {
      go(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };
  const autoplayOn = playing && !reduce;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        aria-roledescription="carousel"
        aria-label="The Kopahi story"
        className="relative h-svh min-h-[36rem] w-full overflow-clip bg-(--color-moss-dark)"
        style={{ touchAction: "pan-y pinch-zoom" }}
      >
        <StoryBackdrop />

        {SLIDES.map((s, i) => {
          const on = i === index;
          const offset = on ? 0 : i < index ? -100 : 100;
          const moving = !instant && (on || i === prev);
          const Slide = s.Component;
          return (
            <motion.div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}: ${s.label}`}
              aria-hidden={!on}
              inert={!on}
              initial={false}
              animate={{ x: `${offset}%`, opacity: on ? 1 : 0.35 }}
              transition={moving ? { duration: 0.95, ease: SLIDE_EASE } : { duration: 0 }}
              className="absolute inset-0"
            >
              <Slide active={on} progress={progress} onHold={hold} />
            </motion.div>
          );
        })}

        {/* Announce chapter changes only when the visitor is driving. */}
        <p className="sr-only" aria-live="polite">
          {running ? "" : `Chapter ${index + 1} of ${SLIDES.length}: ${current.label}`}
        </p>

        {/* ---------- side arrows ---------- */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous chapter"
          className={`absolute left-4 xl:left-8 top-[calc(50%+2rem)] z-30 hidden md:inline-flex h-12 w-12 xl:h-14 xl:w-14 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-[2px] transition-all duration-300 disabled:pointer-events-none disabled:opacity-0 ${arrowCls}`}
        >
          <ArrowIcon dir="prev" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === LAST}
          aria-label="Next chapter"
          className={`absolute right-4 xl:right-8 top-[calc(50%+2rem)] z-30 hidden md:inline-flex h-12 w-12 xl:h-14 xl:w-14 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-[2px] transition-all duration-300 disabled:pointer-events-none disabled:opacity-0 ${arrowCls}`}
        >
          <ArrowIcon dir="next" />
        </button>

        {/* ---------- scroll cue on the opening chapter ---------- */}
        <AnimatePresence>
          {index === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-(--color-ivory)/75 md:flex"
            >
              <span className="text-[10px] uppercase tracking-[0.32em]">Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-(--color-ivory)/40">
                <span className="scroll-dot absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-(--color-gold)" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- bottom bar: chapter tabs · progress dots ---------- */}
        {/* Phones: chapters taller than the screen scroll inside the slide, so
            fade their text out beneath the controls. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t transition-colors duration-700 lg:hidden ${
            dark ? "from-(--color-moss-dark)" : "from-(--color-ivory)"
          } to-transparent`}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
          <div className={`mx-auto flex max-w-shell items-end justify-between gap-6 pb-4 sm:pb-6 ${SLIDE_X}`}>
            <AnimatePresence initial={false}>
              {current.chapters && (
                <motion.nav
                  key="chapters"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4 }}
                  aria-label="Story chapters"
                  className="pointer-events-auto hidden items-end gap-7 lg:flex xl:gap-10"
                >
                  {SLIDES.slice(1).map((s, j) => {
                    const i = j + 1;
                    const on = i === index;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => go(i)}
                        aria-current={on ? "step" : undefined}
                        className="group min-w-[5.5rem] text-left"
                      >
                        <span
                          className={`block font-display text-xl leading-none transition-colors ${
                            on
                              ? dark
                                ? "text-(--color-gold)"
                                : "text-(--color-gold-dark)"
                              : dark
                              ? "text-(--color-ivory)/50 group-hover:text-(--color-ivory)"
                              : "text-(--color-ink)/40 group-hover:text-(--color-ink)"
                          }`}
                        >
                          {pad(i)}
                        </span>
                        <span
                          className={`relative mt-2 block h-[2px] overflow-hidden ${
                            dark ? "bg-(--color-ivory)/20" : "bg-(--color-ink)/10"
                          }`}
                        >
                          {on && (
                            <motion.span
                              className="absolute inset-0 origin-left bg-(--color-gold)"
                              style={{ scaleX: autoplayOn ? progress : 1 }}
                            />
                          )}
                        </span>
                        <span
                          className={`mt-2 block whitespace-nowrap text-[10px] uppercase tracking-[0.2em] transition-colors ${
                            on
                              ? dark
                                ? "text-(--color-gold)"
                                : "text-(--color-gold-dark)"
                              : dark
                              ? "text-(--color-ivory)/55"
                              : "text-(--color-ink)/50"
                          }`}
                        >
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </motion.nav>
              )}
            </AnimatePresence>

            <div className="pointer-events-auto -ml-1.5 mr-auto flex items-center gap-1 sm:ml-auto sm:mr-16 md:mr-0">
              {SLIDES.map((s, i) => {
                const on = i === index;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${s.label} (${i + 1} of ${SLIDES.length})`}
                    aria-current={on ? "step" : undefined}
                    className="group relative flex h-7 w-7 items-center justify-center"
                  >
                    <svg viewBox="0 0 28 28" className="absolute inset-0 -rotate-90" aria-hidden="true">
                      {on && (
                        <motion.circle
                          cx="14"
                          cy="14"
                          r="10.5"
                          fill="none"
                          stroke="var(--color-gold)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          style={{ pathLength: autoplayOn ? progress : 1 }}
                        />
                      )}
                    </svg>
                    <span
                      className={`block h-2 w-2 rounded-full border transition-colors duration-300 ${
                        on
                          ? "border-(--color-gold) bg-(--color-gold)"
                          : dark
                          ? "border-(--color-ivory)/70 group-hover:bg-(--color-ivory)/60"
                          : "border-(--color-moss)/55 group-hover:bg-(--color-moss)/45"
                      }`}
                    />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={ended ? "Replay the story" : autoplayOn ? "Pause the story" : "Play the story"}
                className={`ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                  dark
                    ? "border-(--color-ivory)/40 text-(--color-ivory)/85 hover:border-(--color-gold) hover:text-(--color-gold)"
                    : "border-(--color-moss)/30 text-(--color-moss) hover:border-(--color-gold-dark) hover:text-(--color-gold-dark)"
                }`}
              >
                {ended ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : autoplayOn ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <rect x="1.5" y="1" width="2.2" height="8" rx="0.6" fill="currentColor" />
                    <rect x="6.3" y="1" width="2.2" height="8" rx="0.6" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2.5 1.2v7.6L8.8 5z" fill="currentColor" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
