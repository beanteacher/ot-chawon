import uuid
import json
import time
from fastapi import APIRouter, Depends, HTTPException
from redis.asyncio import Redis
from app.core.dependencies import get_redis
from app.schemas.fit import FitRequest, FitResponse, FitStatusResponse, FitResult
from app.services.fitting_service import FittingService

router = APIRouter(prefix="/fit", tags=["fit"])

_fitting_service = FittingService()


@router.post("", response_model=FitStatusResponse)
async def create_fit_sync(
    request: FitRequest,
    redis: Redis = Depends(get_redis),
) -> FitStatusResponse:
    """피팅 파이프라인을 동기 실행하고 결과를 즉시 반환합니다."""
    job_id = str(uuid.uuid4())
    t_start = time.monotonic()

    await redis.set(f"fit:{job_id}", "processing", ex=3600)

    try:
        result: FitResult = await _fitting_service.fit_clothing(
            body=request.body,
            item_id=request.item_id,
            render_options=request.render_options,
            job_id=job_id,
        )
        elapsed_ms = int((time.monotonic() - t_start) * 1000)

        result_json = result.model_dump_json()
        await redis.set(f"fit:{job_id}", "completed", ex=3600)
        await redis.set(f"fit:{job_id}:result", result_json, ex=3600)
        await redis.set(f"fit:{job_id}:elapsed", str(elapsed_ms), ex=3600)

        return FitStatusResponse(
            job_id=job_id,
            status="completed",
            result=result,
            elapsed_ms=elapsed_ms,
        )
    except Exception as e:
        await redis.set(f"fit:{job_id}", "failed", ex=3600)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/async", response_model=FitResponse)
async def create_fit_async(
    request: FitRequest,
    redis: Redis = Depends(get_redis),
) -> FitResponse:
    """피팅 작업을 비동기 큐에 등록하고 job_id를 즉시 반환합니다."""
    job_id = str(uuid.uuid4())

    job_payload = {
        "job_id": job_id,
        "user_id": request.user_id,
        "item_id": request.item_id,
        "body": request.body.model_dump(),
        "render_options": request.render_options.model_dump(),
    }
    await redis.set(f"fit:{job_id}", "queued", ex=3600)
    await redis.lpush("fit:queue", json.dumps(job_payload))

    return FitResponse(job_id=job_id, status="queued")


@router.get("/{job_id}/status", response_model=FitStatusResponse)
async def get_fit_status(
    job_id: str,
    redis: Redis = Depends(get_redis),
) -> FitStatusResponse:
    """피팅 작업의 현재 상태를 조회합니다."""
    status = await redis.get(f"fit:{job_id}")
    if status is None:
        return FitStatusResponse(job_id=job_id, status="failed", error_code="JOB_NOT_FOUND")

    elapsed_raw = await redis.get(f"fit:{job_id}:elapsed")
    elapsed_ms = int(elapsed_raw) if elapsed_raw else None

    return FitStatusResponse(job_id=job_id, status=status, elapsed_ms=elapsed_ms)


@router.get("/{job_id}/result", response_model=FitStatusResponse)
async def get_fit_result(
    job_id: str,
    redis: Redis = Depends(get_redis),
) -> FitStatusResponse:
    """완료된 피팅 작업의 상세 결과를 반환합니다."""
    status = await redis.get(f"fit:{job_id}")
    if status is None:
        raise HTTPException(status_code=404, detail="Job not found")

    result_json = await redis.get(f"fit:{job_id}:result")
    elapsed_raw = await redis.get(f"fit:{job_id}:elapsed")
    elapsed_ms = int(elapsed_raw) if elapsed_raw else None

    result = None
    if result_json:
        try:
            result = FitResult.model_validate_json(result_json)
        except Exception:
            pass

    return FitStatusResponse(
        job_id=job_id,
        status=status,
        result=result,
        elapsed_ms=elapsed_ms,
    )
