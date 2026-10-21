import { CloudDrizzle, CloudRain, CloudRainWind } from "lucide-react"
import type { MonthResult, MonthStatus } from "@/types/dashboard"

export const STATUS_COPY: Record<MonthStatus, { label: string; risk: string }> =
  {
    safe: { label: "Safe", risk: "Low" },
    careful: { label: "Be careful", risk: "Medium" },
    danger: { label: "Danger", risk: "High" },
  }

export const rainWord = (pct: number) =>
  pct >= 70 ? "Heavy" : pct >= 35 ? "Moderate" : "Light"

// Same thresholds as rainWord, so the word, icon and color always agree.
export const rainIcon = (pct: number) =>
  pct >= 70 ? CloudRainWind : pct >= 35 ? CloudRain : CloudDrizzle

export const rainText = (pct: number) =>
  pct >= 70 ? "text-sky-700" : pct >= 35 ? "text-sky-600" : "text-sky-500"

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`

// days under 7 -> days, 7 to 29 -> weeks, 30+ -> months
export function formatLeadTime(days: number) {
  const d = Math.max(1, Math.round(days))
  if (d < 7) return plural(d, "day")
  if (d < 30) return plural(Math.floor(d / 7), "week")
  return plural(Math.floor(d / 30), "month")
}

export function headline(months: MonthResult[]) {
  const danger = months.find((m) => m.status === "danger")
  if (danger) return `Flooding is likely in month ${danger.month}`
  const careful = months.find((m) => m.status === "careful")
  if (careful) return `Be careful in month ${careful.month}`
  return "Safe from flooding all year"
}

export function worstStatus(months: MonthResult[]): MonthStatus {
  if (months.some((m) => m.status === "danger")) return "danger"
  if (months.some((m) => m.status === "careful")) return "careful"
  return "safe"
}

export const STATUS_TEXT: Record<MonthStatus, string> = {
  safe: "text-emerald-600",
  careful: "text-amber-500",
  danger: "text-red-500",
}
