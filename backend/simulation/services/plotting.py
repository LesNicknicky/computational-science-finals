from io import BytesIO
from matplotlib.figure import Figure

def build_plot_png(months, rain_mm, recovered_pct, title) -> bytes:
    fig = Figure(figsize=(8, 4.5), dpi=150)
    ax = fig.subplots()
    ax.bar(months, rain_mm, color="#93c5fd")
    ax.set_xlabel("Month")
    ax.set_ylabel("Rain (mm)")

    ax2 = ax.twinx()
    ax2.plot(months, recovered_pct, color="#059669", marker="o")
    ax2.set_ylabel("Absorption recovered (%)")
    ax2.set_ylim(0, 100)

    ax.set_title(title)
    fig.tight_layout()

    buf = BytesIO()
    fig.savefig(buf, format="png")
    return buf.getvalue()