from simulation import constants

TABLES = {"DATA_DIR", "SURFACES", "SPECIES", "RAINFALL", "PRESETS", "SOURCES"}


def scalar_names():
    return {n for n in dir(constants) if n.isupper() and n not in TABLES}


def test_every_constant_has_a_source():
    missing = scalar_names() - set(constants.SOURCES)
    assert not missing, f"constants without a source: {sorted(missing)}"


def test_no_stale_source_entries():
    stale = set(constants.SOURCES) - scalar_names()
    assert not stale, f"sources for constants that no longer exist: {sorted(stale)}"