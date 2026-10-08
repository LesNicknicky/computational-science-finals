import numpy as np 

def potential_retention(cn: float) -> float:
    """Eq 1: S in mm."""
    return 25400.0/ cn - 254.0

def runoff_depth(p_mm: float, cn: float, lam: float) -> float:
    """Eq 2-3: SCS runoff depth Q in mm. lam = initial abstraction ratio."""
    s = potential_retention(cn)
    ia = lam * s
    if p_mm <= ia:
        return 0.0
    return (p_mm - ia) ** 2 / (p_mm - ia + s)

def composite_cn(imp_fraction: float, cn_impervious: float, cn_pervious: float ) -> float:
    """Eq 4: area-weighted CN for partial pavement."""
    return imp_fraction * cn_impervious + (1.0 - imp_fraction) * cn_pervious

def daily_rainfall(days: int, p_wet: float, alpha: float, mean_wet_mm: float, rng: np.random.Generator) ->np.ndarray:
    """Eq 5: wet-day probability + gamma amounts, with alpha * theta = mean_wet_mm."""
    theta = mean_wet_mm / alpha
    is_wet = rng.random(days) < p_wet
    amounts = rng.gamma(shape=alpha, scale=theta, size=days)
    return np.where(is_wet, amounts, 0.0)