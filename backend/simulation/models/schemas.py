from typing import Literal

from click import FloatRange
from pydantic import BaseModel

RegionId = Literal[
    "caraga", "calabarzon", "northern mindanao", "central visayaz", "ilocos"
]
GroundType = Literal[
    "sand","loam","clay","gravel_dirt","partial_pavement","full_pavement"
]
RiskLevel = Literal["safe", "watch", "warning"]

class SimulationRequest(BaseModel):
    region:RegionId
    groundType:GroundType
    matureTrees: int
    cutPercentage: float
    rainSeed: int

class MonthResult(BaseModel):
    month:int
    rainfallMm:float
    absorptionRecoveredPct:float
    cumulativeRunoff: float 
    riseRate: float
    risk: RiskLevel

class PredictionRow(BaseModel):
    month:int
    recoveredPct:float
    riskIndex: float
    risk: RiskLevel

class SimulationResponse(BaseModel):
    treesToCut: int
    saplingsNeeded: int
    leadTimeMonths: int
    months: list[MonthResult]
    prediction: list[PredictionRow]
    