from .sapling_growth import growth_fraction

def daily_absorption_m3(*, n_trees: int, n_cut: int, n_saplings: int, a_m: float,
                        sigma: float, tau_years: float, k: float, p: float) -> float:
    """Eq 7: V(t) in m3/day. Trees left standing + surviving saplings."""
    standing = (n_trees - n_cut) * a_m
    saplings = sigma * n_saplings * a_m * growth_fraction(tau_years, k, p)
    return standing + saplings

def absorption_recovered_pct(v_m3_day: float, n_trees: int, a_m: float) -> float:
    """Eq 8: rho(t), percent of the pre-cut baseline N * a_m."""
    baseline = n_trees * a_m
    if baseline <= 0:
        return 0.0
    return min(100.0, 100.0 * v_m3_day / baseline)