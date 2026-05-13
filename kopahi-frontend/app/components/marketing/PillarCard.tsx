"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function PillarCard({
  index,
  title,
  body,
  image,
  href,
  reverse = false,
}: {
  index: string;
  title: string;
  body: string;
  image: string;
  href?: string;
  reverse?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 32 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className={`md:col-span-7 relative overflow-hidden rounded-sm aspect-[4/3] md:aspect-[5/4] ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-[1.4s] ease-out hover:scale-[1.04]"
        />
      </motion.div>

      <div className={`md:col-span-5 relative ${reverse ? "md:order-1 md:pr-6" : "md:pl-6"}`}>
        <span
          aria-hidden="true"
          className="font-display italic text-[clamp(6rem,12vw,10rem)] leading-none text-(--color-bamboo)/15 absolute -top-12 -left-2 select-none pointer-events-none"
        >
          {index}
        </span>
        <p className="eyebrow text-(--color-bamboo)">Pillar · {index}</p>
        <h3 className="font-display font-light tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight mt-3 text-(--color-ink)">
          {title}
        </h3>
        <p className="mt-4 text-(--color-ink)/75 leading-relaxed max-w-prose">{body}</p>
        {href && (
          <Link
            href={href}
            className="mt-6 inline-flex items-center gap-2 text-(--color-gold-dark) hover:text-(--color-gold) transition-colors text-sm font-medium uppercase tracking-[0.18em]"
          >
            Explore Pillar
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
