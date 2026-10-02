from fastapi.responses import Response

from .services.plotting import build_plot_png

@router.post("/export/plot")
def export_plot(req: SimulationRequest) ->Response:
    result = run_simulation(req)

    png = build_plot_png(
        months = [m.month for m in result.months],
        rain_mm=[m.rainfall_mm for m in result.months],
        recovered_pct=[m.absorption_recovered_pct for m in result.months],
        title=f"{req.region} · {req.groundType} · {req.cutPercentage:.0f}% cut",
    )
    return Response(content=png, media_type="image/png")
