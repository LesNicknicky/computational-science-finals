import {
  CloudRain,
  Droplets,
  ShieldCheck,
  Sprout,
  TreePine,
} from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import { STATUS_COPY, STATUS_TEXT, rainWord } from "@/lib/copy"
import type { MonthResult, SimulationResult } from "@/types/dashboard"

function Tile({
  icon,
  title,
  value,
  sub,
  valueClass,
}: {
  icon: React.ElementType
  title: string
  value: string
  sub: string
  valueClass?: string
}) {
  return (
    <GlassCard>
      <CardTitle icon={icon}>{title}</CardTitle>
      <div className={`text-[22px] font-bold ${valueClass ?? ""}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </GlassCard>
  )
}

export function HighlightTiles({
  month,
  result,
}: {
  month: MonthResult
  result: SimulationResult
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Tile
        icon={CloudRain}
        title="Rain"
        value={rainWord(month.rainPct)}
        sub={`Month ${month.month}`}
      />
      <Tile
        icon={Droplets}
        title="Soaks up"
        value={`${Math.round(month.soakPct)}%`}
        sub="of normal"
      />
      <Tile
        icon={ShieldCheck}
        title="Flood chance"
        value={STATUS_COPY[month.status].risk}
        sub={`Month ${month.month}`}
        valueClass={STATUS_TEXT[month.status]}
      />
      <Tile
        icon={Sprout}
        title="New trees"
        value={result.saplingsPlanted.toLocaleString("en-US")}
        sub="to plant"
      />
    </div>
  )
}

export function CutVsPlanted({ result }: { result: SimulationResult }) {
  const cutWidth = Math.max(
    4,
    (result.treesCut / Math.max(result.saplingsPlanted, 1)) * 100
  )
  return (
    <GlassCard className="min-h-0 flex-1 justify-center">
      <CardTitle icon={TreePine}>Trees cut vs. planted</CardTitle>
      <div className="mb-1 text-xs text-muted-foreground">
        Cut: {result.treesCut.toLocaleString("en-US")}
      </div>
      <div className="h-3.5 rounded-lg bg-white/60">
        <div
          className="h-full rounded-lg bg-orange-500"
          style={{ width: `${cutWidth}%` }}
        />
      </div>
      <div className="mt-2.5 mb-1 text-xs text-muted-foreground">
        Planted: {result.saplingsPlanted.toLocaleString("en-US")}
      </div>
      <div className="h-3.5 rounded-lg bg-white/60">
        <div className="h-full w-full rounded-lg bg-emerald-600" />
      </div>
    </GlassCard>
  )
}
