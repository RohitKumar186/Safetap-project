from pydantic import BaseModel
from typing import List

class PolicyInput(BaseModel):
    policy_text: str

class RiskClause(BaseModel):
    clause_text: str
    risk_type: str
    level: str

class AnalysisOutput(BaseModel):
    privacy_score: int
    summary: str
    risk_clauses: List[RiskClause]