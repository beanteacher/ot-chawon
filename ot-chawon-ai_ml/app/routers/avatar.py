import uuid
from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.core.dependencies import get_redis
from app.schemas.avatar import AvatarRequest, AvatarResponse

router = APIRouter(prefix="/avatar", tags=["avatar"])


@router.post("", response_model=AvatarResponse)
async def create_avatar(
    request: AvatarRequest,
    redis: Redis = Depends(get_redis),
) -> AvatarResponse:
    """아바타 메쉬를 비동기로 생성합니다."""
    job_id = str(uuid.uuid4())
    # TODO: SMPL-X 기반 아바타 메쉬 생성 파이프라인 큐 등록
    await redis.set(f"avatar:{job_id}", "queued", ex=3600)
    return AvatarResponse(job_id=job_id, status="queued")
