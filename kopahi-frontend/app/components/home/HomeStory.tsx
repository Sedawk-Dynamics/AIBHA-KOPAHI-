"use client";

import { HeroSlide, JoinSlide, OurStorySlide, WhyNowSlide } from "./StorySlides";
import OriginsSlide from "./OriginsSlide";
import PillarsSlide, { PILLAR_COUNT, PILLAR_MS } from "./PillarsSlide";
import StoryCarousel, { type StorySlide } from "./StoryCarousel";

const SLIDES: StorySlide[] = [
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

export default function HomeStory() { return <StoryCarousel slides={SLIDES} />; }
