// Journal "Explore" stories — People · Origins · Processes.
//
// Facts here are drawn from Kopahi's existing Journal essays and farmer
// records (app/lib/journal.ts, app/lib/marketing.ts). Swap in the client's
// own farmer details and portraits as they arrive — `image` is optional on
// farmer stories and a monogram stands in until then.

export type FarmerStory = {
  name: string;
  place: string;
  craft: string;
  /** Years spent growing / making this crop. */
  years: number;
  yearsLabel: string;
  /** The GI connection, when there is one. */
  gi?: string;
  story: string;
  quote: string;
  image?: string;
  essay?: { href: string; title: string };
};

export const FARMER_STORIES: FarmerStory[] = [
  {
    name: "Bireswar Hazarika",
    place: "Diphu cluster, Karbi Anglong · Assam",
    craft: "Keteki Joha rice",
    years: 17,
    yearsLabel: "years in the paddy",
    gi: "Keteki Joha — GI-protected since 2018",
    story:
      "Bireswar still sows by his grandfather's notebook — a record, begun in the drought year of 1983, of where each Keteki strain stood in the family's four acres. Seed is hand-threshed and kept in sealed clay pots, which is why his Joha is still the pure landrace the GI protects while much of the region crossed with high-yield hybrids.",
    quote: "Joha grain remembers everything the soil told it.",
    essay: { href: "/journal/bireswar-and-the-keteki-seedbank", title: "Bireswar and the Keteki seedbank" },
  },
  {
    name: "Khrieliezo Dawhuo",
    place: "Khonoma cluster, Kohima · Nagaland",
    craft: "Bhoot Jolokia — Naga king chilli",
    years: 19,
    yearsLabel: "years growing Bhoot Jolokia",
    gi: "Naga chilli — GI-protected since 2008",
    story:
      "His terraces sit at 1,200 metres above Khonoma. In 2017 he tried flatter, easier land nearer town: the chillies looked the same, but tested at half the heat. He went back uphill — picking at first colour, sun-drying on bamboo racks and stone-milling in small lots, the way his grandmother taught him.",
    quote: "Heat needs a mountain. The mountain has only so much space.",
    essay: { href: "/journal/khrieliezo-and-the-mountain-heat", title: "Khrieliezo, and the heat that needs a mountain" },
  },
  {
    name: "Rina Borah",
    place: "Dibrugarh garden cluster · Assam",
    craft: "First-flush Assam tea",
    years: 19,
    yearsLabel: "seasons as a lead plucker",
    story:
      "Rina leads a team of pluckers through the spring first flush — the short window when the new growth is at its most tender and the cup at its brightest. Her standard is the old one: two leaves and a bud, picked by hand, early in the morning.",
    quote: "Two leaves and a bud. Plucked before the dew lifts.",
    essay: { href: "/journal/first-flush-tasting-window-2026", title: "The Assam first-flush, and the calendar that needs watching" },
  },
  {
    name: "Phulmoni Devi",
    place: "Sualkuchi · Assam",
    craft: "Muga silk weaving",
    years: 31,
    yearsLabel: "years at the loom",
    story:
      "In Sualkuchi, Assam's great weaving village, Phulmoni works Muga — the naturally golden silk that belongs to Assam alone. Three decades at the loom have given her the patience the thread demands.",
    quote: "The eight days are the silk. The thread is what they leave behind.",
  },
];

export type OriginStory = {
  crop: string;
  state: string;
  image: string;
  imageAlt: string;
  /** object-position for the crop */
  imageFocus?: string;
  paragraphs: string[];
  facts: string[];
  essay?: { href: string; title: string };
};

export const ORIGIN_STORIES: OriginStory[] = [
  {
    crop: "Joha Rice",
    state: "Assam",
    image: "/products/judima.jpg",
    imageAlt: "Short-grain rice in terracotta bowls",
    paragraphs: [
      "Keteki Joha is Assam's short-grain aromatic rice — the rice families kept back for weddings and Bihu. It is fussy about water, slow to mature and easily flattened by a strong wind, and it keeps its fragrance only in its home belt.",
      "Its Geographical Indication protects a specific landrace grown in a specific part of Assam. Cross it with a modern high-yield variety and it may still taste good — but it is no longer Keteki.",
    ],
    facts: ["GI-registered 2018", "Aromatic short grain", "Karbi Anglong, Assam"],
    essay: { href: "/journal/khar-with-joha-rice", title: "Khar with Joha — when the rice is the loudest ingredient" },
  },
  {
    crop: "Lakadong Turmeric",
    state: "Meghalaya",
    image: "/products/lakadong-turmeric.jpg",
    imageAlt: "Freshly dug Lakadong turmeric beside a bowl of its powder",
    imageFocus: "object-[center_72%]",
    paragraphs: [
      "In a small valley of the West Jaintia Hills, Lakadong turmeric regularly tests at seven to nine percent curcumin — against two to three for most turmeric in the world's kitchens.",
      "Part of that is the seed: generations of Khasi and Jaintia farmers keeping back the brightest rhizome. The rest is the place — red, iron-rich soil at around 1,000 metres, cool curing nights, and a fourteen-day cure on the plant before harvest.",
    ],
    facts: ["GI-registered 2024", "7–9% curcumin", "West Jaintia Hills"],
    essay: { href: "/journal/lakadong-curcumin-mountain", title: "Lakadong, and the curcumin mountain" },
  },
  {
    crop: "Naga King Chilli",
    state: "Nagaland",
    image: "/products/bhut-jolokia.jpg",
    imageAlt: "A bowl of glossy red Naga king chillies",
    paragraphs: [
      "The Naga king chilli — Bhoot Jolokia — takes its heat from hardship. Cool nights, thin soil and long, unbroken sun on the hill terraces push the plant to make more capsaicin.",
      "At 1,200 metres it can pass a million Scoville units; the very same plant grown in the plains tests at about half. That is why serious growers stay above 800 metres.",
    ],
    facts: ["GI-protected since 2008", "1M+ Scoville units", "Grown above 800 m"],
    essay: { href: "/journal/khrieliezo-and-the-mountain-heat", title: "Khrieliezo, and the heat that needs a mountain" },
  },
];

export type ProcessStep = { title: string; body: string };

export const PROCESS_STORY = {
  title: "From Field to Final Product",
  intro:
    "Every Kopahi product travels the same careful path — from the grower's field, through our facility in Jorhat, to shelves around the world. Nothing is rushed, and nothing loses its name along the way.",
  image: "/products/dist.png",
  imageAlt: "Produce being sorted and packed inside Kopahi's processing shed",
  steps: [
    {
      title: "Harvest",
      body: "Picked at its peak by the growers who know the crop best — at first colour for chillies, before the dew lifts for tea, after the long on-plant cure for Lakadong turmeric.",
    },
    {
      title: "Aggregate",
      body: "At the collection point every lot is weighed and logged against its farmer, village and season, so each pack can be traced back to where it began. Farmers are paid directly.",
    },
    {
      title: "Process",
      body: "In our Jorhat facility the harvest is cleaned, sorted and gently dried; spices are milled in small batches so heat and aroma are not lost.",
    },
    {
      title: "Test & Store",
      body: "Each batch is quality-tested before it moves on, then held in our warehouse in clean, dry, controlled conditions until it is packed.",
    },
    {
      title: "Pack",
      body: "Sealed in export-ready packaging and labelled with its origin, batch and — where it has one — its GI mark.",
    },
    {
      title: "Dispatch",
      body: "Shipped to retail, B2B and export partners with the paperwork to match: FSSAI, certificates of analysis and GI authorised-user proof.",
    },
  ] satisfies ProcessStep[],
};
