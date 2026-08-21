import json
import os
import sqlite3
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
db = sqlite3.connect(os.path.join(ROOT, "database", "wisdom_radiance.db"))
rows = db.execute("SELECT answers_json FROM survey_responses WHERE survey_key='menopause'").fetchall()
counters = {key: Counter() for key in ["symptoms", "hardest", "care", "felt_effective", "want_to_try"]}
anxiety = []
for (raw,) in rows:
    answer = json.loads(raw)
    values = list(answer.values())
    for key, index in [("symptoms", 5), ("hardest", 6), ("care", 7), ("felt_effective", 8), ("want_to_try", 9)]:
        if index < len(values):
            for value in str(values[index] or "").replace("、", ",").split(","):
                value = value.strip()
                if value:
                    counters[key][value] += 1
    if len(values) > 10 and str(values[10] or "").strip() not in ("", "特にない"):
        anxiety.append(str(values[10]).strip())
output = {"survey": "menopause", "responseCount": len(rows), "symptoms": [{"label": k, "count": v} for k, v in counters["symptoms"].most_common()], "hardestSymptoms": [{"label": k, "count": v} for k, v in counters["hardest"].most_common()], "care": [{"label": k, "count": v} for k, v in counters["care"].most_common()], "feltEffective": [{"label": k, "count": v} for k, v in counters["felt_effective"].most_common()], "wantToTry": [{"label": k, "count": v} for k, v in counters["want_to_try"].most_common()], "anxietyExamples": anxiety}
with open(os.path.join(ROOT, "data", "menopause-insights.json"), "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
print(json.dumps({"responseCount": len(rows), "anxietyExamples": len(anxiety), "output": "data/menopause-insights.json"}, ensure_ascii=False))
