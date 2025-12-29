RISK_PATTERNS = {
    "Data Sharing": {
        "level": "High",
        "keywords": ["shares with third parties", "sell your data", "disclose to advertisers", "share with partners"]
    },
    "Data Retention": {
        "level": "Medium",
        "keywords": ["stores indefinitely", "retain for business purposes", "keep your data"]
    },
    "Tracking": {
        "level": "High",
        "keywords": ["third-party tracking", "cookies from advertisers", "cross-device tracking", "track your activity"]
    },
    "Vague Language": {
        "level": "Low",
        "keywords": ["may collect", "for example", "including, but not limited to"]
    }
}

def analyze_with_rules(text: str):
    found_clauses = []
    lower_text = text.lower()

    for risk_type, details in RISK_PATTERNS.items():
        for keyword in details["keywords"]:
            if keyword in lower_text:
                # Since we are not checking sentence by sentence,
                # we just report the keyword that was found.
                found_clauses.append({
                    "clause_text": f"Found keyword: '{keyword}'",
                    "risk_type": risk_type,
                    "level": details["level"]
                })
    
    return found_clauses