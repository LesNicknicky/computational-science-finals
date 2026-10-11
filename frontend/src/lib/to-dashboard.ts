import type { SimulationResult, MonthStatus } from "@/types/dashboard"
import type { RiskLevel, SimulationResponse } from "@/types/simulation"

const STATUS: Record<RiskLevel, MonthStatus> = {
  safe: "safe",
  watch: "careful",
  warning: "danger",
}

// API response -> the shape the dashboard components read
export function toDashboardResult(res: SimulationResponse): SimulationResult {
  const maxRain = Math.max(...res.months.map((m) => m.rainfallMm), 1)
  return {
    treesCut: res.treesToCut,
    saplingsPlanted: res.saplingsNeeded,
    leadDays: res.leadTimeMonths == null ? null : Math.round(res.leadTimeMonths * 30),
    months: res.months.map((m) => ({
      month: m.month,
      rainPct: (m.rainfallMm / maxRain) * 100,
      soakPct: m.absorptionRecoveredPct, // already 0-100
      status: STATUS[m.risk],
    })),
  }
}