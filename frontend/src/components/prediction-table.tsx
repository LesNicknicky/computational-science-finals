import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { RISK_LABEL, RISK_STYLE } from "../data/risks"
import type { PredictionRow } from "../types/simulation"

interface Props {
  rows: PredictionRow[]
}

export default function PredictionTable({ rows }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction (expected rainfall)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Recovered</TableHead>
              <TableHead>Risk index</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.month}>
                <TableCell className="font-medium">Month {r.month}</TableCell>
                <TableCell>{Math.round(r.recoveredPct)}%</TableCell>
                <TableCell>{r.riskIndex.toFixed(1)}</TableCell>
                <TableCell>
                  <Badge className={RISK_STYLE[r.risk]}>
                    {RISK_LABEL[r.risk]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-3 text-xs text-muted-foreground">
          Sample constants for illustration only.
        </p>
      </CardContent>
    </Card>
  )
}
