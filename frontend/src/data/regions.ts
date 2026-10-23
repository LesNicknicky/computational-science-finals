import type { RegionId, RegionPreset } from "../types/simulation"

export const REGIONS: Record<RegionId, RegionPreset> = {
  caraga: {
    id: "caraga",
    label: "Caraga (XIII)",
    matureTrees: 100,
    station: "Butuan",
    logM3: 83565.6,
  },
  calabarzon: {
    id: "calabarzon",
    label: "Calabarzon",
    matureTrees: 100,
    station: "Infanta",
    logM3: 13218.68,
  },
  northern_mindanao: {
    id: "northern_mindanao",
    label: "Northern Mindanao",
    matureTrees: 100,
    station: "Malaybalay",
    logM3: 5169.79,
  },
  central_visayas: {
    id: "central_visayas",
    label: "Central Visayas",
    matureTrees: 100,
    station: "Mactan",
    logM3: 2695.03,
  },
  ilocos: {
    id: "ilocos",
    label: "Ilocos",
    matureTrees: 100,
    station: "Laoag",
    logM3: 2683.35,
  },
}
