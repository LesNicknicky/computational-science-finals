// src/components/prediction-form.tsx
import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { PredictionAreaChart } from "@/components/prediction-area-chart"
import type { SimulationResponse } from "@/types/simulation"

const barConfig = {
  cut: { label: "Trees Cut", color: "#eb6834" },
  planted: { label: "Saplings Planted", color: "var(--chart-1)" },
} satisfies ChartConfig

const pieConfig = {
  months: { label: "Months" },
  safe: { label: "Safe", color: "#1baf7a" },
  watch: { label: "Be careful", color: "#eda100" },
  warning: { label: "Danger", color: "#d03b3b" },
} satisfies ChartConfig

export function PredictionForm({
  result,
}: {
  result: SimulationResponse | null
}) {
  // Assumption: all trees are cut in month 0, and the saplings are planted
  // evenly over the lead time. Replace this if your backend gives real
  // per-month numbers.
  const schedule = useMemo(() => {
    if (!result) return []
    const span = Math.max(result.leadTimeMonths, 1)
    return result.months.map((_, i) => ({
      month: i,
      cut: i === 0 ? result.treesToCut : 0,
      planted: i < span ? Math.round(result.saplingsNeeded / span) : 0,
    }))
  }, [result])

  if (!result || result.months.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Prediction Yet</CardTitle>
          <CardDescription>
            Run a simulation first, then come back to see how the land recovers.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const pieData = (["safe", "watch", "warning"] as const).map((s) => ({
    status: s,
    months: result.months.filter((m) => m.risk === s).length,
    fill: `var(--color-${s})`,
  }))

  return (
    <div className="flex flex-col gap-4">
      <PredictionAreaChart months={result.months} />

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Trees cut vs. planted</CardTitle>
            <CardDescription>
              How many trees are removed and replaced each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barConfig} className="h-50 w-full">
              <BarChart data={schedule}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `M${v}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="cut" fill="var(--color-cut)" radius={4} />
                <Bar dataKey="planted" fill="var(--color-planted)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>The Year at a glance</CardTitle>
            <CardDescription>How Many months are safe.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={pieConfig}
              className="mx-auto aspect-square h-50"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={pieData} dataKey="months" nameKey="status" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
