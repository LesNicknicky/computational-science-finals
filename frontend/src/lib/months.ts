// Simulation month 1 is January: the rain comes from PAGASA monthly normals, Jan to Dec.
export const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]
export const MONTH_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export const monthShort = (month: number) => MONTH_SHORT[month - 1] ?? `M${month}`
export const monthLong = (month: number) => MONTH_LONG[month - 1] ?? `Month ${month}`

/** "Jun, Jul and Aug" */
export function listMonths(months: number[]) {
  const names = months.map(monthShort)
  if (names.length <= 1) return names.join("")
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
}