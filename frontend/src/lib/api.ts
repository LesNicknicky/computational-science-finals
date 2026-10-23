import type { SimulationRequest, SimulationResponse } from "../types/simulation"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

// FastAPI sends detail as a string (our 400s) or a list (422 validation errors)
async function errorMessage(res: Response): Promise<string> {
  try {
    const { detail } = await res.json()
    if (typeof detail === "string") return detail
    if (Array.isArray(detail)) return detail.map((e) => e.msg).join("; ")
  } catch {
    // body was not JSON
  }
  return `Server Error: ${res.status}`
}

export async function runSimulation(
  req: SimulationRequest
): Promise<SimulationResponse> {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(await errorMessage(res))
  return res.json() as Promise<SimulationResponse>
}

async function download(path: string, filename: string) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(await errorMessage(res))
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// start/end are the first and last month (1-12) to put in the report; default is the whole year
const reportName = (start: number, end: number, ext: string) =>
  start === 1 && end === 12
    ? `simulation-report.${ext}`
    : `simulation-report-months-${start}-${end}.${ext}`

export const exportPlot = (start = 1, end = 12) =>
  download(
    `/export/plot?start=${start}&end=${end}`,
    reportName(start, end, "svg")
  )

export const exportPdf = (start = 1, end = 12) =>
  download(
    `/export/pdf?start=${start}&end=${end}`,
    reportName(start, end, "pdf")
  )
