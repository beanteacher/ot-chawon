"""아바타 생성 API 유닛 테스트 — MockSMPLXAdapter 기반."""
import pytest
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport
from fastapi import FastAPI

from app.main import app
from app.routers.avatar import get_avatar_service
from app.services.avatar_service import AvatarService
from app.services.smplx_mock import MockSMPLXAdapter


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture
def avatar_service() -> AvatarService:
    return AvatarService(adapter=MockSMPLXAdapter())


@pytest.fixture
def male_body_payload() -> dict:
    return {
        "user_id": "test-user-001",
        "pose": "a-pose",
        "body": {
            "height_cm": 175.0,
            "weight_kg": 70.0,
            "gender": "male",
            "shoulder_cm": 44.0,
            "chest_cm": 96.0,
            "waist_cm": 80.0,
            "hip_cm": 95.0,
        },
    }


@pytest.fixture
def female_body_payload() -> dict:
    return {
        "user_id": "test-user-002",
        "pose": "t-pose",
        "body": {
            "height_cm": 162.0,
            "weight_kg": 52.0,
            "gender": "female",
            "shoulder_cm": 38.0,
            "chest_cm": 84.0,
            "waist_cm": 65.0,
            "hip_cm": 90.0,
        },
    }


@pytest.fixture
def tall_body_payload() -> dict:
    """키가 큰 체형 케이스."""
    return {
        "user_id": "test-user-003",
        "pose": "a-pose",
        "body": {
            "height_cm": 195.0,
            "weight_kg": 95.0,
            "gender": "male",
            "shoulder_cm": 52.0,
            "chest_cm": 112.0,
            "waist_cm": 95.0,
            "hip_cm": 104.0,
        },
    }


# ── AvatarService 유닛 테스트 ──────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_generate_avatar_returns_glb_bytes(avatar_service, male_body_payload):
    """동기 아바타 생성 시 GLB 바이트가 포함된 결과를 반환해야 합니다."""
    from app.schemas.body import BodyInput
    body = BodyInput(**male_body_payload["body"])
    result = await avatar_service.generate_avatar(body, "a-pose")

    assert result["glb_bytes"] is not None
    assert isinstance(result["glb_bytes"], bytes)
    assert result["glb_size_bytes"] > 0
    assert result["vertex_count"] > 0
    assert result["joint_count"] == 24
    assert result["generation_time_ms"] > 0


@pytest.mark.asyncio
async def test_generate_avatar_female_t_pose(avatar_service, female_body_payload):
    """여성 t-pose 아바타 생성도 정상 동작해야 합니다."""
    from app.schemas.body import BodyInput
    body = BodyInput(**female_body_payload["body"])
    result = await avatar_service.generate_avatar(body, "t-pose")

    assert result["vertex_count"] > 0
    assert result["joint_count"] == 24
    assert result["glb_size_bytes"] > 0


@pytest.mark.asyncio
async def test_generate_avatar_tall_body(avatar_service, tall_body_payload):
    """키가 큰 체형 아바타 생성도 정상 동작해야 합니다."""
    from app.schemas.body import BodyInput
    body = BodyInput(**tall_body_payload["body"])
    result = await avatar_service.generate_avatar(body, "a-pose")

    assert result["vertex_count"] > 0
    assert result["glb_size_bytes"] > 0


# ── API 엔드포인트 테스트 ──────────────────────────────────────────────────────

@pytest.fixture
def test_app() -> FastAPI:
    """Redis 의존성을 Mock으로 교체한 테스트 앱."""
    mock_redis = AsyncMock()
    mock_redis.set = AsyncMock(return_value=True)
    mock_redis.get = AsyncMock(return_value="queued")

    from app.core.dependencies import get_redis

    app.dependency_overrides[get_redis] = lambda: mock_redis
    yield app
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_post_avatar_sync_male(test_app, male_body_payload):
    """POST /avatar — 남성 체형 동기 생성 성공."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=male_body_payload)

    assert resp.status_code == 200
    data = resp.json()
    assert data["user_id"] == "test-user-001"
    assert data["pose"] == "a-pose"
    assert data["result"]["vertex_count"] > 0
    assert data["result"]["joint_count"] == 24
    assert data["result"]["glb_size_bytes"] > 0
    assert data["result"]["generation_time_ms"] > 0


@pytest.mark.asyncio
async def test_post_avatar_sync_female(test_app, female_body_payload):
    """POST /avatar — 여성 체형 동기 생성 성공."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=female_body_payload)

    assert resp.status_code == 200
    data = resp.json()
    assert data["user_id"] == "test-user-002"
    assert data["pose"] == "t-pose"
    assert data["result"]["vertex_count"] > 0


@pytest.mark.asyncio
async def test_post_avatar_sync_tall(test_app, tall_body_payload):
    """POST /avatar — 큰 체형 동기 생성 성공."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=tall_body_payload)

    assert resp.status_code == 200
    data = resp.json()
    assert data["result"]["glb_size_bytes"] > 0


@pytest.mark.asyncio
async def test_post_avatar_async_queued(test_app, male_body_payload):
    """POST /avatar/async — 비동기 큐 등록 후 job_id 반환."""
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar/async", json=male_body_payload)

    assert resp.status_code == 200
    data = resp.json()
    assert "job_id" in data
    assert data["status"] == "queued"
    assert len(data["job_id"]) == 36  # UUID 형식


@pytest.mark.asyncio
async def test_get_avatar_job_status(test_app):
    """GET /avatar/{job_id} — 작업 상태 조회."""
    job_id = "550e8400-e29b-41d4-a716-446655440000"
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.get(f"/avatar/{job_id}")

    assert resp.status_code == 200
    data = resp.json()
    assert data["job_id"] == job_id
    assert data["status"] == "queued"


@pytest.mark.asyncio
async def test_get_avatar_job_not_found(test_app):
    """GET /avatar/{job_id} — 존재하지 않는 job_id는 404 반환."""
    from app.core.dependencies import get_redis
    mock_redis = AsyncMock()
    mock_redis.get = AsyncMock(return_value=None)
    test_app.dependency_overrides[get_redis] = lambda: mock_redis

    job_id = "nonexistent-job-id"
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.get(f"/avatar/{job_id}")

    assert resp.status_code == 404
    test_app.dependency_overrides.clear()


# ── 입력 검증 테스트 ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_post_avatar_invalid_height(test_app):
    """잘못된 신장 입력(음수)은 422 Unprocessable Entity를 반환해야 합니다."""
    payload = {
        "user_id": "user-invalid",
        "pose": "a-pose",
        "body": {
            "height_cm": -10.0,  # 유효하지 않음
            "weight_kg": 70.0,
            "gender": "male",
            "shoulder_cm": 44.0,
            "chest_cm": 96.0,
            "waist_cm": 80.0,
            "hip_cm": 95.0,
        },
    }
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=payload)

    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_post_avatar_invalid_pose(test_app):
    """잘못된 pose 값은 422를 반환해야 합니다."""
    payload = {
        "user_id": "user-invalid",
        "pose": "x-pose",  # 유효하지 않음
        "body": {
            "height_cm": 175.0,
            "weight_kg": 70.0,
            "gender": "male",
            "shoulder_cm": 44.0,
            "chest_cm": 96.0,
            "waist_cm": 80.0,
            "hip_cm": 95.0,
        },
    }
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=payload)

    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_post_avatar_missing_required_field(test_app):
    """필수 필드 누락 시 422를 반환해야 합니다."""
    payload = {
        "user_id": "user-invalid",
        "pose": "a-pose",
        "body": {
            "height_cm": 175.0,
            # weight_kg 누락
            "gender": "male",
            "shoulder_cm": 44.0,
            "chest_cm": 96.0,
            "waist_cm": 80.0,
            "hip_cm": 95.0,
        },
    }
    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as client:
        resp = await client.post("/avatar", json=payload)

    assert resp.status_code == 422
