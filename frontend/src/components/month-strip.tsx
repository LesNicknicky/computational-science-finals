import { CircleCheck, TriangleAlert, Waves } from "lucide-react"
import { STATUS_COPY, rainIcon, rainText, rainWord } from "@/lib/copy"
import { cn } from "@/lib/utils"
import type { MonthResult, MonthStatus } from "@/types/dashboard"

// Soft pastel badges: calm to look at, still clear at a glance.
const BADGE: Record<
  MonthStatus,
  { icon: React.ElementType; badge: string; text: string; ring: string }
> = {
  safe: {
    icon: CircleCheck,
    badge: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-700",
    ring: "ring-emerald-400/60",
  },
  careful: {
    icon: TriangleAlert,
    badge: "bg-amber-100 text-amber-600",
    text: "text-amber-600",
    ring: "ring-amber-400/60",
  },
  danger: {
    icon: Waves,
    badge: "bg-red-100 text-red-500",
    text: "text-red-600",
    ring: "ring-red-400/60",
  },
}

const SENTENCE: Record<MonthStatus, string> = {
  safe: "the ground keeps up with the rain.",
  careful: "the ground is close to its limit.",
  danger: "flooding is likely.",
}

interface Props {
  months: MonthResult[]
  activeIndex: number
  playing: boolean
  /** first and last month (0-based) of the duration being simulated */
  start: number
  end: number
}

export function MonthStrip({
  months,
  activeIndex,
  playing,
  start,
  end,
}: Props) {
  const active = months[activeIndex] ?? months[months.length - 1]
  const ActiveIcon = BADGE[active.status].icon

  return (
    <div className="flex flex-col gap-2">
      {/* One small tile per month: just a status badge and a rain icon. */}
      <div className="grid grid-cols-12 gap-1.5">
        {months.map((m, i) => {
          const b = BADGE[m.status]
          const Icon = b.icon
          const Rain = rainIcon(m.rainPct)
          const inRange = i >= start && i <= end
          const isPartial = start > 0 || end < months.length - 1
          return (
            <div
              key={m.month}
              title={`Month ${m.month}: ${rainWord(m.rainPct)} rain, ${STATUS_COPY[m.status].label}`}
              className={cn(
                "clay-sm flex min-w-0 flex-col items-center gap-1 py-1.5 transition-all duration-300",
                // months outside the chosen duration are muted; inside, the ones not reached yet fade
                !inRange && "opacity-25 saturate-0",
                inRange && i > activeIndex && "opacity-40",
                isPartial &&
                  inRange &&
                  !playing &&
                  "ring-2 ring-emerald-300/70",
                playing &&
                  i === activeIndex &&
                  cn("-translate-y-1 scale-105 ring-4 ring-offset-0", b.ring)
              )}
            >
              <span className="text-[11px] text-muted-foreground">
                M{m.month}
              </span>
              <span
                className={cn(
                  "grid size-8 place-items-center rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08),2px_3px_5px_rgba(88,128,98,0.25)]",
                  b.badge
                )}
              >
                <Icon
                  className="size-4.5"
                  aria-label={STATUS_COPY[m.status].label}
                />
              </span>
              <Rain
                className={cn("size-4", rainText(m.rainPct))}
                aria-label={`${rainWord(m.rainPct)} rain`}
              />
            </div>
          )
        })}
      </div>

      {/* The details, said once, in words, for the month being shown. */}
      <div className="clay-inset flex items-center gap-2 px-4 py-1.5 text-sm">
        <ActiveIcon
          className={cn("size-4 shrink-0", BADGE[active.status].text)}
          aria-hidden
        />
        <span>
          <b>Month {active.month}</b> · {rainWord(active.rainPct)} rain ·{" "}
          <b className={BADGE[active.status].text}>
            {STATUS_COPY[active.status].label}
          </b>
          : {SENTENCE[active.status]}
        </span>
      </div>
    </div>
  )
}
