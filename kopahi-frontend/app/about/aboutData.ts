import { FOUNDERS } from "../lib/marketing";

// Approved factual answers carried over from the previous About page.
export const ABOUT_FAQS = [
  {
    question: "Who owns Kopahi?",
    answer:
      "Kopahi is a brand of AIBA Agri NE LLP, a Limited Liability Partnership registered in India. The leadership team is Barsha Prakash Choudhury and Ashreeta Gogoi (Founders), Trideep Khanikar (Director, Operations) and Prakash Natarajan (Director, Sales & Marketing).",
  },
  {
    question: "Where is Kopahi based?",
    answer:
      "Our principal place of business is Bye Lane 2, Suraj Nagar, NA Ali, Jorhat, Assam — 785001. Sourcing, processing and dispatch run from this office; the farmer network spans all seven Northeast states.",
  },
  {
    question: "Which states do you source from?",
    answer:
      "We source from Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Sikkim and Mizoram — the seven sister states. Active partnerships span tea, GI Lakadong turmeric, Keteki Joha rice, Bhoot Jolokia, Karbi Anglong ginger, Tripura Queen pineapple, Muga silk and a curated pantry range.",
  },
  {
    question: "Is Kopahi an exporter?",
    answer:
      "Yes. We hold an IEC and currently work with B2B and HoReCa partners across 12 countries. Export-grade documentation (FSSAI, COA, GI authorised-user proof) is provided on request via the /b2b portal.",
  },
];

export const MILESTONES = [
  { year: "2023", title: "AIBA Agri NE LLP incorporated" },
  { year: "2024", title: "First farmer onboarded" },
  { year: "2024", title: "First GI partnership" },
  { year: "2025", title: "Processing facility commissioned" },
  { year: "2025", title: "First export shipment" },
  { year: "2026", title: "Seven-state footprint" },
];

export const PEOPLE = [
  {
    name: "Barsha Prakash Choudhury",
    imagePosition: "50% 22%",
    role: "Founder",
    line: "A deep commitment to Northeast India and its people.",
  },
  {
    name: "Ashreeta Gogoi",
    imagePosition: "50% 0%",
    role: "Founder",
    line: "Driven by a belief in fair opportunities and local growth.",
  },
  {
    name: "Trideep Khanikar",
    imagePosition: "50% 45%",
    role: "Director, Operations",
    line: "Focused on quality, traceability and strong producer partnerships.",
  },
  {
    name: "Prakash Natarajan",
    imagePosition: "50% 12%",
    role: "Director, Sales & Marketing",
    line: "Building global markets for Northeast India's unique products.",
  },
].map((p) => {
  const f = FOUNDERS.find((x) => x.name === p.name);
  return { ...p, image: f?.image, bio: f?.bio };
});

