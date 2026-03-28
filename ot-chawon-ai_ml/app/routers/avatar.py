"""아바타 라우터 — 동기/비동기 아바타 생성 엔드포인트."""
import uuid
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from redis.asyncio import Redis
from app.core.dependencies import get_redis
from app.schemas.avatar import (
    AvatarRequest,
    AvatarResponse,
    AvatarSyncResponse,
    AvatarResult,
    AvatarJobStatusResponse,
)
from app.services.avatar_service import AvatarService

router = APIRouter(prefix="/avatar", tags=["avatar"])


def get_avatar_service() -> AvatarService:
    """AvatarService 의존성 주입 (MockSMPLXAdapter 기본 사용)."""
    return AvatarService()


@router.post("", response_model=AvatarSyncResponse, summary="아바타 동기 생성")
async def create_avatar_sync(
    request: AvatarRequest,
    service: AvatarService = Depends(get_avatar_service),
) -> AvatarSyncResponse:
    """
    체형 파라미터를 받아 즉시 SMPL-X 아바타 GLB를 생성하고 메타데이터를 반환합니다.
    GLB 바이너리는 /avatar/glb 엔드포인트에서 별도로 다운로드할 수 있습니다.
    """
    result = await service.generate_avatar(request.body, request.pose)

    return AvatarSyncResponse(
        user_id=request.user_id,
        pose=request.pose,
        result=AvatarResult(
            vertex_count=result["vertex_count"],
            joint_count=result["joint_count"],
            glb_size_bytes=result["glb_size_bytes"],
            generation_time_ms=result["generation_time_ms"],
            glb_url=None,
        ),
    )


@router.post("/async", response_model=AvatarResponse, summary="아바타 비동기 생성 큐 등록")
async def create_avatar_async(
    request: AvatarRequest,
    redis: Redis = Depends(get_redis),
) -> AvatarResponse:
    """
    아바타 생성 작업을 Redis 큐에 등록하고 job_id를 반환합니다.
    생성 완료 여부는 GET /avatar/{job_id}로 폴링합니다.
    """
    job_id = str(uuid.uuid4())
    await redis.set(f"avatar:{job_id}", "queued", ex=3600)
    return AvatarResponse(job_id=job_id, status="queued")


@router.get("/{job_id}", response_model=AvatarJobStatusResponse, summary="비동기 작업 상태 조회")
async def get_avatar_job(
    job_id: str,
    redis: Redis = Depends(get_redis),
) -> AvatarJobStatusResponse:
    """비동기 아바타 생성 작업의 현재 상태를 조회합니다."""
    status = await redis.get(f"avatar:{job_id}")
    if status is None:
        raise HTTPException(status_code=404, detail=f"job_id '{job_id}'를 찾을 수 없습니다.")

    glb_url = None
    if status == "completed":
        glb_url = await redis.get(f"avatar:{job_id}:url")

    return AvatarJobStatusResponse(
        job_id=job_id,
        status=status,
        glb_url=glb_url,
    )
