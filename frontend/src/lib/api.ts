import type { SimulationRequest, SimulationResponse } from "../types/simulation"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export async function runSimulation(
  req: SimulationRequest
): Promise<SimulationResponse> {
  const res = await fetch(`${BASE_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Server Error: ${res.status}`)
  return res.json() as Promise<SimulationResponse>
}

export async function exportPlot() {
  const res = await fetch(`${BASE_URL}/export/plot`)
  if (!res.ok) {
    const { detail } = await res.json()
    throw new Error(detail)
  }
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement("a")
  a.href = url
  a.download = "simulation-report.svg"
  a.click()
  URL.revokeObjectURL(url)
}