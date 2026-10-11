import pytest

from simulation import constants as C
from simulation.services.params import build_run_args, rain_params, surface_params
from simulation.services.simulator import run_year


def test_surface_values_match_the_data_files():
    assert surface_params("sand") == {"cn": 39, "drainage_mm_day": pytest.approx(24 * 235.7)}
    assert surface_params("loam")["drainage_mm_day"] == pytest.approx(316.8)
    assert surface_params("clay")["drainage_mm_day"] == pytest.approx(12.0)
    assert surface_params("gravel_or_dirt")["drainage_mm_day"] == pytest.approx(48.0)


def test_partial_pavement_is_composite():
    out = surface_params("partial_pavement")
    assert out["cn"] == pytest.approx(79.5)
    assert out["drainage_mm_day"] == pytest.approx(0.5 * 24 * 13.2)


def test_unset_constants_fail_by_name():
    with pytest.raises(C.ConstantNotSet, match="full_pavement"):
        surface_params("full_pavement")
    with pytest.raises(C.ConstantNotSet, match="annual rainfall only"):
        rain_params("ilocos")
    with pytest.raises(C.ConstantNotSet, match="RAIN_ALPHA"):
        rain_params("caraga")


def test_unknown_ground_type():
    with pytest.raises(ValueError):
        surface_params("rock")


def test_full_pipeline_with_test_values(monkeypatch):
    # TEST values only: they stand in for constants that are still unset.
    monkeypatch.setattr(C, "RAIN_ALPHA", 1.0)
    monkeypatch.setattr(C, "TREE_DENSITY_PER_HA", 100.0)
    monkeypatch.setattr(C, "T0", 50.0)
    monkeypatch.setattr(C, "RATE_OF_RISE_LIMIT", 30.0)
    args = build_run_args(region="caraga", ground_type="clay", n_trees=100,
                          cut_fraction=0.2, seed=1)
    assert args["area_m2"] == pytest.approx(10_000.0)
    assert args["rain"][0] == (0.581, 1.0, 18.13)
    result = run_year(**args)
    assert len(result["months"]) == 12 and result["treesToCut"] == 20