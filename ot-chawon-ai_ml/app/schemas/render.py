from pydantic import BaseModel, Field
from typing import Literal, Optional


class RenderRequest(BaseModel):
    job_id: str = Field(..., description="피팅 완료된 작업 ID")
    angles: list[int] = Field(default=[0, 90, 180], description="렌더링 각도 목록")
    resolution: str = Field(default="1080x1080", description="렌더링 해상도")


class RenderResponse(BaseModel):
    job_id: str = Field(..., description="렌더링 작업 ID")
    status: Literal["queued", "processing", "completed", "failed"] = Field(
        ..., description="작업 상태"
    )
    render_urls: Optional[dict[str, str]] = Field(None, description="완료 시 렌더링 URL 맵")
