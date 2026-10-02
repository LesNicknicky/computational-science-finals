import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MethodSection {
  id: string
  title: string
  summary: string
  formula: string
  assumptions: string[]
}

const SECTIONS: MethodSection[] = [
  {
    id: "saplings",
    title: "Sapling Requirement",
    summary: "TODO: how many sapplings offset one felled mature tree, and why?",
    formula: "TODO: saplings_needed = ...",
    assumptions: ["TODO: survival rate", "TODO: replacement ratio source"],
  },
  {
    id: "absorption",
    title: "Absorption recovery over time",
    summary:
      "TODO: how sapling growth restores the water absorption lost from cutting.",
    formula: "TODO: recovered(t) = ...",
    assumptions: ["TODO: growth curve", "TODO: ground type effect"],
  },
  {
    id: "flood-risk",
    title: "Flood risk and rate of rise",
    summary:
      "TODO: how rainfall, runoff, and lost absorption combine into the risk index.",
    formula: "TODO: risk_index = ...",
    assumptions: ["TODO: thresholds for Safe / Watch / Flood warning"],
  },
  {
    id: "lead-time",
    title: "Lead time before cutting",
    summary: "TODO: why saplings are planted months before the cut.",
    formula: "TODO: lead_time = ...",
    assumptions: [],
  },
]

export default function MethodologyPage() {
  return (
    <div className="mx-w-3xl mx-auto space-y-4 p-4">
      <div>
        <h2 className="text-xl font-semibold">Methodology</h2>
        <p className="text-sm text-muted-foreground">
          How each number in the simulator is calculated
        </p>
      </div>

      {SECTIONS.map((s) => (
        <Card key={s.id} id={s.id}>
          <CardHeader>
            <CardTitle>{s.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{s.summary}</p>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm">
              {s.formula}
            </pre>
            {s.assumptions.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {s.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
