from fastapi import APIRouter, Query
from app.schemas.size import (
    SizePredictRequest,
    SizePredictResponse,
    SizeChartResponse,
    BatchSizePredictRequest,
    BatchSizePredictResponse,
)
from app.services.size_recommender import SizeRecommender, _get_category

router = APIRouter(prefix="/size", tags=["size"])

_recommender = SizeRecommender()


@router.post("/predict", response_model=SizePredictResponse)
async def predict_size(request: SizePredictRequest) -> SizePredictResponse:
    """체형 입력을 기반으로 의류 사이즈를 추천합니다."""
    rec = _recommender.recommend(
        body=request.body,
        item_id=request.item_id,
        fit_preference=request.fit_preference or "regular",
    )
    return SizePredictResponse(
        recommended_size=rec["recommended_size"],
        confidence=rec["confidence"],
        alternatives=rec["alternatives"],
        reason=rec["reason"],
    )


@router.get("/chart/{item_id}", response_model=SizeChartResponse)
async def get_size_chart(
    item_id: str,
    gender: str = Query("female", description="성별 (male/female)"),
) -> SizeChartResponse:
    """아이템 카테고리에 해당하는 사이즈 차트를 반환합니다."""
    category = _get_category(item_id)
    chart = _recommender.get_size_chart(item_id=item_id, gender=gender)
    return SizeChartResponse(
        item_id=item_id,
        category=category,
        gender=gender,
        chart=chart,
    )


@router.post("/batch", response_model=BatchSizePredictResponse)
async def batch_predict_size(
    request: BatchSizePredictRequest,
) -> BatchSizePredictResponse:
    """여러 아이템에 대해 일괄 사이즈 추천을 반환합니다."""
    results = []
    for item_id in request.item_ids:
        rec = _recommender.recommend(
            body=request.body,
            item_id=item_id,
            fit_preference=request.fit_preference or "regular",
        )
        results.append(
            SizePredictResponse(
                recommended_size=rec["recommended_size"],
                confidence=rec["confidence"],
                alternatives=rec["alternatives"],
                reason=rec["reason"],
            )
        )
    return BatchSizePredictResponse(results=results)
