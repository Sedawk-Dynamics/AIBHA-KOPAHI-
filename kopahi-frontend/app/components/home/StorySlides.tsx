"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import Eyebrow from "../marketing/Eyebrow";
import Headline from "../marketing/Headline";
import { SHOP_LINKS } from "../../lib/shop";
import { Reveal, RuledEyebrow, SlideFrame, type SlideProps } from "./storyKit";

const BTN_GOLD =
  "inline-flex items-center gap-3 px-7 py-4 bg-(--color-gold) text-(--color-moss-dark) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-gold-dark) hover:text-(--color-ivory) transition-colors";
const BTN_GHOST =
  "inline-flex items-center gap-3 px-7 py-4 border border-(--color-ivory)/60 text-(--color-ivory) text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-(--color-ivory) hover:text-(--color-moss-dark) transition-colors";

/* ------------------------------------------------------------------ */
/*  01 · Welcome — the existing hero, unchanged in message              */
/* ------------------------------------------------------------------ */

function HeroVideo({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement | null>(null);
  // No poster: the moss-dark backdrop shows until the first frame is actually
  // playing, then the video fades in — avoids a still-image flash.
  const [playing, setPlaying] = useState(false);

  // Only spend decode time while the hero is on screen.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-(--color-moss-dark)">
      {!reduce ? (
        <video
          ref={ref}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <Image src="/products/tea-garden.jpg" alt="" fill preload sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/55 via-(--color-moss-dark)/55 to-(--color-moss-dark)/85" />
      <div className="absolute inset-0 grain" />
    </div>
  );
}

export function HeroSlide({ active }: SlideProps) {
  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <HeroVideo active={active} />
      <SlideFrame align="end" className="pb-24 sm:pb-28">
        <Reveal show={active}>
          <Eyebrow tone="gold">AIBA Agri NE LLP</Eyebrow>
        </Reveal>
        <Reveal show={active} delay={0.15}>
          <Headline as="h1" tone="ivory" animate={false} className="mt-6 max-w-4xl" accent="Pure By Nature.">
            Authentic By Geography,
          </Headline>
        </Reveal>
        <Reveal show={active} delay={0.35} className="mt-7 max-w-xl">
          <p className="font-display italic text-lg sm:text-xl text-(--color-ivory)/85 leading-relaxed">
            Bringing Northeast India&apos;s GI-certified heritage products to global markets.
          </p>
        </Reveal>
        <Reveal show={active} delay={0.5} className="mt-9 flex flex-wrap gap-4">
          <a href={SHOP_LINKS.shop} className={BTN_GOLD}>
            Explore Our Origins <span aria-hidden="true">→</span>
          </a>
          <Link href="/contact" className={BTN_GHOST}>
            Partner With Us
          </Link>
        </Reveal>
      </SlideFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  02 · Our Story                                                     */
/* ------------------------------------------------------------------ */

export function OurStorySlide({ active }: SlideProps) {
  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <SlideFrame>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 xl:col-span-6">
            <Reveal show={active}>
              <RuledEyebrow>Our Story</RuledEyebrow>
            </Reveal>
            <Reveal show={active} delay={0.12}>
              <Headline as="h2" tone="ivory" animate={false} className="mt-5 short:text-[2.5rem]" accent="A Promise.">
                A Land. A Lineage.
              </Headline>
            </Reveal>
            <Reveal show={active} delay={0.3}>
              <p className="mt-4 font-display italic text-(--color-gold) text-lg sm:text-xl short:mt-3 short:text-lg">
                Born in Jorhat. Rooted in Northeast India.
              </p>
            </Reveal>
            <div className="mt-5 space-y-3.5 font-display text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-(--color-ivory)/85 max-w-[36rem] short:mt-3 short:space-y-2.5 short:text-[0.9rem]">
              <Reveal show={active} delay={0.5}>
                <p>
                  Kopahi was born in Jorhat, among mist-covered tea gardens, fertile fields and the
                  patient hands of generations who have nurtured this land. We are not here to discover
                  Northeast India — we are here to carry its story forward.
                </p>
              </Reveal>
              <Reveal show={active} delay={0.75}>
                <p>
                  Across the region, we work alongside farmers and weaver communities, bringing products
                  such as Lakadong turmeric, Joha rice, Muga silk, Bhut Jolokia and Judima from their
                  places of origin to the world.
                </p>
              </Reveal>
              <Reveal show={active} delay={1}>
                <p className="text-(--color-ivory)">
                  Our promise is simple: <em>protect the origin. Value the people. Preserve the story.</em>
                </p>
              </Reveal>
            </div>
          </div>

          <Reveal show={active} delay={0.35} y={24} className="hidden lg:block lg:col-span-5 xl:col-start-8">
            <div className="relative aspect-[4/3.4] max-h-[58svh] overflow-hidden rounded-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
              <Image
                src="/products/story.jpeg"
                alt="A farmer hands a basket of fresh chillies and turmeric to a young woman in a tea garden"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover ken-burns"
              />
            </div>
          </Reveal>
        </div>
      </SlideFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  03 · Why Kopahi / Why Now                                          */
/* ------------------------------------------------------------------ */

function ColumnHead({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="block h-px w-8 bg-(--color-gold)" />
      <h3 className="mt-4 font-body text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed text-(--color-ivory)">
        {children}
      </h3>
    </>
  );
}

const hl = "text-(--color-gold) not-italic";

export function WhyNowSlide({ active }: SlideProps) {
  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <SlideFrame>
        <Reveal show={active}>
          <RuledEyebrow>Why Now</RuledEyebrow>
        </Reveal>
        <Reveal show={active} delay={0.12}>
          <Headline as="h2" tone="ivory" animate={false} className="mt-5 max-w-4xl short:text-[2.4rem]" accent="Northeast Stands Apart.">
            The World Is Looking For Origin.
          </Headline>
        </Reveal>

        <div className="mt-8 lg:mt-12 short:mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-8 xl:gap-0 xl:divide-x xl:divide-(--color-ivory)/15">
          <Reveal show={active} delay={0.35} className="xl:pr-6">
            <ColumnHead>
              Authenticity is
              <br className="hidden sm:block" /> becoming an asset
            </ColumnHead>
            <p className="mt-3 font-display text-[0.95rem] leading-relaxed text-(--color-ivory)/75 short:text-[0.875rem]">
              Consumers are increasingly seeking products with identifiable origin, tradition and
              authenticity. India is actively positioning GI products as a route to premium markets and
              greater recognition for farmers, artisans and producer communities.
            </p>
          </Reveal>

          <Reveal show={active} delay={0.5} className="xl:px-6">
            <ColumnHead>
              Northeast India
              <br className="hidden sm:block" /> has the product
            </ColumnHead>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] gap-4">
              <div className="min-w-0">
                <p className="font-display text-[2.75rem] lg:text-5xl leading-none text-(--color-gold)">89</p>
                <p className="mt-2 text-[9.5px] uppercase tracking-[0.12em] leading-snug text-(--color-ivory)/80">
                  GI-registered
                  <br /> products
                </p>
                <p className="mt-1 font-display italic text-[11px] leading-snug text-(--color-ivory)/60">
                  as of March 2026
                </p>
              </div>
              <span aria-hidden="true" className="w-px bg-(--color-ivory)/20" />
              <div className="min-w-0">
                <p className="font-display text-[2.75rem] lg:text-5xl leading-none text-(--color-gold)">150</p>
                <p className="mt-2 text-[9.5px] uppercase tracking-[0.12em] leading-snug text-(--color-ivory)/80">
                  More identified
                  <br /> for GI tagging
                </p>
                <p className="mt-1 font-display italic text-[11px] leading-snug text-(--color-ivory)/60">
                  over the next two years
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal show={active} delay={0.65} className="xl:px-6">
            <ColumnHead>
              The world is
              <br className="hidden sm:block" /> starting to buy
            </ColumnHead>
            <p className="mt-3 font-display text-[0.95rem] leading-relaxed text-(--color-ivory)/75 short:text-[0.875rem]">
              In 2026, GI-tagged products from Northeast India began reaching new international markets —
              including <span className={hl}>Joha Rice</span> from Assam to{" "}
              <span className={hl}>the UK and Italy</span>, and <span className={hl}>Tezpur Litchi</span> to{" "}
              <span className={hl}>Dubai</span>.
            </p>
          </Reveal>

          <Reveal show={active} delay={0.8} className="xl:pl-6">
            <ColumnHead>
              The gap is
              <br className="hidden sm:block" /> in the middle
            </ColumnHead>
            <p className="mt-3 font-display italic text-sm text-(--color-gold)">
              Origin → Processing → Brand → Global Market
            </p>
            <p className="mt-3 font-display text-[0.95rem] leading-relaxed text-(--color-ivory)/75 short:text-[0.875rem]">
              The opportunity isn&apos;t simply to discover Northeast India&apos;s products. It&apos;s to
              build the infrastructure, brand and market access that can take them there.
            </p>
          </Reveal>
        </div>
      </SlideFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  06 · Join the Journey — the partner call to action                 */
/* ------------------------------------------------------------------ */

export function JoinSlide({ active }: SlideProps) {
  return (
    <div className="relative h-full overflow-hidden text-(--color-ivory)">
      <SlideFrame>
        <div className="max-w-3xl">
          <Reveal show={active}>
            <RuledEyebrow>Partner With Us</RuledEyebrow>
          </Reveal>
          <Reveal show={active} delay={0.12}>
            <Headline as="h2" tone="ivory" animate={false} className="mt-5 short:text-[2.5rem]" accent="Soil To Story.">
              Be A Part Of The Journey From
            </Headline>
          </Reveal>
          <Reveal show={active} delay={0.35} className="mt-9 flex flex-wrap gap-4">
            <Link href="/contact" className={BTN_GOLD}>
              Contact Us <span aria-hidden="true">→</span>
            </Link>
            <a href={SHOP_LINKS.account} className={BTN_GHOST}>
              Explore Export Partnerships
            </a>
          </Reveal>
        </div>
      </SlideFrame>
    </div>
  );
}
