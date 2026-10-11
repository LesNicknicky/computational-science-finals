import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { CloudRain } from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MonthResult } from "@/types/dashboard"

const config = {
  rain: { label: "Rain", color: "#d9773c" },
  soak: { label: "Ground soak-up", color: "#12a36e" },
} satisfies ChartConfig

const RANGES = [
  { value: "all", label: "Whole year" },
  { value: "1", label: "Months 1–3" },
  { value: "2", label: "Months 4–6" },
  { value: "3", label: "Months 7–9" },
  { value: "4", label: "Months 10–12" },
]

export function PredictionAreaChart({
  months,
  activeIndex,
}: {
  months: MonthResult[]
  activeIndex: number
}) {
  const [range, setRange] = useState("all")
  // months after the active one are null, so the area "draws itself" while playing
  const data = months.map((m, i) => ({
    label: `M${m.month}`,
    rain: i <= activeIndex ? m.rainPct : null,
    soak: i <= activeIndex ? m.soakPct : null,
  }))
  const q = Number(range)
  const view = range === "all" ? data : data.slice((q - 1) * 3, q * 3)

  return (
    <GlassCard className="min-h-0 flex-2 flex-col">
      <div className="flex items-start justify-between">
        <CardTitle icon={CloudRain}>
          Rain vs. how much the ground can soak up
        </CardTitle>
        {/* Base UI Select passes `string | null`, so guard the null */}
        <Select
          items={RANGES}
          value={range}
          onValueChange={(v) => v && setRange(v)}
        >
          <SelectTrigger
            size="sm"
            className="w-32.5 bg-white/60"
            aria-label="Time range"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={config} className="min-h-0 w-full flex-1">
        <AreaChart data={view} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="soak"
            type="monotone"
            stroke="var(--color-soak)"
            fill="var(--color-soak)"
            fillOpacity={0.25}
            strokeWidth={2.5}
            isAnimationActive={false}
          />
          <Area
            dataKey="rain"
            type="monotone"
            stroke="var(--color-rain)"
            fill="var(--color-rain)"
            fillOpacity={0.18}
            strokeWidth={2.5}
            isAnimationActive={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </GlassCard>
  )
}