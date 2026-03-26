from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.body import BodyInput


class RenderOptions(BaseModel):
    angles: list[int] = Field(default=[0, 90, 180], description="렌더링 각도 목록")
    resolution: str = Field(default="1080x1080", description="렌더링 해상도")


class FitRequest(BaseModel):
    user_id: str = Field(..., description="사용자 UUID")
    item_id: str = Field(..., description="의류 아이템 ID")
    body: BodyInput = Field(..., description="체형 입력 데이터")
    render_options: RenderOptions = Field(default_factory=RenderOptions)

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "item_id": "jacket-001",
                "body": {
                    "height_cm": 175.0,
                    "weight_kg": 68.0,
                    "gender": "male",
                    "shoulder_cm": 44.0,
                    "chest_cm": 96.0,
                    "waist_cm": 80.0,
                    "hip_cm": 95.0,
                },
                "render_options": {"angles": [0, 90, 180], "resolution": "1080x1080"},
            }
        }
    }


class FitResponse(BaseModel):
    job_id: str = Field(..., description="피팅 작업 ID")
    status: Literal["queued", "processing", "completed", "failed"] = Field(
        ..., description="작업 상태"
    )


class FitResult(BaseModel):
    renders: dict[str, str] = Field(..., description="렌더링 이미지 URL 맵")
    glb_url: str = Field(..., description="피팅 완료 GLB 파일 URL")
    size_recommendation: Optional[dict] = Field(None, description="사이즈 추천 결과")


class FitStatusResponse(BaseModel):
    job_id: str = Field(..., description="피팅 작업 ID")
    status: Literal["queued", "processing", "completed", "failed"] = Field(
        ..., description="작업 상태"
    )
    result: Optional[FitResult] = Field(None, description="완료된 경우 결과 데이터")
    elapsed_ms: Optional[int] = Field(None, description="소요 시간 (ms)")
    error_code: Optional[str] = Field(None, description="실패 시 오류 코드")
