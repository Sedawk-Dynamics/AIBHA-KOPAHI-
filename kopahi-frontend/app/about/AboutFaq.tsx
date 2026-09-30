"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Faq = { question: string; answer: string };

/** Accessible accordion (WAI-ARIA pattern): heading › button › region. */
export default function AboutFaq({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const uid = useId();

  return (
    <div className="border-t border-(--color-bamboo)/25">
      {items.map((f, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;
        return (
          <div key={f.question} className="border-b border-(--color-bamboo)/25">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[0.95rem] sm:text-base font-medium text-(--color-ink) hover:text-(--color-moss) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-rust)"
              >
                {f.question}
                <span
                  aria-hidden="true"
                  className="relative h-3.5 w-3.5 shrink-0 text-(--color-rust)"
                >
                  <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current transition-transform duration-300 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            {/* The region stays in the DOM so aria-controls always resolves. */}
            <div id={panelId} role="region" aria-labelledby={btnId}>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-10 text-[0.95rem] leading-relaxed text-(--color-ink)/75">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
