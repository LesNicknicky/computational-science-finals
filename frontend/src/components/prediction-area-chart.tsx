import { useState } from "react"
import {
  Area,
  AreaChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"
import { CloudRain } from "lucide-react"
import { CardTitle, GlassCard } from "@/components/glass-card"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { rainWord } from "@/lib/copy"
import type { MonthResult } from "@/types/dashboard"

const config = {
  rain: { label: "Rain", color: "#2f7fb0" },
  soak: { label: "Ground soak-up", color: "#1f8f6b" },
} satisfies ChartConfig

const RANGES = [
  { value: "all", label: "Whole year" },
  { value: "1", label: "Months 1–3" },
  { value: "2", label: "Months 4–6" },
  { value: "3", label: "Months 7–9" },
  { value: "4", label: "Months 10–12" },
]

// Same cut-offs as rainWord() in lib/copy.ts, so the chart, the Rain tile and
// the month cards all use the same words. Words sit on the left axis, centred
// in each zone; the two faint lines mark where one zone turns into the next.
const ZONE_TICKS = [17.5, 52.5, 90]
const zoneWord = (v: number) =>
  v < 35 ? "Light rain" : v < 70 ? "Moderate" : "Heavy rain"

interface Point {
  label: string
  month: number
  rain: number | null
  soak: number | null
}

// Plain-language hover card instead of the default numeric tooltip.
function FriendlyTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: Point }[]
}) {
  const p = payload?.[0]?.payload
  if (!active || !p || p.rain === null || p.soak === null) return null
  return (
    <div className="clay-sm px-3.5 py-2.5 text-xs">
      <div className="mb-1 font-semibold">Month {p.month}</div>
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#2f7fb0]" />
        Rain: <b>{rainWord(p.rain)}</b>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[#1f8f6b]" />
        Ground soaks up: <b>{Math.round(p.soak)}%</b> of normal
      </div>
    </div>
  )
}

export function PredictionAreaChart({
  months,
  activeIndex,
}: {
  months: MonthResult[]
  activeIndex: number
}) {
  const [range, setRange] = useState("all")
  // months after the active one are null, so the area "draws itself" while playing
  const data: Point[] = months.map((m, i) => ({
    label: `M${m.month}`,
    month: m.month,
    rain: i <= activeIndex ? m.rainPct : null,
    soak: i <= activeIndex ? m.soakPct : null,
  }))
  const q = Number(range)
  const view = range === "all" ? data : data.slice((q - 1) * 3, q * 3)

  const drawn = view.filter((p) => p.rain !== null)
  const peak = drawn.length
    ? drawn.reduce((a, b) => ((b.rain ?? 0) > (a.rain ?? 0) ? b : a))
    : null

  return (
    <GlassCard className="min-h-0 min-w-0 flex-[2.2] flex-col px-3 py-2.5 max-lg:min-h-72">
      <div className="flex items-start justify-between gap-2">
        <div>
          <CardTitle icon={CloudRain}>
            Can the ground handle the rain?
          </CardTitle>
          <div className="-mt-1 mb-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-4 rounded-full bg-[#2f7fb0]/50" />
              Rain each month
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-[#1f8f6b]" />
              Rain the ground can soak up
            </span>
          </div>
        </div>
        {/* Base UI Select passes `string | null`, so guard the null */}
        <Select
          items={RANGES}
          value={range}
          onValueChange={(v) => v && setRange(v)}
        >
          <SelectTrigger
            size="sm"
            className="w-36 shrink-0"
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

      <ChartContainer
        config={config}
        className="clay-inset min-h-44 w-full flex-1 p-1.5 pt-2 lg:min-h-0"
      >
        <AreaChart data={view} margin={{ left: 0, right: 12, top: 14 }}>
          <defs>
            <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-rain)"
                stopOpacity={0.55}
              />
              <stop
                offset="100%"
                stopColor="var(--color-rain)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>

          {/* two whisper-quiet lines: where Light turns Moderate, Moderate turns Heavy */}
          {[35, 70].map((y) => (
            <ReferenceLine
              key={y}
              y={y}
              stroke="rgba(6,78,59,0.28)"
              strokeDasharray="3 5"
            />
          ))}

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={8}
            padding={{ left: 26, right: 10 }}
            tick={{ fontSize: 12, fill: "#3f4f44" }}
          />
          <YAxis
            domain={[0, 120]}
            ticks={ZONE_TICKS}
            tickFormatter={zoneWord}
            tickLine={false}
            axisLine={false}
            width={86}
            tick={{ fontSize: 12, fill: "#3f4f44" }}
          />
          <ChartTooltip
            cursor={{
              stroke: "#3aa882",
              strokeOpacity: 0.4,
              strokeDasharray: "3 4",
            }}
            content={<FriendlyTooltip />}
          />

          {/* the ground's limit: one thin, soft line */}
          <Area
            dataKey="soak"
            type="monotone"
            stroke="var(--color-soak)"
            strokeOpacity={0.95}
            strokeDasharray="7 5"
            fill="none"
            strokeWidth={2.25}
            isAnimationActive={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            dataKey="rain"
            type="monotone"
            stroke="var(--color-rain)"
            fill="url(#rainFill)"
            strokeWidth={3}
            isAnimationActive={false}
            activeDot={{
              r: 5,
              fill: "#fff",
              stroke: "#2f7fb0",
              strokeWidth: 2,
            }}
          />

          {peak && peak.rain !== null && (
            <ReferenceDot
              x={peak.label}
              y={peak.rain}
              r={4.5}
              fill="#fff"
              stroke="#2f7fb0"
              strokeWidth={2}
              ifOverflow="visible"
              label={{
                value: "Wettest",
                position: "bottom",
                fontSize: 12,
                fontWeight: 700,
                fill: "#2f7fb0",
                offset: 10,
              }}
            />
          )}
        </AreaChart>
      </ChartContainer>
    </GlassCard>
  )
}
