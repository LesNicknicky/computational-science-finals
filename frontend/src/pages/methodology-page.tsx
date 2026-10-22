import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface ConstantRow {
  symbol: string
  meaning: string
  value: string
  /** Where the value comes from. [n] matches the numbers on the Sources page. */
  source: string
}

interface MethodSection {
  id: string
  title: string
  inShort: string
  summary: string
  formula: string
  constants: ConstantRow[]
  assumptions: string[]
}

const SECTIONS: MethodSection[] = [
  {
    id: "rain-area",
    title: "Rainfall and study area",
    inShort:
      "Before anything else, the simulator needs to know how much land the trees cover and how it rains there. The land area comes from the number of trees. The rain comes from the monthly weather averages of one PAGASA station per region.",
    summary:
      "The monthly normals give rainy days and totals, not daily rain. So for each month the chance of a wet day and the average rain on a wet day are worked out from them, and then daily rain is drawn at random: a dry day with probability 1 − p_w, otherwise a Gamma-distributed amount. The study area is the area implied by the number of trees and an assumed trees-per-hectare density.",
    formula: `Study area
A = 10,000 · N / D                                        (m²)

Monthly inputs from the PAGASA normals
p_w = R_m / D_m          (rainy days ÷ days in the month)
μ_w = P_m / R_m          (monthly total ÷ rainy days)

Daily rainfall
P_d = 0 with probability 1 − p_w
P_d ~ Gamma(α, θ) with probability p_w,  αθ = μ_w          (Eq. 8)

Example: Infanta, December: 746.3 mm over 25 rainy days, 31 days
p_w = 25 / 31 ≈ 0.81,   μ_w = 746.3 / 25 ≈ 29.85 mm`,
    constants: [
      {
        symbol: "N",
        meaning: "Mature trees in the region before cutting",
        value: "Set per region",
        source: "DENR-FMB log production [4]",
      },
      {
        symbol: "D",
        meaning: "Trees per hectare",
        value: "44 trees/ha",
        source: "Quimio (2016), one site in Samar, used for every region [21]",
      },
      {
        symbol: "R_m, P_m",
        meaning: "Rainy days and rain total for the month",
        value: "From the station table",
        source: "PAGASA normals 1991–2020 [14]",
      },
      {
        symbol: "—",
        meaning: "What counts as a rainy day",
        value: "At least 1 mm in 24 hours",
        source: "PAGASA definition [14]",
      },
      {
        symbol: "α",
        meaning: "Gamma shape of wet-day rain",
        value: "1.0 (tested over 0.43–1.01)",
        source: "Provisional; range from Bermudez et al. [13]",
      },
      {
        symbol: "—",
        meaning: "Random seed for the rain",
        value: "42 (fixed)",
        source: "Same seed gives the same rain every run",
      },
    ],
    assumptions: [
      "Each region uses one weather station: Butuan (Caraga), Mactan (Central Visayas), Laoag (Ilocos), Infanta (Calabarzon) and Malaybalay (Northern Mindanao).",
      "The rain is a made-up year that fits the monthly averages. It is not a record of real days, so it can miss long wet spells and extreme days.",
      "α = 1 is an assumption because monthly normals say nothing about how rain varies from day to day.",
      "The area is only what the tree count and density imply. It is not a mapped boundary.",
    ],
  },
  {
    id: "saplings",
    title: "Sapling Requirement",
    inShort:
      "A mature tree soaks up much more water than a young sapling, so cutting one means planting several to make up for it. Some saplings won't survive, so we plan for extra.",
    summary:
      "The number of trees cut is the cut fraction times the mature trees. Saplings planted follow the DENR replacement ratio R, meaning saplings per tree cut. The result is rounded up so the offset is never short by a fraction of a sapling. Only the saplings that survive are counted later as absorbing water.",
    formula: `N_c = round(c · N)        (Eq. 1, cut trees)
N_s = ⌈R · N_c⌉           (Eq. 2, saplings planted)
σ · N_s                   (saplings expected to survive)

N   = mature trees before cutting
c   = cut fraction (cut now % / 100)
R   = saplings planted per tree cut
σ   = sapling survival rate`,
    constants: [
      {
        symbol: "R",
        meaning: "Saplings planted per natural tree cut",
        value: "100",
        source: "DENR Memorandum Order 2012-02 [10]",
      },
      {
        symbol: "σ",
        meaning: "Share of saplings that survive",
        value: "0.68 (range 0.61–0.85)",
        source: "COA audit, via PIDS and the Senate office [19], [38], [39]",
      },
      {
        symbol: "c",
        meaning: "Share of trees cut",
        value: "Your input",
        source: "Set with the slider",
      },
    ],
    assumptions: [
      "Only the 1 : 100 rule for naturally growing trees is used. The 1 : 50 rule for planted trees and the plantation exemption are left out.",
      "σ = 0.68 is the audited value we picked. The 0.85 end of the range is a program target, not a measurement.",
      "Survival is one average rate. Random sapling deaths, drought years and replanting are not simulated.",
    ],
  },
  {
    id: "absorption",
    title: "Absorption recovery over time",
    inShort:
      "New trees start small and take time to grow. As they grow, their roots soak up more rain, so the land slowly recovers what the cut took away. The type of ground changes how fast water soaks in.",
    summary:
      "A sapling absorbs a fraction f of what a mature tree does, and f rises with age along a Chapman–Richards growth curve. Total absorption is the trees left standing plus the surviving saplings, and it never goes above what the forest absorbed before the cut. Recovered absorption is that total as a percentage of the amount before the cut, capped at 100%.",
    formula: `a_s(τ) = a_m · f(τ)                                      (Eq. 3)
f(τ)   = (1 − e^(−kτ))^p                                 (Eq. 4)
V(t)   = (N − N_c) · a_m + σ · N_s · a_m · f(τ_t)        (Eq. 5)
ρ(t)   = min(100, 100 · V(t) / (N · a_m))                (Eq. 6)

a_m = daily absorption of one mature tree (m³/tree/day)
τ   = sapling age in years
k,p = growth curve shape
σ   = sapling survival rate
V   = absorption of the whole stand (m³/day)
ρ   = absorption recovery in % (written A_r in the paper)`,
    constants: [
      {
        symbol: "a_m",
        meaning: "Water one mature tree takes up per day",
        value: "0.046 m³/tree/day (range 0.0027–1.18)",
        source:
          "Sap-flow study of other tropical trees, used as a stand-in [20], [34]",
      },
      {
        symbol: "k",
        meaning: "Growth rate",
        value: "0.2244 per year (8-year: 0.2805, 12-year: 0.187)",
        source: "Fitted to the falcata height–age curve [11], [7], [8]",
      },
      {
        symbol: "p",
        meaning: "Growth curve shape",
        value: "0.7665",
        source: "Fitted to the falcata height–age curve [11]",
      },
      {
        symbol: "t_mature",
        meaning: "Years for falcata to reach maturity",
        value: "10 years (range 8–12)",
        source: "Midpoint of the range in Alipon et al. [27]",
      },
      {
        symbol: "σ",
        meaning: "Sapling survival rate",
        value: "0.68",
        source: "See Sapling Requirement [19]",
      },
    ],
    assumptions: [
      "The growth curve form is cited (Richards, 1959). The values of k and p are fitted by the project, and a_m is a proxy from other species.",
      "Growth and water-use numbers come from falcata, a fast plantation tree. They are not assumed to hold for other species.",
      "Sap flow and soil-water absorption are related but not the same thing, so a_m is not a measured value for these stands.",
    ],
  },
  {
    id: "flood-risk",
    title: "Flood risk and rate of rise",
    inShort:
      "Each month we compare how much rain falls with how much water the land can still soak up. The bigger the gap, the higher the chance of flooding, shown as Safe, Be careful, or Danger.",
    summary:
      "The Curve Number method turns each day's rain into runoff, and the water the trees and saplings absorb is subtracted. What is left collects as ponded water and drains away each day at a rate set by the ground type. The warning threshold scales with how much absorption has recovered, so a freshly cut area is more sensitive than a recovered one.",
    formula: `Runoff (SCS Curve Number)
S   = 25400 / CN − 254                                      (Eq. 9)
I_a = λ · S,  λ = 0.20                                      (Eq. 10)
Q   = (P − I_a)² / (P − I_a + S)  for P > I_a, else 0       (Eq. 11)
CN_c = (A_imp · 98 + A_perv · CN_perv) / A                  (Eq. 12)

Ponding and drainage
Q_net,d = max(0, Q_d − 1000 · V(t) / A)                     (Eq. 13)
C_d     = max(0, C_(d−1) + Q_net,d − E_d)                   (Eq. 14)
f(F)    = K_s · (1 + ψΔθ / F)                               (Eq. 15)
E_d     = 24 · K_s   (soil and gravel; partial pavement scaled by its pervious share)
E_d     = q_d        (full pavement)                        (Eq. 16)

Rate of rise and risk
r_d  = C_d − C_(d−1)                                        (Eq. 17)
T(t) = T_0 · ρ(t) / 100                                     (Eq. 18)
I_d  = C_d / T(t)                                           (Eq. 19)

Q = runoff (mm)   P = daily rain (mm)   S = maximum retention (mm)
C_d = ponded water (mm)   E_d = water removed per day (mm/day)`,
    constants: [
      {
        symbol: "λ",
        meaning: "Initial abstraction ratio",
        value: "0.20",
        source: "TR-55 [9]",
      },
      {
        symbol: "CN",
        meaning: "Curve Number by ground",
        value:
          "Sand 39 · Loam 61 · Clay 80 · Gravel or dirt 89 · Partial pavement 79.5 · Full pavement 98",
        source: "TR-55 tables [9], [16]",
      },
      {
        symbol: "A_imp / A",
        meaning: "Paved share of partial pavement",
        value: "0.5 (the rest is loam)",
        source: "Project-defined",
      },
      {
        symbol: "K_s",
        meaning: "How fast water soaks into the ground",
        value:
          "Sand 235.7 · Loam 13.2 · Clay 0.5 · Gravel or dirt 2 (0–4), in mm/h",
        source: "Rawls et al. via Texas DOT [17], [18]; gravel [23], [24]",
      },
      {
        symbol: "ψ",
        meaning: "Suction at the wetting front",
        value: "Sand 49.5 · Loam 88.9 · Clay 316.2, in mm",
        source: "Rawls et al. via Texas DOT [17], [18]",
      },
      {
        symbol: "q_d",
        meaning: "Drain rate of full pavement",
        value: "120 mm/day (5 mm/h × 24)",
        source: "Provisional, borrowed from international studies",
      },
      {
        symbol: "T_0",
        meaning: "Base flood-warning depth",
        value: "100 mm",
        source: "Provisional; a 0.1 m hazard depth [22]",
      },
      {
        symbol: "r_lim",
        meaning: "Rate of rise that bumps the status up one band",
        value: "50 mm/day",
        source: "Provisional, project-defined",
      },
      {
        symbol: "—",
        meaning: "Status bands for the risk index",
        value: "Safe below 0.5 · Be careful 0.5 to below 1.0 · Danger 1.0 or more",
        source: "Project-defined",
      },
      {
        symbol: "C_0",
        meaning: "Ponded water at the start",
        value: "0 mm",
        source: "Starting assumption",
      },
    ],
    assumptions: [
      "A fast rate of rise (r_d above r_lim) moves the status up one band.",
      "Eq. 18 follows the simulator code. The paper prints this threshold as H_base · (1 − A_r/100), which gives the opposite behavior.",
      "The runoff coefficient (through CN) sets how much water collects. E_d sets how long it stays.",
      "Equations 13, 14, 16, 17, 18 and 19 are project-defined design choices, not published methods, and have not been checked against real flood events.",
      "The risk index is a relative indicator for comparing scenarios, not a predicted flood depth.",
      "The Curve Number method was built for small US watersheds, so applying it to Philippine daily rainfall is an approximation.",
      "The soak-in term may count some infiltration twice, because the Curve Number method already includes it after runoff starts.",
      "Gravel or dirt is not one standard soil, so its K_s of 2 mm/h is an approximation.",
    ],
  },
  {
    id: "lead-time",
    title: "Lead time before cutting",
    inShort:
      "Saplings need time to grow before they help. Planting them months before the cut means the land isn't left unprotected while they catch up.",
    summary:
      "For a full offset, the surviving saplings must match the absorption of the trees that were cut. That means f(τ) must reach φ. Solving the growth curve for age gives how long before the cut the saplings must be planted. If φ is 1 or more, the saplings can never match the loss and more must be planted.",
    formula: `φ      = N_c / (σ · N_s)
τ_lead = −ln(1 − φ^(1/p)) / k,   valid for 0 < φ < 1     (Eq. 7)`,
    constants: [
      {
        symbol: "k, p",
        meaning: "Growth curve",
        value: "0.2244 per year, 0.7665",
        source: "See Absorption recovery [11]",
      },
      {
        symbol: "σ",
        meaning: "Sapling survival rate",
        value: "0.68",
        source: "See Sapling Requirement [19]",
      },
      {
        symbol: "N_c, N_s",
        meaning: "Trees cut and saplings planted",
        value: "From your inputs",
        source: "Calculated",
      },
    ],
    assumptions: [
      "Depends on the assumed values of k, p and σ.",
      "This is a model-based estimate, not an observation of real forest recovery.",
    ],
  },
]

function MethodCard({
  s,
  open,
  onOpenChange,
}: {
  s: MethodSection
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Card id={s.id} className="scroll-mt-4">
      <CardHeader>
        <CardTitle>{s.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">In short</p>
          <p className="mt-1 text-sm">{s.inShort}</p>
        </div>

        <Collapsible open={open} onOpenChange={onOpenChange}>
          <CollapsibleTrigger className="clay-sm clay-press flex items-center gap-1 rounded-full! px-4 py-1.5 text-sm font-bold text-emerald-700">
            Show the math
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <p className="text-sm">{s.summary}</p>
            <pre className="clay-inset overflow-x-auto rounded-2xl! p-4 text-sm">
              {s.formula}
            </pre>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-emerald-900">
                Constants and variables
              </p>
              <div className="clay-inset overflow-x-auto rounded-2xl! p-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Meaning</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {s.constants.map((c) => (
                      <TableRow key={`${c.symbol}-${c.meaning}`}>
                        <TableCell className="font-mono font-semibold whitespace-nowrap">
                          {c.symbol}
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          {c.meaning}
                        </TableCell>
                        <TableCell className="font-semibold whitespace-normal">
                          {c.value}
                        </TableCell>
                        <TableCell className="whitespace-normal text-muted-foreground">
                          {c.source}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {s.assumptions.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {s.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export default function MethodologyPage() {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const allOpen = SECTIONS.every((s) => open[s.id])
  const setAll = (value: boolean) =>
    setOpen(Object.fromEntries(SECTIONS.map((s) => [s.id, value])))

  return (
    <div className="app-bg mx-auto min-h-svh w-full max-w-none p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-4">
          <h2 className="text-xl font-extrabold text-emerald-900">
            Methodology
          </h2>
          <p className="text-sm text-muted-foreground">
            How each number in the simulator is calculated
          </p>
          <button
            type="button"
            onClick={() => setAll(!allOpen)}
            className="clay-sm clay-press mt-2 rounded-full! px-4 py-1.5 text-sm font-bold text-emerald-700"
          >
            {allOpen ? "Hide all the math" : "Show all the math"}
          </button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-start">
          <nav className="xl:sticky xl:top-4">
            <p className="mb-2 text-sm font-medium">On this page</p>
            <ul className="clay-sm space-y-1 p-4 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-4xl space-y-4">
            {SECTIONS.map((s) => (
              <MethodCard
                key={s.id}
                s={s}
                open={!!open[s.id]}
                onOpenChange={(v) => setOpen((o) => ({ ...o, [s.id]: v }))}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}