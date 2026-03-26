from fastapi import APIRouter
from app.schemas.size import SizePredictRequest, SizePredictResponse

router = APIRouter(prefix="/size", tags=["size"])


@router.post("/predict", response_model=SizePredictResponse)
async def predict_size(request: SizePredictRequest) -> SizePredictResponse:
    """체형 입력을 기반으로 의류 사이즈를 추천합니다 (동기)."""
    # TODO: 실제 사이즈 추천 로직 구현 (app/services/size_rule.py)
    return SizePredictResponse(
        recommended_size="M",
        confidence=0.0,
        reason=["사이즈 추천 서비스 준비 중"],
    )
