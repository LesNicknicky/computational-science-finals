from datetime import date
from io import StringIO

from matplotlib import rc_context
from matplotlib.figure import Figure

from ..models.schemas import SimulationRequest, SimulationResponse

RISK_FILL = {"safe": "#d1fae5", "watch": "#fef3c7", "warning": "#fecaca"}


def _pretty(value: str) -> str:
    return value.replace("_", " ").title()


def _block(fig: Figure, x: float, y: float, title: str, rows: list[tuple[str, str]]) -> None:
    fig.text(x, y, title, fontsize=11, fontweight="bold")
    for i, (label, value) in enumerate(rows, start=1):
        line_y = y - 0.026 * i
        fig.text(x, line_y, label, fontsize=9, color="#555555")
        fig.text(x + 0.19, line_y, value, fontsize=9)


def build_report_svg(req: SimulationRequest, result: SimulationResponse) -> str:
    months = [m.month for m in result.months]
    rain = [m.rainfallMm for m in result.months]
    recovered = [m.absorptionRecoveredPct for m in result.months]

    with rc_context({"svg.fonttype": "none", "font.family": "sans-serif"}):
        fig = Figure(figsize=(8.27, 11.69))  # A4 portrait

        fig.text(0.06, 0.965, "Reforestation Offset Simulation Report", fontsize=16, fontweight="bold")
        fig.text(0.06, 0.945, f"Generated {date.today():%B %d, %Y}", fontsize=9, color="#555555")

        _block(fig, 0.06, 0.915, "Inputs", [
            ("Region", _pretty(req.region)),
            ("Ground type", _pretty(req.groundType)),
            ("Mature trees", f"{req.matureTrees:,}"),
            ("Cut percentage", f"{req.cutPercentage:g}%"),
            ("Rain seed", str(req.rainSeed)),
        ])
        _block(fig, 0.52, 0.915, "Results", [
            ("Trees to cut", f"{result.treesToCut:,}"),
            ("Saplings needed", f"{result.saplingsNeeded:,}"),
            ("Lead time", f"{result.leadTimeMonths} months"),
        ])

   
        ax = fig.add_axes([0.10, 0.50, 0.80, 0.24])
        ax.fill_between(months, recovered, alpha=0.35, color="#16a34a")
        ax.plot(months, recovered, color="#16a34a", linewidth=2)
        ax.set_xlim(1, 12)
        ax.set_xticks(months)
        ax.set_ylim(0, 110)
        ax.set_xlabel("Month")
        ax.set_ylabel("Absorption recovered (%)", color="#16a34a")
        ax.set_title("How the land recovers", fontsize=11, loc="left")

        ax2 = ax.twinx()
        ax2.plot(months, rain, color="#2563eb", linewidth=1.5, linestyle="--")
        ax2.set_ylim(0, max(rain) * 1.15)
        ax2.set_ylabel("Rainfall (mm)", color="#2563eb")

        # 12-month prediction table
        ax_t = fig.add_axes([0.06, 0.05, 0.88, 0.38])
        ax_t.axis("off")
        ax_t.set_title("12-month prediction", fontsize=11, loc="left")

        header = ["Month", "Rainfall (mm)", "Recovered (%)", "Cumulative runoff", "Risk index", "Risk"]
        rows = [
            [
                str(m.month),
                f"{m.rainfallMm:.1f}",
                f"{m.absorptionRecoveredPct:.1f}",
                f"{m.cumulativeRunoff:.1f}",
                f"{p.riskIndex:.1f}",
                p.risk.title(),
            ]
            for m, p in zip(result.months, result.prediction)
        ]
        table = ax_t.table(cellText=rows, colLabels=header, cellLoc="center", bbox=[0, 0, 1, 1])
        table.auto_set_font_size(False)
        table.set_fontsize(9)
        for (row, col), cell in table.get_celld().items():
            if row == 0:
                cell.set_text_props(fontweight="bold")
                cell.set_facecolor("#e5e7eb")
            elif col == len(header) - 1:
                cell.set_facecolor(RISK_FILL[result.prediction[row - 1].risk])

        buf = StringIO()
        fig.savefig(buf, format="svg")
        return buf.getvalue()