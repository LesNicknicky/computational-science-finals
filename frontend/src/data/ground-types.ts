import type { GroundType } from "../types/simulation"

export const GROUND_TYPES: Record<GroundType, string> = {
  sand: "sand",
  loam: "Loam",
  clay: "Clay",
  gravel_dirt: "Gravel or dirt",
  partial_pavement: "Partial pavement",
  full_pavement: "Full pavement",
}
