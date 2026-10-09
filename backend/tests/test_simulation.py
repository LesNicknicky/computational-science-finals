from typing import Any

import pytest

from simulation.services.absorption import absorption_recovered_pct, daily_absorption_m3
from simulation.services.floodrisk import (
    daily_drainage_mm,
    escalate,
    net_runoff_mm,
    ponded_depth_mm,
    status_from_index,
)
from simulation.services.runoff import composite_cn, potential_retention, runoff_depth
from simulation.services.sapling_growth import (
    growth_fraction,
    lead_time_years,
    saplings_needed,
)
from simulation.services.simulator import run_year

LAM = 0.2
K, P, SIGMA = 0.3, 2.0, 0.8        # TEST inputs only, not project constants

# ---- Eq 1-4: runoff
def test_runoff_zero_at_or_below_initial_abstraction():
    ia = LAM * potential_retention(80)
    assert runoff_depth(ia, 80, LAM) == 0.0
    assert runoff_depth(ia - 1, 80, LAM) == 0.0

def test_runoff_hand_calculation():
    # CN 80, P 50: S=63.5, Ia=12.7, Q=(37.3)^2/(37.3+63.5)
    assert runoff_depth(50, 80, LAM) == pytest.approx(13.80, abs=0.01)

def test_runoff_rises_with_rainfall():
    qs = [runoff_depth(p, 80, LAM) for p in (10, 30, 60, 120)]
    assert qs == sorted(qs) and qs[0] < qs[-1]

def test_runoff_ordering_by_ground_type():
    # CN: sand, loam, clay, gravel, full pavement
    qs = [runoff_depth(50, cn, LAM) for cn in (39, 61, 80, 89, 98)]
    assert qs == sorted(qs) and len(set(qs)) == 5

def test_composite_cn_partial_pavement():
    assert composite_cn(0.5, 98, 61) == pytest.approx(79.5)

# ---- Eq 6, 9, 10: saplings
def test_growth_fraction_shape():
    assert growth_fraction(0, K, P) == 0.0
    vals = [growth_fraction(t, K, P) for t in (1, 5, 10, 30)]
    assert vals == sorted(vals) and vals[-1] < 1.0

def test_saplings_needed_rounds_up():
    assert saplings_needed(100, 3) == 300
    assert saplings_needed(50, 3) == 150
    assert saplings_needed(0, 3) == 0
    assert saplings_needed(1.5, 3) == 5          # ceil(4.5)

def test_lead_time_round_trip():
    tau = lead_time_years(20, 40, SIGMA, K, P)
    assert tau is not None
    assert growth_fraction(tau, K, P) == pytest.approx(20 / (SIGMA * 40))

def test_lead_time_none_cases():
    assert lead_time_years(10, 10, SIGMA, K, P) is None   # phi >= 1
    assert lead_time_years(10, 0, SIGMA, K, P) is None    # no replacement

def test_more_saplings_shorten_lead_time():
    more = lead_time_years(20, 80, SIGMA, K, P)
    fewer = lead_time_years(20, 40, SIGMA, K, P)
    assert more is not None and fewer is not None
    assert more < fewer

# ---- Eq 7-8: absorption
def test_absorption_baseline_and_cut():
    full = daily_absorption_m3(n_trees=100, n_cut=0, n_saplings=0, a_m=1, sigma=SIGMA, tau_years=0, k=K, p=P)
    assert absorption_recovered_pct(full, 100, 1) == 100.0
    cut = daily_absorption_m3(n_trees=100, n_cut=20, n_saplings=0, a_m=1, sigma=SIGMA, tau_years=0, k=K, p=P)
    assert absorption_recovered_pct(cut, 100, 1) == pytest.approx(80.0)

def test_saplings_restore_absorption_and_cap_at_100():
    kw: dict[str, Any] = dict(n_trees=100, n_cut=20, n_saplings=100, a_m=1, sigma=SIGMA, k=K, p=P)
    young = absorption_recovered_pct(daily_absorption_m3(tau_years=1, **kw), 100, 1)
    old = absorption_recovered_pct(daily_absorption_m3(tau_years=30, **kw), 100, 1)
    assert 80 < young < old <= 100.0

# ---- Eq 11-16: flood
def test_net_runoff_never_negative():
    assert net_runoff_mm(2.0, 100, 10_000) == 0.0

def test_ponding_accumulates_then_drains():
    c = 0.0
    for _ in range(3):
        c = ponded_depth_mm(c, 10, 4)
    assert c == pytest.approx(18)
    assert ponded_depth_mm(c, 0, 100) == 0.0

def test_drainage_conversion_mm_per_hour_to_mm_per_day():
    assert daily_drainage_mm(ks_mm_h=13.2) == pytest.approx(316.8)      # loam, 24 * Ks
    assert daily_drainage_mm(ks_mm_h=13.2, pervious_fraction=0.5) == pytest.approx(158.4)
    assert daily_drainage_mm(ks_mm_h=None, qd_mm_day=5.0) == 5.0

def test_status_bands_and_escalation():
    assert status_from_index(0.49, 0.5, 1.0) == "safe"
    assert status_from_index(0.5, 0.5, 1.0) == "watch"
    assert status_from_index(1.0, 0.5, 1.0) == "warning"
    assert escalate("safe") == "watch" and escalate("warning") == "warning"

# ---- whole run (TEST inputs only)
RAIN = [(0.6, 1.0, 40.0)] * 12

def base(**over: Any) -> dict[str, Any]:
    kw: dict[str, Any] = dict(n_trees=100, cut_fraction=0.2, ratio_r=0, cn=89, drainage_mm_day=5.0, area_m2=10_000, a_m=0.1, sigma=SIGMA, k=K, p=P, lam=LAM, t0=50.0, low_cut=0.5, high_cut=1.0, rise_limit=30.0, rain=RAIN, seed=42)
    kw.update(over)
    return kw

def peak(res): return max(m["peakRiskIndex"] for m in res["months"])

def test_same_seed_reproduces_and_new_seed_differs():
    a, b, c = run_year(**base()), run_year(**base()), run_year(**base(seed=7))
    assert a == b
    assert a["months"] != c["months"]

def test_twelve_months_returned():
    assert len(run_year(**base())["months"]) == 12

def test_cutting_more_raises_risk():
    assert peak(run_year(**base(cut_fraction=0.5))) > peak(run_year(**base(cut_fraction=0.1)))

def test_runoff_rises_sand_to_pavement():
    peaks = [peak(run_year(**base(cn=cn))) for cn in (39, 61, 80, 89, 98)]
    assert peaks == sorted(peaks)

def test_planting_saplings_lowers_risk():
    none = run_year(**base(ratio_r=0))
    planted = run_year(**base(ratio_r=100))
    assert planted["saplingsNeeded"] == 100 * planted["treesToCut"]
    assert peak(planted) <= peak(none)