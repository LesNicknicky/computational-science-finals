import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataSource {
  name: string
  provides: string
  usedFor: string
  reference: string
}

const SOURCES: DataSource[] = [
  {
    name: "DENR-FMB log production data",
    provides: "Log volumes per region and period",
    usedFor: "TODO: how it feeds the tree-cut estimates",
    reference: "TODO: citation / link",
  },
  {
    name: "TODO: rainfall data source",
    provides: "TODO",
    usedFor: "TODO",
    reference: "TODO",
  },
]

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4">
      <div>
        <h2 className="text-xl font-semibold">Research & Data</h2>
        <p className="text-sm text-muted-foreground">
          Where the numbers come from and how they're used.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sources</TableHead>
                <TableHead>Provide</TableHead>
                <TableHead>Used For</TableHead>
                <TableHead>References</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SOURCES.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.provides}</TableCell>
                  <TableCell>{s.usedFor}</TableCell>
                  <TableCell>{s.reference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
