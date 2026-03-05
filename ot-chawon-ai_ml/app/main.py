from fastapi import FastAPI
from pydantic import BaseModel

from app.services.size_rule import predict_size

app = FastAPI(title="ot-chawon-size-api", version="0.2.0")


class SizePredictRequest(BaseModel):
    height_cm: float
    weight_kg: float
    gender: str
    chest_cm: float | None = None
    waist_cm: float | None = None
    hip_cm: float | None = None


class SizePredictResponse(BaseModel):
    recommended_size: str
    confidence: float
    reason: list[str]


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.post('/size/predict', response_model=SizePredictResponse)
def size_predict(payload: SizePredictRequest) -> SizePredictResponse:
    return SizePredictResponse(
        recommended_size=predict_size(payload.height_cm),
        confidence=0.6,
        reason=['rule-based baseline v0']
    )
