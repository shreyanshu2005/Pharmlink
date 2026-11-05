"""Flask API for the PharmLink AI medical assistant.  Run: python app.py"""
import os
import time
from collections import defaultdict, deque

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

import rag

load_dotenv()

app = Flask(__name__)
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
CORS(app, origins=origins)

MAX_MESSAGE_CHARS = 500
RATE_LIMIT = int(os.getenv("RATE_LIMIT_PER_MIN", "20"))
_hits = defaultdict(deque)  # ip -> timestamps (in-memory; use Redis if you run several workers)

EMERGENCY_TERMS = (
    "chest pain", "can't breathe", "cannot breathe", "difficulty breathing",
    "heart attack", "stroke", "unconscious", "severe bleeding", "overdose",
    "suicide", "kill myself", "want to die", "poison",
)
EMERGENCY_REPLY = (
    "This may be a medical emergency. Call 112 (or 102 for an ambulance in India) "
    "or go to the nearest hospital right now. Please don't wait for an online answer."
)


def rate_limited(ip: str) -> bool:
    now = time.time()
    q = _hits[ip]
    while q and now - q[0] > 60:
        q.popleft()
    if len(q) >= RATE_LIMIT:
        return True
    q.append(now)
    return False


@app.get("/health")
def health():
    return jsonify(status="ok")


@app.post("/api/chat")
def chat():
    ip = request.headers.get("X-Forwarded-For", request.remote_addr or "?").split(",")[0].strip()
    if rate_limited(ip):
        return jsonify(success=False, message="Too many messages. Please wait a minute."), 429

    body = request.get_json(silent=True) or {}
    question = str(body.get("message", "")).strip()
    if not question:
        return jsonify(success=False, message="Please type a question."), 400
    if len(question) > MAX_MESSAGE_CHARS:
        return jsonify(success=False, message=f"Please keep your question under {MAX_MESSAGE_CHARS} characters."), 400

    if any(term in question.lower() for term in EMERGENCY_TERMS):
        return jsonify(success=True, answer=EMERGENCY_REPLY, sources=[], emergency=True)

    try:
        result = rag.answer(question, body.get("history"))
    except Exception:
        app.logger.exception("RAG pipeline failed")  # the question text is not logged
        return jsonify(success=False, message="The assistant is unavailable right now. Please try again shortly."), 503

    return jsonify(success=True, **result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
