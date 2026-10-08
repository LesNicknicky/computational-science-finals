import math

STATUS_ORDER = ["safe","watch","warning"]
CM_PER_H_TO_MM_PER_DAY = 240.0

def green_ampt_rate(ks: float, psi: float, d_theta:float, f_cum:float) -> float:
    """Eq 13, reference only. The daily step uses the limit f -> Ks"""
    return ks * (1.0 + psi * d_theta / f_cum)

def daily_drainage_mm(*, ks_cm_h: float | None, qd_mm_day: float |None = None, pervious_fraction: float = 1.0) -> float:
    """Eq 14. Soils/gravel/partial pavement use 240*Ks; full pavement uses qd.
    pervious_fraction=1.0 reproduces the proposal exactly; for partial pavement
    pass the pervious share (project-defined weighting)."""
    if ks_cm_h is None:
        if qd_mm_day is None:
            raise ValueError("full pavement needs qd_mm_day")
        return qd_mm_day
    return CM_PER_H_TO_MM_PER_DAY * ks_cm_h * pervious_fraction

def net_runoff_mm(q_mm: float, v_m3_day: float, area_m2: float) -> float:
    """Eq 11."""
    return max(0.0, q_mm - 1000.0 * v_m3_day / area_m2)

def ponded_depth_mm(c_prev: float, q_net: float, e_d: float) -> float:
    """Eq 12."""
    return max(0.0, c_prev + q_net - e_d)

def rate_of_rise(c: float, c_prev: float) -> float:
    """Eq 15."""
    return c - c_prev

def threshold_mm(t0: float, rho_pct: float) -> float:
    """Eq 16 threshold; floored so a zero-absorption area can't divide by zero."""
    return max(t0 * rho_pct / 100.0, 1e-9)

def risk_index(c: float, threshold: float) -> float:
    """Eq 16: I_d."""
    return c / threshold

def status_from_index(i: float, low_cut: float, high_cut: float) -> str:
    if i < low_cut:
        return "safe"
    if i < high_cut:
        return "watch"
    return "warning"

def escalate(status: str) -> str:
    """Rate of rise above its limit moves the status up one band."""
    return STATUS_ORDER[min(STATUS_ORDER.index(status) + 1, len(STATUS_ORDER) - 1)]

def recession_days(c_peak: float, e_d: float) -> float:
    """Estimated flood duration after a peak: C_peak / E_d."""
    return c_peak / e_d if e_d > 0 else math.inf