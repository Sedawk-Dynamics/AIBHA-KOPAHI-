import type { StateId } from "./neMapGeometry";

// Kopahi's sourcing network — 13 products across the eight Northeast states
// (client brief, Sep 2026; one-liners follow the "Ingredient Sourcing Network"
// infographic in /public/products/mapsimage.webp).

export type OriginProduct = {
  name: string;
  /** District(s) / belt, when the brief names one. */
  where?: string;
  note: string;
};

export type Origin = {
  id: StateId;
  name: string;
  /** Shorter name for the state buttons, where the full one won't fit. */
  chip?: string;
  /** Italic three-beat line under the state name. */
  tagline: string;
  /** The landscape the produce comes from. */
  region: string;
  image: string;
  imageAlt: string;
  products: OriginProduct[];
};

export const ORIGINS: Origin[] = [
  {
    id: "assam",
    name: "Assam",
    tagline: "River plains. Tea gardens. Heirloom grain.",
    region: "Brahmaputra Valley & Karbi Anglong",
    image: "/products/tea-garden.jpg",
    imageAlt: "Tea pluckers on the terraced gardens of Assam",
    products: [
      { name: "Joha Rice", note: "Aromatic heirloom rice from the fields of Assam." },
      { name: "Assam Tea", where: "Dibrugarh, Jorhat, Rangapara", note: "Fine tea from the gardens of upper Assam." },
      { name: "Organic Honey", where: "Nagaon, Karbi Anglong", note: "Pure, natural forest-edge honey." },
      { name: "Ginger", where: "Karbi Anglong", note: "Aromatic, pungent hill ginger." },
      { name: "Assam Lemon", where: "Tinsukia", note: "Zesty, fragrant Assam lemon." },
      { name: "Litchi", where: "Tezpur", note: "Juicy, sweet Tezpur litchi." },
    ],
  },
  {
    id: "arunachal",
    name: "Arunachal Pradesh",
    chip: "Arunachal",
    tagline: "First light. High orchards. Sun-sweet citrus.",
    region: "Eastern Himalayan foothills",
    image: "/products/thecotton.webp",
    imageAlt: "A bamboo footbridge and a wooden boat on still water at sunrise",
    products: [
      { name: "Orange", note: "Juicy, refreshing oranges from the orchards of Arunachal." },
    ],
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    tagline: "Fertile hills. Rare treasures. Generations of knowledge.",
    region: "West Jaintia Hills",
    image: "/products/lakadong-turmeric.jpg",
    imageAlt: "Freshly dug Lakadong turmeric and its powder",
    products: [
      { name: "Lakadong Turmeric", note: "Home to the world-renowned, high-curcumin Lakadong turmeric." },
    ],
  },
  {
    id: "nagaland",
    name: "Nagaland",
    tagline: "Hill terraces. Fierce heat. Proud tradition.",
    region: "The Naga Hills",
    image: "/products/bhut-jolokia.jpg",
    imageAlt: "A bowl of red Naga king chillies",
    products: [
      { name: "Naga King Chillies", note: "Fiery, flavourful king chillies grown on mountain terraces." },
    ],
  },
  {
    id: "manipur",
    name: "Manipur",
    tagline: "Valley fields. Ancient grain. Deep colour.",
    region: "The Manipur Valley",
    image: "/products/black-rice.jpg",
    imageAlt: "Grains of Manipuri black rice",
    products: [
      { name: "Black Rice", note: "Nutritious heirloom rice, rich in antioxidants." },
    ],
  },
  {
    id: "mizoram",
    name: "Mizoram",
    tagline: "Blue hills. Small chillies. Big fire.",
    region: "The Mizo Hills",
    image: "/products/ghostpepper.jpg",
    imageAlt: "Sun-dried red chillies",
    products: [
      { name: "Bird Eye Chillies", note: "Spicy, aromatic bird eye chillies." },
    ],
  },
  {
    id: "tripura",
    name: "Tripura",
    tagline: "Red soil. Sweet harvest. Queen of fruit.",
    region: "West Tripura",
    image: "/products/gidriedpinaple.jpeg",
    imageAlt: "Kopahi GI Tripura Queen dried pineapple",
    products: [
      { name: "Queen Pineapple", note: "Sweet, juicy Queen pineapple from Tripura." },
    ],
  },
  {
    id: "sikkim",
    name: "Sikkim",
    tagline: "Mountain shade. Smoke-dried pods. Himalayan spice.",
    region: "The Sikkim Himalaya",
    image: "/products/black-cardamom.jpg",
    imageAlt: "Pods of black cardamom",
    products: [
      { name: "Black Cardamom", note: "Aromatic black cardamom from the hills of Sikkim." },
    ],
  },
];

export const PRODUCT_COUNT = ORIGINS.reduce((n, o) => n + o.products.length, 0);
