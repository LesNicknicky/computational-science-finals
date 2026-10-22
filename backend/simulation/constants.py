import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


def _load(name):
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


SURFACES = _load("surface_coefficient.json")
SPECIES = _load("species_profile.json")
RAINFALL = _load("rainfall_normals.json")
REGION_LOGS = _load("region_logs.json")


LAMBDA = 0.2

CN_IMPERVIOUS = 98

MM_HR_TO_MM_DAY = 24

REPLACEMENT_RATIO = {"natural": 100, "planted": 50, "plantation": 0}

CUTTING_CYCLE_YEARS = 35
BIOMASS_REMOVED_PER_CYCLE = 0.50
BIOMASS_RECOVERED_BEFORE_NEXT_CUT = 0.70

# Mature tree volume: Uriarte & Pinol (1996), total merchantable volume equation,
# V = 0.06168 + 0.00004555 x DBH^2 x MH. DBH and MH are ASSUMED (one tree for all regions).
MATURE_DBH_CM = 30.0
MATURE_MH_M = 12.0
VOLUME_INTERCEPT = 0.06168
VOLUME_COEF = 0.00004555
VOLUME_PER_TREE_M3 = VOLUME_INTERCEPT + VOLUME_COEF * MATURE_DBH_CM**2 * MATURE_MH_M  # 0.5536 m3

# Large trees per hectare (Quimio 2016, Table 2); used to derive the area from the tree count
TREE_DENSITY_PER_HA = 44

STATUS_ELEVATED = 0.5
STATUS_WARNING = 1.0

# --- PROVISIONAL demo values: placeholders, not sourced facts ---
RAIN_ALPHA = 1.0           # gamma shape 1 (exponential daily rain); normals have no daily variance
T0 = 100.0                 # Eq 16 (mm), calibrate by sensitivity analysis
RATE_OF_RISE_LIMIT = 50.0  # Eq 16 (mm/day), project-defined

# --- Still unset ---
ALLOWABLE_CUT = None       # decide per cycle vs per year first


class ConstantNotSet(ValueError):
    """A needed constant has no sourced value yet."""


def require(name: str, value):
    """Fail with the constant's name if it has not been set yet."""
    if value is None:
        raise ConstantNotSet(f"Constant {name} is not set yet (see constants.py)")
    return value


SOURCES = {
    "LAMBDA": "USDA-SCS (1986), TR-55 [verify page]",
    "CN_IMPERVIOUS": "USDA-SCS (1986), TR-55 Table 2-2",
    "REPLACEMENT_RATIO": "DENR DMO 2012-02 (only the 1:100 natural ratio is used; 1:50 and plantation are out of scope)",
    "CUTTING_CYCLE_YEARS": "Lasco et al. (2006)",
    "BIOMASS_REMOVED_PER_CYCLE": "Lasco et al. (2006) [verify: 0.50 not found in the excerpts checked]",
    "BIOMASS_RECOVERED_BEFORE_NEXT_CUT": "Lasco et al. (2006): about 70% of original biomass recovered before the next harvest",
    "STATUS_ELEVATED": "Project-defined (proposal 5.4)",
    "STATUS_WARNING": "Project-defined (proposal 5.4)",
    "RAIN_ALPHA": "PROVISIONAL project-defined default of 1.0 (exponential daily rain); sensitivity range 0.43-1.01 from Bermudez et al. (2017), Table 1",
    "T0": "PROVISIONAL placeholder: calibrate by sensitivity analysis",
    "RATE_OF_RISE_LIMIT": "PROVISIONAL placeholder: project-defined",
        "REGION_LOGS": "DENR-FMB Forestry Sector Report 2023 (updated May 19, 2023), log production by region, early 2023 only",
    "VOLUME_PER_TREE_M3": "Uriarte & Pinol (1996), J. Trop. For. Sci. 8(3):289-299, total merchantable volume equation; DBH 30 cm and MH 12 m are assumed (limitation)",
    "ALLOWABLE_CUT": "Project-defined, unset: per cycle vs per year undecided",
    "TREE_DENSITY_PER_HA": "Quimio (2016), Annals of Tropical Research 38(2):30-51, Table 2, large trees per hectare, Samar Island Natural Park; single site, applied to all regions (limitation)",
    "FULL_PAVEMENT_DRAINAGE": "PROVISIONAL, borrowed: 5 mm/h x 24 = 120 mm/day from international urban flood-modeling studies; primary sources to be confirmed; test 5-50 mm/h (see surface_coefficient.json)",
}