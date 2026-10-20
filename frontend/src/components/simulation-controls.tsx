import { FileText, Layers, LoaderCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SimulationControlsProps {
  ground: string
  onGroundChange: (value: string) => void
  groundOptions: { value: string; label: string }[]
  onSimulate: () => void
  simulating: boolean
  onReport: () => void
  canReport: boolean
}

/** The three things you do most: pick the ground, run the simulation, get the report. */
export function SimulationControls(p: SimulationControlsProps) {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <Layers className="size-4 text-emerald-600" aria-hidden />
        <span className="hidden text-[13px] font-bold text-muted-foreground sm:inline">
          Ground
        </span>
        {/* Base UI Select passes `string | null`, so guard the null */}
        <Select
          items={p.groundOptions}
          value={p.ground}
          onValueChange={(v) => v && p.onGroundChange(v)}
        >
          <SelectTrigger className="w-44" aria-label="Ground type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {p.groundOptions.map((g) => (
              <SelectItem key={g.value} value={g.value}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={p.onSimulate} disabled={p.simulating} size="lg">
        {p.simulating ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Play />
        )}
        {p.simulating ? "Simulating…" : "Simulate"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={p.onReport}
        disabled={!p.canReport}
      >
        <FileText /> Report
      </Button>
    </>
  )
}