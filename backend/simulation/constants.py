import json
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"


def _load(name):
    return json.loads((DATA_DIR / name).read_text(encoding="utf-8"))


SURFACES = _load("surface_coefficient.json")
SPECIES = _load("species_profile.json")
RAINFALL = _load("rainfall_normals.json")


LAMBDA = 0.2

CN_IMPERVIOUS = 98

MM_HR_TO_MM_DAY = 24

REPLACEMENT_RATIO = {"natural": 100, "planted": 50, "plantation": 0}

CUTTING_CYCLE_YEARS = 35
BIOMASS_REMOVED_PER_CYCLE = 0.50
BIOMASS_RECOVERED_BEFORE_NEXT_CUT = 0.70

STATUS_ELEVATED = 0.5
STATUS_WARNING = 1.0

# --- PROVISIONAL demo values: placeholders, not sourced facts ---
RAIN_ALPHA = 1.0           # gamma shape 1 (exponential daily rain); normals have no daily variance
T0 = 100.0                 # Eq 16 (mm), calibrate by sensitivity analysis
RATE_OF_RISE_LIMIT = 50.0  # Eq 16 (mm/day), project-defined

# --- Still unset ---
ALLOWABLE_CUT = None       # decide per cycle vs per year first
TREE_DENSITY_PER_HA = 877


class ConstantNotSet(ValueError):
    """A needed constant has no sourced value yet."""


def require(name: str, value):
    """Fail with the constant's name if it has not been set yet."""
    if value is None:
        raise ConstantNotSet(f"Constant {name} is not set yet (see constants.py)")
    return value


SOURCES = {
    "LAMBDA": "USDA NRCS (2004), NEH-630 Ch. 10",     # progress doc says TR-55; pick one
    "CN_IMPERVIOUS": "USDA-SCS (1986), TR-55 Table 2-2",
    "REPLACEMENT_RATIO": "DENR DMO 2012-02",
    "CUTTING_CYCLE_YEARS": "Lasco et al. (2006)",
    "BIOMASS_REMOVED_PER_CYCLE": "Lasco et al. (2006)",
    "BIOMASS_RECOVERED_BEFORE_NEXT_CUT": "Lasco et al. (2006)",
    "STATUS_ELEVATED": "Project-defined (proposal 5.4)",
    "STATUS_WARNING": "Project-defined (proposal 5.4)", 
    "RAIN_ALPHA": "PROVISIONAL: assumption, exponential daily rain; test in sensitivity analysis",
    "T0": "PROVISIONAL placeholder: calibrate by sensitivity analysis",
    "RATE_OF_RISE_LIMIT": "PROVISIONAL placeholder: project-defined",
    "ALLOWABLE_CUT": "Project-defined, unset: per cycle vs per year undecided",
   "TREE_DENSITY_PER_HA": "Quimio (2016), Annals of Tropical Research 38(2):30-51, Samar Island Natural Park; single site, applied to all regions (limitation)",
}