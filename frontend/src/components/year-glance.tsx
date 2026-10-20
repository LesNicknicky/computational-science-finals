import { Label, Pie, PieChart } from "recharts";
import { GlassCard } from "@/components/glass-card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { MonthResult } from "@/types/dashboard";

const config = {
  safe: { label: "Safe", color: "#12a36e" },
  careful: { label: "Be careful", color: "#e0a020" },
  danger: { label: "Danger", color: "#dc4b3c" },
} satisfies ChartConfig;

export function YearGlance({ months }: { months: MonthResult[] }) {
  const count = (s: MonthResult["status"]) => months.filter((m) => m.status === s).length;
  const data = (["safe", "careful", "danger"] as const).map((s) => ({ status: s, count: count(s), fill: `var(--color-${s})` }));
  return (
    <GlassCard className="min-h-0 flex-1 flex-col items-center justify-center">
      <p className="mb-1 self-start text-[13px] font-semibold text-muted-foreground">The year at a glance</p>
      <ChartContainer config={config} className="aspect-square max-h-35 w-full drop-shadow-[3px_4px_3px_rgba(6,78,59,0.25)]">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" innerRadius="62%" strokeWidth={3} cornerRadius={6} paddingAngle={2}>
            <Label
              content={({ viewBox }) =>
                viewBox && "cx" in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-bold">
                    {count("safe")}/12
                  </text>
                ) : null
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <p className="text-xs text-muted-foreground">
        <b className="text-emerald-600">●</b> {count("safe")} safe <b className="text-amber-500">●</b> {count("careful")} careful <b className="text-red-500">●</b> {count("danger")} danger
      </p>
    </GlassCard>
  );
}