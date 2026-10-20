import { CalendarDays, Download, Play, ShieldCheck, Square } from "lucide-react"
import { GlassCard, CardTitle } from "@/components/glass-card"
import { CutVsPlanted, HighlightTiles } from "@/components/highlight-tiles"
import { MonthStrip } from "@/components/month-strip"
import { PredictionAreaChart } from "@/components/prediction-area-chart"
import {
  SimulationForm,
  type SimulationFormProps,
} from "@/components/simulation-form"
import { YearGlance } from "@/components/year-glance"
import { Button } from "@/components/ui/button"
import { usePlaySequence } from "@/hooks/use-play-sequence"
import { STATUS_TEXT, formatLeadTime, headline, worstStatus } from "@/lib/copy"
import type { SimulationResult } from "@/types/dashboard"

interface Props {
  result: SimulationResult
  form: SimulationFormProps
  onExport?: () => void
}

// Page content only. The SidebarProvider + AppSidebar live once, in App.tsx.
export function SimulationDashboard({ result, form, onExport }: Props) {
  // passing `result` resets to the full year whenever a new result arrives
  const { index, playing, toggle } = usePlaySequence(
    result.months.length,
    700,
    result
  )
  const worst = worstStatus(result.months)

  return (
    <div className="app-bg relative flex min-w-0 flex-1 flex-col gap-3 overflow-auto p-3 lg:h-svh lg:overflow-hidden">
      <div
        className="blob -top-16 left-64 size-110 opacity-70"
        style={{ background: "radial-gradient(oklch(0.86 0.09 152 / 0.75), transparent 70%)" }}
      />
      <div
        className="blob right-32 -bottom-20 size-115 opacity-80"
        style={{
          background: "radial-gradient(oklch(0.9 0.09 110 / 0.8), transparent 70%)",
          animationDirection: "reverse",
        }}
      />
      <header className="relative flex h-11 items-center justify-between">
        <h1 className="clay-sm rounded-full! px-5 py-1.5 text-[19px] font-extrabold text-emerald-900">
          Deforestation Offset Simulator
        </h1>
      </header>

      <div className="relative grid min-h-0 flex-1 gap-3 lg:grid-cols-[330px_minmax(0,1fr)_290px]">
        <SimulationForm {...form} />

        <div className="flex min-h-0 flex-col gap-3">
          <GlassCard className="flex-row flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <ShieldCheck
                className={`size-12 ${STATUS_TEXT[worst]}`}
                strokeWidth={1.8}
                aria-hidden
              />
              <div>
                <div className={`text-2xl font-bold ${STATUS_TEXT[worst]}`}>
                  {headline(result.months)}
                </div>
                <div className="text-sm">
                  Cut <b>{result.treesCut.toLocaleString("en-US")} trees</b> →
                  plant{" "}
                  <b>
                    {result.saplingsPlanted.toLocaleString("en-US")} new trees
                  </b>
                  {result.leadDays === null ? (
                    ", but this cut can't be offset by planting."
                  ) : (
                    <>
                      , starting <b>{formatLeadTime(result.leadDays)}</b> before
                      cutting.
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-muted-foreground">
                {playing ? `Month ${index + 1} of 12` : "Whole year"}
              </span>
              <Button
                onClick={toggle}
                size="lg"
              >
                {playing ? <Square /> : <Play />}{" "}
                {playing ? "Stop" : "Play the year"}
              </Button>
              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  size="lg"
                >
                  <Download /> Export PDF
                </Button>
              )}
            </div>
          </GlassCard>

          <GlassCard className="min-h-0 flex-2 flex-col">
            <CardTitle icon={CalendarDays}>The year, month by month</CardTitle>
            <MonthStrip
              months={result.months}
              activeIndex={index}
              playing={playing}
            />
          </GlassCard>

          <div className="flex min-h-0 flex-3 gap-3">
            <PredictionAreaChart months={result.months} activeIndex={index} />
            <YearGlance months={result.months} />
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          <HighlightTiles month={result.months[index]} result={result} />
          <CutVsPlanted result={result} />
        </div>
      </div>
    </div>
  )
}