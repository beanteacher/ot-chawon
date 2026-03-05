# API Examples v0

## Health
curl -X GET http://localhost:8000/health

## Size Predict
curl -X POST http://localhost:8000/size/predict \
  -H 'Content-Type: application/json' \
  -d '{
    "height_cm": 172,
    "weight_kg": 68,
    "gender": "male"
  }'
