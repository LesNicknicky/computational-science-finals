from datetime import datetime
from io import BytesIO, StringIO
from textwrap import wrap
from typing import IO

from matplotlib import rc_context
from matplotlib.figure import Figure
from matplotlib.patches import FancyBboxPatch

from ..models.schemas import SimulationRequest, SimulationResponse

PAGE_W, PAGE_H = 8.27, 11.69  # A4 portrait, in inches
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

RISK_FILL = {"safe": "#d1fae5", "watch": "#fef3c7", "warning": "#fecaca"}
RISK_LABEL = {"safe": "Safe", "watch": "Be careful", "warning": "Danger"}
GREEN = "#16a34a"
GRAY = "#555555"


def _pretty(value: str) -> str:
    return value.replace("_", " ").title()


def _lead_time(months: float | None) -> str:
    """Days under 7, weeks under 30 days, then months (30 days each)."""
    if months is None:
        return "Cannot be offset"
    days = max(1, round(months * 30))
    if days < 7:
        return f"{days} day{'s' if days != 1 else ''}"
    if days < 30:
        weeks = days // 7
        return f"{weeks} week{'s' if weeks != 1 else ''}"
    n = days // 30
    return f"{n} month{'s' if n != 1 else ''}"


def _month_ranges(indexes: list[int]) -> str:
    """[2, 3, 4, 7] -> 'Mar–May, Aug' (0-based month indexes)."""
    parts, start, prev = [], None, None
    for i in indexes + [None]:
        if start is None:
            start = prev = i
        elif i is not None and i == prev + 1:
            prev = i
        else:
            parts.append(MONTHS[start] if start == prev else f"{MONTHS[start]}–{MONTHS[prev]}")
            start = prev = i
    return ", ".join(parts)


def _card(ax, x: float, y: float, w: float, h: float, value: str, label: str) -> None:
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.12",
                                facecolor="#ecfdf5", edgecolor="#a7f3d0", linewidth=1.2))
    size = 26 if len(value) <= 7 else 20 if len(value) <= 10 else 15
    ax.text(x + w / 2, y + h * 0.60, value, ha="center", va="center",
            fontsize=size, fontweight="bold", color="#065f46")
    ax.text(x + w / 2, y + h * 0.20, label, ha="center", va="center", fontsize=10, color=GRAY)


def _render(req: SimulationRequest, result: SimulationResponse, fmt: str, buf: IO) -> None:
    """Draw the one-page A4 report once and save it as `fmt` ("svg" or "pdf") into `buf`."""
    region = _pretty(req.region)
    risks = [p.risk for p in result.prediction]
    recovered = [m.absorptionRecoveredPct for m in result.months]
    rain = [m.rainfallMm for m in result.months]
    lead = _lead_time(result.leadTimeMonths)

    # fonttype 42 keeps the PDF text real (selectable) instead of outlines
    with rc_context({"svg.fonttype": "none", "pdf.fonttype": 42, "font.family": "sans-serif"}):
        fig = Figure(figsize=(PAGE_W, PAGE_H))

        # Full-page canvas in inches (1 unit = 1 inch), drawn underneath the chart
        page = fig.add_axes((0, 0, 1, 1))
        page.set_xlim(0, PAGE_W)
        page.set_ylim(0, PAGE_H)
        page.axis("off")
        left = 0.56

        # Title
        page.text(left, 11.05, "Tree Cutting and Replanting Plan", fontsize=21, fontweight="bold")
        page.text(left, 10.72,
                  f"{region}  ·  Ground: {_pretty(req.groundType)}  ·  {datetime.now().astimezone():%B %d, %Y}",
                  fontsize=10, color=GRAY)

        # One plain sentence
        if result.leadTimeMonths is None:
            tail = "replanting alone cannot offset the loss."
        else:
            tail = f"plant {result.saplingsNeeded:,} young trees, starting {lead} before cutting."
        sentence = f"If you cut {result.treesToCut:,} of {req.matureTrees:,} old trees in {region}, {tail}"
        for i, line in enumerate(wrap(sentence, 62)):
            page.text(left, 10.2 - i * 0.29, line, fontsize=13)

        # Three big numbers
        w, gap, h, y = 2.25, 0.2, 1.1, 8.15
        cards = [
            (f"{result.treesToCut:,}", "Trees to cut"),
            (f"{result.saplingsNeeded:,}", "Young trees to plant"),
            (lead, "Plant before cutting"),
        ]
        for i, (value, label) in enumerate(cards):
            _card(page, left + i * (w + gap), y, w, h, value, label)

        # Month-by-month strip
        page.text(left, 7.7, "Is it safe, month by month?", fontsize=13, fontweight="bold")
        bw, bgap, by, bh = 0.55, 0.05, 6.85, 0.6
        for i, month in enumerate(MONTHS):
            x = left + i * (bw + bgap)
            page.add_patch(FancyBboxPatch((x, by), bw, bh, boxstyle="round,pad=0,rounding_size=0.06",
                                          facecolor=RISK_FILL[risks[i]], edgecolor="#9ca3af", linewidth=0.8))
            page.text(x + bw / 2, by + bh / 2, month, ha="center", va="center",
                      fontsize=9, fontweight="bold")

        # Legend
        lx = left
        for key in ("safe", "watch", "warning"):
            page.add_patch(FancyBboxPatch((lx, 6.5), 0.18, 0.18, boxstyle="round,pad=0,rounding_size=0.03",
                                          facecolor=RISK_FILL[key], edgecolor="#9ca3af", linewidth=0.8))
            page.text(lx + 0.26, 6.59, RISK_LABEL[key], va="center", fontsize=9, color=GRAY)
            lx += 1.5

        # One-line verdict
        danger = [i for i, r in enumerate(risks) if r == "warning"]
        careful = [i for i, r in enumerate(risks) if r == "watch"]
        if not danger and not careful:
            verdict = "All 12 months look safe."
        else:
            parts = []
            if danger:
                parts.append(f"Danger: {_month_ranges(danger)}.")
            if careful:
                parts.append(f"Be careful: {_month_ranges(careful)}.")
            verdict = " ".join(parts)
        page.text(left, 6.1, verdict, fontsize=12, fontweight="bold")

        # One simple chart: green line = recovery, light blue bars = rain (reference)
        page.text(left, 5.65, "How the land recovers", fontsize=13, fontweight="bold")
        page.text(left, 5.38, "How much of the forest's rain-soaking power is back after cutting",
                  fontsize=9, color=GRAY)

        x = list(range(12))
        rect = (1.1 / PAGE_W, 2.55 / PAGE_H, 5.9 / PAGE_W, 2.5 / PAGE_H)

        # Rain bars on their own (right-hand) axis, kept short so they stay in the background
        ax_rain = fig.add_axes(rect)
        top = max(rain) if max(rain) > 0 else 1
        ax_rain.bar(x, rain, width=0.6, color="#93c5fd", alpha=0.55)
        ax_rain.set_xlim(-0.5, 11.5)
        ax_rain.set_ylim(0, top * 2.2)
        ax_rain.yaxis.tick_right()
        ax_rain.yaxis.set_label_position("right")
        ax_rain.set_yticks([0, top / 2, top])
        ax_rain.set_yticklabels([f"{v:,.0f}" for v in (0, top / 2, top)], fontsize=8, color="#3b82f6")
        ax_rain.set_ylabel("Rain each month (mm)", fontsize=9, color="#3b82f6")
        ax_rain.set_xticks([])
        for side in ("top", "left"):
            ax_rain.spines[side].set_visible(False)

        # Green recovery line on top, with the left-hand % axis
        ax = fig.add_axes(rect)
        ax.patch.set_visible(False)
        ax.fill_between(x, recovered, alpha=0.22, color=GREEN)
        ax.plot(x, recovered, color=GREEN, linewidth=2.5)
        ax.set_xlim(-0.5, 11.5)
        ax.set_xticks(x)
        ax.set_xticklabels(MONTHS, fontsize=9)
        ax.set_ylim(0, 105)
        ax.set_yticks([0, 25, 50, 75, 100])
        ax.set_yticklabels(["0%", "25%", "50%", "75%", "100%"], fontsize=9)
        ax.set_ylabel("Rain-soaking power back", fontsize=9, color=GREEN)
        ax.grid(axis="y", color="#e5e7eb", linewidth=1)
        ax.set_axisbelow(True)
        for side in ("top", "right"):
            ax.spines[side].set_visible(False)

        # Plain-language key
        page.add_patch(FancyBboxPatch((left, 2.12), 0.28, 0.12, boxstyle="round,pad=0,rounding_size=0.02",
                                      facecolor=GREEN, edgecolor="none"))
        page.text(left + 0.38, 2.18, "Green line: how much of the forest's rain-soaking power is back",
                  va="center", fontsize=9, color=GRAY)
        page.add_patch(FancyBboxPatch((left, 1.9), 0.28, 0.12, boxstyle="round,pad=0,rounding_size=0.02",
                                      facecolor="#93c5fd", edgecolor="none"))
        page.text(left + 0.38, 1.96, "Blue bars: how much rain falls that month (for reference)",
                  va="center", fontsize=9, color=GRAY)

        # Short footnote
        note = (
            f"How this was estimated: monthly rainfall averages from a PAGASA weather station for {region} "
            "(1991–2020) and the DENR replacement rule (DMO 2012-02: 1 tree cut = 100 young trees planted). "
            "These are planning estimates, not a forecast."
        )
        for i, line in enumerate(wrap(note, 105)):
            page.text(left, 1.45 - i * 0.2, line, fontsize=8, color=GRAY)

        fig.savefig(buf, format=fmt)


def build_report_svg(req: SimulationRequest, result: SimulationResponse) -> str:
    buf = StringIO()
    _render(req, result, "svg", buf)
    return buf.getvalue()


def build_report_pdf(req: SimulationRequest, result: SimulationResponse) -> bytes:
    buf = BytesIO()
    _render(req, result, "pdf", buf)
    return buf.getvalue()