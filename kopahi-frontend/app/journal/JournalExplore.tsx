"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useLenisRef } from "../components/marketing/LenisProvider";
import { FARMER_STORIES, ORIGIN_STORIES, PROCESS_STORY } from "./stories";

type Key = "people" | "origins" | "processes";

const CARDS: {
  key: Key;
  eyebrow: string;
  title: [string, string];
  body: string;
  image: string;
  alt: string;
  /** object-position for the crop */
  focus?: string;
  cta: string;
}[] = [
  {
    key: "people",
    eyebrow: "People",
    title: ["The People Behind", "the Source."],
    body: "Meet the farmers, communities and craftspeople whose knowledge and work keep Northeast India's traditions alive.",
    image: "/products/empover.png",
    alt: "Smiling farmers holding baskets of their harvest in a hillside field",
    // Crops out the signboard at the photo's left edge.
    focus: "object-[88%_center]",
    cta: "Explore People",
  },
  {
    key: "origins",
    eyebrow: "Origins",
    title: ["Where Every", "Story Begins."],
    body: "Explore the landscapes, crops and traditions that give Northeast India's products their distinct identity.",
    image: "/products/judima.jpg",
    alt: "Joha rice in terracotta bowls",
    cta: "Explore Origins",
  },
  {
    key: "processes",
    eyebrow: "Processes",
    title: ["From Source", "to World."],
    body: "From harvest to final product, every step is guided by care, quality and respect for where it began.",
    image: "/products/distributtion.png",
    alt: "Packed Kopahi produce being loaded onto a truck for dispatch",
    cta: "Explore Processes",
  },
];

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];
const KEYS: Key[] = ["people", "origins", "processes"];

/** md+ — the three cards sit in one row. */
const WIDE_QUERY = "(min-width: 768px)";
function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true,
  );
}

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
        open
          ? "border-(--color-gold-dark) bg-(--color-gold-dark) text-(--color-ivory)"
          : "border-(--color-gold-dark)/60 text-(--color-gold-dark) group-hover:bg-(--color-gold-dark) group-hover:text-(--color-ivory)"
      }`}
    >
      <span className="absolute h-[1.5px] w-2.5 bg-current" />
      <span
        className={`absolute h-2.5 w-[1.5px] bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
      />
    </span>
  );
}

function PanelEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-gold-dark)">{children}</p>
  );
}

function ReadLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-(--color-gold-dark) hover:text-(--color-moss) transition-colors"
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

/* ---------------- panels ---------------- */

function PeoplePanel() {
  return (
    <div>
      <div className="max-w-2xl">
        <PanelEyebrow>People</PanelEyebrow>
        <h3 className="mt-3 font-display font-light text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-(--color-ink)">
          The hands behind the <span className="accent-italic">harvest.</span>
        </h3>
        <p className="mt-4 leading-relaxed text-(--color-ink)/75">
          Every Kopahi product begins with someone who has spent years — often a lifetime — learning one crop, one
          slope and one season at a time.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {FARMER_STORIES.map((f) => (
          <li
            key={f.name}
            className="flex flex-col rounded-sm border border-(--color-bamboo)/15 bg-(--color-ivory) p-6 sm:p-8"
          >
            <div className="flex items-center gap-4">
              {f.image ? (
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                  <Image src={f.image} alt={`Portrait of ${f.name}`} fill sizes="56px" className="object-cover" />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--color-moss) font-display text-xl italic text-(--color-gold)"
                >
                  {f.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
              <div className="min-w-0">
                <h4 className="font-display text-xl leading-tight text-(--color-ink)">{f.name}</h4>
                <p className="mt-0.5 text-[0.8125rem] text-(--color-ink)/60">{f.place}</p>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 border-y border-(--color-bamboo)/15 py-4">
              <dt className="sr-only">Experience</dt>
              <dd className="row-span-2 font-display text-4xl leading-none text-(--color-gold-dark)">
                {f.years}
                <span className="mt-1 block max-w-[7rem] font-body text-[10px] uppercase leading-snug tracking-[0.14em] text-(--color-ink)/55">
                  {f.yearsLabel}
                </span>
              </dd>
              <dt className="sr-only">Crop or craft</dt>
              <dd className="text-sm font-medium text-(--color-moss)">{f.craft}</dd>
              {f.gi ? (
                <>
                  <dt className="sr-only">Geographical Indication</dt>
                  <dd className="inline-flex items-center gap-2 text-xs text-(--color-ink)/70">
                    <span className="rounded-full bg-(--color-gold)/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-(--color-gold-dark)">
                      GI
                    </span>
                    {f.gi}
                  </dd>
                </>
              ) : (
                <dd aria-hidden="true" />
              )}
            </dl>

            <p className="mt-5 text-[0.95rem] leading-relaxed text-(--color-ink)/75">{f.story}</p>
            <blockquote className="mt-5 border-l-2 border-(--color-gold)/60 pl-4 font-display italic text-(--color-bamboo)">
              “{f.quote}”
            </blockquote>
            {f.essay && (
              <div className="mt-auto pt-6">
                <ReadLink href={f.essay.href}>Read the full story</ReadLink>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OriginsPanel() {
  return (
    <div>
      <PanelEyebrow>Origins</PanelEyebrow>
      <p className="mt-3 max-w-3xl font-display font-light text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-(--color-ink)">
        From the fields of Assam to the hills of Meghalaya and beyond, geography shapes what grows here —{" "}
        <span className="accent-italic">and the traditions built around it.</span>
      </p>

      <div className="mt-12 space-y-14 lg:space-y-20">
        {ORIGIN_STORIES.map((o, i) => (
          <article key={o.crop} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-(--color-ivory-warm)">
                <Image
                  src={o.image}
                  alt={o.imageAlt}
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className={`object-cover ${o.imageFocus ?? ""}`}
                />
              </div>
            </div>
            <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <h4 className="font-display text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight text-(--color-ink)">
                {o.crop} <span className="text-(--color-gold-dark)">·</span>{" "}
                <span className="italic text-(--color-bamboo)">{o.state}</span>
              </h4>
              <div className="mt-4 space-y-4 leading-relaxed text-(--color-ink)/75">
                {o.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {o.facts.map((fact) => (
                  <li
                    key={fact}
                    className="rounded-full border border-(--color-bamboo)/25 px-3 py-1 text-[10.5px] uppercase tracking-[0.14em] text-(--color-ink)/70"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
              {o.essay && (
                <div className="mt-6">
                  <ReadLink href={o.essay.href}>{o.essay.title}</ReadLink>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function ProcessesPanel() {
  const s = PROCESS_STORY;
  return (
    <article className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-(--color-ivory-warm) lg:aspect-[4/5]">
            <Image src={s.image} alt={s.imageAlt} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-7">
        <PanelEyebrow>Processes</PanelEyebrow>
        <h3 className="mt-3 font-display font-light text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-(--color-ink)">
          {s.title}
        </h3>
        <p className="mt-4 max-w-2xl leading-relaxed text-(--color-ink)/75">{s.intro}</p>

        <ol className="relative mt-10 space-y-8 border-l border-(--color-bamboo)/25 pl-8">
          {s.steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[3.05rem] top-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--color-gold)/60 bg-(--color-ivory) font-display text-sm italic text-(--color-gold-dark)"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="font-display text-xl text-(--color-ink)">{step.title}</h4>
              <p className="mt-1.5 max-w-xl text-[0.95rem] leading-relaxed text-(--color-ink)/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

const PANELS: Record<Key, () => React.ReactNode> = {
  people: PeoplePanel,
  origins: OriginsPanel,
  processes: ProcessesPanel,
};

/* ---------------- section ---------------- */

export default function JournalExplore() {
  const [open, setOpen] = useState<Key | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const scrollOnOpen = useRef(false);
  const lenisRef = useLenisRef();
  const reduce = useReducedMotion();
  const wide = useWide();

  const toggle = (k: Key) => {
    scrollOnOpen.current = open !== k;
    setOpen((cur) => (cur === k ? null : k));
  };

  // Deep links (/journal#origins) open that panel.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const k = window.location.hash.slice(1) as Key;
      if (KEYS.includes(k)) {
        scrollOnOpen.current = true;
        setOpen(k);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rather than just growing the section, glide the opened stories into view.
  useEffect(() => {
    if (!open || !scrollOnOpen.current) return;
    scrollOnOpen.current = false;
    const t = window.setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const lenis = lenisRef?.current;
      if (lenis) {
        // Lenis debounces its own resize; refresh it so the scroll limit
        // already includes the stories that were just added. It also honours
        // the page's scroll-padding-top, so the stories land below the header.
        lenis.resize();
        lenis.scrollTo(el, { duration: 1.3 });
      } else {
        const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        const top = el.getBoundingClientRect().top + window.scrollY - pad;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      }
    }, 120);
    return () => window.clearTimeout(t);
  }, [open, lenisRef, reduce]);

  const Panel = open ? PANELS[open] : null;

  // The stories reveal underneath the cards — directly under the tapped card
  // on phones (where the cards stack), under the whole row on wider screens —
  // and the page glides down to them (effect above) instead of just growing.
  const panelBlock = (
    <div id="journal-explore-panel" ref={panelRef} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {Panel && (
          <motion.div
            key={open}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <motion.div
              initial={{ y: 32 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="border-t border-(--color-bamboo)/25 pt-10 md:mt-14 md:pt-14 lg:mt-20 lg:pt-16"
            >
              <Panel />
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const k = open;
                    setOpen(null);
                    document.getElementById(k ?? "")?.scrollIntoView({ block: "nearest" });
                  }}
                  className="group inline-flex items-center gap-3 text-sm font-medium text-(--color-ink)/70 hover:text-(--color-gold-dark) transition-colors"
                >
                  Close
                  <PlusMinus open />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section aria-labelledby="explore-title" className="relative bg-(--color-ivory-warm) py-20 lg:py-28">
      <div className="mx-auto max-w-grid px-5 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-gold-dark)">
              Explore the Journal
            </p>
            <h2
              id="explore-title"
              className="mt-4 font-display font-light tracking-tight text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-(--color-ink)"
            >
              People. Origins. Processes.
            </h2>
          </div>
          <p className="max-w-xs font-display italic text-(--color-ink)/70 lg:pb-2">
            Three perspectives. A deeper understanding of what makes Northeast India extraordinary.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-(--color-bamboo)/20">
          {CARDS.map((c) => {
            const isOpen = open === c.key;
            return (
              <Fragment key={c.key}>
                <article id={c.key} className="flex scroll-mt-28 flex-col md:px-6 lg:px-8 md:first:pl-0 md:last:pr-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-(--color-ivory)">
                    <Image
                      src={c.image}
                      alt={c.alt}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-[1.2s] ease-out ${c.focus ?? ""} ${isOpen ? "scale-[1.04]" : ""}`}
                    />
                  </div>
                  <p className="mt-6 font-body text-[11px] font-medium uppercase tracking-[0.24em] text-(--color-gold-dark)">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight text-(--color-ink)">
                    {c.title[0]}
                    <br />
                    {c.title[1]}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-(--color-ink)/70">{c.body}</p>
                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => toggle(c.key)}
                      aria-expanded={isOpen}
                      aria-controls="journal-explore-panel"
                      className="group inline-flex items-center gap-3 text-sm font-medium text-(--color-ink) hover:text-(--color-gold-dark) transition-colors"
                    >
                      {c.cta}
                      <PlusMinus open={isOpen} />
                    </button>
                  </div>
                </article>
                {!wide && isOpen && panelBlock}
              </Fragment>
            );
          })}
        </div>

        {wide && panelBlock}
      </div>
    </section>
  );
}
