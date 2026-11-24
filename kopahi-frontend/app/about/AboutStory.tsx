"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import StoryCarousel, { type StorySlide } from "../components/home/StoryCarousel";
import { Reveal, RuledEyebrow, SlideFrame, type SlideProps } from "../components/home/storyKit";
import Headline from "../components/marketing/Headline";
import { ABOUT_FAQS, MILESTONES, PEOPLE } from "./aboutData";

const button = "inline-flex items-center gap-3 bg-(--color-gold) px-7 py-4 text-[13px] font-medium uppercase tracking-[0.22em] text-(--color-moss-dark) transition-colors hover:bg-(--color-gold-dark) hover:text-(--color-ivory)";
const copy = "mt-6 max-w-xl space-y-4 font-display text-base leading-relaxed text-(--color-ivory)/85 sm:text-lg";

function Chapter({ active, eyebrow, title, accent, children, onHold }: SlideProps & { eyebrow: string; title: string; accent: string; children: ReactNode }) {
  return <div className="relative h-full text-(--color-ivory)" onFocusCapture={onHold} onPointerDown={onHold}>
    <SlideFrame>
      <Reveal show={active}><RuledEyebrow>{eyebrow}</RuledEyebrow></Reveal>
      <Reveal show={active} delay={0.12}><Headline tone="ivory" animate={false} className="mt-5 max-w-4xl" accent={accent}>{title}</Headline></Reveal>
      <Reveal show={active} delay={0.35}>{children}</Reveal>
    </SlideFrame>
  </div>;
}

function Welcome({ active }: SlideProps) {
  return <div className="relative h-full text-(--color-ivory)">
    <Image src="/products/tea-garden.jpg" alt="Tea gardens in Assam" fill preload sizes="100vw" className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-(--color-moss-dark)/55 via-(--color-moss-dark)/55 to-(--color-moss-dark)/85" />
    <div className="absolute inset-0 grain" />
    <SlideFrame align="end" className="pb-24 sm:pb-28">
      <Reveal show={active}><RuledEyebrow>About Kopahi · AIBA Agri NE LLP</RuledEyebrow></Reveal>
      <Reveal show={active} delay={0.15}><Headline as="h1" tone="ivory" animate={false} className="mt-6 max-w-4xl" accent="Reaching for the World.">Rooted in Seven States.</Headline></Reveal>
      <Reveal show={active} delay={0.35}><p className={copy}>Kopahi brings the exceptional produce and craftsmanship of Northeast India to global markets — creating opportunities for people, preserving traditions and celebrating a truly unique region.</p></Reveal>
      <Reveal show={active} delay={0.5} className="mt-9"><a href="#who-we-are" className={button}>Our story <span aria-hidden="true">→</span></a></Reveal>
    </SlideFrame>
  </div>;
}

function Identity(props: SlideProps) {
  return <Chapter {...props} eyebrow="Who We Are" title="Rooted in Our People." accent="Connected to the World.">
    <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={copy}><p>Kopahi is a brand of AIBA Agri NE LLP, bringing GI-certified and indigenous agricultural and handloom products of Northeast India to global markets.</p><p>We work directly with farmers and weavers, building ethical, transparent value chains across production, aggregation, processing, branding and distribution — ensuring authenticity, quality and fair value at every step.</p></div>
      <div className="relative aspect-[4/3] max-h-[38svh] overflow-hidden rounded-xl"><Image src="/products/directfromfarmers2.webp" alt="Farmers holding baskets of freshly picked greens" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" /></div>
    </div>
  </Chapter>;
}

function Mission(props: SlideProps) {
  return <Chapter {...props} eyebrow="Our Vision & Mission" title="Protect the Origin." accent="Create Opportunity.">
    <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
      <div><RuledEyebrow>Our Vision</RuledEyebrow><p className="mt-6 max-w-md font-display text-2xl leading-snug sm:text-3xl">Build global markets for Northeast GI produce.</p></div>
      <div><RuledEyebrow>Our Mission</RuledEyebrow><p className={copy}>To ethically produce, aggregate, process, brand and export indigenous agricultural and handloom products, while ensuring quality, traceability and creating sustainable growth for the people and communities of Northeast India.</p></div>
    </div>
  </Chapter>;
}

function Journey(props: SlideProps) {
  return <Chapter {...props} eyebrow="Our Journey" title="A Local Beginning." accent="A Growing Purpose.">
    <ol className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{MILESTONES.map(m => <li key={m.title} className="border-t border-(--color-ivory)/25 pt-4"><p className="font-display text-3xl text-(--color-gold)">{m.year}</p><p className="mt-3 font-display text-lg text-(--color-ivory)/85">{m.title}</p></li>)}</ol>
  </Chapter>;
}

function People(props: SlideProps) {
  return <Chapter {...props} eyebrow="The People Behind Kopahi" title="Shared Roots." accent="One Purpose.">
    <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">{PEOPLE.map(p => <li key={p.name}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-(--color-ivory)/10">{p.image && <Image src={p.image} alt={`Portrait of ${p.name}`} fill sizes="(max-width: 640px) 90vw, (max-width: 1280px) 40vw, 22vw" className="object-cover" style={{ objectPosition: p.imagePosition }} />}</div>
      <h3 className="mt-4 font-display text-xl">{p.name}</h3><p className="mt-1 text-xs uppercase tracking-widest text-(--color-gold)">{p.role}</p><p className="mt-3 text-sm leading-relaxed text-(--color-ivory)/75">{p.line}</p>
      {p.bio && <details className="mt-3"><summary className="cursor-pointer text-xs uppercase tracking-widest text-(--color-gold)">Read bio</summary><p className="mt-3 text-sm leading-relaxed text-(--color-ivory)/85">{p.bio}</p></details>}
    </li>)}</ul>
  </Chapter>;
}

function Impact(props: SlideProps) {
  return <Chapter {...props} eyebrow="Our Impact" title="Creating Sustainable," accent="Farmer-Led Value.">
    <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-16"><div><p className={copy}>By choosing Kopahi, you support indigenous produce, traditional craftsmanship and vibrant communities across Northeast India.</p><Link href="/contact" className={`${button} mt-8`}>Contact Us <span aria-hidden="true">→</span></Link></div><div className="relative aspect-[4/3] max-h-[38svh] overflow-hidden rounded-xl"><Image src="/products/gitagged.webp" alt="A farming couple holding baskets of vegetables and verified-farmer cards" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" /></div></div>
  </Chapter>;
}

function Questions(props: SlideProps) {
  return <Chapter {...props} eyebrow="Frequently Asked Questions" title="Get to Know" accent="Kopahi.">
    <div className="mt-8 max-w-4xl border-t border-(--color-ivory)/25">{ABOUT_FAQS.map(f => <details key={f.question} className="border-b border-(--color-ivory)/25 py-5"><summary className="cursor-pointer font-display text-lg text-(--color-gold)">{f.question}</summary><p className="mt-4 max-w-3xl text-sm leading-relaxed text-(--color-ivory)/85 sm:text-base">{f.answer}</p></details>)}</div>
  </Chapter>;
}

const slides: StorySlide[] = [
  { id: "about", label: "About", duration: 12000, tone: "dark", chapters: false, Component: Welcome },
  { id: "who-we-are", label: "Who We Are", duration: 18000, tone: "dark", chapters: true, Component: Identity },
  { id: "vision-mission", label: "Our Purpose", duration: 18000, tone: "dark", chapters: true, Component: Mission },
  { id: "our-journey", label: "Our Journey", duration: 16000, tone: "dark", chapters: true, Component: Journey },
  { id: "people-title", label: "Our People", duration: 24000, tone: "dark", chapters: true, Component: People },
  { id: "impact-title", label: "Our Impact", duration: 14000, tone: "dark", chapters: true, Component: Impact },
  { id: "faq-title", label: "FAQs", duration: 24000, tone: "dark", chapters: true, Component: Questions },
];

export default function AboutStory() {
  return <StoryCarousel slides={slides} label="About Kopahi" />;
}
