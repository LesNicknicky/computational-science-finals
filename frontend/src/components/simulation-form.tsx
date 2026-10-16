import { Info, Layers, MapPin, TreePine } from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import { RegionMap } from "@/components/region-map"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { REGIONS, VOLUME_SOURCE } from "@/data/region-map"

export interface SimulationFormProps {
  regionId: string
  onRegionChange: (id: string) => void
  ground: string
  onGroundChange: (value: string) => void
  groundOptions: { value: string; label: string }[]
  cutPercent: number
  onCutChange: (value: number) => void
  /** Message from the backend when /simulate fails (e.g. "Full pavement is not modeled yet") */
  error?: string | null
}

export function SimulationForm(p: SimulationFormProps) {
  const region = REGIONS.find((r) => r.id === p.regionId) ?? REGIONS[0]
  return (
    <GlassCard className="min-h-0 flex-col">
      <CardTitle icon={MapPin}>1. Tap a region on the map</CardTitle>
      <RegionMap
        value={p.regionId}
        onChange={p.onRegionChange}
        className="min-h-0 flex-1"
      />
      <div className="mt-1.5">
        <div className="text-xl font-bold">{region.name}</div>
        <div className="text-[13px] text-muted-foreground">
          {region.volumeM3.toLocaleString("en-US")} m³ of logs recorded (
          {VOLUME_SOURCE})
        </div>
      </div>

      <div className="mt-3">
        <CardTitle icon={Layers}>2. What is the ground like?</CardTitle>
        {/* Base UI: value is always an array, single-select is the default */}
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[p.ground]}
          onValueChange={(v) => {
            if (v[0]) p.onGroundChange(v[0]) // ignore empty = no deselecting
          }}
          className="flex-wrap justify-start gap-1.5"
        >
          {p.groundOptions.map((g) => (
            <ToggleGroupItem
              key={g.value}
              value={g.value}
              className="rounded-full data-pressed:bg-emerald-600 data-pressed:text-white aria-pressed:bg-emerald-600 aria-pressed:text-white"
            >
              {g.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <TreePine className="size-4 text-emerald-700" aria-hidden /> 3. How
            many trees to cut?
          </span>
          <span className="text-[15px] text-emerald-700">{p.cutPercent}%</span>
        </div>
        <Slider
          min={5}
          max={100}
          step={1}
          value={[p.cutPercent]}
          onValueChange={(v) => p.onCutChange(typeof v === "number" ? v : v[0])}
          aria-label="Percent of trees to cut"
        />
      </div>

      {p.error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50/70 p-3 text-[13px] text-amber-900"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{p.error}</span>
        </div>
      )}
    </GlassCard>
  )
}