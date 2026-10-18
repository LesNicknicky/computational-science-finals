from simulation.services.params import build_run_args
from simulation.services.simulator import run_year


def _run(ground="loam", **kw):
    args = build_run_args(region="caraga", ground_type=ground, n_trees=1000, seed=1, **kw)
    return run_year(**args)


def test_cut_percent_changes_month_zero_recovery():
    low = _run(cut_fraction=0.1)["prediction"][0]["recoveredPct"]
    high = _run(cut_fraction=0.5)["prediction"][0]["recoveredPct"]
    assert high < low


def test_planting_lead_raises_month_zero_recovery():
    now = _run(cut_fraction=0.5)["prediction"][0]["recoveredPct"]
    early = _run(cut_fraction=0.5, planting_lead_months=1)["prediction"][0]["recoveredPct"]
    assert early > now


def test_full_pavement_is_storm_drained():
    args = build_run_args(region="caraga", ground_type="full_pavement",
                          n_trees=1000, cut_fraction=0.3, seed=1)
    assert args["storm_drained"] is True