from pydantic import BaseModel, Field
from app.schemas.body import BodyInput


class SizePredictRequest(BaseModel):
    body: BodyInput = Field(..., description="체형 입력 데이터")
    item_id: str = Field(..., description="의류 아이템 ID")


class SizePredictResponse(BaseModel):
    recommended_size: str = Field(..., description="추천 사이즈 (XS/S/M/L/XL/XXL)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="신뢰도 (0~1)")
    reason: list[str] = Field(..., description="추천 근거 목록")

    model_config = {
        "json_schema_extra": {
            "example": {
                "recommended_size": "M",
                "confidence": 0.87,
                "reason": ["가슴둘레 +4cm 여유", "허리둘레 +6cm 여유"],
            }
        }
    }
