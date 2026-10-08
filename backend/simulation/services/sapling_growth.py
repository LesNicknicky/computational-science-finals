import math

def growth_fraction(tau_years: float, k: float, p: float) -> float:
    """Eq 6: f(tau), fraction of a mature tree's absorption at sapling age tau."""
    return (1.0 - math.exp(-k * tau_years)) ** p

def saplings_needed(r: float, n_cut: int) -> int:
    """Eq 9: Ns = ceil(R * Nc)."""
    return math.ceil(r * n_cut)

def lead_time_years(n_cut: int, n_saplings: int, sigma: float, k: float, p: float) -> float | None:
    """Eq 10: planting lead time in years.
    Returns None if saplings can never match the loss (phi >= 1)
    or if no replacement is required (Ns = 0)."""
    if n_saplings == 0:
        return None
    phi = n_cut / (sigma * n_saplings)
    if phi >= 1.0:
        return None
    return -math.log(1.0 - phi ** (1.0 / p)) / k