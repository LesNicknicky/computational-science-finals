from typing import Literal

from pydantic import BaseModel, Field

RegionId = Literal[
    "caraga", "calabarzon", "northern mindanao", "central visayas", "ilocos"
]
GroundType = Literal[
    "sand", "loam", "clay", "gravel_dirt", "partial_pavement", "full_pavement"
]
RiskLevel = Literal["safe", "watch", "warning"]
class SimulationRequest(BaseModel):
    region: RegionId
    groundType: GroundType
    matureTrees: int = Field(gt=0)
    cutPercentage: float = Field(ge=0, le=100)
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
    