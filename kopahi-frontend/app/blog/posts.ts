export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "ul"; items: string[] }
  | { type: "img"; src: string; alt: string; caption?: string }
  | { type: "callout"; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  img: string;
  category: string;
  date: string;
  readTime: number;
  author: { name: string; role: string };
  tags: string[];
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "lakadong-turmeric-explained",
    title: "What makes Lakadong turmeric different?",
    excerpt:
      "A deep-dive into the curcumin content, soil profile, and why Meghalaya's prized rhizome is now GI-tagged.",
    img: "https://picsum.photos/seed/kopahi-lakadong/1400/900",
    category: "Spotlight",
    date: "Apr 22, 2026",
    readTime: 6,
    author: { name: "Dr. Anjali Borah", role: "Sourcing & Quality" },
    tags: ["turmeric", "spices", "GI-tagged", "Meghalaya"],
    body: [
      {
        type: "p",
        text: "Walk into any spice market in India and you'll find a dozen varieties of turmeric. Most look the same on the shelf — bright orange-yellow powder, similar packaging. But the moment you cook with Lakadong, something shifts: the colour is deeper, the aroma is more floral, and the dish carries a quiet warmth that ordinary turmeric just doesn't.",
      },
      { type: "h2", text: "It's about the curcumin." },
      {
        type: "p",
        text: "Curcumin is the compound responsible for turmeric's colour, anti-inflammatory properties, and most of its therapeutic claims. Most commercial Indian turmeric clocks in at 2-3% curcumin. Lakadong, grown in the Jaintia Hills of Meghalaya, routinely tests at 7-9%. That's not a marketing claim — it's been verified across multiple lab studies and is the primary reason it received GI (Geographical Indication) status in 2023.",
      },
      {
        type: "callout",
        text: "GI status means the name 'Lakadong' is legally protected. If a packet doesn't come from the Jaintia Hills, it can't be sold under that name.",
      },
      { type: "h2", text: "Why this region?" },
      {
        type: "p",
        text: "Three factors stack up to create the curcumin advantage:",
      },
      {
        type: "ul",
        items: [
          "Soil — iron-rich, slightly acidic, with the trace mineral profile turmeric thrives in.",
          "Altitude — between 1,000-1,500 metres, cool nights and humid days slow down rhizome growth, concentrating flavour.",
          "Tradition — farmers harvest at 9-10 months instead of the commercial 7-month cycle, letting the curcumin fully develop.",
        ],
      },
      {
        type: "img",
        src: "https://picsum.photos/seed/kopahi-lakadong-drying/1400/900",
        alt: "Turmeric drying in the sun",
        caption: "Sun-drying — never machine-dried — keeps the volatile oils intact.",
      },
      { type: "h2", text: "How we source it." },
      {
        type: "p",
        text: "We work with a co-operative of 84 families across three villages — Lakadong, Mukhla, and Sahsniang. Every batch is lab-tested for curcumin content before it reaches our warehouse, and we publish the lot number and curcumin percentage on every pack.",
      },
      {
        type: "quote",
        text: "When you taste real Lakadong, you understand why our grandparents never bought turmeric from the market — they grew it themselves.",
        cite: "Mary Suchen, co-op coordinator",
      },
      { type: "h2", text: "Cooking with it." },
      {
        type: "p",
        text: "Use about half of what you'd normally use. Lakadong's potency means a quarter-teaspoon does the work of a full teaspoon of regular turmeric. It also pairs beautifully with black pepper (which boosts curcumin absorption by up to 2,000%) — try it in a simple haldi-doodh, or stirred into ghee at the start of a dal.",
      },
    ],
  },
  {
    slug: "cooking-with-bhut-jolokia",
    title: "Cooking with Bhut Jolokia — without losing your tongue",
    excerpt:
      "Three traditional Naga recipes that showcase the world's hottest chilli without overpowering the dish.",
    img: "https://picsum.photos/seed/kopahi-bhut-jolokia/1400/900",
    category: "Recipes",
    date: "Apr 12, 2026",
    readTime: 5,
    author: { name: "Pranjal Saikia", role: "Recipes Editor" },
    tags: ["chilli", "recipes", "Nagaland", "Bhut Jolokia"],
    body: [
      {
        type: "p",
        text: "Bhut Jolokia — the ghost pepper — clocks in at over a million Scoville units. For perspective, a jalapeño is around 5,000. Most people who've heard of it know it from internet challenges, where someone bites in and immediately regrets every life choice.",
      },
      {
        type: "p",
        text: "But in Nagaland and parts of Assam, this chilli isn't a stunt. It's a kitchen staple — used carefully, in tiny amounts, to build a smoky depth that no other chilli can match. The trick is restraint.",
      },
      { type: "h2", text: "Rule one: never use the seeds." },
      {
        type: "p",
        text: "The capsaicin sits mostly in the seeds and the pithy white ribs. Slit the chilli open, scrape both out, and you're working with maybe 30% of the original heat — which is still enough.",
      },
      { type: "h2", text: "Recipe 1 — Smoked dry-chilli paste" },
      {
        type: "ul",
        items: [
          "2 dried Bhut Jolokia (deseeded)",
          "4 cloves garlic",
          "1 tbsp mustard oil",
          "Pinch of salt",
        ],
      },
      {
        type: "p",
        text: "Roast the chillies and garlic on a dry pan until fragrant. Pound to a coarse paste with the salt and oil. Use a quarter teaspoon to lift any rice-based dish.",
      },
      { type: "h2", text: "Recipe 2 — Naga-style pork curry (mild)" },
      {
        type: "p",
        text: "In Nagaland, Bhut Jolokia is added whole to slow-cooked pork — never broken, never sliced. The chilli infuses the broth without releasing the seeds. After 90 minutes of simmering, you fish it out, and the dish carries warmth without aggressive heat.",
      },
      {
        type: "callout",
        text: "Always wear gloves. The capsaicin doesn't wash off easily and will find your eyes hours later.",
      },
      { type: "h2", text: "Recipe 3 — Pickled chilli (the gateway)" },
      {
        type: "p",
        text: "Slice fresh Bhut Jolokia (deseeded) into thin rings, layer in a sterile jar with mustard oil, salt, and a tablespoon of vinegar. After two weeks, the heat mellows into something complex and smoky. A teaspoon turns a plain plate of khichdi into something memorable.",
      },
      {
        type: "quote",
        text: "We don't use it to burn. We use it to remember a place.",
        cite: "Imti Longchar, chef and consultant",
      },
    ],
  },
  {
    slug: "first-flush-2026",
    title: "First Flush 2026: tasting notes from Assam's tea gardens",
    excerpt:
      "Our buyers' field report from Doomur Dullung and Mangalam — including which lots made it to the catalogue.",
    img: "https://picsum.photos/seed/kopahi-first-flush/1400/900",
    category: "Field Notes",
    date: "Mar 30, 2026",
    readTime: 7,
    author: { name: "Rituraj Das", role: "Head Tea Buyer" },
    tags: ["tea", "Assam", "first flush", "tasting notes"],
    body: [
      {
        type: "p",
        text: "First flush in Assam is a tighter window than people realise — about three weeks in late February through mid-March, when the bushes wake up after winter dormancy and push out their first new shoots. The leaves are smaller, lighter, and the resulting tea is brisk and floral in a way that the bigger, maltier second flush will never quite be.",
      },
      {
        type: "p",
        text: "Our 2026 buying trip took us through six estates over nine days. Some highlights, some surprises, and one heartbreak.",
      },
      { type: "h2", text: "Doomur Dullung — the standout" },
      {
        type: "p",
        text: "An estate that's quietly built a reputation among specialty buyers. Their orthodox manufacturing keeps the leaf intact, and the resulting cup is bright copper with a clean, crisp finish. We bought 180kg from their A1 lot and 90kg from a smaller experimental lot they're calling 'Silver Tips'.",
      },
      {
        type: "img",
        src: "https://picsum.photos/seed/kopahi-tea-garden-dawn/1400/900",
        alt: "Assam tea garden in early morning light",
        caption: "Doomur Dullung at 6am — the tea pickers are already three rows deep.",
      },
      { type: "h2", text: "Mangalam — consistent as ever" },
      {
        type: "p",
        text: "Mangalam's been a partner since 2023 and continues to deliver consistency. This year's first flush has slightly more body than last year's — likely because of a drier January — but the floral notes are still there. We took the full A1 lot.",
      },
      { type: "h2", text: "The heartbreak: Borengajuli" },
      {
        type: "p",
        text: "Hailstorms in early March wiped out about 40% of the first-flush yield at several smaller estates around Borengajuli. The leaves we tasted were good, but the volumes weren't there. We're working with the co-operative on a winter coverage product to help offset the risk for next year.",
      },
      {
        type: "callout",
        text: "Climate volatility is the single biggest threat to specialty tea in Assam. Yields are getting harder to predict.",
      },
      { type: "h2", text: "What's in the catalogue" },
      {
        type: "ul",
        items: [
          "Doomur Dullung A1 — 180kg, listed as 'Assam Premium First Flush'",
          "Doomur Dullung Silver Tips — 90kg, ultra-premium tier",
          "Mangalam A1 — full lot, listed as 'Assam Premium Tea' (our flagship)",
          "Two smaller orthodox lots from co-op estates, dropping next month",
        ],
      },
      {
        type: "quote",
        text: "First flush teaches you to taste with patience. The good ones don't shout — they unfold.",
        cite: "Rituraj Das, head buyer",
      },
    ],
  },
  {
    slug: "joha-rice-pairings",
    title: "Joha rice pairings: it's not just for biryani",
    excerpt:
      "The aromatic Assamese short-grain that punches above its weight in everything from kheer to risotto.",
    img: "https://picsum.photos/seed/kopahi-joha-rice/1400/900",
    category: "Recipes",
    date: "Mar 18, 2026",
    readTime: 5,
    author: { name: "Pranjal Saikia", role: "Recipes Editor" },
    tags: ["rice", "Joha", "recipes", "Assam"],
    body: [
      {
        type: "p",
        text: "Joha rice is one of those varieties that gets pigeonholed. Most people, if they've heard of it at all, think 'biryani rice' — a substitute for basmati. It's a fair starting point, but it sells Joha short.",
      },
      {
        type: "p",
        text: "Joha is a small-grain aromatic from Assam, with a perfume that sits somewhere between basmati and a Thai jasmine. It's been grown in the Brahmaputra valley for at least three centuries, and at one point was the rice of choice for royal kitchens. It also got GI status in 2018, which is why we now ship it under that name.",
      },
      { type: "h2", text: "The non-biryani case for Joha" },
      {
        type: "p",
        text: "Three things make Joha unusually versatile:",
      },
      {
        type: "ul",
        items: [
          "It cooks in 12-14 minutes — faster than most aromatic rices.",
          "It absorbs liquid evenly, which makes it forgiving in dishes where the ratio matters.",
          "Its aroma survives long simmering — most aromatic rices fade after 20 minutes; Joha holds.",
        ],
      },
      { type: "h2", text: "Try: Joha kheer" },
      {
        type: "p",
        text: "Replace your usual kheer rice with Joha. The grains stay distinct in the milk, and the floral note layers beautifully with cardamom. We use a 1:6 ratio of rice to milk, simmered for 40 minutes.",
      },
      { type: "h2", text: "Try: Joha risotto" },
      {
        type: "p",
        text: "Heretical, yes. But Joha's starch profile is closer to arborio than basmati, and its aroma plays well with parmesan and butter. Add the stock in stages, the way you'd treat any risotto, and finish with mountain wild honey for a pseudo-Italian-Assamese fusion.",
      },
      {
        type: "callout",
        text: "Don't rinse Joha for more than 30 seconds. You'll wash off the aroma along with the surface starch.",
      },
      { type: "h2", text: "Try: Joha pulao with mustard oil" },
      {
        type: "p",
        text: "Most North Indian pulao uses ghee. Try Joha with mustard oil instead — toast the rice for two minutes in the oil before adding water. The result is darker, nuttier, and uniquely Assamese.",
      },
    ],
  },
  {
    slug: "mustard-honey-harvest",
    title: "Inside a winter mustard honey harvest",
    excerpt:
      "We followed beekeepers across Barpeta as they uncapped frames and bottled the rarest honey of the year.",
    img: "https://picsum.photos/seed/kopahi-mustard-honey/1400/900",
    category: "Field Notes",
    date: "Feb 24, 2026",
    readTime: 6,
    author: { name: "Anjali Borah", role: "Sourcing & Quality" },
    tags: ["honey", "mustard", "harvest", "Barpeta"],
    body: [
      {
        type: "p",
        text: "Mustard honey is a winter-only product. The mustard fields of Lower Assam bloom in December and January, and beekeepers have a six-week window to move their hives in, let the bees work, and pull the frames before the bloom ends.",
      },
      {
        type: "p",
        text: "We spent three days in Barpeta with a co-operative of 22 beekeepers. Here's what a harvest looks like.",
      },
      {
        type: "img",
        src: "https://picsum.photos/seed/kopahi-beekeeper-frame/1400/900",
        alt: "A beekeeper inspects a frame",
        caption: "Frames are uncapped manually with a heated knife — never a machine.",
      },
      { type: "h2", text: "5am: smoke and patience" },
      {
        type: "p",
        text: "The day starts before sunrise. Smoke calms the bees, and the cool morning air makes the wax easier to handle. Each hive yields 2-3 frames, and a frame holds about 1.5kg of honey. Multiply that across 40-60 hives per beekeeper and you've got a season's worth in 90 minutes of work.",
      },
      { type: "h2", text: "Why mustard honey is rare" },
      {
        type: "ul",
        items: [
          "It crystallises within two weeks. Most retailers don't stock it because customers think crystallisation means it's gone bad.",
          "The window is short. Six weeks max, with bad weather able to wipe out 30-40% of yield.",
          "It's mono-floral. Bees have to be moved to a single mustard field and kept there — which means logistics, and logistics cost money.",
        ],
      },
      {
        type: "callout",
        text: "Crystallised honey is real honey. It's the synthetic, ultra-filtered stuff that stays liquid forever.",
      },
      { type: "h2", text: "What we bottled" },
      {
        type: "p",
        text: "880kg of mustard honey, split across two grades. The premium grade is single-co-op, single-bloom. The standard grade is blended from three co-ops to balance flavour. Both are raw, unfiltered, and bottled within 48 hours of harvest.",
      },
      {
        type: "quote",
        text: "If the honey crystallises in your jar, it's because we didn't lie to you about what's inside.",
        cite: "The Kopahi Team",
      },
    ],
  },
  {
    slug: "fair-trade-explained",
    title: "How fair trade actually works at Kopahi",
    excerpt:
      "A breakdown of payouts, settlements, and what 'no middlemen' means when the farmer cashes the cheque.",
    img: "https://picsum.photos/seed/kopahi-fair-trade/1400/900",
    category: "Inside Kopahi",
    date: "Feb 02, 2026",
    readTime: 8,
    author: { name: "The Kopahi Team", role: "Editorial" },
    tags: ["fair trade", "transparency", "vendors", "policy"],
    body: [
      {
        type: "p",
        text: "Every agri-marketplace in India says 'no middlemen' and 'fair trade'. Most of them mean it loosely. We want to be specific about what we mean — both because it's how we want to be measured, and because it's the kind of thing that's easy to lie about.",
      },
      { type: "h2", text: "The actual payout breakdown" },
      {
        type: "p",
        text: "When you buy a 250g pack of Assam Premium Tea for ₹499 from Kopahi, here's where every rupee goes:",
      },
      {
        type: "ul",
        items: [
          "₹312 — to the farmer / co-op (62.5%)",
          "₹65 — packaging and FSSAI-compliant labelling (13%)",
          "₹40 — logistics, cold-chain, last-mile (8%)",
          "₹35 — payment gateway, GST handling, insurance (7%)",
          "₹47 — Kopahi platform fee, including QC, photography, customer service (9.5%)",
        ],
      },
      {
        type: "callout",
        text: "Compare this to the typical agri value chain, where the farmer gets 18-22% of the retail price after broker, processor, distributor, retailer markups stack up.",
      },
      { type: "h2", text: "Settlements: weekly, not monthly" },
      {
        type: "p",
        text: "Most marketplaces pay vendors monthly. We pay weekly — every Friday — for orders shipped in the prior week. Why? Because cashflow is the single biggest constraint for small farmers, and monthly settlements force them to take informal credit at predatory rates while waiting.",
      },
      { type: "h2", text: "What 'no middlemen' actually means" },
      {
        type: "p",
        text: "We mean: no commission agents, no consolidators, no rebranding of someone else's tea as ours. Every catalogue listing names the source farm or co-op. Every batch has a lot number traceable to a specific harvest week.",
      },
      {
        type: "p",
        text: "What it doesn't mean: that we don't run a platform. We do — and that platform has costs (the 9.5% above). Pretending otherwise would be a different kind of dishonesty.",
      },
      { type: "h2", text: "How we audit it" },
      {
        type: "p",
        text: "Twice a year we publish payout data — total to farmers, total to operations, total to platform. The 2025 numbers are on our /partners page. The 2026 numbers will be published in July.",
      },
      {
        type: "quote",
        text: "Trust isn't a marketing claim. It's the thing left after you've done the math in public.",
        cite: "The Kopahi Team",
      },
    ],
  },
];

export const categories = Array.from(new Set(posts.map((p) => p.category)));

export const getPostBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export const getRelated = (slug: string, limit = 3) => {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === current.category ? -1 : 0;
      const bSame = b.category === current.category ? -1 : 0;
      return aSame - bSame;
    })
    .slice(0, limit);
};
