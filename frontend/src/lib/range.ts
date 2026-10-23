// Which months the person wants to simulate: the whole year, or one quarter.
export const RANGES = [
  { value: "all", label: "Whole year", start: 0, end: 11 },
  { value: "1", label: "Months 1–3", start: 0, end: 2 },
  { value: "2", label: "Months 4–6", start: 3, end: 5 },
  { value: "3", label: "Months 7–9", start: 6, end: 8 },
  { value: "4", label: "Months 10–12", start: 9, end: 11 },
]

export const getRange = (value: string) =>
  RANGES.find((r) => r.value === value) ?? RANGES[0]
