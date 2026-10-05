import { PredictionForm } from "./prediction-form"
import PredictionTable from "./prediction-table"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Play, Pause, RefreshCw, Download } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Slider } from "../components/ui/slider"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { REGIONS } from "../data/regions"
import { GROUND_TYPES } from "../data/ground-types"
import { exportPlot, runSimulation } from "../lib/api"
import type {
  GroundType,
  RegionId,
  RiskLevel,
  SimulationResponse,
} from "../types/simulation"

const RISK_STYLE: Record<RiskLevel, string> = {
  safe: "bg-green-600/20 text-green-400",
  watch: "bg-yellow-500/20 text-yellow-400",
  warning: "bg-red-600/20 text-red-400",
}

const RISK_TEXT: Record<RiskLevel, { label: string; hint: string }> = {
  safe: { label: "Safe", hint: "Land can handle the rain" },
  watch: { label: "Be careful", hint: "Water may pool" },
  warning: { label: "Danger", hint: "Flooding is likely" },
}

// Plain-word rain level. Adjust the cutoffs to your rainfall scale.
const rainLevel = (mm: number): string =>
  mm >= 70 ? "Heavy" : mm >= 40 ? "Moderate" : "Light"

const first = (v: number | readonly number[]): number =>
  typeof v === "number" ? v : v[0]

function Stat({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-2xl font-semibold">{children}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export default function SimulationForm() {
  const [region, setRegion] = useState<RegionId>("caraga")
  const [groundType, setGroundType] = useState<GroundType>("loam")
  const [matureTrees, setMatureTrees] = useState<number>(
    REGIONS.caraga.matureTrees
  )
  const [cutPct, setCutPct] = useState<number>(20)
  const [rainSeed, setRainSeed] = useState<number>(1)

  const [result, setResult] = useState<SimulationResponse | null>(null)
  const [month, setMonth] = useState<number>(0)
  const [playing, setPlaying] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState<boolean>(false)

  // Re-run the simulation whenever an input changes (debounced 300 ms)
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      try {
        const data = await runSimulation({
          region,
          groundType,
          matureTrees,
          cutPercentage: cutPct,
          rainSeed,
        })
        if (cancelled) return
        setResult(data)
        setMonth(0)
        setPlaying(false)
        setError(null)
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unknown error")
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [region, groundType, matureTrees, cutPct, rainSeed])

  // Playback: advance one month every 500 ms
  useEffect(() => {
    if (!playing || !result) return
    const id = setInterval(() => {
      setMonth((m) => {
        if (m >= result.months.length - 1) {
          setPlaying(false)
          return m
        }
        return m + 1
      })
    }, 500)
    return () => clearInterval(id)
  }, [playing, result])

  const current = result?.months[month]
  const lastMonth = result ? result.months.length - 1 : 0

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await exportPlot({
        region,
        groundType,
        matureTrees,
        cutPercentage: cutPct,
        rainSeed,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `simulation-${region}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4">
      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        {/* LEFT: inputs, stays in view while you scroll */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Plan the cut</CardTitle>
              <CardDescription>
                Pick a place and a ground type, then choose how many trees to
                cut.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Where</Label>
                  <Select
                    value={region}
                    onValueChange={(v) => {
                      const id = v as RegionId
                      setRegion(id)
                      setMatureTrees(REGIONS[id].matureTrees)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(REGIONS).map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Old trees in the area</Label>
                  <Input
                    type="number"
                    min={0}
                    value={matureTrees}
                    onChange={(e) =>
                      setMatureTrees(Math.max(0, Number(e.target.value)))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>What is the ground like?</Label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(GROUND_TYPES) as [GroundType, string][]).map(
                    ([id, label]) => (
                      <Button
                        key={id}
                        type="button"
                        size="sm"
                        className="rounded-full"
                        variant={groundType === id ? "default" : "outline"}
                        onClick={() => setGroundType(id)}
                      >
                        {label}
                      </Button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <Label>How many to cut</Label>
                  <span className="text-sm font-medium">{cutPct}%</span>
                </div>
                <Slider
                  value={[cutPct]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => setCutPct(first(v))}
                />
                <div className="grid grid-cols-20 gap-0.75 pt-1">
                  {Array.from({ length: 100 }, (_, i) => (
                    <span
                      key={i}
                      className={`aspect-square rounded-full ${
                        i < cutPct ? "bg-orange-500" : "bg-green-500"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-orange-500" /> Cut
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> Kept
                  </span>
                  <span>Each dot is 1% of the trees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: results */}
        <div className="flex min-w-0 flex-col gap-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="grid grid-cols-3 gap-4">
            <Stat label="Trees to cut">{result?.treesToCut ?? "–"}</Stat>
            <Stat label="New trees to plant">
              {result?.saplingsNeeded.toLocaleString() ?? "–"}
            </Stat>
            <Stat label="Plant them first" hint="before cutting">
              {result ? `${result.leadTimeMonths} months` : "–"}
            </Stat>
          </div>

          <Card className="flex-1">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle>Watch what happens</CardTitle>
                <CardDescription>
                  Move through the months to see the land recover.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={!result || exporting}
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Exporting…" : "Export plot"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="outline"
                  disabled={!result}
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {playing ? "Pause" : "Play"}
                </Button>
                <Slider
                  className="min-w-40 flex-1"
                  value={[month]}
                  min={0}
                  max={lastMonth}
                  step={1}
                  disabled={!result}
                  onValueChange={(v) => setMonth(first(v))}
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  Month {month}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setRainSeed((s) => s + 1)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> New rain
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Stat label="Land recovered">
                  {current
                    ? `${Math.round(current.absorptionRecoveredPct)}%`
                    : "–"}
                  {current && (
                    <Progress
                      className="mt-2 h-1.5"
                      value={current.absorptionRecoveredPct}
                    />
                  )}
                </Stat>
                <Stat
                  label="Rain this month"
                  hint={
                    current ? `${Math.round(current.rainfallMm)} mm` : undefined
                  }
                >
                  {current ? rainLevel(current.rainfallMm) : "–"}
                </Stat>
                <Stat
                  label="Flood outlook"
                  hint={current ? RISK_TEXT[current.risk].hint : undefined}
                >
                  {current && (
                    <Badge className={RISK_STYLE[current.risk]}>
                      {RISK_TEXT[current.risk].label}
                    </Badge>
                  )}
                </Stat>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FULL WIDTH: table and charts */}
      {result && (
        <>
          <PredictionTable rows={result.prediction} />
          <PredictionForm result={result} />
        </>
      )}
    </div>
  )
}
