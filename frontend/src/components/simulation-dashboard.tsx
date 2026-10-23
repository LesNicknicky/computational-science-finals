import {
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Download,
  ArrowLeftSquare,
  Lightbulb,
  LoaderCircle,
  Play,
  ShieldCheck,
  Square,
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { GlassCard, CardTitle } from "@/components/glass-card"
import { CutVsPlanted, HighlightTiles } from "@/components/highlight-tiles"
import { MonthStrip } from "@/components/month-strip"
import { PredictionAreaChart } from "@/components/prediction-area-chart"
import {
  SimulationForm,
  type SimulationFormProps,
} from "@/components/simulation-form"
import { InterpretationPanel } from "@/components/interpretation-panel"
import { YearGlance } from "@/components/year-glance"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RANGES, getRange } from "@/lib/range"
import { usePlaySequence } from "@/hooks/use-play-sequence"
import { PROJECT } from "@/lib/project"
import { STATUS_TEXT, formatLeadTime, headline, worstStatus } from "@/lib/copy"
import type { SimulationResult } from "@/types/dashboard"

interface Props {
  result: SimulationResult
  form: SimulationFormProps
  /** first and last month (1-12) of the duration chosen next to Simulate */
  onExport?: (start: number, end: number) => void
}

// Page content only. The SidebarProvider + AppSidebar live once, in App.tsx.
export function SimulationDashboard({ result, form, onExport }: Props) {
  // the whole year is optional: the person can simulate just one quarter
  const [rangeValue, setRangeValue] = useState("all")
  const range = getRange(rangeValue)
  const isWhole = range.value === "all"
  const scoped = result.months.slice(range.start, range.end + 1)
  // passing `result` resets to the chosen range whenever a new result arrives
  const { index, playing, done, toggle } = usePlaySequence(
    result.months.length,
    700,
    result,
    range.start,
    range.end
  )
  const worst = worstStatus(scoped)

  return (
    <div className="app-bg relative flex min-w-0 flex-1 flex-col gap-3 p-3 lg:h-svh lg:overflow-auto">
      <div
        className="blob -top-16 left-64 size-110 opacity-70"
        style={{
          background:
            "radial-gradient(oklch(0.86 0.09 152 / 0.75), transparent 70%)",
        }}
      />
      <div
        className="blob right-32 -bottom-20 size-115 opacity-80"
        style={{
          background:
            "radial-gradient(oklch(0.9 0.09 110 / 0.8), transparent 70%)",
          animationDirection: "reverse",
        }}
      />
      <header className="sticky top-0 z-20 flex items-center justify-between">
        <div className="clay-sm max-w-full rounded-[1.5rem]! px-5 py-1.5">
          <h1 className="text-[19px] leading-tight font-extrabold tracking-wide text-emerald-900">
            {PROJECT.name}
          </h1>
          <p className="line-clamp-2 text-[11px] leading-snug font-semibold text-emerald-900/70">
            {PROJECT.title}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
            aria-label="Back to the landing page"
          >
            <ArrowLeftSquare /> Return To Landing Page
          </Link>
          <Link
            to="/guide"
            className={buttonVariants({ variant: "outline", size: "lg" })}
            aria-label="Open the guide"
          >
            <BookOpen /> Guide
          </Link>
        </div>
      </header>

      <div className="relative grid min-h-0 flex-1 gap-3 lg:grid-cols-[330px_minmax(0,1fr)_290px] lg:grid-rows-[minmax(0,1fr)]">
        <SimulationForm {...form} />

        <div className="flex min-h-0 flex-col gap-3">
          <GlassCard className="flex-row flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
            {done ? (
              <div className="flex items-center gap-3.5">
                <ShieldCheck
                  className={`size-14 ${STATUS_TEXT[worst]}`}
                  strokeWidth={1.8}
                  aria-hidden
                />
                <div>
                  <div
                    className={`text-3xl leading-tight font-bold ${STATUS_TEXT[worst]}`}
                  >
                    {headline(
                      scoped,
                      isWhole ? "all year" : `in ${range.label.toLowerCase()}`
                    )}
                  </div>
                  <div className="text-base">
                    Cut <b>{result.treesCut.toLocaleString("en-US")} trees</b> →
                    plant{" "}
                    <b>
                      {result.saplingsPlanted.toLocaleString("en-US")} new trees
                    </b>
                    {result.leadDays === null ? (
                      ", but this cut can't be offset by planting."
                    ) : (
                      <>
                        , starting <b>{formatLeadTime(result.leadDays)}</b>{" "}
                        before cutting.
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3.5">
                {playing ? (
                  <LoaderCircle
                    className="size-14 animate-spin text-emerald-600"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                ) : (
                  <ShieldCheck
                    className="size-14 text-emerald-900/25"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                )}
                <div>
                  <div className="text-xs font-bold tracking-widest text-emerald-900/60">
                    SIMULATION RESULT
                  </div>
                  <div className="text-2xl leading-tight font-bold text-emerald-900/50">
                    {playing ? "Simulating…" : "No result yet"}
                  </div>
                  <div className="text-base text-muted-foreground">
                    {playing
                      ? "The flood verdict appears when it finishes or you press Stop."
                      : "Pick your settings, then press Simulate."}
                  </div>
                </div>
              </div>
            )}
            <div className="ml-auto flex items-center gap-2.5">
              {/* Base UI Select passes `string | null`, so guard the null */}
              <Select
                items={RANGES}
                value={rangeValue}
                onValueChange={(v) => v && setRangeValue(v)}
                disabled={playing}
              >
                <SelectTrigger className="w-40" aria-label="Months to simulate">
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
              <Button onClick={toggle} size="lg">
                {playing ? <Square /> : <Play />}{" "}
                {playing ? "Stop" : "Simulate"}
              </Button>
              {onExport && (
                <Button
                  variant="outline"
                  onClick={() => onExport(range.start + 1, range.end + 1)}
                  size="lg"
                >
                  <Download /> Create report
                </Button>
              )}
            </div>
          </GlassCard>

          <GlassCard className="flex-col px-3 py-2.5">
            <CardTitle icon={CalendarDays}>
              {isWhole
                ? "The year, month by month"
                : `${range.label}, month by month`}
            </CardTitle>
            {done ? (
              <MonthStrip
                months={result.months}
                activeIndex={index}
                playing={playing}
                start={range.start}
                end={range.end}
              />
            ) : (
              <div className="clay-inset flex h-26 items-center justify-center gap-2 px-4 text-sm text-muted-foreground">
                {playing ? (
                  <LoaderCircle
                    className="size-4 animate-spin text-emerald-600"
                    aria-hidden
                  />
                ) : (
                  <CalendarDays
                    className="size-4 text-emerald-600"
                    aria-hidden
                  />
                )}
                {playing
                  ? "Simulating… the months appear when it finishes or you press Stop."
                  : "Press Simulate to see the months."}
              </div>
            )}
          </GlassCard>

          <div className="flex min-h-0 flex-1 gap-3">
            {done ? (
              <>
                <PredictionAreaChart
                  months={result.months}
                  activeIndex={index}
                  start={range.start}
                  end={range.end}
                />
                <YearGlance
                  months={scoped}
                  whole={isWhole}
                  label={range.label}
                />
              </>
            ) : (
              <GlassCard className="min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-2 px-4 py-3 text-center max-lg:min-h-64">
                {playing ? (
                  <LoaderCircle
                    className="size-9 animate-spin text-emerald-600"
                    aria-hidden
                  />
                ) : (
                  <ChartNoAxesCombined
                    className="size-9 text-emerald-600"
                    aria-hidden
                  />
                )}
                <p className="text-base font-bold text-emerald-900">
                  {playing ? "Simulating…" : "Graphs show after the simulation"}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {playing
                    ? "The graphs appear when it finishes, or when you press Stop."
                    : "Press Simulate to run the months and see the results."}
                </p>
              </GlassCard>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3">
          {done ? (
            <>
              <HighlightTiles month={result.months[index]} result={result} />
              <CutVsPlanted result={result} />
              <InterpretationPanel
                result={result}
                className="lg:min-h-0 lg:flex-1"
              />
            </>
          ) : (
            <GlassCard className="min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 py-3 text-center max-lg:min-h-64">
              {playing ? (
                <LoaderCircle
                  className="size-9 animate-spin text-emerald-600"
                  aria-hidden
                />
              ) : (
                <Lightbulb className="size-9 text-emerald-600" aria-hidden />
              )}
              <p className="text-base font-bold text-emerald-900">
                {playing ? "Simulating…" : "Results show after the simulation"}
              </p>
              <p className="text-[13px] text-muted-foreground">
                {playing
                  ? "The numbers and what they mean appear when it finishes, or when you press Stop."
                  : "Press Simulate to see the numbers and what they mean."}
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
