import { Label, Pie, PieChart } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import { CardTitle, GlassCard } from "@/components/glass-card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { MonthResult } from "@/types/dashboard";

const config = {
  safe: { label: "Safe", color: "#12a36e" },
  careful: { label: "Be careful", color: "#e0a020" },
  danger: { label: "Danger", color: "#dc4b3c" },
} satisfies ChartConfig;

const LEGEND = [
  { key: "safe", label: "safe", dot: "bg-emerald-500" },
  { key: "careful", label: "careful", dot: "bg-amber-400" },
  { key: "danger", label: "danger", dot: "bg-red-500" },
] as const;

export function YearGlance({
  months,
  whole = true,
  label = "Whole year",
}: {
  months: MonthResult[]
  whole?: boolean
  label?: string
}) {
  const count = (s: MonthResult["status"]) => months.filter((m) => m.status === s).length;
  // zero-sized slices are dropped so a full ring has no gap or rounded notch
  const data = (["safe", "careful", "danger"] as const)
    .map((s) => ({ status: s, count: count(s), fill: `var(--color-${s})` }))
    .filter((d) => d.count > 0);

  return (
    <GlassCard className="min-h-0 min-w-0 flex-1 flex-col px-4 py-3 max-lg:min-h-64">
      <CardTitle icon={PieIcon}>
        {whole ? "The year at a glance" : `${label} at a glance`}
      </CardTitle>
      <ChartContainer
        config={config}
        className="min-h-0 w-full flex-1 aspect-auto max-lg:min-h-40 drop-shadow-[3px_4px_3px_rgba(6,78,59,0.25)]"
      >
        <PieChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            innerRadius="64%"
            outerRadius="100%"
            strokeWidth={data.length > 1 ? 3 : 0}
            paddingAngle={data.length > 1 ? 3 : 0}
            cornerRadius={data.length > 1 ? 6 : 0}
          >
            <Label
              content={({ viewBox }) =>
                viewBox && "cx" in viewBox ? (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                    {count("safe")}/{months.length}
                  </text>
                ) : null
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-1.5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
        {LEGEND.map((l) => (
          <span key={l.key} className="flex items-center gap-1">
            <span className={`size-2 rounded-full ${l.dot}`} />
            {count(l.key)} {l.label}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}