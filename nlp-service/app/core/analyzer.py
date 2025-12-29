from .rule_based import analyze_with_rules

SCORE_DEDUCTIONS = {
    "Low": 5,
    "Medium": 15,
    "High": 25
}

def perform_analysis(policy_text: str):
    risk_clauses = analyze_with_rules(policy_text)
    
    final_score = 100
    for clause in risk_clauses:
        final_score -= SCORE_DEDUCTIONS.get(clause["level"], 0)
    
    final_score = max(0, final_score)

    summary = ""
    if final_score >= 80:
        summary = "This policy seems safe with minimal risks found."
    elif final_score >= 50:
        summary = "This policy has some risks. Please review the highlighted clauses carefully."
    else:
        summary = "This policy has significant privacy risks. Proceed with caution."

    return {
        "privacy_score": final_score,
        "summary": summary,
        "risk_clauses": risk_clauses
    }