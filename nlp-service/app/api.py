from fastapi import FastAPI
from .schemas import PolicyInput, AnalysisOutput
from .core.analyzer import perform_analysis

app = FastAPI(
    title="SafeTap NLP Service",
    description="Analyzes privacy policies for risks.",
    version="1.0.0"
)

@app.post("/process_policy", response_model=AnalysisOutput)
async def process_policy(request: PolicyInput):
    analysis_result = perform_analysis(request.policy_text)
    return analysis_result