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

export async function exportPlot(req: SimulationRequest): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/export/plot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`Export failed: ${res.status}`)
  return res.blob()
}
