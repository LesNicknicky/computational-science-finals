import { useEffect, useState } from "react"
import {
  Check,
  CloudRain,
  Copy,
  Database,
  Droplets,
  Info,
  Layers,
  MapPin,
  ScrollText,
  Sprout,
  TriangleAlert,
  TreePine,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* =====================================================================
   DATA
   Everything on this page is plain data at the top of the file.
   Values mirror backend/simulation/constants.py and data/*.json.
   If a backend number changes, change it here too.
   ===================================================================== */

/* ---------- references ---------- */

interface Reference {
  id: string
  citation: string
  /** Shown as an amber "Check" tag until you have verified the citation. */
  check?: string
}

// Order here sets the [1], [2]... numbers shown on the page.
const REFERENCES: Reference[] = [
  {
    id: "denr-fmb",
    citation:
      "Department of Environment and Natural Resources, Forest Management Bureau. (2023). Forestry sector report 2023: Production of major forest products [Data updated May 19, 2023].",
    check: "Add the link",
  },
  {
    id: "denr-dmo",
    citation:
      "Department of Environment and Natural Resources. (2012). Uniform replacement ratio for cut or relocated trees (DENR Memorandum Order No. 2012-02).",
    check: "Compare with the official FMB copy",
  },
  {
    id: "pagasa",
    citation:
      "Philippine Atmospheric, Geophysical and Astronomical Services Administration. (n.d.). Climatological normals, 1991–2020 [Data set]. PAGASA.",
    check: "Add link and station pages",
  },
  {
    id: "tr55",
    citation:
      "U.S. Department of Agriculture, Soil Conservation Service. (1986). Urban hydrology for small watersheds (Technical Release 55). USDA-SCS.",
  },
  {
    id: "neh630",
    citation:
      "U.S. Department of Agriculture, Natural Resources Conservation Service. (2004). Estimation of direct runoff from storm rainfall. In National engineering handbook, Part 630: Hydrology (Chapter 10). USDA-NRCS.",
    check: "Pick one source for the 0.2 value (this or TR-55)",
  },
  {
    id: "rawls",
    citation:
      "Rawls, W. J., Ahuja, L. R., Brakensiek, D. L., & Shirmohammadi, A. (1993). Infiltration and soil water movement. In D. R. Maidment (Ed.), Handbook of hydrology (pp. 5.1–5.51). McGraw-Hill.",
    check: "Confirm page range",
  },
  {
    id: "txdot",
    citation:
      "Texas Department of Transportation. (n.d.). Hydraulic design manual (Table 4-27). TxDOT.",
    check: "Add year, link, and date accessed",
  },
  {
    id: "quimio",
    citation:
      "Quimio, [initials]. (2016). [Title]. Annals of Tropical Research, 38(2), 30–51. https://doi.org/10.32945/atr3823.2016",
    check: "Fill in author initials and title",
  },
  {
    id: "lasco",
    citation: "Lasco, R. D., et al. (2006). [Title and journal to confirm].",
    check: "Full citation needed",
  },
  {
    id: "marryanna",
    citation: "Marryanna, L., et al. (2023). [Title and journal to confirm].",
    check: "Full citation needed",
  },
  {
    id: "jordan",
    citation:
      "Jordan, C. F., & Kline, J. R. ([year]). [Title and journal to confirm].",
    check: "Year and title needed",
  },
  {
    id: "alipon",
    citation: "Alipon, M. A., et al. (2016). [Title and journal to confirm].",
    check: "Full citation needed",
  },
  {
    id: "uriarte",
    citation:
      "Uriarte, M., & Piñol, J. (1996). [Title and journal to confirm].",
    check: "Full citation needed",
  },
  {
    id: "richards",
    citation:
      "Richards, F. J. (1959). A flexible growth function for empirical use. Journal of Experimental Botany, 10(2), 290–301. https://doi.org/10.1093/jxb/10.2.290",
  },
  {
    id: "coa",
    citation:
      "Commission on Audit. (2012, 2013). [National Greening Program audit reports], as reported by the Philippine Institute for Development Studies and the Senate Economic Planning Office.",
    check: "Titles, years, and report numbers needed",
  },
  {
    id: "epa-swmm",
    citation:
      "U.S. Environmental Protection Agency. (2009). SWMM applications manual (EPA/600/R-09/000). EPA.",
    check: "Confirm page for 1.27 mm",
  },
  {
    id: "nehls",
    citation:
      "Nehls, T., et al. (2015). [Title and journal to confirm; laser-scanning study of 11 pavement designs].",
    check: "Full citation needed",
  },
]

/* ---------- data sources ---------- */

interface DataSource {
  name: string
  icon: React.ElementType
  gives: string
  usedFor: string
  goodToKnow?: string
  refIds: string[]
}

const SOURCES: DataSource[] = [
  {
    name: "Log production (DENR-FMB)",
    icon: TreePine,
    gives: "How many cubic meters of logs each region produced in 2023.",
    usedFor: "Picks the five regions and sets how many trees each one has.",
    goodToKnow:
      "Covers only the first months of 2023, so it is not a full year.",
    refIds: ["denr-fmb"],
  },
  {
    name: "Rainfall normals (PAGASA)",
    icon: CloudRain,
    gives:
      "Monthly rain totals and rainy days at weather stations, 1991–2020.",
    usedFor:
      "Makes the simulated rain: how often it rains and how hard, month by month.",
    goodToKnow: "One weather station stands in for each whole region.",
    refIds: ["pagasa"],
  },
  {
    name: "Runoff numbers (SCS Curve Number)",
    icon: Layers,
    gives: "How much rain runs off each kind of ground instead of soaking in.",
    usedFor: "Sets the runoff for sand, loam, clay, gravel and pavement.",
    refIds: ["tr55", "neh630"],
  },
  {
    name: "Soil soak-in speed (Rawls)",
    icon: Droplets,
    gives: "How fast water soaks into sand, loam and clay.",
    usedFor: "Sets how quickly standing water drains away.",
    goodToKnow: "Read through the Texas DOT table, not the original book.",
    refIds: ["rawls", "txdot"],
  },
  {
    name: "Replacement rule (DENR order)",
    icon: ScrollText,
    gives: "How many seedlings must be planted for each tree cut.",
    usedFor: "Sets the number of saplings to plant: 100 for every tree cut.",
    goodToKnow: "We only use the rule for naturally growing trees.",
    refIds: ["denr-dmo"],
  },
  {
    name: "Tree growth and water use",
    icon: Sprout,
    gives:
      "How fast a tree grows, how much water it takes up, and how many survive.",
    usedFor: "Sets how long saplings need before they replace an old tree.",
    goodToKnow:
      "Growth numbers come from falcata, a fast-growing plantation tree.",
    refIds: ["uriarte", "richards", "marryanna", "alipon", "coa"],
  },
]

/* ---------- logs by region ---------- */

const NATIONAL_TOTAL_M3 = 117368.16

const TOP_REGIONS = [
  { name: "Caraga (XIII)", m3: 83565.6 },
  { name: "Calabarzon", m3: 13218.68 },
  { name: "Northern Mindanao", m3: 5169.79 },
  { name: "Central Visayas", m3: 2695.03 },
  { name: "Ilocos", m3: 2683.35 },
]

/* ---------- rain stations ---------- */

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]

interface RainStation {
  region: string
  station: string | null
  /** Monthly rain total in mm, Jan to Dec. null = not on this page yet. */
  monthly: number[] | null
  note?: string
}

const RAIN_STATIONS: RainStation[] = [
  {
    region: "Caraga",
    station: "Butuan City",
    monthly: null,
    note: "Monthly numbers not shown here yet.",
  },
  {
    region: "Calabarzon",
    station: "Infanta, Quezon",
    monthly: [
      348.9, 289.0, 220.7, 175.0, 203.7, 233.4, 265.6, 193.0, 251.1, 498.6,
      561.8, 746.3,
    ],
    note: "Most Calabarzon logs come from Quezon.",
  },
  {
    region: "Northern Mindanao",
    station: "Malaybalay, Bukidnon",
    monthly: [
      174.8, 112.8, 104.1, 118.3, 240.1, 319.5, 350.2, 300.7, 290.8, 292.1,
      177.6, 160.9,
    ],
    note: "A highland station (689.5 m), so it may be wetter than the coast.",
  },
  {
    region: "Central Visayas",
    station: null,
    monthly: null,
    note: "Station still to be confirmed.",
  },
  {
    region: "Ilocos",
    station: "Laoag City, Ilocos Norte",
    monthly: [
      6.1, 3.0, 5.3, 21.8, 218.8, 286.5, 478.9, 593.7, 412.9, 117.2, 36.6, 6.2,
    ],
    note: "Most Ilocos logs come from Pangasinan, which is not covered.",
  },
]

/* ---------- constants ---------- */

type Kind = "source" | "derived" | "assumption" | "todo"

const KIND: Record<
  Kind,
  { label: string; meaning: string; badge: string; bar: string }
> = {
  source: {
    label: "From a source",
    meaning: "Taken directly from a published study or report.",
    badge: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-500",
  },
  derived: {
    label: "Worked out",
    meaning: "Calculated by us from published numbers.",
    badge: "bg-lime-100 text-lime-800",
    bar: "bg-lime-500",
  },
  assumption: {
    label: "Our assumption",
    meaning: "A modeling choice we made, not a measured value.",
    badge: "bg-amber-100 text-amber-800",
    bar: "bg-amber-400",
  },
  todo: {
    label: "Still checking",
    meaning: "Not final yet, or not switched on in the simulator.",
    badge: "bg-stone-200 text-stone-700",
    bar: "bg-stone-400",
  },
}

interface Constant {
  name: string
  meaning: string
  value: string
  kind: Kind
  refIds?: string[]
  note?: string
}

interface ConstantGroup {
  title: string
  icon: React.ElementType
  items: Constant[]
}

const CONSTANT_GROUPS: ConstantGroup[] = [
  {
    title: "Trees and planting",
    icon: Sprout,
    items: [
      {
        name: "Saplings per tree cut",
        meaning: "How many new trees make up for one cut tree.",
        value: "100 (1 : 100)",
        kind: "source",
        refIds: ["denr-dmo"],
        note: "Naturally growing trees only. The 1 : 50 rule and the plantation exemption are not used.",
      },
      {
        name: "Sapling survival rate",
        meaning: "Share of planted saplings that survive.",
        value: "68% (range 61–85%)",
        kind: "source",
        refIds: ["coa"],
        note: "We picked the audited 68%. The 85% is a program target, not a measurement.",
      },
      {
        name: "Time to full size",
        meaning: "How long a tree takes to reach full water uptake.",
        value: "10 years (range 8–12)",
        kind: "assumption",
        refIds: ["alipon"],
        note: "The midpoint of the cited range.",
      },
      {
        name: "Growth curve shape",
        meaning: "How the sapling's uptake builds up over its life.",
        value: "Chapman-Richards curve",
        kind: "derived",
        refIds: ["uriarte", "richards"],
        note: "We fitted the curve to a published falcata height-age curve (error about 0.03).",
      },
      {
        name: "Water a full-grown tree takes up",
        meaning: "Cubic meters of water per tree per day.",
        value: "0.046 m³ / day",
        kind: "source",
        refIds: ["marryanna", "jordan"],
        note: "Published values range widely, from 0.0027 to 1.18.",
      },
      {
        name: "Trees per hectare",
        meaning: "Sets how much land the old trees cover.",
        value: "877 stems / ha",
        kind: "source",
        refIds: ["quimio"],
        note: "Measured at one site in Samar and used for every region.",
      },
      {
        name: "Volume per tree",
        meaning: "Turns cubic meters of logs into a tree count.",
        value: "Not switched on yet",
        kind: "todo",
        refIds: ["uriarte"],
        note: "The units of the volume equation still need checking.",
      },
      {
        name: "Cutting cycle",
        meaning: "Years between cuts, and how much is removed and regrown.",
        value: "35 years · 50% removed · 70% regrown",
        kind: "source",
        refIds: ["lasco"],
        note: "From a dipterocarp forest. Stored, but the limit on how much you may cut is not switched on yet.",
      },
    ],
  },
  {
    title: "Rain",
    icon: CloudRain,
    items: [
      {
        name: "Rainy days and rain per rainy day",
        meaning: "How often it rains and how much, for each month.",
        value: "Different for each region and month",
        kind: "derived",
        refIds: ["pagasa"],
        note: "A rainy day is a day with at least 1 mm. We worked out the chance and average from the monthly normals.",
      },
      {
        name: "Spread of daily rain",
        meaning: "How uneven day-to-day rain is.",
        value: "Shape 1.0",
        kind: "assumption",
        note: "Placeholder. The normals do not include day-by-day spread. To be tested in the sensitivity analysis.",
      },
    ],
  },
  {
    title: "Flood warning",
    icon: TriangleAlert,
    items: [
      {
        name: "Be careful starts at",
        meaning: "Share of the flood limit where Safe turns to Be careful.",
        value: "0.5 of the limit",
        kind: "assumption",
        note: "Project-defined (proposal Section 5.4).",
      },
      {
        name: "Danger starts at",
        meaning: "Share of the flood limit where Be careful turns to Danger.",
        value: "1.0 of the limit",
        kind: "assumption",
        note: "Project-defined (proposal Section 5.4).",
      },
      {
        name: "Water the ground can hold",
        meaning: "Standing water depth used as the flood limit.",
        value: "100 mm",
        kind: "assumption",
        note: "Placeholder. Will be tuned by sensitivity analysis.",
      },
      {
        name: "Fastest safe rise",
        meaning: "How fast runoff can build up day to day.",
        value: "50 mm / day",
        kind: "assumption",
        note: "Placeholder. Project-defined.",
      },
    ],
  },
  {
    title: "Ground",
    icon: Layers,
    items: [
      {
        name: "Early rain that never runs off",
        meaning: "Share of the storage that fills before runoff begins.",
        value: "0.2",
        kind: "source",
        refIds: ["neh630", "tr55"],
        note: "The standard value in the curve-number method.",
      },
    ],
  },
]

const ALL_CONSTANTS = CONSTANT_GROUPS.flatMap((g) => g.items)

/* ---------- ground types ---------- */

interface GroundRow {
  name: string
  cn: number
  cnNote?: string
  soak: string
  soakKind: Kind
  note?: string
  refIds: string[]
}

const GROUND: GroundRow[] = [
  {
    name: "Sand",
    cn: 39,
    soak: "235.7 mm/hr",
    soakKind: "source",
    note: "Soil group A.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Loam",
    cn: 61,
    soak: "13.2 mm/hr",
    soakKind: "source",
    note: "Soil group B.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Clay",
    cn: 80,
    soak: "0.5 mm/hr",
    soakKind: "source",
    note: "Soil group D.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Gravel or dirt",
    cn: 89,
    soak: "2 mm/hr (range 0–4)",
    soakKind: "assumption",
    note: "Soak-in is the midpoint of a forest-road range from the literature.",
    refIds: ["tr55"],
  },
  {
    name: "Partial pavement",
    cn: 79.5,
    soak: "Mix of loam and pavement",
    soakKind: "derived",
    note: "Half loam, half pavement (our choice), averaged by area.",
    refIds: ["tr55"],
  },
  {
    name: "Full pavement",
    cn: 98,
    soak: "No sourced value yet",
    soakKind: "todo",
    note: "Pavement holds about 1.27 mm before runoff starts (typical; range 0.6–2.5). That is storage, not drainage speed.",
    refIds: ["tr55", "epa-swmm", "nehls"],
  },
]

/* ---------- limits ---------- */

const LIMITS: string[] = [
  "The log data covers only the first months of 2023, not a full year.",
  "Only the five biggest log-producing regions are included.",
  "One tree density, measured at one site in Samar, is used for every region.",
  "Growth and water-use numbers come from falcata, a fast plantation tree. The cutting-cycle numbers come from a different forest type.",
  "Each region uses one weather station, and day-to-day rain spread is assumed.",
  "Only the 1 : 100 rule for naturally growing trees is modeled.",
  "Full pavement has no sourced drainage speed, so how long it floods is not modeled yet.",
  "Storm drains and gutters are not modeled.",
  "Several flood thresholds are placeholders until the sensitivity analysis is done.",
]

/* ---------- navigation ---------- */

const NAV = [
  { id: "sources", label: "Data sources" },
  { id: "regions", label: "Where the logs come from" },
  { id: "rain", label: "Where the rain data comes from" },
  { id: "constants", label: "The numbers we use" },
  { id: "ground", label: "Ground types" },
  { id: "limits", label: "What this does not cover" },
  { id: "references", label: "References" },
]
const NAV_IDS = NAV.map((n) => n.id)

/* =====================================================================
   SMALL PIECES
   ===================================================================== */

function refNumber(id: string) {
  return REFERENCES.findIndex((r) => r.id === id) + 1
}

function Refs({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) {
    return <span className="text-xs text-muted-foreground">None</span>
  }
  return (
    <span className="inline-flex flex-wrap gap-1">
      {ids.map((id) => {
        const n = refNumber(id)
        if (n === 0) return null
        return (
          <a
            key={id}
            href={`#ref-${id}`}
            className="rounded-md bg-emerald-700/10 px-1.5 py-0.5 text-xs font-medium text-emerald-800 hover:bg-emerald-700/20"
          >
            [{n}]
          </a>
        )
      })}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} className="shrink-0">
      {copied ? (
        <Check className="mr-1 size-4" />
      ) : (
        <Copy className="mr-1 size-4" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  blurb,
}: {
  icon: React.ElementType
  title: string
  blurb?: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-emerald-700 text-white">
          <Icon className="size-4" aria-hidden />
        </span>
        {title}
      </h3>
      {blurb && <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>}
    </div>
  )
}

function KindBadge({ kind }: { kind: Kind }) {
  return <Badge className={KIND[kind].badge}>{KIND[kind].label}</Badge>
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActive(top.target.id)
      },
      { rootMargin: "-10% 0px -70% 0px" }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function ResearchPage() {
  const [filter, setFilter] = useState<Kind | "all">("all")
  const active = useActiveSection(NAV_IDS)

  const counts = (Object.keys(KIND) as Kind[]).map((k) => ({
    kind: k,
    n: ALL_CONSTANTS.filter((c) => c.kind === k).length,
  }))
  const total = ALL_CONSTANTS.length
  const needCheck = REFERENCES.filter((r) => r.check).length

  return (
    <div className="app-bg relative min-h-svh p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* ---------- header + trust meter ---------- */}
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-emerald-800">
              <Database className="size-4" aria-hidden /> Sources
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Where our numbers come from
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Every number in the simulator is listed here, with where it came
              from and how solid it is.
            </p>
          </div>

          <GlassCard className="p-5">
            <p className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
              <Info className="size-4 text-emerald-700" aria-hidden /> How solid
              are our numbers?
            </p>
            <div
              className="flex h-3 overflow-hidden rounded-full bg-white/60"
              role="img"
              aria-label={counts
                .map((c) => `${c.n} ${KIND[c.kind].label}`)
                .join(", ")}
            >
              {counts.map((c) => (
                <div
                  key={c.kind}
                  className={cn(KIND[c.kind].bar, "transition-all")}
                  style={{ width: `${(c.n / total) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              {counts.map((c) => (
                <button
                  key={c.kind}
                  type="button"
                  onClick={() => {
                    setFilter(c.kind)
                    document
                      .getElementById("constants")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="rounded-lg p-1.5 text-left hover:bg-white/60"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={cn("size-2 rounded-full", KIND[c.kind].bar)}
                    />
                    {KIND[c.kind].label}
                  </span>
                  <span className="text-xl font-semibold">{c.n}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {needCheck} of {REFERENCES.length} references still need a detail
              confirmed before submission.
            </p>
          </GlassCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-[210px_minmax(0,1fr)] xl:items-start">
          {/* ---------- nav ---------- */}
          <nav className="hidden xl:sticky xl:top-6 xl:block">
            <p className="mb-2 text-sm font-medium">On this page</p>
            <ul className="space-y-0.5 border-l border-emerald-800/20 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={cn(
                      "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                      active === n.id
                        ? "border-emerald-700 font-medium text-emerald-900"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 max-w-4xl space-y-5">
            {/* ---------- data sources ---------- */}
            <GlassCard id="sources" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Database}
                title="Data sources"
                blurb="The reports and datasets behind the simulator."
              />
              <div className="grid gap-3 md:grid-cols-2">
                {SOURCES.map((s) => (
                  <div
                    key={s.name}
                    className="space-y-3 rounded-xl border border-white/70 bg-white/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-2 font-medium">
                        <s.icon
                          className="size-4 shrink-0 text-emerald-700"
                          aria-hidden
                        />
                        {s.name}
                      </p>
                      <Refs ids={s.refIds} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        What it gives us
                      </p>
                      <p className="text-sm">{s.gives}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Where we use it
                      </p>
                      <p className="text-sm">{s.usedFor}</p>
                    </div>
                    {s.goodToKnow && (
                      <p className="flex items-start gap-1.5 rounded-lg bg-amber-100/70 px-2.5 py-1.5 text-xs text-amber-900">
                        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                        {s.goodToKnow}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* ---------- logs by region ---------- */}
            <GlassCard id="regions" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={MapPin}
                title="Where the logs come from"
                blurb={
                  <>
                    The five regions with the most logs, as a share of the
                    national total of{" "}
                    {NATIONAL_TOTAL_M3.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    m³ (early 2023). <Refs ids={["denr-fmb"]} />
                  </>
                }
              />
              <div className="space-y-4">
                {TOP_REGIONS.map((r, i) => {
                  const share = (r.m3 / NATIONAL_TOTAL_M3) * 100
                  return (
                    <div key={r.name} className="space-y-1.5">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="font-medium">
                          <span className="mr-2 text-muted-foreground">
                            {i + 1}
                          </span>
                          {r.name}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(r.m3).toLocaleString()} m³ ·{" "}
                          {share.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-white/60">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-700"
                          style={{ width: `${Math.max(share, 1.5)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Caraga alone produced about 7 of every 10 logs.
              </p>
            </GlassCard>

            {/* ---------- rain stations ---------- */}
            <GlassCard id="rain" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={CloudRain}
                title="Where the rain data comes from"
                blurb={
                  <>
                    One PAGASA weather station per region, using 1991–2020
                    averages. Bars show the rain total for each month.{" "}
                    <Refs ids={["pagasa"]} />
                  </>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {RAIN_STATIONS.map((s) => {
                  const max = s.monthly ? Math.max(...s.monthly) : 0
                  const year = s.monthly
                    ? s.monthly.reduce((a, b) => a + b, 0)
                    : null
                  return (
                    <div
                      key={s.region}
                      className="rounded-xl border border-white/70 bg-white/50 p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{s.region}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.station ?? "Station to be confirmed"}
                          </p>
                        </div>
                        {year !== null && (
                          <p className="text-right text-sm font-semibold text-emerald-800">
                            {Math.round(year).toLocaleString()} mm
                            <span className="block text-xs font-normal text-muted-foreground">
                              per year
                            </span>
                          </p>
                        )}
                      </div>
                      {s.monthly ? (
                        <div
                          className="mt-3 flex h-16 items-end gap-1"
                          role="img"
                          aria-label={`Monthly rain at ${s.station}`}
                        >
                          {s.monthly.map((v, i) => (
                            <div
                              key={i}
                              className="flex h-full flex-1 flex-col justify-end gap-1"
                              title={`${v} mm`}
                            >
                              <div
                                className="rounded-sm bg-emerald-600/80"
                                style={{ height: `${(v / max) * 100}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 grid h-16 place-items-center rounded-lg border border-dashed border-stone-300 text-xs text-muted-foreground">
                          No chart yet
                        </div>
                      )}
                      {s.monthly && (
                        <div className="mt-1 flex gap-1 text-[10px] text-muted-foreground">
                          {MONTHS.map((m, i) => (
                            <span key={i} className="flex-1 text-center">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.note && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {s.note}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </GlassCard>

            {/* ---------- constants ---------- */}
            <GlassCard id="constants" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Layers}
                title="The numbers we use"
                blurb="Tap a label to show only that kind of number."
              />

              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === "all"
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-emerald-800/20 bg-white/50 hover:bg-white/80"
                  )}
                >
                  All ({total})
                </button>
                {(Object.keys(KIND) as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilter(k)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      filter === k
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-emerald-800/20 bg-white/50 hover:bg-white/80"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", KIND[k].bar)} />
                    {KIND[k].label}
                  </button>
                ))}
              </div>

              {filter !== "all" && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {KIND[filter].meaning}
                </p>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>What it is</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>How solid</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONSTANT_GROUPS.map((g) => {
                    const rows = g.items.filter(
                      (c) => filter === "all" || c.kind === filter
                    )
                    if (rows.length === 0) return null
                    return [
                      <TableRow
                        key={g.title}
                        className="bg-emerald-700/10 hover:bg-emerald-700/10"
                      >
                        <TableCell
                          colSpan={4}
                          className="text-xs font-semibold text-emerald-900"
                        >
                          <span className="flex items-center gap-1.5">
                            <g.icon className="size-3.5" aria-hidden />
                            {g.title}
                          </span>
                        </TableCell>
                      </TableRow>,
                      ...rows.map((c) => (
                        <TableRow key={c.name}>
                          <TableCell className="max-w-64 whitespace-normal">
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {c.meaning}
                            </p>
                            {c.note && (
                              <p className="mt-1 text-xs text-stone-600">
                                {c.note}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="whitespace-normal font-medium">
                            {c.value}
                          </TableCell>
                          <TableCell>
                            <KindBadge kind={c.kind} />
                          </TableCell>
                          <TableCell>
                            <Refs ids={c.refIds} />
                          </TableCell>
                        </TableRow>
                      )),
                    ]
                  })}
                </TableBody>
              </Table>
            </GlassCard>

            {/* ---------- ground types ---------- */}
            <GlassCard id="ground" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Layers}
                title="Ground types"
                blurb="Runoff number: the higher it is, the more rain runs off instead of soaking in. Soak-in speed: how fast standing water drains away."
              />
              <div className="space-y-3">
                {GROUND.map((g) => (
                  <div
                    key={g.name}
                    className="grid gap-x-4 gap-y-2 rounded-xl border border-white/70 bg-white/50 p-4 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="font-medium">{g.name}</p>
                      <Refs ids={g.refIds} />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Runoff number
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/70">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-800"
                            style={{ width: `${g.cn}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-sm font-semibold">
                          {g.cn}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Soak-in speed
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{g.soak}</span>
                        <KindBadge kind={g.soakKind} />
                      </div>
                    </div>

                    {g.note && (
                      <p className="text-xs text-muted-foreground md:col-span-3">
                        {g.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Soak-in speeds for sand, loam and clay come from Rawls et al.
                (1993) through the Texas DOT table.
              </p>
            </GlassCard>

            {/* ---------- limits ---------- */}
            <GlassCard id="limits" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={TriangleAlert}
                title="What this does not cover"
                blurb="Good to keep in mind when reading the results."
              />
              <ul className="grid gap-2 sm:grid-cols-2">
                {LIMITS.map((l) => (
                  <li
                    key={l}
                    className="flex items-start gap-2 rounded-xl border border-white/70 bg-white/50 p-3 text-sm"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0 text-amber-600"
                      aria-hidden
                    />
                    {l}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* ---------- references ---------- */}
            <GlassCard id="references" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={ScrollText}
                title="References"
                blurb="Full citations for the sources above. Items tagged Check still need a detail confirmed."
              />
              <ol className="space-y-3 text-sm">
                {REFERENCES.map((r, i) => (
                  <li
                    key={r.id}
                    id={`ref-${r.id}`}
                    className="flex scroll-mt-6 items-start justify-between gap-2"
                  >
                    <span>
                      <span className="mr-2 text-muted-foreground">
                        [{i + 1}]
                      </span>
                      {r.citation}
                      {r.check && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800">
                          Check: {r.check}
                        </Badge>
                      )}
                    </span>
                    <CopyButton text={r.citation} />
                  </li>
                ))}
              </ol>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}