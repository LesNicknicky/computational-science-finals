import {
  ArrowRight,
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
import { monthShort } from "@/lib/months"
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
    <GlassCard className="px-3 py-2">
      <CardTitle icon={icon}>{title}</CardTitle>
      <div className="-mt-1 flex flex-wrap items-baseline gap-x-1.5">
        <span
          className={`text-xl leading-tight font-extrabold ${valueClass ?? ""}`}
        >
          {value}
        </span>
        <span className="text-[11px] text-muted-foreground">{sub}</span>
      </div>
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
    <div className="grid grid-cols-2 gap-2.5">
      <Tile
        icon={rainIcon(month.rainPct)}
        title="Rain"
        value={rainWord(month.rainPct)}
        sub={`in ${monthShort(month.month)}`}
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
        sub={`in ${monthShort(month.month)}`}
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
    <GlassCard className="px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <CardTitle icon={TreePine}>Cut vs. planted</CardTitle>
        {treesCut > 0 && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ArrowRight className="size-3 text-emerald-600" aria-hidden />
            plant <b className="text-foreground">{n(ratio)}</b> per 1 cut
          </span>
        )}
      </div>

      {treesCut === 0 ? (
        <p className="py-2 text-center text-sm text-muted-foreground">
          Nothing is being cut, so nothing needs replacing.
        </p>
      ) : (
        // key replays the entrance animation whenever the numbers change
        <div
          key={`${treesCut}-${saplingsPlanted}`}
          className="flex flex-col gap-2"
        >
          <div className="clay-sm clay-tint-orange flex animate-in items-center gap-2.5 px-2.5 py-1.5 fill-mode-both fade-in slide-in-from-bottom-2">
            <span className="clay-inset grid size-8 shrink-0 place-items-center rounded-full!">
              <Axe className="size-4.5 text-orange-500" aria-hidden />
            </span>
            <span className="text-xs text-muted-foreground">You cut</span>
            <span className="ml-auto text-lg leading-tight font-extrabold whitespace-nowrap text-orange-600">
              {n(treesCut)}
              <span className="ml-1 text-xs font-semibold">
                {treesCut === 1 ? "tree" : "trees"}
              </span>
            </span>
          </div>

          <div
            className="clay-sm clay-tint-green flex animate-in items-center gap-2.5 px-2.5 py-1.5 fill-mode-both fade-in slide-in-from-bottom-2"
            style={{ animationDelay: "200ms" }}
          >
            <span className="clay-inset grid size-8 shrink-0 place-items-center rounded-full!">
              <Sprout className="size-4.5 text-emerald-600" aria-hidden />
            </span>
            <span className="text-xs text-muted-foreground">You plant</span>
            <span className="ml-auto text-lg leading-tight font-extrabold whitespace-nowrap text-emerald-700">
              {n(saplingsPlanted)}
              <span className="ml-1 text-xs font-semibold">trees</span>
            </span>
          </div>
        </div>
      )}
      <p className="mt-1.5 flex items-center justify-center gap-1 text-[10.5px] text-muted-foreground">
        <Info className="size-3" aria-hidden />
        Rule: DENR Memorandum Order 2012-02
      </p>
    </GlassCard>
  )
}
