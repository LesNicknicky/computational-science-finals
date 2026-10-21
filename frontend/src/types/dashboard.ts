export type MonthStatus = "safe" | "careful" | "danger"

export interface MonthResult {
  month: number // 1-12
  rainPct: number // rainfall vs the wettest month, 0-100
  rainMm: number // rain that month, mm
  depthMm: number // peak depth of standing water that month, mm
  riskIndex: number // peak standing water vs what the ground can take; 1 = at the limit
  soakPct: number // how much rain the ground can soak up, 0-100
  status: MonthStatus
}

// Map your API response to this shape once, then every component below just reads it.
export interface SimulationResult {
  treesCut: number
  saplingsPlanted: number
  leadDays: number | null // null = the cut can never be offset; copy.ts turns days into days/weeks/months
  months: MonthResult[] // 12 items
}
