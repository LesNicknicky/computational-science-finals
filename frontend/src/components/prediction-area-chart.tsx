// src/components/prediction-area-chart.tsx
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import type { SimulationResponse } from "../types/simulation"

const chartConfig = {
  recovered: {
    label: "Land's ability to soak up rain",
    color: "var(--chart-1)",
  },
  rain: { label: "Rainfall (vs. wettest month)", color: "#eb6834" },
} satisfies ChartConfig

// Item values are the labels themselves so the Select shows readable text
const RANGES: Record<string, number | null> = {
  "Whole run": null,
  "First 6 months": 6,
  "First 3 months": 3,
}

export function PredictionAreaChart({
  months,
}: {
  months: SimulationResponse["months"]
}) {
  const [range, setRange] = useState<string>("Whole run")

  const data = useMemo(() => {
    const wettest = Math.max(...months.map((m) => m.rainfallMm), 1)
    const rows = months.map((m, i) => ({
      month: i,
      recovered: Math.round(m.absorptionRecoveredPct),
      rain: Math.round((m.rainfallMm / wettest) * 100),
    }))
    const limit = RANGES[range]
    return limit === null ? rows : rows.slice(0, limit + 1)
  }, [months, range])

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle>How the land recovers</CardTitle>
          <CardDescription>
            As new trees grow, the land soaks up more rain. Flooding is most
            likely in the rainy months.
          </CardDescription>
        </div>
        <Select value={range} onValueChange={(v) => v && setRange(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(RANGES).map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `M${v}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) => `Month ${v}`}
                />
              }
            />
            <Area
              dataKey="rain"
              type="natural"
              stroke="var(--color-rain)"
              fill="var(--color-rain)"
              fillOpacity={0.15}
            />
            <Area
              dataKey="recovered"
              type="natural"
              stroke="var(--color-recovered)"
              fill="var(--color-recovered)"
              fillOpacity={0.15}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
