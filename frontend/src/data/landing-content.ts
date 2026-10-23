/**
 * EDIT THIS FILE to change the landing page.
 *
 * - Text: just change the strings. Wrap words in **double asterisks** to make them bold.
 * - Images: put your files in the folder  frontend/public/images/
 *   and match the file name here ("/images/forest-hero.jpg" = public/images/forest-hero.jpg).
 *   If a file is missing or the path is "", a plain green background shows instead.
 * - Hide a whole section: set its `show` to false.
 * - News videos live in data/news-video.ts.
 */

export const SITE = {
  name: "BINHI",
  navSubtitle: "REFORESTATION OFFSET SIMULATOR",
  fullTitle:
    "Reforestation Offset Simulator: Modeling Sapling Requirements, Absorption Recovery, and Relative Flood Risk",
  standardBadge: "DENR MO 2012-02 Standard",
  launchLabel: "Launch Simulator",
  footerCredit:
    "© 2026 Team Dysonic • DENR MO 2012-02 & PAGASA climatological data",
}

export const NAV_LINKS = [
  { href: "#purpose", label: "Purpose" },
  { href: "#problem", label: "Problem & Solution" },
  { href: "#news", label: "Hazards & News" },
]

export const HERO = {
  image: "/public/landing/hero.jpg",
  pill: "Interactive Hydrological Reforestation & Flood Risk Guide",
  title: "BINHI",
  subtitle:
    "Reforestation Offset Simulator: Modeling Sapling Requirements, Absorption Recovery, and Relative Flood Risk",
  primaryButton: "Launch Simulator",
  secondaryButton: "Learn How It Works",
  didYouKnow: {
    show: true,
    title: "Did You Know?",
    body: "Every time a mature tree is cleared, the soil loses its natural sponge-like absorption capacity. Rainwater that used to soak deep into the earth now rushes over the surface as flash floods. A single sapling doesn't instantly replace a mature tree: saplings start small and face natural field mortality. That is why DENR regulations require planting 100 saplings for every naturally growing tree cut.",
  },
  mandate: {
    show: true,
    image: "/public/landing/sechero.jpg",
    imageBadge: "Watershed Protection Protocol",
    label: "DENR MO 2012-02 MANDATE",
    ratio: "1 : 100 ratio",
    body: "Every 1 naturally growing mature tree cut requires 100 planted saplings to buffer canopy interception loss and restore soil permeability over time.",
  },
}

export const PURPOSE = {
  show: true,
  tag: "PURPOSE & CORE CONCEPTS",
  title: "The Science Behind Reforestation Offsets",
  intro:
    "How tree cutting, soil drainage, and multi-year recovery lags combine to create downstream flood risk.",
  cards: [
    {
      title: "The Replacement Gap",
      image: "/public/landing/treeplanting.jpg",
      imageBadge: "1 tree cut ≠ 1 sapling planted",
      visual: "image" as const,
      body: "One mature tree absorbs an estimated **0.046 m³ (46 liters) of water per day**. Because newly planted saplings are small and face field mortality (modeled at a **68% default survival rate**), planting a 1-to-1 ratio leaves watersheds vulnerable. That is why **DENR Memorandum Order No. 2012-02** requires planting **100 saplings per naturally growing tree cut**.",
    },
    {
      title: "The Hydrological Shield",
      image: "/public/landing/lake.jpg",
      imageBadge: "Runoff & soil infiltration",
      visual: "image" as const,
      body: "Rainfall behavior depends on soil structure and permeability. Porous soils like **sand and loam** absorb water quickly and recharge deep aquifers, while compacted soils like **clay and gravel/dirt** make rainwater pool and rush off as flash floods.",
    },
    {
      title: "Growth Lag Time",
      image: "",
      imageBadge: "",
      // "growth-chart" shows the animated curve instead of a photo
      visual: "growth-chart" as const,
      body: "Saplings do not act like mature trees overnight. Using biological growth curves (Chapman–Richards function fitted to Falcataria moluccana), BINHI tracks the multi-year transition window, showing planners and communities how long a watershed stays exposed to elevated runoff before the canopy fully recovers.",
    },
  ],
}

export const PROBLEM = {
  show: true,
  tag: "PROBLEM & PREVENTION",
  title: "The Watershed Crisis & How BINHI Prevents Disasters",
  intro:
    "Why conventional tree-planting counts fall short, and how simulation helps communities foresee flash floods.",
  problem: {
    badge: "The core problem",
    title: "Blind Reforestation & The Vulnerability Gap",
    body: "When local government units (LGUs) or developers cut mature forests for timber, agriculture, or infrastructure, standard policies often require tree replacement without accounting for **temporal growth lag** or **soil compaction**.",
    items: [
      {
        title: "False sense of security",
        text: "Planting saplings today does not stop next week's monsoon flash floods.",
      },
      {
        title: "Ignoring mortality",
        text: "Overlooking seedling field mortality leaves watersheds severely under-protected.",
      },
      {
        title: "Soil type neglect",
        text: "Treating clay soils like sandy soils leads to major runoff underestimation.",
      },
    ],
    resultLabel: "Result without planning:",
    result: "Severe flash floods & erosion",
  },
  solution: {
    badge: "How BINHI solves it",
    title: "Proactive Modeling & Risk-Aware Planning",
    body: "BINHI bridges ecological policy and hydrological science in an interactive sandbox tool. By simulating daily rainfall, soil absorption, and sapling maturation, it gives planners actionable foresight.",
    items: [
      {
        title: "Quantifying lead time",
        text: "Planners see how many years a community stays exposed before canopy closure.",
      },
      {
        title: "Survival-adjusted targets",
        text: "Mortality buffers are computed so planting counts match real-world survival.",
      },
      {
        title: "Regional climatology",
        text: "Scenarios run against regional PAGASA storm normals to prepare for peak monsoon months.",
      },
    ],
    resultLabel: "Result with BINHI:",
    result: "Informed LGU decisions & disaster resilience",
  },
  disclaimer:
    "BINHI reports relative flood risk for planning and education. It is not a flood forecast or an engineering assessment.",
}

export const NEWS = {
  show: true,
  tag: "REAL-WORLD HAZARDS & NEWS",
  title: "Deforestation & Flooding in the News",
  intro:
    "Investigative reports and broadcasts on how mountain clearing, illegal logging, and lost ground permeability drive flooding across Philippine watersheds.",
  selectLabel: "SELECT A BROADCAST",
  watchLabel: "Watch on YouTube",
}

export const CTA = {
  show: true,
  image: "/images/canopy-tree.jpg",
  titleBefore: "Ready to Model Reforestation Scenarios with",
  titleHighlight: "BINHI",
  titleAfter: "?",
  body: "Select a Philippine region, choose a ground type, set the share of mature trees removed, and run the simulation to explore absorption recovery and relative flood risk.",
  button: "Launch Simulator",
}
