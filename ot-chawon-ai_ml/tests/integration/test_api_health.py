import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app


@pytest.fixture
def mock_redis():
    with patch("app.core.dependencies._redis_client") as mock:
        redis_mock = AsyncMock()
        redis_mock.ping = AsyncMock(return_value=True)
        mock.__bool__ = lambda self: True
        return redis_mock


@pytest.mark.asyncio
async def test_health_returns_200():
    with patch("app.routers.health.get_redis") as mock_get_redis:
        redis_mock = AsyncMock()
        redis_mock.ping = AsyncMock(return_value=True)

        async def _fake_get_redis():
            yield redis_mock

        mock_get_redis.return_value = _fake_get_redis()

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"


@pytest.mark.asyncio
async def test_health_response_shape():
    with patch("app.routers.health.get_redis") as mock_get_redis:
        redis_mock = AsyncMock()
        redis_mock.ping = AsyncMock(return_value=True)

        async def _fake_get_redis():
            yield redis_mock

        mock_get_redis.return_value = _fake_get_redis()

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/health")

    body = response.json()
    assert "status" in body
    assert "redis" in body
    assert "model_loaded" in body
