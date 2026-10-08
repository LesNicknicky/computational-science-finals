import numpy as np
from .runoff import daily_rainfall, runoff_depth
from .absorption import daily_absorption_m3, absorption_recovered_pct
from .sapling_growth import saplings_needed, lead_time_years
from .floodrisk import (net_runoff_mm, ponded_depth_mm, rate_of_rise,threshold_mm,risk_index,status_from_index, escalate, recession_days, STATUS_ORDER)

DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def run_year(*, n_trees, cut_fraction, ratio_r, cn, drainage_mm_day, area_m2,a_m , sigma, k, p , lam, t0, low_cut,high_cut, rise_limit,rain, seed):
    """rain: 12 tuples (p_wet, alpha, mean_wet_mm), one per month."""
    rng = np.random.default_rng(seed)
    n_cut = round(cut_fraction * n_trees)
    n_sap = saplings_needed(ratio_r, n_cut)
    lead = lead_time_years(n_cut, n_sap, sigma, k, p)
    tau0 = lead if lead is not None else 0.0     # cohort already this old at the cut

    c_prev = 0.0
    months = []
    for m, days in enumerate(DAYS_IN_MONTH):
        p_wet, alpha, mean_wet = rain[m]
        rain_mm = daily_rainfall(days, p_wet, alpha, mean_wet, rng)

        v = daily_absorption_m3(n_trees=n_trees, n_cut=n_cut, n_saplings=n_sap, a_m=a_m,
                                sigma=sigma, tau_years=tau0 + m / 12, k=k, p=p)
        rho = absorption_recovered_pct(v, n_trees, a_m)
        thr = threshold_mm(t0, rho)

        worst, peak_i, peak_c = "safe", 0.0, 0.0
        for p_d in rain_mm:
            q = runoff_depth(float(p_d), cn, lam)
            c = ponded_depth_mm(c_prev, net_runoff_mm(q, v, area_m2), drainage_mm_day)
            i = risk_index(c, thr)
            status = status_from_index(i, low_cut, high_cut)
            if rate_of_rise(c, c_prev) > rise_limit:
                status = escalate(status)
            worst = max(worst, status, key=STATUS_ORDER.index)
            peak_i, peak_c, c_prev = max(peak_i, i), max(peak_c, c), c

        months.append({
            "month": m + 1,
            "absorptionRecoveredPct": rho,
            "rainfallMm": float(rain_mm.sum()),
            "risk": worst,
            "peakRiskIndex": peak_i,
            "floodDurationDays": recession_days(peak_c, drainage_mm_day),
        })

    return {"treesToCut": n_cut, "saplingsNeeded": n_sap,
            "leadTimeMonths": None if lead is None else lead * 12, "months": months}