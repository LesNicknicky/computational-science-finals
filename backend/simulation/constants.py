import json 
from pathlib import Path

DATA_DIR =  Path(__file__).parent/"data"
SURFACES = json.loads((DATA_DIR / "surface_coefficient.json").read_text())
SPICIES= json.loads((DATA_DIR / "species_profile.json").read_text())
PRESETS = json.loads((DATA_DIR / "barangay_presets.json").read_text())