# QA Day1 - Phase0 DoD + Smoke v0

## Phase0 DoD
- API health endpoint returns 200
- auth login fail/success baseline validated
- product list endpoint schema validated
- frontend route skeleton renders without crash

## API Smoke Checklist
- status code correctness (200/400/401)
- response schema has success/data/message
- unauthorized request returns 401

## 3D/AI Smoke
- 3D: fallback UI shown when asset unavailable
- AI: /health responds < 500ms in local
- AI: /size/predict handles invalid payload with 400
