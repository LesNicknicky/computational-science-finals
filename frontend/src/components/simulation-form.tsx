import PredictionTable from "../components/prediction-table"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Play, Pause, RefreshCw, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Slider } from "../components/ui/slider"
import { Badge } from "../components/ui/badge"
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

const first = (v: number | readonly number[]): number =>
  typeof v === "number" ? v : v[0]

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-2xl font-semibold">{children}</div>
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
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      {/* Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Setup</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Region preset</Label>
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
            <Label>Ground type</Label>
            <Select
              value={groundType}
              onValueChange={(v) => setGroundType(v as GroundType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(GROUND_TYPES) as [GroundType, string][]).map(
                  ([id, label]) => (
                    <SelectItem key={id} value={id}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mature trees</Label>
            <Input
              type="number"
              min={0}
              value={matureTrees}
              onChange={(e) =>
                setMatureTrees(Math.max(0, Number(e.target.value)))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Cut now: {cutPct}%</Label>
            <Slider
              value={[cutPct]}
              min={0}
              max={100}
              step={1}
              onValueChange={(v) => setCutPct(first(v))}
            />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        <Stat label="Trees to cut">{result?.treesToCut ?? "–"}</Stat>
        <Stat label="Saplings to plant">
          {result?.saplingsNeeded.toLocaleString() ?? "–"}
        </Stat>
        <Stat label="Plant before cutting">
          {result ? `${result.leadTimeMonths} mo` : "–"}
        </Stat>
      </div>

      {/* Simulation run */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Simulation run</CardTitle>
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
            <Button variant="outline" onClick={() => setRainSeed((s) => s + 1)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Re-roll rain
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Stat label="Absorption recovered">
              {current ? `${Math.round(current.absorptionRecoveredPct)}%` : "–"}
            </Stat>
            <Stat label="Rain this month">
              {current ? `${Math.round(current.rainfallMm)} mm` : "–"}
            </Stat>
            <Stat label="Flood status">
              {current && (
                <Badge className={`capitalize ${RISK_STYLE[current.risk]}`}>
                  {current.risk}
                </Badge>
              )}
            </Stat>
          </div>
        </CardContent>
      </Card>

      {result && <PredictionTable rows={result.prediction} />}
    </div>
  )
}
