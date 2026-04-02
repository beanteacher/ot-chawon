from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path
from app.core.config import get_settings
from app.core.dependencies import close_redis
from app.routers import health, fit, size, avatar, render, metrics

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown
    await close_redis()


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="옷차원 AI 피팅 추론 서버 - 체형 예측, 가상 피팅, 사이즈 추천",
    lifespan=lifespan,
)

Path("/tmp/fits").mkdir(parents=True, exist_ok=True)
app.mount("/static/fits", StaticFiles(directory="/tmp/fits"), name="static_fits")

app.include_router(health.router)
app.include_router(size.router)
app.include_router(fit.router)
app.include_router(avatar.router)
app.include_router(render.router)
app.include_router(metrics.router)
