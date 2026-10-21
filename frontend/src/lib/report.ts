import { PROJECT } from "@/lib/project"
import { STATUS_COPY, formatLeadTime, rainWord } from "@/lib/copy"
import { SEVERITY, interpret, type Scenario } from "@/lib/interpret"
import { monthLong, monthShort } from "@/lib/months"
import type { SimulationResult } from "@/types/dashboard"

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const n = (v: number) => v.toLocaleString("en-US")

const STATUS_HEX = { safe: "#12a36e", careful: "#e0a020", danger: "#dc4b3c" }

// Rain bars + soak-up line, drawn as plain SVG so the report needs no library.
function chartSvg(result: SimulationResult) {
  const W = 680,
    H = 200,
    L = 40,
    R = 40,
    T = 14,
    B = 28
  const iw = W - L - R,
    ih = H - T - B
  const maxMm = Math.max(...result.months.map((m) => m.rainMm), 1)
  const bw = iw / 12
  const bars = result.months
    .map((m, i) => {
      const h = (m.rainMm / maxMm) * ih
      return `<rect x="${L + i * bw + bw * 0.18}" y="${T + ih - h}" width="${bw * 0.64}" height="${h}" rx="4" fill="${STATUS_HEX[m.status]}" fill-opacity=".75"/>
      <text x="${L + i * bw + bw / 2}" y="${H - 10}" font-size="10" text-anchor="middle" fill="#55655b">${monthShort(m.month)}</text>`
    })
    .join("")
  const pts = result.months
    .map((m, i) => `${L + i * bw + bw / 2},${T + ih - (m.soakPct / 100) * ih}`)
    .join(" ")
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Rain and soak-up by month">
    <line x1="${L}" y1="${T + ih}" x2="${W - R}" y2="${T + ih}" stroke="#c9d6cd"/>
    ${bars}
    <polyline points="${pts}" fill="none" stroke="#2563a8" stroke-width="2.5" stroke-linejoin="round"/>
    <text x="${L - 6}" y="${T + 8}" font-size="10" text-anchor="end" fill="#55655b">${Math.round(maxMm)} mm</text>
    <text x="${W - R + 6}" y="${T + 8}" font-size="10" fill="#2563a8">100%</text>
  </svg>`
}

export function openReport(
  result: SimulationResult,
  scenario: Scenario
): boolean {
  const info = interpret(result, scenario)
  const sev = SEVERITY[info.severity]
  const when = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const rows = result.months
    .map(
      (m) => `<tr>
        <td>${monthLong(m.month)}</td>
        <td class="num">${Math.round(m.rainMm)}</td>
        <td>${rainWord(m.rainPct)}</td>
        <td class="num">${Math.round(m.soakPct)}%</td>
        <td><span class="dot" style="background:${STATUS_HEX[m.status]}"></span>${STATUS_COPY[m.status].label}</td>
      </tr>`
    )
    .join("")

  const lead =
    result.leadDays === null
      ? "Cannot be offset by planting"
      : `${formatLeadTime(result.leadDays)} before cutting`

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>BINHI report · ${esc(scenario.regionName)} · ${esc(scenario.groundLabel)}</title>
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body { font-family: "Nunito Sans", "Segoe UI", Arial, sans-serif; color: #17261d; font-size: 12px; line-height: 1.45; margin: 0; }
  header { border-bottom: 3px solid #2f9d68; padding-bottom: 8px; margin-bottom: 12px; }
  .brand { display: flex; justify-content: space-between; align-items: baseline; }
  .brand b { font-size: 22px; letter-spacing: .5px; color: #14633f; }
  .brand span { color: #55655b; }
  .title { font-style: italic; margin: 4px 0 0; color: #34463b; }
  h2 { font-size: 13px; margin: 14px 0 6px; color: #14633f; text-transform: uppercase; letter-spacing: .6px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .card { border: 1px solid #d3dfd7; border-radius: 10px; padding: 8px 10px; }
  .card small { display: block; color: #55655b; }
  .card strong { font-size: 15px; }
  .sev { display: flex; gap: 12px; align-items: center; border: 2px solid ${sev.hex}; border-radius: 12px; padding: 10px 12px; }
  .sev .badge { background: ${sev.hex}; color: #fff; border-radius: 999px; padding: 4px 14px; font-weight: 800; font-size: 14px; white-space: nowrap; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 4px 8px; border-bottom: 1px solid #e3ebe5; text-align: left; }
  th { background: #eef5f0; font-size: 11px; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  ul { margin: 4px 0; padding-left: 18px; }
  .note { color: #55655b; font-size: 11px; }
  footer { margin-top: 14px; border-top: 1px solid #d3dfd7; padding-top: 6px; color: #55655b; font-size: 10.5px; display: flex; justify-content: space-between; }
  .legend { font-size: 10.5px; color: #55655b; }
  .legend i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin: 0 4px 0 10px; vertical-align: -1px; }
  button { font: inherit; padding: 8px 18px; border-radius: 999px; border: 0; background: #2f9d68; color: #fff; font-weight: 700; cursor: pointer; }
  .bar { text-align: right; margin-bottom: 8px; }
  @media print { .bar { display: none; } }
  section { break-inside: avoid; }
</style></head><body>
<div class="bar"><button onclick="window.print()">Print / Save as PDF</button></div>
<header>
  <div class="brand"><b>${PROJECT.name}</b><span>Simulation report · ${when}</span></div>
  <p class="title">${esc(PROJECT.title)}</p>
  <div class="note">by ${PROJECT.team}</div>
</header>

<section>
<h2>Scenario</h2>
<div class="grid">
  <div class="card"><small>Region (rain station)</small><strong>${esc(scenario.regionName)}</strong><small>${esc(scenario.station)}</small></div>
  <div class="card"><small>Ground type</small><strong>${esc(scenario.groundLabel)}</strong></div>
  <div class="card"><small>Trees cut</small><strong>${scenario.cutPercent}% · ${n(result.treesCut)} of ${n(scenario.matureTrees)}</strong></div>
  <div class="card"><small>Saplings to plant</small><strong>${n(result.saplingsPlanted)}</strong><small>100 per tree cut (DENR DMO 2012-02)</small></div>
  <div class="card"><small>Plant before cutting</small><strong>${esc(lead)}</strong></div>
  <div class="card"><small>Simulated period</small><strong>12 months</strong><small>January to December</small></div>
</div>
</section>

<section>
<h2>Result and severity</h2>
<div class="sev">
  <span class="badge">${sev.label.toUpperCase()}</span>
  <div><b>${esc(info.summary)}</b><div class="note">${esc(sev.meaning)}</div></div>
</div>
</section>

<section>
<h2>The year, month by month</h2>
${chartSvg(result)}
<div class="legend">Bars: simulated rain (mm), coloured by status
  <i style="background:#12a36e"></i>Safe<i style="background:#e0a020"></i>Be careful<i style="background:#dc4b3c"></i>Danger
  <i style="background:#2563a8"></i>Ground soak-up (% of normal)</div>
<table>
  <thead><tr><th>Month</th><th class="num">Rain (mm)</th><th>Rain level</th><th class="num">Soak-up</th><th>Status</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
</section>

<section>
<h2>Interpretation</h2>
<ul>${info.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
<p><b>What to do:</b> ${esc(info.advice)}</p>
</section>

<section>
<h2>Context for this result</h2>
<ul>${info.context.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
<p class="note">Limits: severity is a relative indicator, the rain is a single simulated year, and this report supports planning only. It does not replace a field survey or a permit review.</p>
</section>

<footer><span>${PROJECT.name} · created by ${PROJECT.team}</span><span>Generated ${when}</span></footer>
</body></html>`

  const w = window.open("", "_blank")
  if (!w) return false
  w.document.open()
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 500)
  return true
}
