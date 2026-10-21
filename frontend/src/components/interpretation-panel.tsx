import {
  CloudRain,
  Lightbulb,
  Sprout,
  TriangleAlert,
  Waves,
} from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import { formatLeadTime } from "@/lib/copy"
import { SEVERITY, severityOf, type Severity } from "@/lib/interpret"
import { listMonths, monthLong, monthShort } from "@/lib/months"
import { cn } from "@/lib/utils"
import type { MonthResult, SimulationResult } from "@/types/dashboard"

// Flood intensity: how far the standing water goes past what the ground can take.
// Bands follow the model's own cut-offs and never read lower than the month's
// Safe / Be careful / Danger mark.
const LEVELS = [
  {
    label: "None",
    note: "No standing water",
    text: "text-emerald-600",
    bar: "bg-emerald-400",
  },
  {
    label: "Low",
    note: "Very little water",
    text: "text-lime-600",
    bar: "bg-lime-400",
  },
  {
    label: "Moderate",
    note: "Water starts to collect",
    text: "text-amber-500",
    bar: "bg-amber-400",
  },
  {
    label: "High",
    note: "Water ponds up",
    text: "text-orange-600",
    bar: "bg-orange-500",
  },
  {
    label: "Severe",
    note: "Deep, lasting flooding",
    text: "text-red-600",
    bar: "bg-red-500",
  },
]

const levelOf = (m: MonthResult) => {
  if (m.depthMm < 0.5) return 0
  const byIndex =
    m.riskIndex >= 2 ? 4 : m.riskIndex >= 1 ? 3 : m.riskIndex >= 0.5 ? 2 : 1
  const byStatus = m.status === "danger" ? 3 : m.status === "careful" ? 2 : 0
  return Math.max(byIndex, byStatus)
}

const TIP: Record<Severity, string> = {
  low: "Looks manageable. Stick to the planting plan.",
  moderate: "Plant earlier or cut a little less.",
  high: "Cut fewer trees or plant earlier, then try again.",
  severe: "Not advisable. Cut much less and plant first.",
}

function Row({
  icon: Icon,
  tone = "text-emerald-600",
  children,
}: {
  icon: React.ElementType
  tone?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 text-[13px] leading-snug">
      <span className="clay-inset grid size-7 shrink-0 place-items-center rounded-full!">
        <Icon className={cn("size-4", tone)} aria-hidden />
      </span>
      <span className="pt-0.5">{children}</span>
    </div>
  )
}

export function InterpretationPanel({
  result,
  className,
}: {
  result: SimulationResult
  className?: string
}) {
  const sev = SEVERITY[severityOf(result)]
  const months = result.months

  const peak = months.reduce((a, b) =>
    levelOf(b) > levelOf(a) ||
    (levelOf(b) === levelOf(a) && b.depthMm > a.depthMm)
      ? b
      : a
  )
  const level = levelOf(peak)
  const L = LEVELS[level]

  const wettest = months.reduce((a, b) => (b.rainPct > a.rainPct ? b : a))
  const first = months[0]
  const last = months[months.length - 1]
  const trouble = months.filter((m) => m.status !== "safe")
  const danger = months.filter((m) => m.status === "danger")

  return (
    <GlassCard className={cn("flex-col px-3 py-2.5", className)}>
      <div className="flex items-start justify-between gap-2">
        <CardTitle icon={Lightbulb}>What this means</CardTitle>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            sev.badge
          )}
        >
          {sev.label} risk
        </span>
      </div>

      {/* flood intensity: how bad the flooding gets at its worst */}
      <div className="clay-inset flex items-center gap-3 px-3 py-2">
        <Waves
          className={cn("size-9 shrink-0", L.text)}
          strokeWidth={1.8}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-muted-foreground">
            Flood intensity
          </div>
          <div className={cn("text-xl leading-tight font-extrabold", L.text)}>
            {L.label}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {L.note}
            {level > 0 && ` · worst in ${monthShort(peak.month)}`}
          </div>
        </div>
      </div>
      <div
        className="mt-1.5 flex gap-1 px-1"
        role="img"
        aria-label={`Flood intensity: ${L.label}`}
      >
        {LEVELS.map((l, i) => (
          <span
            key={l.label}
            className={cn(
              "h-2 flex-1 rounded-full",
              i <= level ? l.bar : "bg-black/10"
            )}
          />
        ))}
      </div>

      <div className="mt-2 flex flex-1 flex-col justify-around gap-1">
        <Row icon={CloudRain} tone="text-sky-600">
          Wettest month: <b>{monthLong(wettest.month)}</b>
        </Row>
        <Row icon={Sprout}>
          Ground soaks up <b>{Math.round(first.soakPct)}%</b> now,{" "}
          <b>{Math.round(last.soakPct)}%</b> by {monthShort(last.month)}
        </Row>
        {trouble.length > 0 && (
          <Row
            icon={TriangleAlert}
            tone={danger.length ? "text-red-500" : "text-amber-500"}
          >
            {danger.length ? "Flooding likely in" : "Watch"}{" "}
            <b>
              {listMonths(
                (danger.length ? danger : trouble).map((m) => m.month)
              )}
            </b>
          </Row>
        )}
        {result.treesCut > 0 && result.leadDays !== null && (
          <Row icon={Sprout}>
            Plant <b>{formatLeadTime(result.leadDays)}</b> before cutting
          </Row>
        )}
      </div>

      <p className="mt-2 flex items-start gap-2 rounded-2xl bg-emerald-50/80 px-2.5 py-2 text-[13px] leading-snug font-semibold text-emerald-900 [@media(max-height:680px)]:hidden">
        <Lightbulb
          className="mt-0.5 size-4 shrink-0 text-emerald-600"
          aria-hidden
        />
        {TIP[severityOf(result)]}
      </p>
    </GlassCard>
  )
}
