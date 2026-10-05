import random

from fastapi import APIRouter
from yaml import safe_dump

from .models.schemas import(
    MonthResult,
    PredictionRow,
    RiskLevel,
    SimulationRequest,
    SimulationResponse,
)

router = APIRouter()

def risk_from_index(index: float) -> RiskLevel:
    if index >= 60:
        return "warning"
    if index >= 30:
        return "watch"
    return "safe"

@router.post("/simulate", response_model=SimulationResponse)
def simulate(req: SimulationRequest) -> SimulationResponse:
    rng = random.Random(req.rainSeed)
    trees_to_cut = round(req.matureTrees * req.cutPercentage / 100)

    months:list[MonthResult] =[]
    prediction: list[PredictionRow] =[]
    cumulative= 0.0

    for m in range(1,13):
        rain = rng.uniform(50,400)
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

    return SimulationResponse(
        treesToCut=trees_to_cut,
        saplingsNeeded=trees_to_cut * 3,
        leadTimeMonths=6,
        months=months,
        prediction=prediction,
    )


    