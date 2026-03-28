"""사이즈 추천 API 테스트."""
import time
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ── 공통 체형 픽스처 ──────────────────────────────────────────────

MALE_M_BODY = {
    "height_cm": 175.0,
    "weight_kg": 70.0,
    "gender": "male",
    "shoulder_cm": 46.0,
    "chest_cm": 98.0,
    "waist_cm": 82.0,
    "hip_cm": 98.0,
}

FEMALE_S_BODY = {
    "height_cm": 162.0,
    "weight_kg": 50.0,
    "gender": "female",
    "shoulder_cm": 39.0,
    "chest_cm": 86.0,
    "waist_cm": 70.0,
    "hip_cm": 90.0,
}


# ── /size/predict ─────────────────────────────────────────────────

class TestSizePredict:
    def test_male_m_body_recommends_m(self):
        """남성 M 체형 → M 추천."""
        payload = {"body": MALE_M_BODY, "item_id": "TOP-001"}
        resp = client.post("/size/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["recommended_size"] == "M"
        assert "alternatives" in data
        assert len(data["alternatives"]) == 2

    def test_female_s_body_recommends_s(self):
        """여성 S 체형 → S 추천."""
        payload = {"body": FEMALE_S_BODY, "item_id": "TOP-001"}
        resp = client.post("/size/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["recommended_size"] == "S"

    def test_fit_preference_slim_smaller_than_regular(self):
        """slim 선호 → regular보다 작거나 같은 사이즈 추천."""
        body = MALE_M_BODY
        regular_resp = client.post(
            "/size/predict",
            json={"body": body, "item_id": "TOP-001", "fit_preference": "regular"},
        )
        slim_resp = client.post(
            "/size/predict",
            json={"body": body, "item_id": "TOP-001", "fit_preference": "slim"},
        )
        assert regular_resp.status_code == 200
        assert slim_resp.status_code == 200

        size_order = ["XS", "S", "M", "L", "XL", "XXL"]
        regular_idx = size_order.index(regular_resp.json()["recommended_size"])
        slim_idx = size_order.index(slim_resp.json()["recommended_size"])
        assert slim_idx <= regular_idx  # slim은 regular 이하 사이즈

    def test_fit_preference_loose_larger_than_regular(self):
        """loose 선호 → regular보다 크거나 같은 사이즈 추천."""
        body = MALE_M_BODY
        regular_resp = client.post(
            "/size/predict",
            json={"body": body, "item_id": "TOP-001", "fit_preference": "regular"},
        )
        loose_resp = client.post(
            "/size/predict",
            json={"body": body, "item_id": "TOP-001", "fit_preference": "loose"},
        )
        assert regular_resp.status_code == 200
        assert loose_resp.status_code == 200

        size_order = ["XS", "S", "M", "L", "XL", "XXL"]
        regular_idx = size_order.index(regular_resp.json()["recommended_size"])
        loose_idx = size_order.index(loose_resp.json()["recommended_size"])
        assert loose_idx >= regular_idx  # loose는 regular 이상 사이즈

    def test_response_time_under_1_second(self):
        """응답 시간 1초 미만 확인."""
        payload = {"body": MALE_M_BODY, "item_id": "TOP-001"}
        start = time.time()
        resp = client.post("/size/predict", json=payload)
        elapsed = time.time() - start
        assert resp.status_code == 200
        assert elapsed < 1.0, f"응답 시간 초과: {elapsed:.3f}s"

    def test_alternatives_not_include_recommended(self):
        """alternatives에 추천 사이즈 미포함 확인."""
        payload = {"body": MALE_M_BODY, "item_id": "TOP-001"}
        resp = client.post("/size/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["recommended_size"] not in data["alternatives"]

    def test_confidence_range(self):
        """신뢰도 0~1 범위 확인."""
        payload = {"body": MALE_M_BODY, "item_id": "TOP-001"}
        resp = client.post("/size/predict", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert 0.0 <= data["confidence"] <= 1.0


# ── /size/chart/{item_id} ─────────────────────────────────────────

class TestSizeChart:
    def test_top_item_returns_chart(self):
        """TOP 아이템 → 사이즈 차트 반환."""
        resp = client.get("/size/chart/TOP-001", params={"gender": "male"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["category"] == "TOP"
        assert data["gender"] == "male"
        assert "M" in data["chart"]
        assert "chest_cm" in data["chart"]["M"]

    def test_bottom_item_returns_chart(self):
        """BOTTOM 아이템 → 카테고리 BOTTOM 반환."""
        resp = client.get("/size/chart/PANTS-001", params={"gender": "female"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["category"] == "BOTTOM"

    def test_outer_item_returns_chart(self):
        """OUTER 아이템 → 카테고리 OUTER 반환."""
        resp = client.get("/size/chart/JACKET-001", params={"gender": "male"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["category"] == "OUTER"

    def test_chart_has_all_sizes(self):
        """사이즈 차트에 XS~XXL 모두 포함."""
        resp = client.get("/size/chart/TOP-001", params={"gender": "female"})
        assert resp.status_code == 200
        chart = resp.json()["chart"]
        for size in ["XS", "S", "M", "L", "XL", "XXL"]:
            assert size in chart

    def test_chart_response_time_under_1_second(self):
        """차트 응답 시간 1초 미만."""
        start = time.time()
        resp = client.get("/size/chart/TOP-001", params={"gender": "male"})
        elapsed = time.time() - start
        assert resp.status_code == 200
        assert elapsed < 1.0


# ── /size/batch ───────────────────────────────────────────────────

class TestSizeBatch:
    def test_batch_returns_results_for_each_item(self):
        """배치 요청 → 각 아이템별 결과 반환."""
        payload = {
            "body": MALE_M_BODY,
            "item_ids": ["TOP-001", "PANTS-001", "JACKET-001"],
        }
        resp = client.post("/size/batch", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["results"]) == 3

    def test_batch_each_result_has_required_fields(self):
        """배치 결과 각 항목에 필수 필드 포함."""
        payload = {
            "body": FEMALE_S_BODY,
            "item_ids": ["TOP-002", "SKIRT-001"],
        }
        resp = client.post("/size/batch", json=payload)
        assert resp.status_code == 200
        for result in resp.json()["results"]:
            assert "recommended_size" in result
            assert "confidence" in result
            assert "alternatives" in result
            assert "reason" in result

    def test_batch_with_fit_preference(self):
        """배치 요청에 fit_preference 적용."""
        payload = {
            "body": MALE_M_BODY,
            "item_ids": ["TOP-001", "TOP-002"],
            "fit_preference": "slim",
        }
        resp = client.post("/size/batch", json=payload)
        assert resp.status_code == 200
        assert len(resp.json()["results"]) == 2

    def test_batch_response_time_under_1_second(self):
        """배치 응답 시간 1초 미만."""
        payload = {
            "body": MALE_M_BODY,
            "item_ids": ["TOP-001", "PANTS-001", "JACKET-001"],
        }
        start = time.time()
        resp = client.post("/size/batch", json=payload)
        elapsed = time.time() - start
        assert resp.status_code == 200
        assert elapsed < 1.0


# ── 단위 테스트: SizeRecommender ─────────────────────────────────

class TestSizeRecommenderUnit:
    def test_category_detection_top(self):
        """TOP 접두사 카테고리 감지."""
        from app.services.size_recommender import _get_category
        assert _get_category("TOP-001") == "TOP"
        assert _get_category("SHIRT-001") == "TOP"
        assert _get_category("TEE-001") == "TOP"

    def test_category_detection_bottom(self):
        """BOTTOM 접두사 카테고리 감지."""
        from app.services.size_recommender import _get_category
        assert _get_category("PANTS-001") == "BOTTOM"
        assert _get_category("SKIRT-001") == "BOTTOM"
        assert _get_category("JEANS-001") == "BOTTOM"

    def test_category_detection_outer(self):
        """OUTER 접두사 카테고리 감지."""
        from app.services.size_recommender import _get_category
        assert _get_category("JACKET-001") == "OUTER"
        assert _get_category("COAT-001") == "OUTER"

    def test_male_chart_larger_than_female(self):
        """남성 차트 기준값이 여성보다 큼."""
        from app.services.size_recommender import (
            TOP_SIZE_CHART_MALE,
            TOP_SIZE_CHART_FEMALE,
        )
        assert TOP_SIZE_CHART_MALE["M"]["chest_cm"] > TOP_SIZE_CHART_FEMALE["M"]["chest_cm"]

    @pytest.mark.parametrize("fit_preference,expected_relation", [
        ("slim", "lte"),
        ("loose", "gte"),
        ("regular", "eq"),
    ])
    def test_fit_preference_direction(self, fit_preference, expected_relation):
        """fit_preference 방향성 단위 검증."""
        from app.services.size_recommender import SizeRecommender, SIZE_ORDER
        from app.schemas.body import BodyInput

        body = BodyInput(**MALE_M_BODY)
        rec = SizeRecommender()

        regular_result = rec.recommend(body=body, item_id="TOP-001", fit_preference="regular")
        pref_result = rec.recommend(body=body, item_id="TOP-001", fit_preference=fit_preference)

        regular_idx = SIZE_ORDER.index(regular_result["recommended_size"])
        pref_idx = SIZE_ORDER.index(pref_result["recommended_size"])

        if expected_relation == "lte":
            assert pref_idx <= regular_idx
        elif expected_relation == "gte":
            assert pref_idx >= regular_idx
        else:
            assert pref_idx == regular_idx
