import { CircleCheck, TriangleAlert, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MonthResult } from "@/types/dashboard"

const ICON = {
  safe: <CircleCheck className="size-6 text-emerald-600" aria-label="Safe" />,
  careful: (
    <TriangleAlert className="size-6 text-amber-500" aria-label="Be careful" />
  ),
  danger: <Zap className="size-6 text-red-500" aria-label="Danger" />,
}
const RING = {
  safe: "ring-emerald-500",
  careful: "ring-amber-500",
  danger: "ring-red-500",
}

interface Props {
  months: MonthResult[]
  activeIndex: number
  playing: boolean
}

export function MonthStrip({ months, activeIndex, playing }: Props) {
  return (
    <div className="flex min-h-0 flex-1 gap-1.5">
      {months.map((m, i) => (
        <div
          key={m.month}
          className={cn(
            "flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-xl bg-white/50 py-2 transition-all duration-300",
            i > activeIndex && "opacity-30",
            playing &&
              i === activeIndex &&
              cn("bg-white/90 ring-2", RING[m.status])
          )}
        >
          <span className="text-xs text-muted-foreground">M{m.month}</span>
          {ICON[m.status]}
          <span className="text-sm font-semibold">
            {Math.round(m.soakPct)}%
          </span>
        </div>
      ))}
    </div>
  )
}
