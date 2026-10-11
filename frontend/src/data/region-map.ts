export interface Region {
  id: string // must match the region ids your backend expects
  name: string
  volumeM3: number // log volume, FMB report
  path: string // hand-simplified shape on a 200x250 canvas
}

export const VOLUME_SOURCE = "FMB report, 2023" // double-check the period against the report

export const REGIONS: Region[] = [
  {
    id: "ilocos",
    name: "Ilocos Region",
    volumeM3: 2683.35,
    path: "M52 12 L74 8 L82 40 L70 70 L50 62 L46 34Z",
  },
  {
    id: "calabarzon",
    name: "Calabarzon",
    volumeM3: 13218.68,
    path: "M70 80 L100 76 L116 98 L96 118 L74 108Z",
  },
  {
    id: "central_visayas",
    name: "Central Visayas",
    volumeM3: 2695.03,
    path: "M92 138 L126 132 L140 150 L112 164 L90 156Z",
  },
  {
    id: "northern_mindanao",
    name: "Northern Mindanao",
    volumeM3: 5169.79,
    path: "M96 182 L136 176 L150 198 L118 212 L96 204Z",
  },
  {
    id: "caraga",
    name: "Caraga",
    volumeM3: 83565.6,
    path: "M142 186 L172 176 L182 222 L158 242 L148 218Z",
  },
]
