import random

from fastapi import APIRouter, HTTPException, Response

from .models.schemas import (
    MonthResult,
    PredictionRow,
    RiskLevel,
    SimulationRequest,
    SimulationResponse,
)
from .services.plotting import build_report_svg

router = APIRouter()

# Last finished simulation, kept in memory until a new one runs (lost on restart)
last_run: tuple[SimulationRequest, SimulationResponse] | None = None


def risk_from_index(index: float) -> RiskLevel:
    if index >= 60:
        return "warning"
    if index >= 30:
        return "watch"
    return "safe"


@router.post("/simulate", response_model=SimulationResponse)
def simulate(req: SimulationRequest) -> SimulationResponse:
    global last_run

    rng = random.Random(req.rainSeed)
    trees_to_cut = round(req.matureTrees * req.cutPercentage / 100)

    months: list[MonthResult] = []
    prediction: list[PredictionRow] = []
    cumulative = 0.0

    for m in range(1, 13):
        rain = rng.uniform(50, 400)
        recovered = m * 100 / 12
        runoff = rain * (1 - recovered / 100) * req.cutPercentage / 100
        cumulative += runoff
        index = (rain / 4) * (1 - recovered / 100)
        risk = risk_from_index(index)

        months.append(
            MonthResult(
                month=m,
                rainfallMm=round(rain, 1),
                absorptionRecoveredPct=round(recovered, 1),
                cumulativeRunoff=round(cumulative, 1),
                riseRate=round(runoff, 1),
                risk=risk,
            )
        )
        prediction.append(
            PredictionRow(
                month=m,
                recoveredPct=round(recovered, 1),
                riskIndex=round(index, 1),
                risk=risk,
            )
        )

    result = SimulationResponse(
        treesToCut=trees_to_cut,
        saplingsNeeded=trees_to_cut * 3,
        leadTimeMonths=6,
        months=months,
        prediction=prediction,
    )
    last_run = (req, result)
    return result


@router.get("/export/plot")
def export_plot() -> Response:
    if last_run is None:
        raise HTTPException(status_code=404, detail="No simulation has been run yet.")

    req, result = last_run
    return Response(
        content=build_report_svg(req, result),
        media_type="image/svg+xml",
        headers={"Content-Disposition": 'attachment; filename="simulation-report.svg"'},
    )