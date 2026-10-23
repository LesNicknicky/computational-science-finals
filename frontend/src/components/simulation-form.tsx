import { Layers, MapPin, TreePine } from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import { RegionMap } from "@/components/region-map"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { REGIONS as PRESETS } from "@/data/regions"
import { REGIONS } from "@/data/region-map"
import type { RegionId } from "@/types/simulation"

export interface SimulationFormProps {
  regionId: string
  onRegionChange: (id: string) => void
  cutPercent: number
  onCutChange: (value: number) => void
  matureTrees: number
  ground: string
  onGroundChange: (value: string) => void
  groundOptions: { value: string; label: string }[]
}

export function SimulationForm(p: SimulationFormProps) {
  const region = REGIONS.find((r) => r.id === p.regionId) ?? REGIONS[0]
  const preset = PRESETS[region.id as RegionId] as
    (typeof PRESETS)[RegionId] | undefined
  const cutTrees = Math.round((p.cutPercent / 100) * p.matureTrees)

  return (
    <GlassCard className="min-h-0 flex-col p-3">
      <CardTitle icon={MapPin}>Pick a region</CardTitle>
      <RegionMap
        value={p.regionId}
        onChange={p.onRegionChange}
        className="min-h-64 flex-1 lg:min-h-0"
      />
      <div className="clay-sm mt-2 px-3.5 py-2">
        <div className="text-lg leading-tight font-extrabold">
          {region.name}
        </div>
        <div className="text-xs text-muted-foreground">
          Rain data: PAGASA station {preset?.station ?? "—"}
        </div>
        {preset && (
          <div className="text-xs text-muted-foreground">
            Log production:{" "}
            <span className="font-semibold text-foreground">
              {preset.logM3.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              m³
            </span>{" "}
            approximately (early 2023)
          </div>
        )}
      </div>
      <p className="mt-1.5 px-1 text-[11px] leading-tight text-muted-foreground">
        Greyed-out regions aren&apos;t available yet: their rain data is not
        confirmed.
      </p>

      <div className="mt-2 px-1">
        <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
          <Layers className="size-4 text-emerald-600" aria-hidden /> Ground type
        </div>
        <Select
          value={p.ground}
          onValueChange={(v) => {
            if (v) p.onGroundChange(v as string)
          }}
        >
          <SelectTrigger className="w-full" aria-label="Ground type">
            <SelectValue>
              {(v: string) =>
                p.groundOptions.find((o) => o.value === v)?.label ?? v
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {p.groundOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2.5 px-1">
        <div className="mb-2.5 flex items-center justify-between text-[13px] font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <TreePine className="size-4 text-emerald-600" aria-hidden /> Trees
            to cut
          </span>
          <span className="clay-inset rounded-full! px-3 py-0.5 text-[14px] font-extrabold text-emerald-700">
            {p.cutPercent}% · {cutTrees} of {p.matureTrees}
          </span>
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
    </GlassCard>
  )
}
