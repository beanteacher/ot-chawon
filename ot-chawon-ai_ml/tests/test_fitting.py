"""피팅 엔진 통합 테스트 — SCRUM-46."""
import asyncio
import pytest
import numpy as np
from unittest.mock import AsyncMock, MagicMock

from app.schemas.body import BodyInput
from app.schemas.fit import FitRequest, RenderOptions
from app.services.blendshape_engine import BlendShapeEngine
from app.services.size_recommender import SizeRecommender
from app.services.render_service import RenderService
from app.services.fitting_service import FittingService


# 테스트용 기준 체형
BODY_MALE_M = BodyInput(
    height_cm=175.0,
    weight_kg=72.0,
    gender="male",
    shoulder_cm=47.0,
    chest_cm=102.0,
    waist_cm=86.0,
    hip_cm=102.0,
)

BODY_MALE_L = BodyInput(
    height_cm=180.0,
    weight_kg=80.0,
    gender="male",
    shoulder_cm=50.0,
    chest_cm=108.0,
    waist_cm=92.0,
    hip_cm=106.0,
)

BODY_FEMALE_S = BodyInput(
    height_cm=160.0,
    weight_kg=52.0,
    gender="female",
    shoulder_cm=38.0,
    chest_cm=84.0,
    waist_cm=66.0,
    hip_cm=90.0,
)


# ---------------------------------------------------------------------------
# BlendShapeEngine 테스트
# ---------------------------------------------------------------------------

class TestBlendShapeEngine:
    def setup_method(self):
        self.engine = BlendShapeEngine()
        self.avatar_bounds = {"min": [0, 0, 0], "max": [0, 1.75, 0]}

    def _make_vertices(self, n: int = 100) -> np.ndarray:
        """랜덤 버텍스 생성 (Y: 0~1.75 범위)."""
        rng = np.random.default_rng(42)
        verts = rng.uniform(-0.3, 0.3, (n, 3))
        verts[:, 1] = rng.uniform(0, 1.75, n)
        return verts

    def test_vertex_count_preserved(self):
        """변형 후 버텍스 수가 보존되어야 합니다."""
        verts = self._make_vertices(200)
        result = self.engine.apply_deformation(verts, self.avatar_bounds, BODY_MALE_M)
        assert result.shape == verts.shape, f"버텍스 shape 불일치: {result.shape} != {verts.shape}"

    def test_deformation_changes_vertices(self):
        """체형이 기준과 다르면 XZ 좌표가 변경되어야 합니다."""
        verts = self._make_vertices(50)
        result_m = self.engine.apply_deformation(verts.copy(), self.avatar_bounds, BODY_MALE_M)
        result_l = self.engine.apply_deformation(verts.copy(), self.avatar_bounds, BODY_MALE_L)
        # L 사이즈는 XZ가 더 커야 함
        assert not np.allclose(result_m[:, 0], result_l[:, 0]), "L과 M의 X 좌표가 동일함"

    def test_dtype_float64(self):
        """반환 배열은 float64여야 합니다."""
        verts = self._make_vertices(30)
        result = self.engine.apply_deformation(verts, self.avatar_bounds, BODY_MALE_M)
        assert result.dtype == np.float64

    def test_invalid_shape_raises(self):
        """shape (N, 2) 입력 시 ValueError 발생."""
        bad_verts = np.ones((10, 2))
        with pytest.raises(ValueError):
            self.engine.apply_deformation(bad_verts, self.avatar_bounds, BODY_MALE_M)

    def test_compute_ratios(self):
        """compute_ratios가 올바른 키를 반환해야 합니다."""
        ratios = self.engine.compute_ratios(BODY_MALE_M)
        for key in ["shoulder_ratio", "chest_ratio", "waist_ratio", "hip_ratio", "height_ratio"]:
            assert key in ratios
            assert ratios[key] > 0


# ---------------------------------------------------------------------------
# SizeRecommender 테스트
# ---------------------------------------------------------------------------

class TestSizeRecommender:
    def setup_method(self):
        self.recommender = SizeRecommender()

    def test_male_m_body_recommends_m(self):
        """M 사이즈 기준 체형은 M을 추천해야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_M, "jacket-001")
        assert rec["recommended_size"] == "M"

    def test_male_l_body_recommends_l(self):
        """L 사이즈 기준 체형은 L을 추천해야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_L, "jacket-001")
        assert rec["recommended_size"] == "L"

    def test_female_s_body_recommends_s_or_xs(self):
        """S 사이즈 여성 체형은 S 또는 XS를 추천해야 합니다."""
        rec = self.recommender.recommend(BODY_FEMALE_S, "dress-001")
        assert rec["recommended_size"] in ("XS", "S")

    def test_confidence_range(self):
        """confidence는 0~1 범위여야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_M, "jacket-001")
        assert 0.0 <= rec["confidence"] <= 1.0

    def test_alternatives_count(self):
        """alternatives는 2개여야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_M, "jacket-001")
        assert len(rec["alternatives"]) == 2

    def test_reason_not_empty(self):
        """reason 목록은 비어있지 않아야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_M, "jacket-001")
        assert len(rec["reason"]) > 0

    def test_high_confidence_for_exact_match(self):
        """정확한 기준 체형은 높은 confidence를 가져야 합니다."""
        rec = self.recommender.recommend(BODY_MALE_M, "jacket-001")
        assert rec["confidence"] >= 0.8, f"confidence 너무 낮음: {rec['confidence']}"


# ---------------------------------------------------------------------------
# RenderService 테스트
# ---------------------------------------------------------------------------

class TestRenderService:
    def setup_method(self):
        self.service = RenderService()

    def test_render_returns_all_angles(self):
        """요청한 모든 각도에 대해 결과가 반환되어야 합니다."""
        angles = [0, 90, 180]
        result = self.service.render_scene(None, angles, "512x512")
        assert set(result.keys()) == {"0", "90", "180"}

    def test_render_bytes_length_positive(self):
        """각 렌더링 이미지 바이트 길이는 0보다 커야 합니다."""
        result = self.service.render_scene(None, [0, 90, 180], "256x256")
        for angle, img_bytes in result.items():
            assert len(img_bytes) > 0, f"angle={angle} 이미지 바이트가 비어있음"

    def test_render_single_angle(self):
        """단일 각도 렌더링이 정상 동작해야 합니다."""
        result = self.service.render_scene(None, [0], "128x128")
        assert "0" in result
        assert len(result["0"]) > 0

    def test_render_from_vertices(self):
        """버텍스 배열로부터 렌더링이 정상 동작해야 합니다."""
        verts = np.array([[0, 0, 0], [1, 0, 0], [0, 1, 0]], dtype=float)
        faces = np.array([[0, 1, 2]])
        result = self.service.render_from_vertices(verts, faces, [0, 180], "128x128")
        assert len(result) == 2
        for img_bytes in result.values():
            assert len(img_bytes) > 0

    def test_render_png_magic_bytes(self):
        """반환된 바이트가 PNG 포맷이어야 합니다 (magic bytes 확인)."""
        result = self.service.render_scene(None, [0], "128x128")
        png_magic = b"\x89PNG\r\n\x1a\n"
        assert result["0"][:8] == png_magic, "PNG magic bytes 불일치"


# ---------------------------------------------------------------------------
# FittingService 통합 테스트
# ---------------------------------------------------------------------------

class TestFittingService:
    def setup_method(self):
        self.service = FittingService()

    def test_fit_clothing_returns_fit_result(self):
        """fit_clothing이 FitResult를 반환해야 합니다."""
        from app.schemas.fit import FitResult
        result = asyncio.get_event_loop().run_until_complete(
            self.service.fit_clothing(
                body=BODY_MALE_M,
                item_id="jacket-001",
                render_options=RenderOptions(angles=[0, 90], resolution="256x256"),
                job_id="test-job-001",
            )
        )
        assert isinstance(result, FitResult)

    def test_fit_result_has_renders(self):
        """FitResult.renders는 비어있지 않아야 합니다."""
        result = asyncio.get_event_loop().run_until_complete(
            self.service.fit_clothing(
                body=BODY_MALE_M,
                item_id="jacket-001",
                render_options=RenderOptions(angles=[0, 90, 180], resolution="256x256"),
                job_id="test-job-002",
            )
        )
        assert len(result.renders) == 3

    def test_fit_result_has_size_recommendation(self):
        """FitResult.size_recommendation이 None이 아니어야 합니다."""
        result = asyncio.get_event_loop().run_until_complete(
            self.service.fit_clothing(
                body=BODY_MALE_M,
                item_id="jacket-001",
                render_options=RenderOptions(),
                job_id="test-job-003",
            )
        )
        assert result.size_recommendation is not None
        assert "recommended_size" in result.size_recommendation

    def test_fit_result_has_glb_url(self):
        """FitResult.glb_url이 빈 문자열이 아니어야 합니다."""
        result = asyncio.get_event_loop().run_until_complete(
            self.service.fit_clothing(
                body=BODY_MALE_M,
                item_id="jacket-001",
                render_options=RenderOptions(),
                job_id="test-job-004",
            )
        )
        assert result.glb_url != ""


# ---------------------------------------------------------------------------
# POST /fit 엔드포인트 통합 테스트
# ---------------------------------------------------------------------------

@pytest.fixture
def mock_redis():
    """Redis AsyncMock 생성."""
    from unittest.mock import AsyncMock
    r = AsyncMock()
    r.get.return_value = None
    r.set.return_value = True
    r.lpush.return_value = 1
    return r


@pytest.fixture
def client(mock_redis):
    """FastAPI TestClient — Redis를 mock으로 교체."""
    from fastapi.testclient import TestClient
    from app.main import app
    from app.core.dependencies import get_redis

    async def override_get_redis():
        yield mock_redis

    app.dependency_overrides[get_redis] = override_get_redis
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


class TestFitEndpoint:
    FIT_PAYLOAD = {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "item_id": "jacket-001",
        "body": {
            "height_cm": 175.0,
            "weight_kg": 68.0,
            "gender": "male",
            "shoulder_cm": 43.0,
            "chest_cm": 94.0,
            "waist_cm": 78.0,
            "hip_cm": 96.0,
        },
        "render_options": {"angles": [0, 90], "resolution": "256x256"},
    }

    def test_post_fit_sync_status_200(self, client):
        """POST /fit 가 200을 반환해야 합니다."""
        resp = client.post("/fit", json=self.FIT_PAYLOAD)
        assert resp.status_code == 200

    def test_post_fit_sync_has_job_id(self, client):
        """POST /fit 응답에 job_id가 있어야 합니다."""
        resp = client.post("/fit", json=self.FIT_PAYLOAD)
        data = resp.json()
        assert "job_id" in data
        assert len(data["job_id"]) > 0

    def test_post_fit_sync_status_completed(self, client):
        """POST /fit 동기 응답의 status는 'completed'여야 합니다."""
        resp = client.post("/fit", json=self.FIT_PAYLOAD)
        data = resp.json()
        assert data["status"] == "completed"

    def test_post_fit_async_status_queued(self, client):
        """POST /fit/async 응답의 status는 'queued'여야 합니다."""
        resp = client.post("/fit/async", json=self.FIT_PAYLOAD)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "queued"
