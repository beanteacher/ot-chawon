import uuid
from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.core.dependencies import get_redis
from app.schemas.render import RenderRequest, RenderResponse

router = APIRouter(prefix="/render", tags=["render"])


@router.post("", response_model=RenderResponse)
async def create_render(
    request: RenderRequest,
    redis: Redis = Depends(get_redis),
) -> RenderResponse:
    """피팅 완료 후 다각도 렌더링을 비동기로 재요청합니다."""
    render_job_id = str(uuid.uuid4())
    # TODO: 렌더링 파이프라인 큐 등록 (Open3D / Blender Headless)
    await redis.set(f"render:{render_job_id}", "queued", ex=3600)
    return RenderResponse(job_id=render_job_id, status="queued")
