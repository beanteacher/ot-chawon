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
