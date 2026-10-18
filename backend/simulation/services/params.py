from .. import constants as C
from .floodrisk import daily_drainage_mm
from .runoff import composite_cn

GROUND_TYPES = ("sand", "loam", "clay", "gravel_or_dirt", "partial_pavement", "full_pavement")


def surface_params(ground_type: str) -> dict:
    """CN (Eq 1-4) and daily drainage in mm/day (Eq 14) for one ground type."""
    s = C.SURFACES
    if ground_type in ("sand", "loam", "clay"):
        row = s[ground_type]
        return {"cn": row["cn"], "drainage_mm_day": daily_drainage_mm(ks_mm_h=row["ks_mm_hr"])}
    if ground_type == "gravel_or_dirt":
        row = s[ground_type]
        return {"cn": row["cn"], "drainage_mm_day": daily_drainage_mm(ks_mm_h=row["ks_mm_hr_default"])}
    if ground_type == "partial_pavement":
        row = s[ground_type]
        pervious = s[row["pervious_from"]]
        f = row["impervious_fraction"]
        return {
            "cn": composite_cn(f, C.CN_IMPERVIOUS, pervious["cn"]),
            "drainage_mm_day": daily_drainage_mm(ks_mm_h=pervious["ks_mm_hr"], pervious_fraction=1.0 - f),
        }
    if ground_type == "full_pavement":
        row = s[ground_type]
        # CHANGED: no Ks (impervious). Drainage is the borrowed storm-drain rate,
        # already in mm/day (5 mm/h x 24), so it does NOT go through daily_drainage_mm.
        # See surface_coefficient.json and Limitations.
        return {
            "cn": row["cn"],
            "drainage_mm_day": C.require("full_pavement drainage_mm_day", row["drainage_mm_day"]),
        }
    raise ValueError(f"unknown ground type '{ground_type}'")  # CHANGED: no silent None


def rain_params(region: str) -> list[tuple[float, float, float]]:
    """Twelve (p_w, alpha, mu_w) tuples for Eq 5."""
    row = C.RAINFALL.get(region)
    if row is None:
        raise C.ConstantNotSet(f"no rainfall data for '{region}' yet")
    if "p_w" not in row:
        raise C.ConstantNotSet(f"'{region}' has annual rainfall only; monthly table still needed")
    alpha = row.get("alpha")
    if alpha is None:
        alpha = C.require("RAIN_ALPHA", C.RAIN_ALPHA)
    return [(row["p_w"][m], alpha, row["mu_w_mm"][m]) for m in range(12)]


def species_params(t_mature_years: int | None = None) -> dict:
    sp = C.SPECIES
    g = sp["growth"]
    t = t_mature_years or g["t_mature_years"]["default"]
    k_table = g["k_by_t_mature"]
    if str(t) not in k_table:
        raise ValueError(f"t_mature_years must be one of {sorted(map(int, k_table))}")
    return {"a_m": sp["a_m_m3_tree_day"]["value"], "sigma": sp["sigma"]["default"],
            "k": k_table[str(t)], "p": g["p"]}


def build_run_args(*, region: str, ground_type: str, n_trees: int, cut_fraction: float,
                   seed: int, forest_type: str = "natural",
                   t_mature_years: int | None = None, planting_lead_months: float = 0.0) -> dict:
    """Everything run_year needs, from the constants and data files."""
    if forest_type not in C.REPLACEMENT_RATIO:
        raise ValueError(f"unknown forest type '{forest_type}'")
    surface = surface_params(ground_type)
    species = species_params(t_mature_years)
    density = C.require("TREE_DENSITY_PER_HA", C.TREE_DENSITY_PER_HA)
    return dict(
        n_trees=n_trees, cut_fraction=cut_fraction, seed=seed,
        ratio_r=C.REPLACEMENT_RATIO[forest_type],
        cn=surface["cn"], drainage_mm_day=surface["drainage_mm_day"],
        storm_drained=surface.get("storm_drained", False),
        planting_lead_months=planting_lead_months,
        area_m2=n_trees / density * 10_000.0,
        lam=C.LAMBDA, low_cut=C.STATUS_ELEVATED, high_cut=C.STATUS_WARNING,
        t0=C.require("T0", C.T0),
        rise_limit=C.require("RATE_OF_RISE_LIMIT", C.RATE_OF_RISE_LIMIT),
        rain=rain_params(region),
        **species,
    )