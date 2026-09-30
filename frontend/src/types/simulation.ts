export type RegionId =
  "caraga" | "calabarzon" | "northern_mindanao" | "central_visayas" | "ilocos"

export type GroundType =
  | "sand"
  | "loam"
  | "clay"
  | "gravel_dirt"
  | "partial_pavement"
  | "full_pavement"

export type RiskLevel = "safe" | "watch" | "warning"

export interface RegionPreset {
  id: RegionId
  label: string
  matureTrees: number
}

export interface SimulationRequest {
  region: RegionId
  groundType: GroundType
  matureTrees: number
  cutPercentage: number
  rainSeed: number
}

export interface MonthResult {
  month: number
  rainfallMm: number
  absorptionRecoveredPct: number
  cumulativeRunoff: number
  riseRate: number
  risk: RiskLevel
}
export interface PredictionRow {
  month: number
  recoveredPct: number
  riskIndex: number
  risk: RiskLevel
}

export interface SimulationResponse {
  treesToCut: number
  saplingsNeeded: number
  leadTimeMonths: number
  months: MonthResult[]
  prediction: PredictionRow[]
}
