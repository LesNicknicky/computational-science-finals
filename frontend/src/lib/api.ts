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

export const exportPlot = () =>
  download("/export/plot", "simulation-report.svg")

export const exportPdf = () => download("/export/pdf", "simulation-report.pdf")
