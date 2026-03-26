from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from app.core.dependencies import get_redis

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(redis: Redis = Depends(get_redis)):
    redis_ok = False
    try:
        await redis.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "ok",
        "redis": "connected" if redis_ok else "disconnected",
        "model_loaded": False,
    }
