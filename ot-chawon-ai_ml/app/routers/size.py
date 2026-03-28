from fastapi import APIRouter
from app.schemas.size import SizePredictRequest, SizePredictResponse
from app.services.size_recommender import SizeRecommender

router = APIRouter(prefix="/size", tags=["size"])

_recommender = SizeRecommender()


@router.post("/predict", response_model=SizePredictResponse)
async def predict_size(request: SizePredictRequest) -> SizePredictResponse:
    """체형 입력을 기반으로 의류 사이즈를 추천합니다 (동기)."""
    rec = _recommender.recommend(body=request.body, item_id=request.item_id)
    return SizePredictResponse(
        recommended_size=rec["recommended_size"],
        confidence=rec["confidence"],
        reason=rec["reason"],
    )
