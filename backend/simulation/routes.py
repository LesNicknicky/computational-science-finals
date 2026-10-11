from fastapi import APIRouter, HTTPException, Response

from . import constants as C
from .models.schemas import SimulationRequest, SimulationResponse
from .services.params import build_run_args
from .services.plotting import build_report_svg
from .services.simulator import run_year

router = APIRouter()

# Last finished simulation, kept in memory until a new one runs (lost on restart)
last_run: tuple[SimulationRequest, SimulationResponse] | None = None


@router.post("/simulate", response_model=SimulationResponse)
def simulate(req: SimulationRequest) -> SimulationResponse:
    global last_run
    ground = "gravel_or_dirt" if req.groundType == "gravel_dirt" else req.groundType
    try:
        args = build_run_args(
            region=req.region,
            ground_type=ground,
            n_trees=req.matureTrees,
            cut_fraction=req.cutPercentage / 100,
            seed=req.rainSeed,
        )
        out = run_year(**args)
    except C.ConstantNotSet as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = SimulationResponse(**out)
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