import type { RegionId, RegionPreset } from "../types/simulation"

export const REGIONS: Record<RegionId, RegionPreset> = {
  caraga: { id: "caraga", label: "Caraga (XIII)", matureTrees: 100 },
  calabarzon: { id: "calabarzon", label: "Calabarzon", matureTrees: 100 },
  northern_mindanao: {
    id: "northern_mindanao",
    label: "Northern Mindanao",
    matureTrees: 100,
  },
  central_visayas: {
    id: "central_visayas",
    label: "Central Visayas",
    matureTrees: 100,
  },
  ilocos: { id: "ilocos", label: "Ilocos", matureTrees: 100 },
}
