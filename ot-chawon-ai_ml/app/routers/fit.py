import uuid
from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.core.dependencies import get_redis
from app.schemas.fit import FitRequest, FitResponse, FitStatusResponse

router = APIRouter(prefix="/fit", tags=["fit"])


@router.post("", response_model=FitResponse)
async def create_fit_job(
    request: FitRequest,
    redis: Redis = Depends(get_redis),
) -> FitResponse:
    """피팅 작업을 생성하고 job_id를 즉시 반환합니다 (비동기)."""
    job_id = str(uuid.uuid4())
    # TODO: 비동기 피팅 파이프라인 큐에 작업 등록
    await redis.set(f"fit:{job_id}", "queued", ex=3600)
    return FitResponse(job_id=job_id, status="queued")


@router.get("/{job_id}/status", response_model=FitStatusResponse)
async def get_fit_status(
    job_id: str,
    redis: Redis = Depends(get_redis),
) -> FitStatusResponse:
    """피팅 작업의 현재 상태 및 결과를 조회합니다."""
    # TODO: Redis에서 작업 상태 조회 및 결과 반환
    status = await redis.get(f"fit:{job_id}")
    if status is None:
        return FitStatusResponse(job_id=job_id, status="failed", error_code="JOB_NOT_FOUND")
    return FitStatusResponse(job_id=job_id, status=status)
