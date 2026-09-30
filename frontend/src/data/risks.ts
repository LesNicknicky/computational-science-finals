import type { RiskLevel } from "../types/simulation"

export const RISK_STYLE: Record<RiskLevel, string> = {
  safe: "bg-green-600/20 text-green-400",
  watch: "bg-yellow-500/20 text-yellow-400",
  warning: "bg-red-600/20 text-red-400",
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  safe: "Safe",
  watch: "Watch",
  warning: "Flood warning",
}
