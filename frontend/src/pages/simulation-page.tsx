import { useEffect, useState } from "react"
import { SimulationDashboard } from "@/components/simulation-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { GROUND_TYPES } from "@/data/ground-types"
import { REGIONS as PRESETS } from "@/data/regions"
import { exportPdf, runSimulation } from "@/lib/api"
import { toDashboardResult } from "@/lib/to-dashboard"
import type { SimulationResult } from "@/types/dashboard"
import type { GroundType, RegionId } from "@/types/simulation"

const RAIN_SEED = 42 // fixed for now; no "New rain" button in the new layout

const GROUND_OPTIONS = (Object.entries(GROUND_TYPES) as [GroundType, string][]).map(
  ([value, label]) => ({
    value,
    label: label.charAt(0).toUpperCase() + label.slice(1),
  })
)

export default function SimulationPage() {
  const [region, setRegion] = useState<RegionId>("caraga")
  const [ground, setGround] = useState<GroundType>("loam")
  const [cut, setCut] = useState(20)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // re-run whenever an input changes (short delay so dragging the slider doesn't spam the API)
  useEffect(() => {
    let ignore = false
    const t = setTimeout(() => {
      runSimulation({
        region,
        groundType: ground,
        matureTrees: PRESETS[region].matureTrees,
        cutPercentage: cut,
        rainSeed: RAIN_SEED,
      })
        .then((res) => {
          if (ignore) return
          setResult(toDashboardResult(res))
          setError(null)
        })
        .catch((e: Error) => {
          if (!ignore) setError(e.message)
        })
    }, 250)
    return () => {
      ignore = true
      clearTimeout(t)
    }
  }, [region, ground, cut])

  return (
    <div className="relative flex min-w-0 flex-1 flex-col">
      {error && (
        <Alert variant="destructive" className="absolute top-3 right-3 z-10 w-80">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result ? (
        <SimulationDashboard
          result={result}
          onExport={(start, end) =>
            exportPdf(start, end)
              .then(() => setError(null))
              .catch((e: Error) => setError(e.message))
          }
          form={{
            regionId: region,
            onRegionChange: (id) => setRegion(id as RegionId),
            ground,
            onGroundChange: (v) => setGround(v as GroundType),
            groundOptions: GROUND_OPTIONS,
            cutPercent: cut,
            onCutChange: setCut,
            matureTrees: PRESETS[region].matureTrees,
          }}
        />
      ) : (
        <Skeleton className="m-3 flex-1 rounded-[1.75rem]" />
      )}
    </div>
  )
}