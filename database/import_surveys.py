import json
import os
import sqlite3

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "database", "wisdom_radiance.db")
FILES = [
    ("makeup", "メイクアップ製品に関するアンケート（回答）.xlsx"),
    ("menopause", "更年期症状に関するアンケ―ト（回答）.xlsx"),
]
TOPICS = ["疲れ・倦怠感", "ほてり・発汗", "イライラ・怒り", "頭痛・めまい・ふらつき", "不眠", "気分の落ち込み", "冷え・むくみ"]

con = sqlite3.connect(DB_PATH)
cur = con.cursor()
cur.executescript("""
DROP TABLE IF EXISTS survey_responses;
DROP TABLE IF EXISTS survey_questions;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS topics;
CREATE TABLE survey_responses (id INTEGER PRIMARY KEY, survey_key TEXT NOT NULL, source_file TEXT NOT NULL, row_number INTEGER NOT NULL, submitted_at TEXT, age TEXT, answers_json TEXT NOT NULL);
CREATE TABLE survey_questions (id INTEGER PRIMARY KEY, survey_key TEXT NOT NULL, question_index INTEGER NOT NULL, question_text TEXT NOT NULL);
CREATE TABLE stories (id TEXT PRIMARY KEY, age INTEGER, title TEXT, topic TEXT, intro TEXT, tried_json TEXT, feeling TEXT);
CREATE TABLE topics (id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL);
""")
cur.executemany("INSERT INTO topics(name) VALUES (?)", [(topic,) for topic in TOPICS])
counts = {}
for survey_key, filename in FILES:
    path = os.path.join(ROOT, "data", filename)
    worksheet = openpyxl.load_workbook(path, read_only=True, data_only=True).active
    rows = list(worksheet.iter_rows(values_only=True))
    headers = [str(value or "") for value in rows[0]]
    cur.executemany("INSERT INTO survey_questions(survey_key, question_index, question_text) VALUES (?,?,?)", [(survey_key, i, header) for i, header in enumerate(headers)])
    count = 0
    for row_number, row in enumerate(rows[1:], 2):
        values = [None if value is None else str(value) for value in row]
        payload = dict(zip(headers, values))
        cur.execute("INSERT INTO survey_responses(survey_key, source_file, row_number, submitted_at, age, answers_json) VALUES (?,?,?,?,?,?)", (survey_key, filename, row_number, values[0] if values else None, values[2] if len(values) > 2 else None, json.dumps(payload, ensure_ascii=False)))
        count += 1
    counts[survey_key] = count
con.commit()
print(json.dumps({"db": DB_PATH, "counts": counts, "topics": len(TOPICS)}, ensure_ascii=False))
