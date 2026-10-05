import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* ---------- data ---------- */

interface Reference {
  id: string
  citation: string
}

// Order here sets the [1], [2]... numbers shown on the page.
const REFERENCES: Reference[] = [
  {
    id: "ref-denr-fmb",
    citation:
      "Department of Environment and Natural Resources, Forest Management Bureau. (2023). Forestry sector report 2023 [Data for January–April 2023, updated May 19, 2023]. TODO: confirm title and add link.",
  },
]

interface DataSource {
  name: string
  gives: string
  usedFor: string
  goodToKnow?: string
  refId?: string
}

const SOURCES: DataSource[] = [
  {
    name: "DENR-FMB log production data",
    gives: "How many cubic meters of logs each region produced.",
    usedFor: "Sets the tree counts for the five regions you can pick.",
    goodToKnow: "Covers January to April 2023 only, so it is not a full year.",
    refId: "ref-denr-fmb",
  },
  {
    name: "TODO: rainfall data source",
    gives: "TODO",
    usedFor: "TODO",
  },
]

const NATIONAL_TOTAL_M3 = 117368.16

const TOP_REGIONS = [
  { name: "Caraga (XIII)", m3: 83565.6 },
  { name: "Calabarzon", m3: 13218.68 },
  { name: "Northern Mindanao", m3: 5169.79 },
  { name: "Central Visayas", m3: 2695.03 },
  { name: "Ilocos", m3: 2683.35 },
]

type Kind = "source" | "derived" | "assumption" | "todo"

const KIND: Record<
  Kind,
  { label: string; meaning: string; className: string }
> = {
  source: {
    label: "From a source",
    meaning: "Taken directly from a published study or report.",
    className: "bg-green-600/20 text-green-400",
  },
  derived: {
    label: "Worked out from data",
    meaning: "Calculated by us from published numbers.",
    className: "bg-blue-600/20 text-blue-400",
  },
  assumption: {
    label: "Our assumption",
    meaning: "A modeling choice we made, not a measured value.",
    className: "bg-yellow-500/20 text-yellow-400",
  },
  todo: {
    label: "To be confirmed",
    meaning: "Still being checked.",
    className: "bg-muted text-muted-foreground",
  },
}

interface Constant {
  name: string
  meaning: string
  value: string
  kind: Kind
  refId?: string
}

// Fill in value, kind, and refId as each number is verified.
const CONSTANTS: Constant[] = [
  {
    name: "Sapling replacement ratio",
    meaning: "How many new trees make up for one cut tree.",
    value: "TODO",
    kind: "todo",
  },
  {
    name: "Sapling survival rate",
    meaning: "Share of planted saplings that survive.",
    value: "TODO",
    kind: "todo",
  },
  {
    name: "Sapling growth time",
    meaning: "How long a sapling takes to reach full water absorption.",
    value: "TODO",
    kind: "todo",
  },
  {
    name: "Runoff by ground type",
    meaning: "How much rain runs off instead of soaking in (six ground types).",
    value: "TODO",
    kind: "todo",
  },
  {
    name: "Drainage speed by ground type",
    meaning:
      "How quickly water drains away, which sets how long flooding lasts.",
    value: "TODO",
    kind: "todo",
  },
  {
    name: "Flood warning thresholds",
    meaning: "Where Safe turns into Be careful, and Be careful into Danger.",
    value: "TODO",
    kind: "todo",
  },
]

const LIMITS: string[] = [
  "The log data covers January to April 2023 only, not a full year.",
  "Only the five biggest log-producing regions have presets.",
  "Rainfall is randomized on every run, so results change when you press New rain.",
  "The model works at the region level, not for individual communities.",
  "TODO: add any other limits from the study scope.",
]

const NAV = [
  { id: "sources", label: "Data sources" },
  { id: "regions", label: "Where the logs come from" },
  { id: "constants", label: "The numbers we use" },
  { id: "limits", label: "What this does not cover" },
  { id: "references", label: "References" },
]

/* ---------- small pieces ---------- */

function RefLink({ id }: { id?: string }) {
  const n = REFERENCES.findIndex((r) => r.id === id)
  if (n === -1) return <span className="text-muted-foreground">TODO</span>
  return (
    <a href={`#${id}`} className="text-primary hover:underline">
      [{n + 1}]
    </a>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy}>
      {copied ? (
        <Check className="mr-1 h-4 w-4" />
      ) : (
        <Copy className="mr-1 h-4 w-4" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

/* ---------- page ---------- */

export default function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-7xl p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Research & data</h2>
        <p className="text-sm text-muted-foreground">
          Where the numbers come from and how they're used.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-start">
        <nav className="xl:sticky xl:top-4">
          <p className="mb-2 text-sm font-medium">On this page</p>
          <ul className="space-y-1 border-l pl-3 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-4xl space-y-4">
          {/* Data sources */}
          <Card id="sources" className="scroll-mt-4">
            <CardHeader>
              <CardTitle>Data sources</CardTitle>
              <CardDescription>
                The reports and datasets behind the simulator.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {SOURCES.map((s) => (
                <div key={s.name} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{s.name}</p>
                    <RefLink id={s.refId} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      What it gives us
                    </p>
                    <p className="text-sm">{s.gives}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Where we use it
                    </p>
                    <p className="text-sm">{s.usedFor}</p>
                  </div>
                  {s.goodToKnow && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Good to know
                      </p>
                      <p className="text-sm">{s.goodToKnow}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top regions */}
          <Card id="regions" className="scroll-mt-4">
            <CardHeader>
              <CardTitle>Where the logs come from</CardTitle>
              <CardDescription>
                The five regions with the most logs produced, as a share of the
                national total (January to April 2023).{" "}
                <RefLink id="ref-denr-fmb" />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {TOP_REGIONS.map((r) => {
                const share = (r.m3 / NATIONAL_TOTAL_M3) * 100
                return (
                  <div key={r.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{r.name}</span>
                      <span className="text-muted-foreground">
                        {Math.round(r.m3).toLocaleString()} m³ ·{" "}
                        {share.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={share} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Constants */}
          <Card id="constants" className="scroll-mt-4">
            <CardHeader>
              <CardTitle>The numbers we use</CardTitle>
              <CardDescription>
                Each number is labeled so you can tell how solid it is.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(KIND) as Kind[]).map((k) => (
                  <div key={k} className="flex items-start gap-2 text-sm">
                    <Badge className={`shrink-0 ${KIND[k].className}`}>
                      {KIND[k].label}
                    </Badge>
                    <span className="text-muted-foreground">
                      {KIND[k].meaning}
                    </span>
                  </div>
                ))}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>What it is</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>How solid</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONSTANTS.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.meaning}
                        </p>
                      </TableCell>
                      <TableCell>{c.value}</TableCell>
                      <TableCell>
                        <Badge className={KIND[c.kind].className}>
                          {KIND[c.kind].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <RefLink id={c.refId} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Limits */}
          <Card id="limits" className="scroll-mt-4">
            <CardHeader>
              <CardTitle>What this does not cover</CardTitle>
              <CardDescription>
                Good to keep in mind when reading the results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {LIMITS.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* References */}
          <Card id="references" className="scroll-mt-4">
            <CardHeader>
              <CardTitle>References</CardTitle>
              <CardDescription>
                Full citations for the sources above.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                {REFERENCES.map((r, i) => (
                  <li
                    key={r.id}
                    id={r.id}
                    className="flex scroll-mt-4 items-start justify-between gap-2"
                  >
                    <span>
                      <span className="mr-2 text-muted-foreground">
                        [{i + 1}]
                      </span>
                      {r.citation}
                    </span>
                    <CopyButton text={r.citation} />
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
