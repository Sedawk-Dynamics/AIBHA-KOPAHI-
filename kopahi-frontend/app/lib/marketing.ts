// Shared content layer for the Kopahi marketing site.
// Kept as a typed module so /products/[slug], /farmers, /journal etc. can
// statically generate. Swap for Sanity/Contentful/MDX without changing pages.

export const STATES = [
  "Assam",
  "Meghalaya",
  "Arunachal Pradesh",
  "Nagaland",
  "Manipur",
  "Sikkim",
  "Mizoram",
  "Tripura",
] as const;
export type State = (typeof STATES)[number];

export const CATEGORIES = [
  "Tea",
  "Spices",
  "Rice",
  "Fruit",
  "Vegetable Powder",
  "Herbal Powder",
  "Superfood",
  "Specialty",
] as const;
export type Category = (typeof CATEGORIES)[number];

export type ProductVariant = {
  name: string;
  sku: string;
  price: number;
  stock: number;
};

export type ProductNutrition = {
  energy?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  fibre?: string;
  iron?: string;
  vitaminA?: string;
};

export type Product = {
  slug: string;
  name: string;
  origin: string;            // "Karbi Anglong, Assam"
  state: State;
  district?: string;
  village?: string;
  category: Category;
  subcategory?: string;
  gi: boolean;
  giYear?: number;
  giIdentifier?: string;
  image: string;
  shortDesc: string;
  longDesc?: string;
  story: string;
  notes: string[];           // Tasting / Use notes (renders as "Tasting · Use notes")
  tags?: string[];
  farmerSlug?: string;
  farmerName?: string;
  sourcingMethod?: "Direct" | "Cooperative" | "Aggregated";
  mrp?: number;
  sellingPrice?: number;
  stock?: number;
  unit?: "kg" | "g" | "pack" | "piece" | "ml";
  netWeight?: string;        // Human-readable, e.g. "200 g" or "1 kg"
  sku?: string;
  hsnCode?: string;
  gstRate?: number;
  variants?: ProductVariant[];
  nutritionPer100g?: ProductNutrition;
  warningLabel?: string;
  imagePending?: boolean;
};

export type Farmer = {
  slug: string;
  name: string;
  village: string;
  state: State;
  crop: string;
  years: number;
  quote: string;
  image?: string;
};

export const FARMERS: Farmer[] = [
  {
    slug: "bireswar-hazarika",
    name: "Bireswar Hazarika",
    village: "Diphu cluster, Karbi Anglong",
    state: "Assam",
    crop: "Keteki Joha rice",
    years: 17,
    quote: "Joha grain remembers everything the soil told it.",
    image: "/products/black-rice.jpg",
  },
  {
    slug: "pohor-phukan",
    name: "Pohor Phukan",
    village: "Diphu cluster, Karbi Anglong",
    state: "Assam",
    crop: "Ginger (cooperative lead, 38 growers)",
    years: 14,
    quote: "We ship the day it's pulled from the soil. Anything longer, and the oil is gone.",
    image: "/products/gigingerpowder.jpeg",
  },
  {
    slug: "khrieliezo-dawhuo",
    name: "Khrieliezo Dawhuo",
    village: "Khonoma cluster, Kohima",
    state: "Nagaland",
    crop: "Bhoot Jolokia (Naga Chilli)",
    years: 11,
    quote: "Open the pack with the windows open. The chilli announces itself.",
    image: "/products/bhut-jolokia.jpg",
  },
  {
    slug: "tonkho-marak",
    name: "Tonkho Marak",
    village: "Nalkata cluster, West Tripura",
    state: "Tripura",
    crop: "Queen pineapple",
    years: 9,
    quote: "We slice them within hours. The sun finishes what the soil began.",
    image: "/products/gidriedpinaple.jpeg",
  },
  {
    slug: "rina-borah",
    name: "Rina Borah",
    village: "Dibrugarh garden cluster",
    state: "Assam",
    crop: "First-flush Assam tea (lead plucker)",
    years: 19,
    quote: "Two leaves and a bud. Plucked before the dew lifts.",
    image: "/products/tea-garden.jpg",
  },
  {
    slug: "lakadong-cooperative",
    name: "Lakadong Cooperative",
    village: "Lakadong, West Jaintia Hills",
    state: "Meghalaya",
    crop: "Lakadong turmeric (cooperative)",
    years: 8,
    quote: "Three weeks of curing. The hills know how long.",
    image: "/products/gi-turmeric-powder.jpeg",
  },
];

// ============================================================
// THE CATALOGUE — 14 SKUs
// ============================================================
// Image paths point to /public/products/<slug>.jpg. Drop the
// uploaded image files there to make every product render.
// Until then, Next.js will show a broken image placeholder for
// missing files, which is preferable to wrong photography.

export const PRODUCTS: Product[] = [
  // ============ 5 GI-TAGGED ============
  {
    slug: "gi-keteki-joha-rice",
    name: "GI Keteki Joha Rice",
    origin: "Karbi Anglong, Assam",
    state: "Assam",
    district: "Karbi Anglong",
    village: "Diphu cluster",
    category: "Rice",
    subcategory: "Indigenous Aromatic",
    gi: true,
    giYear: 2018,
    giIdentifier: "GI-661",
    image: "/products/gi-keteki-joha-rice.jpeg",
    shortDesc:
      "A short-grain aromatic rice from the fertile valleys of Assam — fragrant, soft, and protected by GI tag.",
    longDesc:
      "Grown in the fertile valleys of Assam, GI-tagged Keteki Joha Rice is a traditional short-grain aromatic rice, cherished for its delicate fragrance, soft texture and rich heritage. A true reflection of Assam's agricultural legacy.",
    story:
      "Keteki Joha grows where the Brahmaputra still floods on its own schedule. The grain is small — almost shy — but its perfume can carry across a courtyard. Our partner growers in Karbi Anglong tend it the old way: no hybrids, no pesticides, only patience and the seed-bank notes passed down through their grandfathers. The GI tag, awarded in 2018, is the legal seal on what villages here have always known. Eat it with kheer at a wedding, with pithas at Bihu, or simply with a curl of mustard oil and a green chilli — it remembers everything the soil told it.",
    notes: ["Pulao & Biryani", "Khichdi & Comfort Food", "Traditional Assamese Dishes", "Daily Meals"],
    tags: ["GI-Tagged", "Assam", "Aromatic", "Indigenous", "Heritage"],
    farmerSlug: "bireswar-hazarika",
    farmerName: "Bireswar Hazarika",
    sourcingMethod: "Direct",
    mrp: 849,
    sellingPrice: 699,
    stock: 80,
    unit: "kg",
    netWeight: "1 kg",
    sku: "KOP-RICE-JOHA-1KG",
    hsnCode: "1006",
    gstRate: 5,
  },
  {
    slug: "gi-lakadong-turmeric-powder",
    name: "GI Lakadong Turmeric Powder",
    origin: "Lakadong, Meghalaya",
    state: "Meghalaya",
    district: "West Jaintia Hills",
    village: "Lakadong",
    category: "Spices",
    subcategory: "Turmeric",
    gi: true,
    giYear: 2024,
    giIdentifier: "GI-789",
    image: "/products/gi-turmeric-powder.jpeg",
    shortDesc:
      "7–9% curcumin — among the highest in the world. Earthy, deeply golden, irreplaceable in any modern kitchen.",
    longDesc:
      "Sourced from the highlands of Meghalaya, GI-certified Lakadong Turmeric is prized for its exceptionally high curcumin content and vibrant natural colour. Carefully sun-dried and finely ground, it delivers purity, potency and authentic origin in every spoon.",
    story:
      "Lakadong is a small valley in Meghalaya's Jaintia Hills. Its turmeric is what the rest of the world reaches for when it talks about \"real\" turmeric. Curcumin content here runs 7–9% — more than three times the global average — because the soil, altitude, and the patient three-week post-harvest curing all conspire in its favour. The GI tag came in 2024, but Khasi and Jaintia growers have been protecting this strain for centuries. Add a quarter-teaspoon to warm milk, and the kitchen will smell of mountains.",
    notes: ["Cooking & Curries", "Golden Milk & Beverages", "Wellness Recipes", "Herbal Blends"],
    tags: ["GI-Tagged", "Meghalaya", "High Curcumin", "Sun-Dried", "Heritage"],
    farmerSlug: "lakadong-cooperative",
    sourcingMethod: "Cooperative",
    mrp: 449,
    sellingPrice: 349,
    stock: 120,
    unit: "g",
    netWeight: "200 g",
    sku: "KOP-SPC-TURM-200G",
    hsnCode: "0910",
    gstRate: 5,
  },
  {
    slug: "gi-naga-chilli-bhoot-jolokia-powder",
    name: "GI Naga Chilli (Bhoot Jolokia) Powder",
    origin: "Kohima, Nagaland",
    state: "Nagaland",
    district: "Kohima",
    village: "Khonoma cluster",
    category: "Spices",
    subcategory: "Chilli",
    gi: true,
    giYear: 2008,
    giIdentifier: "GI-110",
    image: "/products/bhootjholokiajam.jpeg",
    shortDesc:
      "One of the world's hottest chillies — deep smoky heat that builds before it bites. Use sparingly; respect always.",
    longDesc:
      "Sourced from the hills of Northeast India, this GI-certified Naga Chilli (Bhoot Jolokia) is one of the world's hottest chillies. Carefully sun-dried and finely ground, it delivers intense heat, deep flavour and authentic origin purity.",
    story:
      "Bhoot Jolokia translates to \"ghost chilli\" — and the name is a warning. At over one million Scoville units, a single pod can perfume an entire dish. Our partner farmer Khrieliezo Dawhuo grows it on terraced plots above 1,200 metres outside Kohima. He pickles, smokes, and sun-dries each batch the way his grandmother taught him. Open the pack with the windows open. A pinch is plenty. The first hit is smoky, almost sweet. Then it arrives.",
    notes: ["Curries & Gravies", "Marinades & Rubs", "Sauces & Dips", "Spice Blends"],
    tags: ["GI-Tagged", "Nagaland", "Extreme Heat", "Sun-Dried", "Heritage"],
    warningLabel: "HEAT LEVEL: EXTREME · Handle with care.",
    farmerSlug: "khrieliezo-dawhuo",
    farmerName: "Khrieliezo Dawhuo",
    sourcingMethod: "Direct",
    mrp: 499,
    sellingPrice: 399,
    stock: 60,
    unit: "g",
    netWeight: "200 g",
    sku: "KOP-SPC-BHUT-200G",
    hsnCode: "0904",
    gstRate: 5,
  },
  {
    slug: "gi-karbi-anglong-ginger-powder",
    name: "GI Karbi Anglong Ginger Powder",
    origin: "Karbi Anglong, Assam",
    state: "Assam",
    district: "Karbi Anglong",
    village: "Diphu cluster",
    category: "Spices",
    subcategory: "Ginger",
    gi: true,
    giYear: 2013,
    giIdentifier: "GI-401",
    image: "/products/gigingerpowder.jpeg",
    shortDesc:
      "High-pungency, low-fibre ginger from the hills of Karbi Anglong. Powerful in marinades, gentle in tea.",
    longDesc:
      "Sourced from the pristine hills of Karbi Anglong, this GI-certified ginger is renowned for its intense aroma and high essential oil content. Carefully sun-dried and finely milled, it preserves the natural strength, warmth and purity of its origin.",
    story:
      "Karbi Anglong ginger has the kind of pungency that announces itself before the pod hits the pan. The rhizomes are smaller, the fibre count lower, and the essential oil content noticeably higher than commercial varieties — because the Karbi Hills are still cool enough, wet enough, and steep enough to keep the plant working harder than it would elsewhere. Our cooperative lead Pohor Phukan coordinates 38 growers across the hills and ensures every kilo ships the day it's pulled from the soil.",
    notes: ["Herbal Teas", "Cooking & Seasoning", "Wellness Beverages", "Ayurvedic Preparations"],
    tags: ["GI-Tagged", "Assam", "Single Origin", "Sun-Dried", "Heritage"],
    farmerSlug: "pohor-phukan",
    farmerName: "Pohor Phukan (Cooperative Lead)",
    sourcingMethod: "Cooperative",
    mrp: 449,
    sellingPrice: 349,
    stock: 100,
    unit: "g",
    netWeight: "200 g",
    sku: "KOP-SPC-GING-200G",
    hsnCode: "0910",
    gstRate: 5,
  },
  {
    slug: "gi-tripura-queen-dried-pineapple",
    name: "GI Tripura Queen Dried Pineapple",
    origin: "Nalkata, West Tripura",
    state: "Tripura",
    district: "West Tripura",
    village: "Nalkata cluster",
    category: "Fruit",
    subcategory: "Dried Fruit",
    gi: true,
    giYear: 2015,
    giIdentifier: "GI-505",
    image: "/products/gidriedpinaple.jpeg",
    shortDesc:
      "Sweet, low-acid, fragrant. The Queen of pineapples — now exported across Asia and the EU.",
    longDesc:
      "Sourced from the lush plantations of Tripura, the GI-certified Queen Pineapple is celebrated for its natural sweetness and rich aroma. Carefully sliced and gently dried, it preserves its vibrant flavour and nutritional goodness.",
    story:
      "The Queen variety is grown almost nowhere else on earth. Tripura's terraced hillsides give it the heat and the drainage it loves; the result is a pineapple that's low in acid, high in fragrance, and sweet enough that no sugar needs to be added at any stage of drying. Our farmer Tonkho Marak slices them within hours of harvest and dries them gently — no preservatives, no sulphur. Eat them straight from the pack, or stir them into yoghurt; they soften beautifully overnight in cereal.",
    notes: ["Healthy Snack", "Cereals & Granola", "Desserts & Baking", "Gourmet Platters"],
    tags: ["GI-Tagged", "Tripura", "Naturally Sweet", "No Added Sugar", "Vegan"],
    farmerSlug: "tonkho-marak",
    farmerName: "Tonkho Marak",
    sourcingMethod: "Direct",
    mrp: 349,
    sellingPrice: 249,
    stock: 90,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-FRT-PINE-100G",
    hsnCode: "0813",
    gstRate: 12,
  },

  // ============ 9 NON-GI ============
  {
    slug: "kopahi-tea-range",
    name: "Kopahi Tea — Heritage Range",
    origin: "Dibrugarh, Assam",
    state: "Assam",
    district: "Dibrugarh",
    village: "Multiple estate partners",
    category: "Tea",
    subcategory: "Multi-format",
    gi: false,
    image: "/products/kopahitea.jpeg",
    shortDesc:
      "Bold, malty Assam tea sourced from the finest gardens along the Brahmaputra. Four formats, one estate.",
    longDesc:
      "Our heritage tea range is sourced from estate gardens along the Brahmaputra valley. From whole-leaf loose-leaf to convenient dip-bags, every format honours the same simple promise: two leaves and a bud, plucked before the dew lifts.",
    story:
      "Assam tea is the morning ritual of a continent — and ours comes from estates that have been working the same bushes for four generations. Rina Borah, our longest-tenured plucker partner, has worked the same Dibrugarh-side garden for nineteen years. The range exists because not every cup is the same: Assam Gold is the showpiece whole-leaf, Classic Leaf the everyday companion, Green Reserve the gentler partner, and Classic Dip for the busy mornings that still deserve a real cup.",
    notes: ["Breakfast Cup", "Afternoon Tea", "Iced Tea", "Chai"],
    tags: ["Assam", "Heritage", "Single Estate"],
    farmerSlug: "rina-borah",
    farmerName: "Rina Borah (Lead Plucker, Dibrugarh)",
    sourcingMethod: "Direct",
    mrp: 599,
    sellingPrice: 499,
    stock: 150,
    unit: "pack",
    netWeight: "Varies — see formats",
    sku: "KOP-TEA-RANGE",
    hsnCode: "0902",
    gstRate: 5,
    variants: [
      { name: "Assam Gold · Loose Leaf 100g", sku: "KOP-TEA-GOLD-100G", price: 599, stock: 40 },
      { name: "Classic Leaf · Loose Leaf 75g", sku: "KOP-TEA-CLAS-75G", price: 449, stock: 50 },
      { name: "Green Reserve · Loose Leaf 50g", sku: "KOP-TEA-GRN-50G", price: 499, stock: 30 },
      { name: "Classic Dip · 25 Tea Bags", sku: "KOP-TEA-DIP-25", price: 329, stock: 30 },
    ],
  },
  {
    slug: "kopahi-tomato-powder",
    name: "Tomato Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Vegetable Powder",
    subcategory: "Fruit-Vegetable",
    gi: false,
    image: "/products/tomatopowder.jpeg",
    shortDesc:
      "Made from ripe, hand-picked tomatoes — sun-dried and finely ground to keep flavour, colour and goodness intact.",
    longDesc:
      "Made from ripe, handpicked tomatoes, carefully sun-dried and finely ground to retain their natural flavour, colour and goodness. A perfect way to add the rich taste of tomatoes to your everyday meals.",
    story:
      "A pantry secret of the Northeast kitchen — concentrated, intense, and instantly transformative. A tablespoon adds the depth of an hour of slow-simmered tomatoes to any dish: stews, marinades, soups, rasams. No preservatives, no additives, no anti-caking agents. Just sun and patience.",
    notes: ["Curries & Gravies", "Soups & Stews", "Marinades", "Pasta Sauces"],
    tags: ["Sun-Dried", "No Additives", "Rich in Lycopene", "Versatile"],
    sourcingMethod: "Aggregated",
    mrp: 299,
    sellingPrice: 229,
    stock: 200,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-VEG-TOMA-100G",
    hsnCode: "0712",
    gstRate: 5,
    nutritionPer100g: { energy: "351 kcal", protein: "14.1g", carbs: "71.2g", fat: "1.2g", fibre: "17.4g" },
  },
  {
    slug: "kopahi-moringa-powder",
    name: "Moringa Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Superfood",
    subcategory: "Leaf Powder",
    gi: false,
    image: "/products/moringapowder.jpeg",
    shortDesc:
      "A daily superfood from carefully selected moringa leaves — gently sun-dried, finely ground.",
    longDesc:
      "Made from carefully selected moringa leaves, gently sun-dried and finely ground to retain the highest nutrition, natural colour and goodness. A perfect daily superfood for a healthy you.",
    story:
      "Known locally as the \"miracle tree\", moringa thrives in Northeast India's warm corners and yields leaves packed with protein, iron and antioxidants. We dry ours below 45°C to preserve the chlorophyll and the bioactives — the powder that results is the deep, alive green of fresh-cut leaves, not the hay-yellow of over-processed commodity grade. Stir a teaspoon into water, juice, soup, or chapati dough.",
    notes: ["Smoothies & Juices", "Soups & Daals", "Chapati Dough", "Wellness Drinks"],
    tags: ["Superfood", "Sun-Dried", "Rich in Nutrients", "Boosts Wellness"],
    sourcingMethod: "Aggregated",
    mrp: 449,
    sellingPrice: 349,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-SUP-MORI-100G",
    hsnCode: "1404",
    gstRate: 5,
    nutritionPer100g: { energy: "298 kcal", protein: "27.1g", carbs: "38.2g", fat: "2.3g", fibre: "19.2g" },
  },
  {
    slug: "kopahi-beetroot-powder",
    name: "Beetroot Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Vegetable Powder",
    subcategory: "Root",
    gi: false,
    image: "/products/beetrootpowder.jpeg",
    shortDesc:
      "Carefully selected beetroot — gently sun-dried for natural colour, nutrients and goodness.",
    longDesc:
      "Made from carefully selected beetroot, gently sun-dried and finely ground to retain its natural colour, nutrients and goodness. A perfect way to add natural nutrition and vibrant colour to your everyday meals.",
    story:
      "Add a spoon to a smoothie and the glass turns the colour of a Northeast sunset. Beetroot is one of those vegetables that gives up its goodness more easily as a powder than as a raw root — easier to dose, easier to store, faster to dissolve. We dry at low temperature to preserve the deep iron content and the natural betalain pigments that give the powder its colour.",
    notes: ["Smoothies", "Soups & Hummus", "Baking", "Natural Food Colour"],
    tags: ["Sun-Dried", "Rich in Antioxidants", "Natural Colour", "Iron-Rich"],
    sourcingMethod: "Aggregated",
    mrp: 399,
    sellingPrice: 299,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-VEG-BEET-100G",
    hsnCode: "0712",
    gstRate: 5,
    nutritionPer100g: { energy: "308 kcal", protein: "11.8g", carbs: "69.0g", fat: "1.2g", fibre: "18.2g", iron: "7.6mg" },
  },
  {
    slug: "kopahi-carrot-powder",
    name: "Carrot Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Vegetable Powder",
    subcategory: "Root",
    gi: false,
    image: "/products/carrotpowder.jpeg",
    shortDesc:
      "Fresh, hand-picked carrots — sun-dried and finely ground for vibrant colour and nutrition.",
    longDesc:
      "Made from fresh, handpicked carrots, carefully sun-dried and finely ground to retain their natural colour, nutrients and goodness. A perfect way to add vibrant colour and nutrition to your everyday meals.",
    story:
      "A quiet kitchen workhorse. The vitamin A in a teaspoon of this powder is roughly what you'd get from a whole large carrot — useful for soups, baby foods, breads and any dish that wants a flash of colour and a touch of sweetness without the chopping. Our carrots are sourced from cooler-month cooperatives in the Brahmaputra valley.",
    notes: ["Soups & Stews", "Baby Food", "Baking & Cakes", "Smoothies"],
    tags: ["Sun-Dried", "Rich in Vitamin A", "Natural Colour", "Versatile"],
    sourcingMethod: "Aggregated",
    mrp: 349,
    sellingPrice: 269,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-VEG-CARR-100G",
    hsnCode: "0712",
    gstRate: 5,
    nutritionPer100g: { energy: "356 kcal", protein: "7.7g", carbs: "82.3g", fat: "1.7g", fibre: "13.6g", vitaminA: "16,760 μg" },
  },
  {
    slug: "kopahi-onion-powder",
    name: "Onion Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Spices",
    subcategory: "Aromatic",
    gi: false,
    image: "/products/KOPAHIONIONPOWDER.jpeg",
    shortDesc:
      "Sun-dried red onion ground fine — for the depth of slow-cooked onion without the chopping.",
    longDesc:
      "Made from carefully selected red onions, gently sun-dried and finely ground to retain their natural flavour and aroma. A pantry essential for adding savoury depth to any dish.",
    story:
      "The trick to a great Indian gravy is well-cooked onions. The trick to a great onion powder is sun, time, and not over-processing. Ours is single-ingredient — no anti-caking agents, no fillers — and it carries the natural sweetness of the red onions it came from. Use it in dry rubs, in salad dressings, in soups that don't need fresh onion's wetness.",
    notes: ["Curries & Gravies", "Dry Rubs", "Soups & Stews", "Salad Dressings"],
    tags: ["Sun-Dried", "No Additives", "Rich in Flavour", "Versatile"],
    sourcingMethod: "Aggregated",
    mrp: 329,
    sellingPrice: 249,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-SPC-ONIO-100G",
    hsnCode: "0712",
    gstRate: 5,
  },
  {
    slug: "kopahi-curry-leaf-powder",
    name: "Curry Leaf Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Herbal Powder",
    subcategory: "Leaf",
    gi: false,
    image: "/products/KOPAHICURRYLEAFPOWDER.jpeg",
    shortDesc:
      "Carefully selected curry leaves — cleaned, sun-dried and ground for natural aroma and goodness.",
    longDesc:
      "Made from carefully selected curry leaves, cleaned, sun-dried and finely ground to retain their natural aroma, colour and goodness. A perfect way to add flavour and nutrition to your everyday meals.",
    story:
      "A daily kitchen herb across India — and one of the most underrated. We dry whole leaves in the shade to keep the deep green and the volatile oils intact, then mill cold so the powder still smells of the tree. Stir into tempering oils, sprinkle on rasams and chutneys, or mix into hair-oil blends the way grandmothers always have.",
    notes: ["Tempering Oils", "Rasams & Sambars", "Chutneys", "Hair-Oil Blends"],
    tags: ["Sun-Dried", "Rich in Nutrients", "Aroma-Rich", "Traditional"],
    sourcingMethod: "Aggregated",
    mrp: 299,
    sellingPrice: 229,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-HRB-CURR-100G",
    hsnCode: "1211",
    gstRate: 5,
    nutritionPer100g: { energy: "298 kcal", protein: "6.9g", carbs: "49.0g", fat: "7.2g", fibre: "18.0g" },
  },
  {
    slug: "kopahi-mint-powder",
    name: "Mint Powder",
    origin: "Assam",
    state: "Assam",
    district: "Multiple districts",
    category: "Herbal Powder",
    subcategory: "Leaf",
    gi: false,
    image: "/products/KOPAHIMINTPOWDER.jpeg",
    shortDesc:
      "Fresh mint leaves — gently sun-dried for refreshing aroma and natural goodness.",
    longDesc:
      "Made from carefully selected fresh mint leaves, gently sun-dried and finely ground to retain their natural aroma, flavour, nutrients and goodness. A perfect daily superfood for a refreshing you.",
    story:
      "Mint is one of the few herbs that powders well without losing its soul. Ours is shade-dried slowly so the menthol-rich oils don't evaporate, then milled fine enough to dissolve into raitas, chutneys, and summer drinks. A pinch transforms a glass of buttermilk. A tablespoon transforms a chicken marinade.",
    notes: ["Raitas & Chutneys", "Summer Drinks", "Marinades", "Herbal Teas"],
    tags: ["Sun-Dried", "Rich in Nutrients", "Naturally Refreshing", "Aromatic"],
    sourcingMethod: "Aggregated",
    mrp: 349,
    sellingPrice: 279,
    stock: 150,
    unit: "g",
    netWeight: "100 g",
    sku: "KOP-HRB-MINT-100G",
    hsnCode: "1211",
    gstRate: 5,
    nutritionPer100g: { energy: "312 kcal", protein: "19.6g", carbs: "53.1g", fat: "5.1g", fibre: "28.0g" },
  },
  {
    slug: "kopahi-bhoot-jolokia-jam",
    name: "Bhoot Jolokia Jam",
    origin: "Jorhat, Assam · chillies from Kohima",
    state: "Assam",
    district: "Jorhat",
    category: "Specialty",
    subcategory: "Preserves",
    gi: false,
    image: "/products/bhootjholokiajam.jpeg",
    shortDesc:
      "A slow-cooked preserve made with GI Naga Chilli — smoky, sweet, with a heat that lingers.",
    longDesc:
      "Our small-batch preserve marries the GI-tagged Bhoot Jolokia with cane sugar and a whisper of vinegar. The result is a jam that swings between sweet and ferocious — a finishing condiment for cheese boards, grilled meats, and anyone who likes their breakfast toast to wake them up.",
    story:
      "A house experiment that escaped the kitchen. We started making this for our own toast and ended up making batches for friends, then friends-of-friends, then the website. The chilli comes from the same GI-certified Naga Chilli supply as our powder — Khrieliezo Dawhuo's terraces above Kohima. Every jar carries his name on the back.",
    notes: ["Cheese Boards", "Grilled Meats", "Toast & Crackers", "Glazes"],
    tags: ["Specialty", "Small Batch", "Made with GI Bhoot Jolokia", "Limited Stock"],
    warningLabel: "Made with one of the world's hottest chillies. A little goes a long way.",
    farmerSlug: "khrieliezo-dawhuo",
    farmerName: "Khrieliezo Dawhuo (chilli source)",
    sourcingMethod: "Direct",
    mrp: 599,
    sellingPrice: 449,
    stock: 40,
    unit: "g",
    netWeight: "200 g",
    sku: "KOP-SPL-BJJM-200G",
    hsnCode: "2007",
    gstRate: 12,
    nutritionPer100g: { energy: "240 kcal", protein: "0.6g", carbs: "58.0g", fat: "0.2g", fibre: "0.9g" },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFarmerBySlug(slug: string): Farmer | undefined {
  return FARMERS.find((f) => f.slug === slug);
}

export const FEATURED_HOMEPAGE_SLUGS = [
  "gi-lakadong-turmeric-powder",
  "gi-keteki-joha-rice",
  "gi-naga-chilli-bhoot-jolokia-powder",
  "kopahi-tea-range",
  "gi-tripura-queen-dried-pineapple",
  "kopahi-moringa-powder",
] as const;

export function getFeaturedHomepageProducts(): Product[] {
  return FEATURED_HOMEPAGE_SLUGS
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
}

// =============================================================
// Journal posts (kept inline; ready to swap for MDX later)
// =============================================================
export type JournalPost = {
  slug: string;
  title: string;
  category: "Heritage Stories" | "Farmer Profiles" | "Recipes" | "Export Insights";
  excerpt: string;
  image: string;
  author: string;
  date: string;
};

export const JOURNAL: JournalPost[] = [
  {
    slug: "the-quiet-economy-of-muga",
    title: "The quiet economy of Muga",
    category: "Heritage Stories",
    excerpt:
      "Why the only silk that brightens with age is also the most patient supply chain in India.",
    image: "/products/muga-silk-stole.jpg",
    author: "Barsha Saikia",
    date: "2026-03-12",
  },
  {
    slug: "anjali-of-mon",
    title: "Anjali of Mon",
    category: "Farmer Profiles",
    excerpt:
      "A morning on a Konyak chilli terrace, and a quiet argument for slow heat.",
    image: "/products/bhut-jolokia.jpg",
    author: "Ashreeta Borah",
    date: "2026-02-04",
  },
  {
    slug: "khar-with-joha",
    title: "Khar with Joha",
    category: "Recipes",
    excerpt:
      "The Assamese plate that uses the rice as the loudest ingredient. A recipe from Naharani.",
    image: "/products/black-rice.jpg",
    author: "Kopahi Kitchens",
    date: "2026-01-18",
  },
  {
    slug: "what-gi-actually-protects",
    title: "What a GI tag actually protects",
    category: "Export Insights",
    excerpt:
      "A working note for buyers and partners — what the certification means, and what it doesn't.",
    image: "/products/lakadong-turmeric.jpg",
    author: "Trideep Mahanta",
    date: "2026-04-22",
  },
  {
    slug: "judima-and-the-thembra-herb",
    title: "Judima and the thembra herb",
    category: "Heritage Stories",
    excerpt:
      "How an unassuming jungle herb anchors one of India's only GI-tagged rice wines.",
    image: "/products/judima.jpg",
    author: "Kopahi Editors",
    date: "2026-04-02",
  },
  {
    slug: "the-tasting-window",
    title: "The first-flush tasting window",
    category: "Heritage Stories",
    excerpt:
      "Why the Assam first flush has gone from a March affair to a calendar that needs watching.",
    image: "/products/assam-tea.jpg",
    author: "Bipul Hazarika",
    date: "2026-03-30",
  },
];

export const FOUNDERS = [
  {
    name: "Barsha Prakash Choudhury",
    role: "Founder",
    email: "mgmt@kopahi.com",
    phone: "+91 97406 72727",
    quote:
      "Heritage isn't a marketing word. It's a contract with the people who grew this knowledge before us.",
    bio: "Barsha leads brand and partnerships, drawing on a decade in regional sourcing and consumer storytelling. Her aim: make Northeast craftsmanship legible globally — without flattening it.",
    anecdote:
      "Grew up three streets from a Jorhat tea garden she still visits on weekends.",
  },
  {
    name: "Ashreeta Gogoi",
    role: "Founder",
    email: "mgmt@kopahi.com",
    phone: "+91 98540 75705",
    quote: "Every leaf has a name. Every name has a face.",
    bio: "Ashreeta works on the ground with grower cooperatives across Assam, Meghalaya and Nagaland. She designs the farmer-first protocols that keep Kopahi traceable end-to-end.",
    anecdote:
      "Carries two notebooks — one for harvest data, one for the names of every village child she meets.",
  },
  {
    name: "Trideep Khanikar",
    role: "Director · Operations",
    email: "trideep@kopahi.com",
    phone: "+91 93654 72113",
    quote: "Quality is not what we promise on a label — it's what we refuse to ship.",
    bio: "Trideep runs processing, logistics and export readiness. His obsession with the unglamorous middle of the value chain is what lets Kopahi stand behind every shipment.",
    anecdote:
      "Will, given any provocation, explain the difference between FSSAI compliance and FSSAI excellence.",
  },
  {
    name: "Prakash Natarajan",
    role: "Director · Sales & Marketing",
    email: "prakash@kopahi.com",
    phone: "+91 99019 72727",
    quote: "We are not here to sell more. We are here to sell better.",
    bio: "Prakash leads B2B and international markets. He chooses partners the way a tea-taster chooses a flush — slowly, carefully, with a long memory.",
    anecdote:
      "Keeps a tin of first-flush in his desk drawer; refuses to brew it during meetings he wants to keep short.",
  },
];

export const TIMELINE = [
  {
    year: "2023",
    title: "AIBA Agri NE LLP incorporated",
    body: "Founded in Jorhat with a four-person team and a single mandate: protect the geography, pay the people, tell the truth on the label.",
  },
  {
    year: "2024",
    title: "First farmer onboarded",
    body: "Bireswar Hazarika of Karbi Anglong signs on for Keteki Joha — a relationship that becomes the template for every farmer agreement that follows.",
  },
  {
    year: "2024",
    title: "First GI partnership",
    body: "A formal sourcing partnership with the Lakadong Turmeric Cooperative makes Kopahi a verified supply chain for one of Northeast India's most prized GI rhizomes.",
  },
  {
    year: "2025",
    title: "Processing facility commissioned",
    body: "A small, modern processing line in Jorhat brings sorting, drying, packaging and quality testing in-house.",
  },
  {
    year: "2025",
    title: "First export shipment",
    body: "A consignment of Lakadong turmeric and Queen pineapple leaves for a curated retailer in Tokyo — Kopahi's first shipment beyond Indian shores.",
  },
  {
    year: "2026",
    title: "Seven-state footprint",
    body: "Kopahi's farmer network completes its planned footprint — at least one verified cooperative in every Northeast state.",
  },
];
