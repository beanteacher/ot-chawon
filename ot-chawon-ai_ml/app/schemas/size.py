from typing import Literal, Optional
from pydantic import BaseModel, Field
from app.schemas.body import BodyInput


class SizePredictRequest(BaseModel):
    body: BodyInput = Field(..., description="체형 입력 데이터")
    item_id: str = Field(..., description="의류 아이템 ID")
    fit_preference: Optional[Literal["slim", "regular", "loose"]] = Field(
        "regular", description="핏 선호도 (slim/regular/loose)"
    )


class SizePredictResponse(BaseModel):
    recommended_size: str = Field(..., description="추천 사이즈 (XS/S/M/L/XL/XXL)")
    confidence: float = Field(..., ge=0.0, le=1.0, description="신뢰도 (0~1)")
    alternatives: list[str] = Field(..., description="차선 사이즈 2개")
    reason: list[str] = Field(..., description="추천 근거 목록")

    model_config = {
        "json_schema_extra": {
            "example": {
                "recommended_size": "M",
                "confidence": 0.87,
                "alternatives": ["S", "L"],
                "reason": ["가슴둘레 +4cm 여유", "허리둘레 +6cm 여유"],
            }
        }
    }


class SizeChartResponse(BaseModel):
    """카테고리별 사이즈 차트 응답."""
    item_id: str = Field(..., description="아이템 ID")
    category: str = Field(..., description="카테고리 (TOP/BOTTOM/OUTER)")
    gender: str = Field(..., description="성별 (male/female)")
    chart: dict[str, dict[str, float]] = Field(..., description="사이즈별 기준 측정값")


class BatchSizePredictRequest(BaseModel):
    """여러 아이템 일괄 사이즈 추천 요청."""
    body: BodyInput = Field(..., description="체형 입력 데이터")
    item_ids: list[str] = Field(..., description="의류 아이템 ID 목록")
    fit_preference: Optional[Literal["slim", "regular", "loose"]] = Field(
        "regular", description="핏 선호도 (slim/regular/loose)"
    )


class BatchSizePredictResponse(BaseModel):
    """여러 아이템 일괄 사이즈 추천 응답."""
    results: list[SizePredictResponse] = Field(..., description="아이템별 추천 결과")
