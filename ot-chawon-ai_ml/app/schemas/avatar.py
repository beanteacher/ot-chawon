from pydantic import BaseModel, Field
from typing import Literal, Optional
from app.schemas.body import BodyInput


class AvatarRequest(BaseModel):
    user_id: str = Field(..., description="사용자 UUID")
    body: BodyInput = Field(..., description="체형 입력 데이터")
    pose: Literal["a-pose", "t-pose"] = Field(default="a-pose", description="기본 자세")


class AvatarResponse(BaseModel):
    job_id: str = Field(..., description="아바타 생성 작업 ID")
    status: Literal["queued", "processing", "completed", "failed"] = Field(
        ..., description="작업 상태"
    )
    glb_url: Optional[str] = Field(None, description="완료 시 GLB 파일 URL")


class AvatarResult(BaseModel):
    vertex_count: int = Field(..., description="메쉬 버텍스 수")
    joint_count: int = Field(..., description="관절 수")
    glb_size_bytes: int = Field(..., description="GLB 파일 크기 (bytes)")
    generation_time_ms: float = Field(..., description="생성 소요 시간 (ms)")
    glb_url: Optional[str] = Field(None, description="GLB 파일 URL (S3/CDN)")


class AvatarSyncResponse(BaseModel):
    """동기 모드 아바타 생성 응답 — AvatarResult를 직접 포함합니다."""
    user_id: str = Field(..., description="사용자 UUID")
    pose: str = Field(..., description="생성된 포즈")
    result: AvatarResult = Field(..., description="생성 결과 메타데이터")

    model_config = {
        "json_schema_extra": {
            "example": {
                "user_id": "user-uuid-1234",
                "pose": "a-pose",
                "result": {
                    "vertex_count": 1500,
                    "joint_count": 24,
                    "glb_size_bytes": 204800,
                    "generation_time_ms": 320.5,
                    "glb_url": None,
                },
            }
        }
    }


class AvatarJobStatusResponse(BaseModel):
    """비동기 job 상태 조회 응답."""
    job_id: str = Field(..., description="작업 ID")
    status: Literal["queued", "processing", "completed", "failed"] = Field(
        ..., description="작업 상태"
    )
    glb_url: Optional[str] = Field(None, description="완료 시 GLB URL")
