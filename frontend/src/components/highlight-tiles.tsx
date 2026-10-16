import {
  ArrowDown,
  Axe,
  Droplets,
  Info,
  ShieldCheck,
  Sprout,
  TreePine,
} from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import {
  STATUS_COPY,
  STATUS_TEXT,
  rainIcon,
  rainText,
  rainWord,
} from "@/lib/copy"
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
        icon={rainIcon(month.rainPct)}
        title="Rain"
        value={rainWord(month.rainPct)}
        sub={`Month ${month.month}`}
        valueClass={rainText(month.rainPct)}
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
  const { treesCut, saplingsPlanted } = result
  // New trees planted for ONE tree cut (100 under DENR DMO 2012-02).
  const ratio = treesCut > 0 ? Math.round(saplingsPlanted / treesCut) : 0
  const n = (v: number) => v.toLocaleString("en-US")

  return (
    <GlassCard className="min-h-0 flex-1">
      <CardTitle icon={TreePine}>Cut vs. planted</CardTitle>

      {treesCut === 0 ? (
        <p className="m-auto text-sm text-muted-foreground">
          Nothing is being cut, so nothing needs replacing.
        </p>
      ) : (
        // key replays the entrance animation whenever the numbers change
        <div
          key={`${treesCut}-${saplingsPlanted}`}
          className="m-auto flex w-full flex-col items-stretch gap-2"
        >
          {/* 1. what you cut */}
          <div className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center gap-3 rounded-2xl bg-orange-100/80 p-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80">
              <Axe className="size-6 text-orange-500" aria-hidden />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">You cut down</div>
              <div className="text-2xl leading-tight font-bold text-orange-600">
                {n(treesCut)}{" "}
                <span className="text-base font-semibold">
                  {treesCut === 1 ? "tree" : "trees"}
                </span>
              </div>
            </div>
          </div>

          {/* the rule that connects them */}
          <div
            className="animate-in fade-in fill-mode-both flex items-center justify-center gap-2 text-xs text-muted-foreground"
            style={{ animationDelay: "150ms" }}
          >
            <ArrowDown className="size-4 text-emerald-700" aria-hidden />
            <span>
              plant <b className="text-foreground">{n(ratio)}</b> for every 1
              cut
            </span>
          </div>

          {/* 2. what you plant */}
          <div
            className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both flex items-center gap-3 rounded-2xl bg-emerald-100/80 p-3"
            style={{ animationDelay: "300ms" }}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/80">
              <Sprout className="size-6 text-emerald-600" aria-hidden />
            </span>
            <div>
              <div className="text-xs text-muted-foreground">
                You plant
              </div>
              <div className="text-2xl leading-tight font-bold text-emerald-700">
                {n(saplingsPlanted)}{" "}
                <span className="text-base font-semibold">new trees</span>
              </div>
            </div>
          </div>

          <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <Info className="size-3" aria-hidden />
            Rule: DENR Memorandum Order 2012-02
          </p>
        </div>
      )}
    </GlassCard>
  )
}