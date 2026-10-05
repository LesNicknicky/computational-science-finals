import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface MethodSection {
  id: string
  title: string
  inShort: string
  summary: string
  formula: string
  assumptions: string[]
}

const SECTIONS: MethodSection[] = [
  {
    id: "saplings",
    title: "Sapling Requirement",
    inShort:
      "A mature tree soaks up much more water than a young sapling, so cutting one means planting several to make up for it. Some saplings won't survive, so we plan for extra.",
    summary:
      "The number of trees cut is the cut fraction times the mature trees. Saplings planted follow a replacement ratio R, meaning saplings per tree cut. The result is rounded up so the offset is never short by a fraction of a sapling.",
    formula: `N_c = round(c · N)        (cut trees)
N_s = ⌈R · N_c⌉           (Eq. 9, saplings planted)

N   = mature trees before cutting
c   = cut fraction (cut now % / 100)
R   = saplings planted per tree cut`,
    assumptions: [
      "The replacement ratio R is a project-defined value and still a research item (Philippine replacement requirements).",
      "Sapling survival rate σ is also project-defined and still to be set.",
    ],
  },
  {
    id: "absorption",
    title: "Absorption recovery over time",
    inShort:
      "New trees start small and take time to grow. As they grow, their roots soak up more rain, so the land slowly recovers what the cut took away. The type of ground changes how fast water soaks in.",
    summary:
      "A sapling absorbs a fraction f of what a mature tree does, and f rises with age along a Chapman–Richards growth curve. Total absorption is the trees left standing plus the surviving saplings. Recovered absorption is that total as a percentage of the amount before the cut, capped at 100%.",
    formula: `a_s(τ) = a_m · f(τ),  f(τ) = (1 − e^(−kτ))^p          (Eq. 6)
V(t)   = (N − N_c) · a_m + σ · N_s · a_m · f(τ_t)        (Eq. 7)
ρ(t)   = min(100, 100 · V(t) / (N · a_m))                (Eq. 8)

a_m = daily absorption of one mature tree
τ   = sapling age in years
k,p = growth curve shape
σ   = sapling survival rate`,
    assumptions: [
      "The growth curve form is cited (Richards, 1959). The values of k, p and a_m are assumed, from species_profile.json.",
      "Survival is a single average rate. Random sapling deaths, drought years and replanting are not simulated.",
      "Ground type sets the curve number: Sand 39, Loam 61, Clay 80, Gravel or dirt 89, Partial pavement about 80, Full pavement 98 (USDA SCS, 1986).",
    ],
  },
  {
    id: "flood-risk",
    title: "Flood risk and rate of rise",
    inShort:
      "Each month we compare how much rain falls with how much water the land can still soak up. The bigger the gap, the higher the chance of flooding, shown as Safe, Be careful, or Danger.",
    summary:
      "Rain is generated randomly each day. The Curve Number method turns rain into runoff, and the water the trees and saplings absorb is subtracted. What is left collects as ponded water and drains away each day at a rate set by the ground type. The warning threshold scales with how much absorption has recovered, so a freshly cut area is more sensitive than a recovered one.",
    formula: `Rainfall
P_d = 0 with probability 1 − p_w
P_d ~ Gamma(α, θ) with probability p_w,  αθ = μ_w          (Eq. 5)

Runoff (SCS Curve Number)
S   = 25400 / CN − 254                                      (Eq. 1)
I_a = 0.2 · S                                               (Eq. 2)
Q   = (P − I_a)² / (P − I_a + S)  for P > I_a, else 0       (Eq. 3)
CN_c = (A_imp · 98 + A_perv · CN_perv) / A                  (Eq. 4)

Ponding and drainage
Q_net,d = max(0, Q_d − 1000 · V(t) / A)                     (Eq. 11)
C_d     = max(0, C_(d−1) + Q_net,d − E_d)                   (Eq. 12)
f(F)    = K_s · (1 + ψΔθ / F)                               (Eq. 13)
E_d     = 240 · K_s   (soil, gravel, pervious part)
E_d     = q_d         (full pavement)                       (Eq. 14)

Rate of rise and risk
r_d  = C_d − C_(d−1)                                        (Eq. 15)
T(t) = T_0 · ρ(t) / 100,   I_d = C_d / T(t)                 (Eq. 16)`,
    assumptions: [
      "Status bands: Safe for I below 0.5, Be careful from 0.5 to below 1.0, Danger at 1.0 or more. A fast rate of rise moves the status up one band.",
      "The runoff coefficient (through CN) sets how much water collects. E_d sets how long it stays.",
      "Equations 11 to 16 are project-defined design choices, not published methods, and have not been checked against real flood events.",
      "The risk index is a relative indicator for comparing scenarios, not a predicted flood depth.",
      "The Curve Number method was built for small US watersheds, so applying it to Philippine daily rainfall is an approximation.",
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
τ_lead = −ln(1 − φ^(1/p)) / k,   valid for 0 < φ < 1     (Eq. 10)`,
    assumptions: ["Depends on the assumed values of k, p and σ."],
  },
]

function MethodCard({ s }: { s: MethodSection }) {
  const [open, setOpen] = useState(false)

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

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Show the math
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-3">
            <p className="text-sm">{s.summary}</p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
              {s.formula}
            </pre>
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
  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Methodology</h2>
        <p className="text-sm text-muted-foreground">
          How each number in the simulator is calculated
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-start">
        <nav className="xl:sticky xl:top-4">
          <p className="mb-2 text-sm font-medium">On this page</p>
          <ul className="space-y-1 border-l pl-3 text-sm">
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
            <MethodCard key={s.id} s={s} />
          ))}
        </div>
      </div>
    </div>
  )
}
