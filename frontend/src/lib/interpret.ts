import { rainWord } from "@/lib/copy"
import { listMonths, monthLong, monthShort } from "@/lib/months"
import type { SimulationResult } from "@/types/dashboard"

export type Severity = "low" | "moderate" | "high" | "severe"

export const SEVERITY: Record<
  Severity,
  { label: string; meaning: string; badge: string; text: string; hex: string }
> = {
  low: {
    label: "Low",
    meaning: "Every month stays in the safe band.",
    badge: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-600",
    hex: "#12a36e",
  },
  moderate: {
    label: "Moderate",
    meaning:
      "At least one month gets close to the ground's limit, but none reach danger.",
    badge: "bg-amber-100 text-amber-700",
    text: "text-amber-500",
    hex: "#e0a020",
  },
  high: {
    label: "High",
    meaning:
      "One or two months reach danger, or the cut can't be offset by planting.",
    badge: "bg-orange-100 text-orange-700",
    text: "text-orange-600",
    hex: "#ea6a1f",
  },
  severe: {
    label: "Severe",
    meaning: "Three or more months reach danger.",
    badge: "bg-red-100 text-red-700",
    text: "text-red-600",
    hex: "#dc4b3c",
  },
}

/** Relative severity of a scenario, from how many months reach each band. */
export function severityOf(result: SimulationResult): Severity {
  const danger = result.months.filter((m) => m.status === "danger").length
  const careful = result.months.filter((m) => m.status === "careful").length
  if (danger >= 3) return "severe"
  if (danger >= 1 || result.leadDays === null) return "high"
  if (careful >= 1) return "moderate"
  return "low"
}

const GROUND_NOTE: Record<string, string> = {
  sand: "Sand drains quickly (runoff number 39), so most rain soaks in.",
  loam: "Loam is a middle case (runoff number 61): it soaks in a fair share of rain.",
  clay: "Clay soaks up water slowly (runoff number 80), so more rain runs off.",
  gravel_dirt:
    "Gravel or dirt packs hard (runoff number 89), so most rain runs off. Its soak-in speed is our estimate.",
  partial_pavement:
    "Half-paved ground sheds rain from the hard surface (runoff number about 80). The paved share is our assumption.",
}

export interface Scenario {
  regionName: string
  station: string
  groundId: string
  groundLabel: string
  cutPercent: number
  matureTrees: number
}

export interface Interpretation {
  severity: Severity
  headline: string
  summary: string
  points: string[]
  advice: string
  context: string[]
}

const n = (v: number) => v.toLocaleString("en-US")

export function interpret(
  result: SimulationResult,
  s: Scenario
): Interpretation {
  const severity = severityOf(result)
  const danger = result.months
    .filter((m) => m.status === "danger")
    .map((m) => m.month)
  const careful = result.months
    .filter((m) => m.status === "careful")
    .map((m) => m.month)
  const wettest = result.months.reduce((a, b) => (b.rainMm > a.rainMm ? b : a))
  const first = result.months[0]
  const last = result.months[result.months.length - 1]

  let summary: string
  if (result.treesCut === 0) {
    summary =
      "Nothing is being cut, so there is no loss of absorption to offset and the year stays safe."
  } else if (severity === "low") {
    summary = `Cutting ${n(result.treesCut)} of ${n(s.matureTrees)} trees on ${s.groundLabel.toLowerCase()} ground stays safe all year. The ground keeps up with the rain in every month.`
  } else if (severity === "moderate") {
    summary = `The ground gets close to its limit in ${listMonths(careful)}, but flooding is not expected in any month. Watch those months.`
  } else if (severity === "high" && danger.length > 0) {
    summary = `Flooding is likely in ${listMonths(danger)}. In ${danger.length === 1 ? "that month" : "those months"} the rain is more than the recovering ground can soak up.`
  } else if (severity === "high") {
    summary =
      "Planting cannot match the loss from this cut, so the ground stays below its original absorption."
  } else {
    summary = `Flooding is likely in ${danger.length} of 12 months (${listMonths(danger)}). This cut is too large for the ground to recover from in time.`
  }

  const points: string[] = []
  points.push(
    `Rain peaks in ${monthLong(wettest.month)} (${rainWord(wettest.rainPct).toLowerCase()}, about ${Math.round(wettest.rainMm)} mm).`
  )
  points.push(
    `Soak-up recovers from ${Math.round(first.soakPct)}% in ${monthShort(first.month)} to ${Math.round(last.soakPct)}% in ${monthShort(last.month)} as the saplings grow.`
  )
  if (result.leadDays === null) {
    points.push(
      "This cut can't be fully offset by planting, no matter how early the saplings go in."
    )
  } else if (result.treesCut > 0) {
    points.push(
      `To avoid a gap in protection, plant the ${n(result.saplingsPlanted)} saplings about ${Math.max(1, Math.round(result.leadDays / 30))} month(s) before cutting.`
    )
  }
  if (GROUND_NOTE[s.groundId]) points.push(GROUND_NOTE[s.groundId])

  const advice: Record<Severity, string> = {
    low: "This cut looks manageable for this ground and rain pattern. Keep to the planting plan.",
    moderate:
      "Consider planting earlier or cutting a little less, and plan extra care for the flagged months.",
    high: "Lower the share of trees cut, or plant earlier, then run the simulation again until no month reaches danger.",
    severe:
      "Not advisable as modeled. Cut much less, plant well ahead of the cut, and compare other ground types.",
  }

  return {
    severity,
    headline: `${SEVERITY[severity].label} severity`,
    summary,
    points,
    advice: advice[severity],
    context: [
      `Scenario: ${s.cutPercent}% of ${n(s.matureTrees)} mature trees (${n(result.treesCut)}) cut on ${s.groundLabel.toLowerCase()} ground in ${s.regionName}, replaced at 100 saplings for each tree (${n(result.saplingsPlanted)} saplings).`,
      `Rain: one simulated year of random daily rain built from PAGASA 1991–2020 monthly normals at ${s.station}. The same inputs always give the same year.`,
      "Severity is a relative score from the number of months in Be careful or Danger. Use it to compare scenarios. It is not a forecast of flood depth.",
    ],
  }
}
