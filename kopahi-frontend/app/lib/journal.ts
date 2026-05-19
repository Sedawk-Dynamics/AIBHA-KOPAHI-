// =============================================================
// Kopahi Journal — typed essay content
// 9 essays, all status: PUBLISHED. Bodies are typed block arrays
// so inline farmer / product cards can render as components, not
// as raw markdown markers.
// =============================================================

export const JOURNAL_CATEGORIES = [
  "Heritage Stories",
  "Farmer Profiles",
  "Recipes",
  "Export Insights",
] as const;
export type JournalCategory = (typeof JOURNAL_CATEGORIES)[number];

/**
 * A single block of essay content. Rendered by the detail page.
 * - paragraph        — body prose
 * - divider          — the editorial "—" separator
 * - farmerInset      — small inset card referencing a farmer
 * - productInset     — small inset card referencing a product (with optional fallback for products not yet in the catalogue)
 * - authorNote       — italic byline at the foot of the essay
 */
export type EssayBlock =
  | { type: "paragraph"; text: string }
  | { type: "divider" }
  | { type: "farmerInset"; slug: string }
  | { type: "productInset"; slug: string; note?: string }
  | { type: "authorNote"; text: string };

export type JournalEssay = {
  slug: string;
  title: string;
  /** Word/phrase from the title rendered italic-muga in display headlines */
  titleAccent: string;
  dek: string;
  category: JournalCategory;
  author: string;
  authorRole: string;
  publishedAt: string;
  coverImage: string;
  readingMinutes: number;
  isFeatured?: boolean;
  inlineFarmerSlugs?: string[];
  inlineProductSlugs?: string[];
  body: EssayBlock[];
};

// =============================================================
// THE NINE ESSAYS
// =============================================================
export const JOURNAL: JournalEssay[] = [
  // -------------------------------------------------------------
  // 1 · Farmer Profiles — Bireswar & the Keteki seedbank
  // -------------------------------------------------------------
  {
    slug: "bireswar-and-the-keteki-seedbank",
    title: "Bireswar and the Keteki seedbank",
    titleAccent: "Keteki seedbank",
    dek: "In a four-acre paddy at Karbi Anglong, a farmer's grandfather's notebook has quietly preserved a landrace the wider seed market had let cross away.",
    category: "Farmer Profiles",
    author: "Ashreeta Gogoi",
    authorRole: "Founder · Field & Cooperatives",
    publishedAt: "2026-02-28",
    coverImage: "/products/ketekirice.webp",
    readingMinutes: 5,
    inlineFarmerSlugs: ["bireswar-hazarika"],
    inlineProductSlugs: ["gi-keteki-joha-rice"],
    body: [
      {
        type: "paragraph",
        text: "The notebook is bound with a rubber band that was never meant to last forty years. Its pages are foxed, its hand is small, and on the inside cover, in faded ink, are five words in Assamese: the year the rains failed.",
      },
      {
        type: "paragraph",
        text: "The hand is Bireswar Hazarika's grandfather's. The year was 1983. The rains failed across most of upper Assam, and the aush crop — the early monsoon rice that most paddy households here depend on — did not stand. What did stand, in the four acres of low-lying paddy outside the village of Hatiborhola, was a small reserved patch of Keteki Joha, the aromatic short-grain that the family had always kept for weddings and Bihu.",
      },
      {
        type: "paragraph",
        text: "Joha is not a high-yielder. It is fussy about water, slow to mature, and easily lodged in a strong wind. But it is also, the grandfather noted in the small precise hand, the rice that did not die.",
      },
      {
        type: "paragraph",
        text: "He wrote down the dates of sowing, the depths of standing water in his paddy that summer, the day-on-day temperatures from the only thermometer in the village, and most usefully of all, the exact location in the four acres where each Keteki strain had been sown. Forty-three years later, his grandson Bireswar still uses the notebook to decide where to sow.",
      },
      { type: "farmerInset", slug: "bireswar-hazarika" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "When we first met Bireswar in 2024, we were looking for a Keteki Joha supplier who had not crossed his strain with the higher-yielding modern Joha varieties that the state seed corporation had been pushing for two decades. The high-yielders look identical to the eye. They taste similar in the pot. But they are not, by the definition that the Geographical Indication uses, the same rice. The GI for Keteki Joha — granted in 2018 — protects a specific landrace, with specific morphological markers, grown in a specific belt of Assam. Cross it with a modern variety and you have something perfectly edible that is no longer Keteki.",
      },
      {
        type: "paragraph",
        text: "Bireswar's grandfather had, without ever using the word, maintained a seedbank. Every harvest, the best panicles from each row were dried, hand-threshed, and stored in clay pots sealed with cow-dung paste — one pot for the bao (deep-water) strain, one for the sali (winter) strain, one for the prized aromatic Keteki. The pots were passed to Bireswar's father in 1996, and to Bireswar in 2013.",
      },
      {
        type: "paragraph",
        text: "When the Karbi Anglong belt began commercial Joha cultivation in the late 2000s, almost every cooperative in the region accepted seed from the state corporation. It was free. It was reliable. It promised higher yield. By 2019, most of the “Keteki Joha” sold from the region was, genetically, a hybrid. Bireswar's four acres were one of the few that had not crossed.",
      },
      { type: "productInset", slug: "gi-keteki-joha-rice" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The economics, of course, are punishing. Bireswar yields about 2.4 tonnes per acre — roughly forty percent less than his neighbours who grow the hybrid. He compensates because we pay him a premium that reflects what the GI is actually worth: not the average mandi rate for “fine-grain rice”, but the price the GI tag earns on a premium retailer's shelf. Roughly four times the standard procurement price, paid weekly, direct to his account.",
      },
      {
        type: "paragraph",
        text: "The first time we explained the pricing to him, he listened without interrupting, which is his way. Then he said: “My grandfather's notebook will fetch this price?” We said yes. He said, “Then I think we will keep the notebook in a better place.”",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The seedbank is not a romantic object. It is, in the most literal sense, the only reason the Keteki Joha that ships out of Kopahi's Jorhat facility is genuinely the GI rice and not its higher-yielding cousin. Without the four acres in Hatiborhola, the protected landrace would, in this generation, simply have crossed itself out of existence.",
      },
      {
        type: "paragraph",
        text: "Bireswar is sixty-three. His son is studying agricultural engineering at Tezpur University. We have had two conversations with the son. He is interested. He is not yet committed. The notebook, in either case, will sit on the same shelf in the same house for at least the next planting season.",
      },
      {
        type: "paragraph",
        text: "We are not, in our company, in the business of guaranteeing futures. We can only guarantee buying terms, prices, and the truth of the labels we put on the bags. The rest is what Bireswar and his son will decide.",
      },
      {
        type: "paragraph",
        text: "But the year his grandfather wrote down — the year the rains failed — was the year a small four-acre patch in Karbi Anglong, almost by accident, became one of the most quietly important agricultural archives in Northeast India. Forty-three years on, the GI tag has finally caught up with what the notebook always knew.",
      },
      {
        type: "authorNote",
        text: "Ashreeta Gogoi writes from the field desk at Kopahi. She visits Karbi Anglong twice a year.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 2 · Farmer Profiles — Khrieliezo & the mountain heat
  // -------------------------------------------------------------
  {
    slug: "khrieliezo-and-the-mountain-heat",
    title: "Khrieliezo, and the heat that needs a mountain",
    titleAccent: "a mountain",
    dek: "Why Bhoot Jolokia at 1,200 metres is not the same chilli as Bhoot Jolokia at 400 metres — and how a Kohima farmer learned the hard way.",
    category: "Farmer Profiles",
    author: "Ashreeta Gogoi",
    authorRole: "Founder · Field & Cooperatives",
    publishedAt: "2026-02-11",
    coverImage: "/products/ghostpepper.jpg",
    readingMinutes: 5,
    inlineFarmerSlugs: ["khrieliezo-dawhuo"],
    inlineProductSlugs: [
      "gi-naga-chilli-bhoot-jolokia-powder",
      "kopahi-bhoot-jolokia-paste",
    ],
    body: [
      {
        type: "paragraph",
        text: "Khrieliezo Dawhuo has been growing Bhoot Jolokia for nineteen years, but he learned the most important thing about it in 2017, the year he tried to grow it on flatter land.",
      },
      {
        type: "paragraph",
        text: "The terraces above his village in the Khonoma cluster, outside Kohima, sit at 1,200 metres. The soil is thin, the air cool, the slope steep enough that one can lose footing carrying a basket up. None of these things are advantages, by any conventional measure of agriculture. You cannot mechanise on these terraces. You cannot irrigate beyond what the rain provides. You cannot scale.",
      },
      {
        type: "paragraph",
        text: "In 2017, a cooperative offered Khrieliezo and four other Khonoma growers a patch of leased flatland nearer the town — easier to access, easier to weed, with proper drainage and a small bore well. The offer was reasonable. The cooperative would help with seedlings, the patch was good red earth, and a single season's yield from the flatland would, on paper, equal three seasons on the terraces. Khrieliezo agreed to try.",
      },
      {
        type: "paragraph",
        text: "The plants grew. The plants flowered. The plants set fruit. Everything looked, by sight, like a healthy Bhoot Jolokia crop.",
      },
      { type: "paragraph", text: "Then they tasted it." },
      { type: "farmerInset", slug: "khrieliezo-dawhuo" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The Scoville scale is a measure of capsaicin — the alkaloid that makes a chilli hot. Bhoot Jolokia at 1,200 metres, properly cured, typically tests at over one million Scoville units. The same plant grown the same way at 400 metres, the cooperative's lab confirmed, tested at roughly half that. The chillies looked identical. The vines were genetically the same. The fruit, by every visual measure, was the same fruit. But the heat was not the same heat.",
      },
      {
        type: "paragraph",
        text: "The pungency of a Bhoot Jolokia is not a matter of seed. It is a matter of stress. Capsaicin is, evolutionarily, a defence mechanism — the plant produces more of it when its conditions are harder. Higher altitudes mean cooler nights, thinner air, leaner soil, less water security, and longer days in the sun unbroken by valley humidity. A Bhoot Jolokia plant on the terraces above Khonoma is, in horticultural terms, under more strain than it would otherwise be. That strain is what makes it the chilli the GI tag protects.",
      },
      {
        type: "paragraph",
        text: "The 2017 flatland harvest was sold as ordinary chilli. It earned a fraction of what the same volume would have earned on the terraces. Khrieliezo went back uphill.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "This is the kind of thing that does not appear on a product label and rarely makes it into a Geographical Indication application. The GI for Naga Chilli, granted in 2008, specifies the regions where the chilli must be grown to carry the tag, but it does not specify altitude. In practice, every commercially serious Bhoot Jolokia farmer in the protected belt grows above 800 metres, because below that the chilli loses what makes it commercially interesting in the first place. The market does the work the certification doesn't.",
      },
      { type: "productInset", slug: "gi-naga-chilli-bhoot-jolokia-powder" },
      {
        type: "paragraph",
        text: "Khrieliezo's processing is its own quiet education. He picks at first colour, sun-dries on bamboo racks for nine to twelve days depending on humidity, smokes the batches he reserves for pickle and jam over slow alder-wood fires, and stone-mills the powdered grade in small fifteen-kilo lots so the friction heat doesn't volatilise the capsaicin. The grandmother who taught him this died in 2019. Her instructions are not written down.",
      },
      {
        type: "productInset",
        slug: "kopahi-bhoot-jolokia-paste",
        note: "made in Jorhat with Khonoma chillies",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "We took our first delivery from Khrieliezo in late 2024. The order was small — eighteen kilos of powder, a separate forty-jar batch of the smoked grade for our jam line. The price we paid was, by his estimate, the highest he had received in nineteen years of growing. He used a portion of it to replace the bamboo of one of the drying racks, which had been getting tired for two seasons.",
      },
      {
        type: "paragraph",
        text: "When we ask him, as we do every quarter, whether he would consider increasing volume by taking on flatter rented plots, he gives the same answer he has given every time. Heat needs a mountain. The mountain has only so much space.",
      },
      {
        type: "paragraph",
        text: "The price the GI tag earns at the end of the chain is what allows him to keep that answer simple. The whole point of working this way is so that he never has to give a different one.",
      },
      {
        type: "authorNote",
        text: "Ashreeta Gogoi writes from the field desk at Kopahi. She visits Kohima twice a year.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 3 · Heritage Stories — Lakadong & the curcumin mountain
  // -------------------------------------------------------------
  {
    slug: "lakadong-curcumin-mountain",
    title: "Lakadong, and the curcumin mountain",
    titleAccent: "curcumin mountain",
    dek: "Why a small valley in Jaintia Hills produces turmeric three times richer than the global average — and what that really means for the kitchen.",
    category: "Heritage Stories",
    author: "Barsha Prakash Choudhury",
    authorRole: "Founder · Brand & Partnerships",
    publishedAt: "2026-02-04",
    coverImage: "/products/ginj.jpg",
    readingMinutes: 5,
    inlineProductSlugs: [
      "gi-lakadong-turmeric-powder",
      "gi-karbi-anglong-ginger-powder",
    ],
    body: [
      {
        type: "paragraph",
        text: "Most turmeric, in most kitchens, in most countries, contains roughly two to three percent curcumin. Curcumin is the bright yellow polyphenol that turmeric is, in essence, for — the compound responsible for its colour, its anti-inflammatory reputation, and most of what wellness magazines have spent the last decade writing about. The number on a typical commercial turmeric is two-point-something. Two-point-something is fine.",
      },
      {
        type: "paragraph",
        text: "Lakadong turmeric, grown in a small valley in Meghalaya's West Jaintia Hills, regularly tests between seven and nine percent curcumin. That is not a marketing claim — it is what a third-party laboratory assay turns up, consistently, year after year. It is, in the polite understatement of the agricultural literature, anomalously high.",
      },
      { type: "divider" },
      { type: "paragraph", text: "The interesting question is why." },
      {
        type: "paragraph",
        text: "The answer is partly genetic — the Lakadong landrace is a specific cultivar that has been selected over centuries by Khasi and Jaintia farmers for, among other things, its colour. The deeper yellow corresponds, roughly, to higher curcumin content, and the deepest-yellow rhizomes have been retained as seed for replanting season after season. This is not laboratory breeding; it is the slow human eye choosing, over many generations, the brightest rhizome in the basket.",
      },
      {
        type: "paragraph",
        text: "But the genetics alone do not explain the seven-to-nine percent. If you grow Lakadong cultivar in Maharashtra, or in Andhra, you will get a turmeric considerably richer than the local standard — but you will not get nine percent. The valley does the rest. The combination of altitude (around 1,000 metres), the iron-rich red lateritic soil, the cool nights of the post-monsoon curing months, and the unusually long fourteen-day on-plant sun-curing the Lakadong farmers practice before they even pull the rhizomes — these together produce the second half of the number.",
      },
      {
        type: "paragraph",
        text: "Move the cultivar. Lose the soil. Lose the altitude. Lose the curing protocol. The number falls.",
      },
      { type: "productInset", slug: "gi-lakadong-turmeric-powder" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The Geographical Indication for Lakadong Turmeric was granted in 2024, after almost a decade of effort by the Meghalaya Basin Development Authority and the cooperative growers of the West Jaintia Hills. The application document, which is publicly available, is in many ways more interesting than most cookbooks. It documents not just the cultivar and the geography but the protocol — the precise sowing window, the inter-row spacing, the inter-crop with ginger that the soil seems to prefer, the hand-curing on the plant, the slow, off-fire drying after harvest, the long-storage in earthen pits which farmers here will tell you is what makes the colour come out properly over the first three months in the pit.",
      },
      {
        type: "paragraph",
        text: "A GI is, in legal terms, a protection. In practical terms, it is a recipe — written down and witnessed, so that no one else can claim to make the same thing somewhere else.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The reason a kitchen should care about any of this — the reason the seven-to-nine percent is not just a wellness-magazine number — is that curcumin content is, in cooking, the dose-control variable. A teaspoon of two-percent turmeric and a teaspoon of nine-percent turmeric are not, functionally, the same teaspoon. The Lakadong, used with the same hand as commercial turmeric, will over-colour a dish, over-flavour a curry, and overwhelm a golden milk made with the proportions a Bangalore food blog will give you.",
      },
      {
        type: "paragraph",
        text: "Use less. A quarter-teaspoon of Lakadong does the work of a full teaspoon of most commercial turmeric. The price-per-spoon evens out fast.",
      },
      {
        type: "paragraph",
        text: "The deeper change, though, is in the taste. Higher-curcumin turmeric carries a slight bitterness on the finish — the same way a single-estate dark chocolate carries a slight bitterness that a milk chocolate does not. The trade is depth for sweetness, complexity for ease. The Lakadong wants to be paired with fat: ghee, coconut milk, full-cream dairy. It blooms there in a way it cannot in plain water.",
      },
      {
        type: "productInset",
        slug: "gi-karbi-anglong-ginger-powder",
        note: "for the classic Lakadong-and-ginger pairing the soil itself prefers",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The Lakadong belt produces, in a good year, perhaps two thousand tonnes — a rounding error against the global turmeric trade. The growers here are not poor in the way the popular Northeast story sometimes flattens everyone into being; they are skilled specialists working a difficult crop on difficult land, and the GI tag, properly honoured by the market, finally pays them at the rate the rhizome has always been worth.",
      },
      {
        type: "paragraph",
        text: "What the kitchen receives, when it receives Lakadong, is not a wellness commodity. It is a fourteen-day on-plant cure, an altitude, a soil, a curing pit, and the eye of a farmer who, for several generations, chose the brightest rhizome in the basket. The percentage on the lab report is the closing line of a much older story.",
      },
      {
        type: "authorNote",
        text: "Barsha Prakash Choudhury writes from the brand desk at Kopahi.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 4 · Recipes — Khar with Joha
  // -------------------------------------------------------------
  {
    slug: "khar-with-joha-rice",
    title: "Khar with Joha — when the rice is the loudest ingredient",
    titleAccent: "rice is the loudest ingredient",
    dek: "The Assamese plate that earns its name by what it removes, not what it adds. A recipe by way of explanation.",
    category: "Recipes",
    author: "Kopahi Kitchens",
    authorRole: "The Kopahi kitchen",
    publishedAt: "2026-01-18",
    coverImage: "/products/kharwithjora.webp",
    readingMinutes: 4,
    inlineProductSlugs: [
      "gi-keteki-joha-rice",
      "gi-karbi-anglong-ginger-powder",
    ],
    body: [
      {
        type: "paragraph",
        text: "Most Indian rice is a vehicle. It carries flavour from one element on the plate to another, soaking up gravy on the way. Joha rice is not a vehicle. It is the destination.",
      },
      {
        type: "paragraph",
        text: "Khar is the dish that exists, more or less, to let it be that.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "Khar is the Assamese name for an alkaline filtrate traditionally made by burning the skin of a sun-dried banana, collecting the ash, soaking it in water, and straining the liquid clear. The result is a pale, faintly mineral liquid — the kharoni — that you use as you would a seasoning, a few tablespoons at a time, to balance richer ingredients with a clean astringent finish.",
      },
      {
        type: "paragraph",
        text: "What is on the plate, in a classic Assamese midday meal of bhaat aru khar, is staggeringly simple: a small mound of steamed rice, a separate bowl of khar cooked with raw papaya or a leafy green, a side of aloo pitika (mashed potato with mustard oil and green chilli), and a wedge of lemon. There is no curry. There is no gravy. There is no spice mix doing the heavy lifting.",
      },
      { type: "paragraph", text: "The Joha is the lifting." },
      { type: "productInset", slug: "gi-keteki-joha-rice" },
      { type: "divider" },
      { type: "paragraph", text: "Khar with Joha · Serves 2" },
      {
        type: "paragraph",
        text: "For the rice — 150 g GI Keteki Joha rice, rinsed three times in cool water · 280 ml water · A pinch of salt · 1 tsp mustard oil (optional, for the lift).",
      },
      {
        type: "paragraph",
        text: "For the khar — 200 g raw papaya, peeled and cut into 2 cm cubes (or one bunch of jolpan xaak, colocasia leaves, sliced thin) · 2 tbsp traditional khar (or, as a working substitute, ½ tsp food-grade baking soda dissolved in 60 ml water) · 1 small dried red chilli, broken · ½ tsp salt · ¾ tsp GI Karbi Anglong Ginger Powder, dissolved in 2 tbsp water · 1 tsp mustard oil · Fresh coriander to finish.",
      },
      {
        type: "paragraph",
        text: "To plate — A wedge of lemon · A small mound of mashed potato seasoned with raw mustard oil and a slit green chilli (optional but traditional).",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The rice. Soak the Joha for twenty minutes after the third rinse. Drain, place in a heavy pot with the measured water and the pinch of salt, bring to a single boil, then lower to the smallest flame and cover tight. Twelve minutes. Off the heat. Don't lift the lid. Let it sit, covered, for another ten. When you uncover it, drag a fork through the surface — not stirring, just separating — and add the mustard oil if you are using it. The grain should be soft, the perfume should reach the doorway, and the rice should hold its shape even as the kitchen smells of something the supermarket version does not smell of.",
      },
      {
        type: "paragraph",
        text: "The khar. Heat the mustard oil in a small kadhai until it just smokes. Pull off the heat for ten seconds to settle the bite, then return to a low flame and add the broken chilli. Three seconds. Add the papaya cubes. Toss for a minute. Add the khar liquid and the salt. Cover, cook on low for twelve to fifteen minutes until the papaya has gone translucent — it will look a little glassy at the edges. Stir in the dissolved ginger powder. Cook one more minute. The dish should be brothy, not thick — the khar is not a gravy.",
      },
      {
        type: "paragraph",
        text: "To plate. A small mound of Joha. A separate bowl of khar with its broth. A spoon of mashed potato on the side. A wedge of lemon.",
      },
      {
        type: "paragraph",
        text: "Eat the rice first, with a few drops of khar broth. Notice the rice. Then build the meal.",
      },
      { type: "productInset", slug: "gi-karbi-anglong-ginger-powder" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "A note on the rice. Joha is a short-grain aromatic. Do not treat it like Basmati. It will not lengthen. It is meant to be small, slightly sticky, fragrant in the way that a closed pot suddenly fills a room. The supermarket “Joha-style” rice you may have encountered is almost certainly hybridised and will smell of nothing in particular. Real Keteki Joha — protected by GI since 2018 — does not need turmeric or whole spices to flavour it. The four hundred years it took to be bred into existence are the flavour.",
      },
      {
        type: "paragraph",
        text: "A note on khar. If you can find traditional banana-skin khar from an Assamese household, use it. The flavour is rounder, the alkalinity gentler. The baking-soda substitute works for a weeknight, and is what most modern Guwahati kitchens use when no one's grandmother is visiting. Either is fine. The point of khar, as the old saying in Jorhat goes, is to make space for the rice to be heard.",
      },
      {
        type: "authorNote",
        text: "Kopahi Kitchens. The kitchen at Kopahi cooks slowly. We publish only when the recipe earns its place.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 5 · Recipes — Bhoot Jolokia jam on a cheese board
  // -------------------------------------------------------------
  {
    slug: "bhoot-jolokia-jam-on-cheese-board",
    title: "A jar of ghost on a cheese board",
    titleAccent: "ghost",
    dek: "Bhoot Jolokia jam, what it actually does to a plate of aged cheddar — and the small list of things never to pair it with.",
    category: "Recipes",
    author: "Kopahi Kitchens",
    authorRole: "The Kopahi kitchen",
    publishedAt: "2025-12-22",
    coverImage: "/products/ghostjam.webp",
    readingMinutes: 4,
    inlineProductSlugs: ["kopahi-bhoot-jolokia-paste"],
    body: [
      {
        type: "paragraph",
        text: "A jar of jam should not be intimidating. The chilli inside this one is.",
      },
      {
        type: "paragraph",
        text: "Our Bhoot Jolokia jam is a small-batch preserve we make in Jorhat using GI-certified ghost chillies from Khrieliezo Dawhuo's terraces above Kohima. It is, by intent, not a hot sauce. It is a finishing condiment — closer in spirit to a fruit chutney than a salsa, with the heat of a Naga chilli carrying through a long-cooked sugar base. The first hit is smoky and almost sweet. The second hit arrives unhurried, climbs the back of the tongue, and stays for somewhere between thirty seconds and a minute.",
      },
      {
        type: "paragraph",
        text: "A spoon of it on hot rice will end the meal. A quarter-teaspoon of it on the right cheese will redefine the meal.",
      },
      { type: "divider" },
      { type: "paragraph", text: "Here is what it pairs with." },
      {
        type: "paragraph",
        text: "Aged cheddar (2–4 years). The salt in a long-aged cheddar gives the jam something to argue with. The sweetness in the jam cuts the rind-funk. The heat is just enough to make the cheese taste younger. Cut the cheddar in matchbox-sized cubes. A pinhead of jam per cube. A glass of cider next to it.",
      },
      {
        type: "paragraph",
        text: "Manchego or any firm sheep's-milk cheese. The nuttiness wraps the chilli. Almost no other condiment does this — most heat overpowers sheep's milk and leaves you tasting only the chilli. Bhoot Jolokia jam, because of the sugar base, finishes long enough that the cheese gets its sentence in.",
      },
      {
        type: "paragraph",
        text: "Hard goat's-milk cheese. Trickier. The acid in goat will accelerate the heat. Use half as much jam as you think. Pair with a sweet wine to balance.",
      },
      {
        type: "paragraph",
        text: "Soft-rind cheeses (brie, camembert, taleggio). Sparingly, and only on the rind. The cream of a soft-rind cheese will mute the heat for the first two seconds and then it will not. This is a feature, not a bug. Pair with bread and a slow bourbon.",
      },
      {
        type: "paragraph",
        text: "Grilled meats — pork, lamb, duck. The classic Northeast pairing. A glaze of the jam, brushed on the last two minutes of grilling, will char beautifully and carry the heat into the meat itself. Reserve some unheated jam to serve at the table.",
      },
      {
        type: "productInset",
        slug: "kopahi-bhoot-jolokia-paste",
        note: "made in Jorhat with chillies from Kohima",
      },
      { type: "divider" },
      { type: "paragraph", text: "Here is what not to pair it with." },
      {
        type: "paragraph",
        text: "Anything cold. Cold cuts heat. The Bhoot Jolokia jam, on cold meat or cold cheese straight from the fridge, will spike. Allow the cheese to come to room temperature for at least twenty minutes before the board goes out.",
      },
      {
        type: "paragraph",
        text: "Anything with raw garlic. Raw garlic and Bhoot Jolokia have a fight on the palate that no one wins. The jam plays well with cooked garlic, charred garlic, smoked garlic — never raw.",
      },
      {
        type: "paragraph",
        text: "Coriander leaf. The volatile oils in fresh coriander and the smoked notes in our jam cancel each other out. Use mint instead, or basil, or no herb at all.",
      },
      {
        type: "paragraph",
        text: "Anything for a young palate. This is not a beginner's condiment. The polite line is not yet.",
      },
      { type: "divider" },
      { type: "paragraph", text: "Quantities, plainly." },
      {
        type: "paragraph",
        text: "For a board for four: one teaspoon of jam, divided across four cheeses. Total. That is the entire jar's job on the night. The rest of the jar — the way we use it most often, in fact — is for slow weeknight cooking. Stir half a teaspoon into a beef chilli at the end. Brush a roast chicken with it the last five minutes of the oven. Mix one teaspoon into the marinade of a leg of lamb. The sugar caramelises, the heat holds, the meal becomes serious without becoming a competitive sport.",
      },
      { type: "divider" },
      { type: "paragraph", text: "A note on opening the jar." },
      {
        type: "paragraph",
        text: "Do not lean over it. Turn your head as you unscrew the lid. The first whiff is the warning the chilli has built into itself. Trust it.",
      },
      { type: "authorNote", text: "Kopahi Kitchens." },
    ],
  },

  // -------------------------------------------------------------
  // 6 · Export Insights — What GI actually protects
  // -------------------------------------------------------------
  {
    slug: "what-gi-protects-and-what-it-doesnt",
    title: "What a GI tag actually protects",
    titleAccent: "protects",
    dek: "A working note for buyers, distributors and partners — what the certification really delivers, and what still falls on the supplier to prove.",
    category: "Export Insights",
    author: "Prakash Natarajan",
    authorRole: "Director · Sales & Marketing",
    publishedAt: "2026-04-22",
    coverImage: "/products/gitag.webp",
    readingMinutes: 6,
    inlineProductSlugs: [
      "gi-lakadong-turmeric-powder",
      "gi-tripura-queen-dried-pineapple",
    ],
    body: [
      {
        type: "paragraph",
        text: "A Geographical Indication is a legal instrument granted by the Government of India under the Geographical Indications of Goods (Registration and Protection) Act, 1999. There are now over five hundred GIs in force across Indian agriculture, craft, and processed goods. Several of them appear on Kopahi's catalogue. Buyers and partners regularly ask what the tag means in commercial terms — and, more usefully, what it doesn't.",
      },
      {
        type: "paragraph",
        text: "This is a working note rather than a legal opinion. We have written it because the answers we give in B2B conversations have stabilised, and we'd rather publish them once than repeat them weekly.",
      },
      { type: "divider" },
      { type: "paragraph", text: "What a GI tag does protect." },
      {
        type: "paragraph",
        text: "The name. The most consequential protection. Once a GI is granted, no producer outside the protected region can legally sell goods under that name. Lakadong Turmeric may only be sold as Lakadong Turmeric if it comes from the gazetted belt in Meghalaya's West Jaintia Hills. Naga Chilli may only be sold as Naga Chilli from the gazetted Northeast belt. The protection covers translations, transliterations, and lookalike names that would mislead a reasonable buyer.",
      },
      {
        type: "paragraph",
        text: "The origin region. The GI gazette defines the exact production region. This is, in the case of the strongest GIs, drawn to the village cluster. A buyer who receives a Lakadong-tagged consignment is receiving turmeric from a documented belt — not from a generic “Meghalaya” or a generic “Northeast” sourcing pool.",
      },
      {
        type: "paragraph",
        text: "The production method. Every GI application includes, in its filed documentation, the production protocol — cultivar, sowing window, processing method, post-harvest handling. A registered user of the GI is, in principle, bound to that protocol. (We say “in principle” because enforcement is uneven; more on that below.)",
      },
      {
        type: "paragraph",
        text: "The right of registered users to take action. Authorised users — typically farmer producer organisations, cooperatives, or specifically registered firms — can pursue civil action against infringement. This is the legal hook. It does not run on its own; someone has to use it.",
      },
      {
        type: "productInset",
        slug: "gi-lakadong-turmeric-powder",
        note: "GI granted 2024",
      },
      { type: "divider" },
      { type: "paragraph", text: "What a GI tag does not protect." },
      {
        type: "paragraph",
        text: "Price. This is the single most misunderstood point in the room. A GI does not set a floor price. The market sets the price. A weak market will pay the GI almost no premium; a strong market — and a well-told brand — will pay several multiples of the commodity rate. The certificate is permission to charge the premium; it is not the premium itself.",
      },
      {
        type: "paragraph",
        text: "Quality, batch-to-batch. A GI defines the region and the protocol. It does not guarantee that every shipment from every registered producer will hit the same lab specification. Curcumin content in Lakadong turmeric, for example, can vary from year to year depending on rainfall, even within the gazetted belt. The buyer's supply contract — not the GI — is what governs minimum specs.",
      },
      {
        type: "paragraph",
        text: "Authenticity at the point of purchase. A jar in a Mumbai grocery store with a GI tag printed on the label is not necessarily a GI product. The graphic is easy to copy. The legal protection is real, but the day-to-day verification is the buyer's responsibility. (Our internal practice: we cross-reference every batch we sell against the gazetted registered-user list, and we issue a batch certificate on request.)",
      },
      {
        type: "paragraph",
        text: "Adulteration along the chain. GI protection is granted at the source. It is silent on what happens to the product between the farm and the shelf. A Lakadong consignment legitimately sourced can still be cut with cheaper turmeric in a downstream warehouse. This is one of the reasons we keep the supply chain in-house from cooperative to packaging.",
      },
      {
        type: "paragraph",
        text: "Brand equity. A GI is a fact, not a story. The fact alone does not move a buyer. The story — the village, the farmer, the protocol, the price the grower receives — is what converts the GI into a brand premium. Pitching a GI without the story is, in our experience, the most common mistake first-time exporters of Indian heritage produce make.",
      },
      {
        type: "productInset",
        slug: "gi-tripura-queen-dried-pineapple",
        note: "GI granted 2015",
      },
      { type: "divider" },
      { type: "paragraph", text: "For buyers — three practical asks." },
      {
        type: "paragraph",
        text: "When you receive a GI-tagged consignment from any Northeast Indian supplier (us included), ask for: (1) The GI registration number of the protected product, and the supplier's authorised-user status against that number. Both are public information. (2) A batch traceability sheet — village or cooperative of origin, harvest window, processing date, lab assay where applicable (curcumin %, capsaicin in the case of chilli, moisture content for dried fruit). (3) A sample for parallel lab testing. A reputable supplier will not be defensive about this. We send samples on request, including for shipments that have already left our facility.",
      },
      { type: "divider" },
      { type: "paragraph", text: "A closing observation." },
      {
        type: "paragraph",
        text: "Geographical Indications are, in the long arc, one of the better instruments Indian agriculture has been given in our lifetimes. They are also slow, under-enforced, and easily over-claimed in marketing. What makes them work in practice is not the certificate. It is whether the supply chain behind the certificate is doing the work the certificate quietly assumes.",
      },
      {
        type: "paragraph",
        text: "That is the work we are, very deliberately, in. We are happy to walk any buyer through how we do it.",
      },
      {
        type: "authorNote",
        text: "Prakash Natarajan leads sales and partnerships at Kopahi.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 7 · Export Insights — First-flush tasting window
  // -------------------------------------------------------------
  {
    slug: "first-flush-tasting-window-2026",
    title: "The Assam first-flush, and the calendar that needs watching",
    titleAccent: "the calendar that needs watching",
    dek: "A working note on why the March-April tasting window has begun to drift — and how export buyers should adjust contracting.",
    category: "Export Insights",
    author: "Trideep Khanikar",
    authorRole: "Director · Operations",
    publishedAt: "2026-03-30",
    coverImage: "/products/asaamesefarm.webp",
    readingMinutes: 5,
    inlineFarmerSlugs: ["rina-borah"],
    inlineProductSlugs: ["kopahi-tea-range"],
    body: [
      {
        type: "paragraph",
        text: "The first flush in Assam tea is the harvest that runs through the first warm days after the dry winter — traditionally the second half of March through the third week of April. The leaves that come off the bushes in this window have wintered slowly, accumulated soluble compounds, and produce the bright, brisk, golden-tipped cups that the high-grade Assam trade is built on.",
      },
      {
        type: "paragraph",
        text: "Or rather, that the trade used to be built on. The window is moving.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "In the five years we have been buying from Dibrugarh-side estates, the start of usable first-flush plucking has shifted approximately eleven days earlier. In 2021, the first quality leaves on Rina Borah's section of the garden came up on March 18. In 2026, they came up on March 7. That eleven-day shift sounds small. In a category where the grade differential between a properly-timed first flush and a hurried one can be ₹400–₹600 per kilo at the wholesale level, eleven days is the difference between a profitable season and a forgettable one.",
      },
      { type: "farmerInset", slug: "rina-borah" },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The shift is not a mystery. It is climate-driven, specifically winter-driven. The dry, cool winter that Upper Assam used to receive — typically running from mid-December through late February, with night temperatures regularly dropping into the single digits Celsius — has been arriving later and ending earlier each year. The tea bush, which is responsive to night-temperature thresholds, breaks dormancy on its own clock. Warmer winters mean an earlier wake-up. An earlier wake-up means an earlier first flush.",
      },
      {
        type: "paragraph",
        text: "The complication is that not every estate is moving at the same speed. Higher-elevation gardens, gardens with more tree cover, gardens on the cooler north-facing slopes — these are drifting a few days; the warmer Brahmaputra-side estates are drifting a couple of weeks. The “Assam first flush” is no longer a single window. It is, increasingly, a cascade across the region, beginning at the lowest, warmest gardens and rolling north and uphill over four to six weeks.",
      },
      { type: "divider" },
      { type: "paragraph", text: "What this means for buyers." },
      {
        type: "paragraph",
        text: "For the last decade, the standard B2B contract for first-flush Assam has specified a window — typically “leaves plucked between March 15 and April 30” — and trusted that the supplier would deliver the best of the window within it. That contract structure is starting to fail. A buyer signing a March 15 start window in 2026 will simply miss the first eight days of plucking at the warmer estates — which, increasingly, are some of the highest-quality days of the year for those gardens.",
      },
      {
        type: "paragraph",
        text: "The contract structure that is replacing it, in our practice and that of several other Northeast tea sourcers, is event-triggered rather than date-triggered. Instead of “between March 15 and April 30”, the new contract reads something closer to “first-flush grades, plucked within the seven-day window following the first qualifying leaf-break at the estate, as certified by the supplier's master taster.” The window is variable; the trigger is the bush, not the calendar.",
      },
      { type: "productInset", slug: "kopahi-tea-range" },
      { type: "divider" },
      { type: "paragraph", text: "What this means for cup quality." },
      {
        type: "paragraph",
        text: "An earlier first flush is not, in itself, a lower-quality first flush. The leaves that come off Rina's section on March 7 — when they come off after a properly cool winter, which 2026 was — are as bright, brisk and complex as anything that ever came off the same bushes on March 18 in a previous decade. The challenge is logistical, not horticultural. The estate has to be ready to pluck. The factory has to be ready to process. The buyer has to be ready to receive.",
      },
      {
        type: "paragraph",
        text: "Where the cup does suffer is in seasons where the winter has been both late-starting and short, leaving the bush insufficient dormancy. 2023 was one such year, and the first flush that season was, by general consensus across the trade, weaker than usual. Both Rina and the section managers we work with described it the same way: “the leaves came up before they were ready.” That description has now appeared in our tasting notes twice in five years. It used to be a once-in-a-decade thing.",
      },
      { type: "divider" },
      { type: "paragraph", text: "A note for next season." },
      {
        type: "paragraph",
        text: "For 2027 first-flush contracting, we are recommending the event-triggered structure to all our B2B partners. Sample dispatches will continue to be sent at our cost on first-flush completion at each estate we draw from. Buyers who want to lock prices early are welcome to do so — but the plucking window itself, we will no longer pre-commit to a fixed calendar.",
      },
      {
        type: "paragraph",
        text: "This is, in the small ways things become large, what climate is now doing to the calendars of every heritage agricultural product in the region. The first flush is the canary. The rest of the catalogue is on the same clock.",
      },
      {
        type: "authorNote",
        text: "Trideep Khanikar runs operations and processing at Kopahi.",
      },
    ],
  },

  // -------------------------------------------------------------
  // 8 · Heritage Stories — The cotton in the Kopahi logo
  // -------------------------------------------------------------
  {
    slug: "the-cotton-in-the-kopahi-logo",
    title: "The cotton in the Kopahi logo",
    titleAccent: "the Kopahi logo",
    dek: "Why the bouquet at the top of every Kopahi label is not a tea leaf, not a chilli, not a flower from any one of our products — but a small, deliberate piece of Assamese cultural shorthand.",
    category: "Heritage Stories",
    author: "Barsha Prakash Choudhury",
    authorRole: "Founder · Brand & Partnerships",
    publishedAt: "2026-01-08",
    coverImage: "/products/thecotton.webp",
    readingMinutes: 4,
    body: [
      {
        type: "paragraph",
        text: "The first thing people ask, when they look closely at a Kopahi pack, is what is the white flower at the top?",
      },
      {
        type: "paragraph",
        text: "It is not a flower. It is cotton — kopahi, in Assamese — and the name of the company comes from it.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "Cotton, in Assamese cultural memory, is not principally an agricultural product. It is principally a gesture. In an Assamese household, when a guest is welcomed at a doorway, a small offering is sometimes made — a soft white cotton boll, placed in the visitor's hand or pinned to a fold of cloth, as a quiet wordless signal of you are welcome here, you are dear to us, we are pleased that you have come.",
      },
      {
        type: "paragraph",
        text: "The gesture is small. It does not appear in textbooks. Children learn it from grandparents, almost without noticing it has been taught.",
      },
      {
        type: "paragraph",
        text: "When we were choosing what to call the company in 2023, we considered several names. Most of them were geographical — variations on the word for hill, for river, for valley. They were honest enough but felt, to our ear, descriptive rather than offered. They told the visitor where they were. They did not tell the visitor that they were welcome.",
      },
      { type: "paragraph", text: "Kopahi did." },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The bouquet in the logo is, deliberately, three bolls — not one, not two, not a stylised graphic of cotton. Three because in the Assamese gesture, three is the small quiet number of welcome. One boll is too brief. Two is correct but symmetrical and feels formal. Three is the number a grandmother instinctively reaches for when she takes the cotton from the shallow bowl on her shelf and presses it into the visitor's palm.",
      },
      {
        type: "paragraph",
        text: "The green script below it is the wordmark in our house serif. The thin gold line beneath the wordmark is a single sweep that, in the early sketches, was meant to read as the curve of the Brahmaputra. It does not have to read that way. It can read as a flourish, a horizon, a thread. We left it ambiguous on purpose.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "The reason we are telling this story now, on this part of the website, is that we are increasingly asked — by buyers, by partners, occasionally by journalists — why a tea-and-spice brand uses cotton as its mark. The answer is at once obvious and not. We do not sell cotton. We have, at the moment, no plans to. The mark is not a product index. It is a register of how we mean to receive the visitor — every visitor, on every page, in every packet.",
      },
      {
        type: "paragraph",
        text: "The label is, in this small way, the doorway. The cotton is what we put in the visitor's hand as they cross it.",
      },
      { type: "divider" },
      {
        type: "paragraph",
        text: "We have noticed, over the past two years of shipping the product to people we will never meet, that this gesture matters more than we initially expected it to. A buyer in Stockholm wrote to us last spring after receiving her first order. She did not write about the turmeric, which is what she had ordered. She wrote about the small white shape at the top of the bag, which she had not been able to identify, and which she had spent some time turning the packet around in her hand to look at.",
      },
      {
        type: "paragraph",
        text: "“It looked like it was offering itself to me,” she wrote. “I had to look it up. Then I had to write to you.”",
      },
      {
        type: "paragraph",
        text: "We replied. We told her, more or less, what is written above.",
      },
      { type: "paragraph", text: "She has been a regular customer since." },
      {
        type: "authorNote",
        text: "Barsha Prakash Choudhury writes from the brand desk at Kopahi.",
      },
    ],
  },
];

// =============================================================
// HELPERS
// =============================================================
export function getEssayBySlug(slug: string): JournalEssay | undefined {
  return JOURNAL.find((e) => e.slug === slug);
}

export function getEssaysByProductSlug(slug: string): JournalEssay[] {
  return JOURNAL.filter((e) => e.inlineProductSlugs?.includes(slug));
}

export function getEssaysByFarmerSlug(slug: string): JournalEssay[] {
  return JOURNAL.filter((e) => e.inlineFarmerSlugs?.includes(slug));
}

/**
 * Related-essay logic per v6 §7:
 * 1. Other essays in the same category
 * 2. Then other essays by the same author
 * 3. Then most-recent essays overall
 * Always excludes the current essay. Deduped, capped at `limit`.
 */
export function getRelatedEssays(
  currentSlug: string,
  category: JournalCategory,
  limit = 3,
  author?: string,
): JournalEssay[] {
  const seen = new Set<string>([currentSlug]);
  const out: JournalEssay[] = [];

  const tryPush = (e: JournalEssay) => {
    if (seen.has(e.slug)) return;
    seen.add(e.slug);
    out.push(e);
  };

  // Same category, newest first
  JOURNAL.filter((e) => e.category === category)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .forEach(tryPush);

  // Then same author
  if (author && out.length < limit) {
    JOURNAL.filter((e) => e.author === author)
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .forEach(tryPush);
  }

  // Then most-recent overall
  if (out.length < limit) {
    [...JOURNAL]
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .forEach(tryPush);
  }

  return out.slice(0, limit);
}

export function getFeaturedEssay(): JournalEssay | undefined {
  return JOURNAL.find((e) => e.isFeatured);
}
