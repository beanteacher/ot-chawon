"""사이즈 추천 서비스 — 체형 측정값 기반 최적 사이즈 매칭."""
from typing import Literal
from app.schemas.body import BodyInput

SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"]

# TOP (상의): 가슴둘레/어깨너비 중심 — 여성 기준
TOP_SIZE_CHART_FEMALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 37.0, "chest_cm": 80.0, "waist_cm": 64.0, "hip_cm": 86.0},
    "S":   {"shoulder_cm": 39.0, "chest_cm": 86.0, "waist_cm": 70.0, "hip_cm": 90.0},
    "M":   {"shoulder_cm": 41.0, "chest_cm": 92.0, "waist_cm": 76.0, "hip_cm": 94.0},
    "L":   {"shoulder_cm": 43.0, "chest_cm": 98.0, "waist_cm": 82.0, "hip_cm": 98.0},
    "XL":  {"shoulder_cm": 46.0, "chest_cm": 104.0, "waist_cm": 88.0, "hip_cm": 102.0},
    "XXL": {"shoulder_cm": 49.0, "chest_cm": 110.0, "waist_cm": 94.0, "hip_cm": 106.0},
}

# TOP (상의): 가슴둘레/어깨너비 중심 — 남성 기준 (+4~6cm)
TOP_SIZE_CHART_MALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 41.0, "chest_cm": 86.0, "waist_cm": 70.0, "hip_cm": 90.0},
    "S":   {"shoulder_cm": 43.0, "chest_cm": 92.0, "waist_cm": 76.0, "hip_cm": 94.0},
    "M":   {"shoulder_cm": 46.0, "chest_cm": 98.0, "waist_cm": 82.0, "hip_cm": 98.0},
    "L":   {"shoulder_cm": 49.0, "chest_cm": 104.0, "waist_cm": 88.0, "hip_cm": 102.0},
    "XL":  {"shoulder_cm": 52.0, "chest_cm": 110.0, "waist_cm": 94.0, "hip_cm": 106.0},
    "XXL": {"shoulder_cm": 55.0, "chest_cm": 116.0, "waist_cm": 100.0, "hip_cm": 110.0},
}

# BOTTOM (하의): 허리둘레/엉덩이둘레 중심 — 여성 기준
BOTTOM_SIZE_CHART_FEMALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 37.0, "chest_cm": 80.0, "waist_cm": 60.0, "hip_cm": 84.0},
    "S":   {"shoulder_cm": 39.0, "chest_cm": 86.0, "waist_cm": 66.0, "hip_cm": 88.0},
    "M":   {"shoulder_cm": 41.0, "chest_cm": 92.0, "waist_cm": 72.0, "hip_cm": 92.0},
    "L":   {"shoulder_cm": 43.0, "chest_cm": 98.0, "waist_cm": 78.0, "hip_cm": 96.0},
    "XL":  {"shoulder_cm": 46.0, "chest_cm": 104.0, "waist_cm": 84.0, "hip_cm": 100.0},
    "XXL": {"shoulder_cm": 49.0, "chest_cm": 110.0, "waist_cm": 90.0, "hip_cm": 104.0},
}

# BOTTOM (하의): 허리둘레/엉덩이둘레 중심 — 남성 기준 (+4~6cm)
BOTTOM_SIZE_CHART_MALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 41.0, "chest_cm": 86.0, "waist_cm": 66.0, "hip_cm": 88.0},
    "S":   {"shoulder_cm": 43.0, "chest_cm": 92.0, "waist_cm": 72.0, "hip_cm": 92.0},
    "M":   {"shoulder_cm": 46.0, "chest_cm": 98.0, "waist_cm": 78.0, "hip_cm": 96.0},
    "L":   {"shoulder_cm": 49.0, "chest_cm": 104.0, "waist_cm": 84.0, "hip_cm": 100.0},
    "XL":  {"shoulder_cm": 52.0, "chest_cm": 110.0, "waist_cm": 90.0, "hip_cm": 104.0},
    "XXL": {"shoulder_cm": 55.0, "chest_cm": 116.0, "waist_cm": 96.0, "hip_cm": 108.0},
}

# OUTER (아우터): TOP 기준 + 여유분 추가 — 여성 기준
OUTER_SIZE_CHART_FEMALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 38.0, "chest_cm": 84.0, "waist_cm": 68.0, "hip_cm": 90.0},
    "S":   {"shoulder_cm": 40.0, "chest_cm": 90.0, "waist_cm": 74.0, "hip_cm": 94.0},
    "M":   {"shoulder_cm": 42.0, "chest_cm": 96.0, "waist_cm": 80.0, "hip_cm": 98.0},
    "L":   {"shoulder_cm": 44.0, "chest_cm": 102.0, "waist_cm": 86.0, "hip_cm": 102.0},
    "XL":  {"shoulder_cm": 47.0, "chest_cm": 108.0, "waist_cm": 92.0, "hip_cm": 106.0},
    "XXL": {"shoulder_cm": 50.0, "chest_cm": 114.0, "waist_cm": 98.0, "hip_cm": 110.0},
}

# OUTER (아우터): TOP 기준 + 여유분 추가 — 남성 기준
OUTER_SIZE_CHART_MALE: dict[str, dict[str, float]] = {
    "XS":  {"shoulder_cm": 42.0, "chest_cm": 90.0, "waist_cm": 74.0, "hip_cm": 94.0},
    "S":   {"shoulder_cm": 44.0, "chest_cm": 96.0, "waist_cm": 80.0, "hip_cm": 98.0},
    "M":   {"shoulder_cm": 47.0, "chest_cm": 102.0, "waist_cm": 86.0, "hip_cm": 102.0},
    "L":   {"shoulder_cm": 50.0, "chest_cm": 108.0, "waist_cm": 92.0, "hip_cm": 106.0},
    "XL":  {"shoulder_cm": 53.0, "chest_cm": 114.0, "waist_cm": 98.0, "hip_cm": 110.0},
    "XXL": {"shoulder_cm": 56.0, "chest_cm": 120.0, "waist_cm": 104.0, "hip_cm": 114.0},
}

# TOP 가중치: 가슴/어깨 중심
TOP_WEIGHTS = {
    "chest_cm": 0.40,
    "shoulder_cm": 0.35,
    "waist_cm": 0.15,
    "hip_cm": 0.10,
}

# BOTTOM 가중치: 허리/엉덩이 중심
BOTTOM_WEIGHTS = {
    "waist_cm": 0.45,
    "hip_cm": 0.35,
    "chest_cm": 0.10,
    "shoulder_cm": 0.10,
}

# OUTER 가중치: TOP과 동일하나 어깨 비중 소폭 상향
OUTER_WEIGHTS = {
    "chest_cm": 0.35,
    "shoulder_cm": 0.40,
    "waist_cm": 0.15,
    "hip_cm": 0.10,
}

# 기준 편차 (각 항목의 허용 최대 편차 cm — confidence 계산 기준)
REFERENCE_DEVIATION = {
    "chest_cm": 6.0,
    "waist_cm": 6.0,
    "shoulder_cm": 3.0,
    "hip_cm": 4.0,
}

# item_id 접두사 → 카테고리 매핑
_CATEGORY_PREFIXES: dict[str, str] = {
    "TOP": "TOP",
    "SHIRT": "TOP",
    "BLOUSE": "TOP",
    "TEE": "TOP",
    "KNIT": "TOP",
    "BOTTOM": "BOTTOM",
    "PANTS": "BOTTOM",
    "SKIRT": "BOTTOM",
    "JEANS": "BOTTOM",
    "SHORTS": "BOTTOM",
    "OUTER": "OUTER",
    "JACKET": "OUTER",
    "COAT": "OUTER",
    "PADDING": "OUTER",
}


def _get_category(item_id: str) -> str:
    """item_id 기반 카테고리 반환: TOP / BOTTOM / OUTER."""
    upper = item_id.upper()
    for prefix, category in _CATEGORY_PREFIXES.items():
        if upper.startswith(prefix):
            return category
    return "TOP"  # 기본값


def _get_chart(category: str, gender: str) -> dict[str, dict[str, float]]:
    """카테고리·성별에 맞는 사이즈 차트 반환."""
    is_male = gender == "male"
    if category == "BOTTOM":
        return BOTTOM_SIZE_CHART_MALE if is_male else BOTTOM_SIZE_CHART_FEMALE
    if category == "OUTER":
        return OUTER_SIZE_CHART_MALE if is_male else OUTER_SIZE_CHART_FEMALE
    return TOP_SIZE_CHART_MALE if is_male else TOP_SIZE_CHART_FEMALE


def _get_weights(category: str) -> dict[str, float]:
    """카테고리별 가중치 반환."""
    if category == "BOTTOM":
        return BOTTOM_WEIGHTS
    if category == "OUTER":
        return OUTER_WEIGHTS
    return TOP_WEIGHTS


def _compute_weighted_distance(
    body: BodyInput,
    size_key: str,
    chart: dict[str, dict[str, float]],
    weights: dict[str, float],
) -> float:
    """체형과 사이즈 기준값 간 가중 유클리드 거리."""
    chart_vals = chart[size_key]
    body_vals = {
        "shoulder_cm": body.shoulder_cm,
        "chest_cm": body.chest_cm,
        "waist_cm": body.waist_cm,
        "hip_cm": body.hip_cm,
    }
    dist = sum(
        weights[k] * abs(body_vals[k] - chart_vals[k])
        for k in weights
    )
    return dist


def _compute_confidence(
    body: BodyInput,
    size_key: str,
    chart: dict[str, dict[str, float]],
    weights: dict[str, float],
) -> float:
    """추천 사이즈에 대한 신뢰도 계산 (0~1)."""
    chart_vals = chart[size_key]
    body_vals = {
        "shoulder_cm": body.shoulder_cm,
        "chest_cm": body.chest_cm,
        "waist_cm": body.waist_cm,
        "hip_cm": body.hip_cm,
    }
    weighted_deviation = sum(
        weights[k] * (abs(body_vals[k] - chart_vals[k]) / REFERENCE_DEVIATION[k])
        for k in weights
    )
    confidence = max(0.0, 1.0 - weighted_deviation)
    return round(confidence, 4)


def _build_reason(
    body: BodyInput,
    size_key: str,
    chart: dict[str, dict[str, float]],
) -> list[str]:
    """추천 근거 문자열 생성."""
    chart_vals = chart[size_key]
    reasons = []
    fields = {
        "chest_cm": "가슴둘레",
        "waist_cm": "허리둘레",
        "shoulder_cm": "어깨너비",
        "hip_cm": "엉덩이둘레",
    }
    body_vals = {
        "shoulder_cm": body.shoulder_cm,
        "chest_cm": body.chest_cm,
        "waist_cm": body.waist_cm,
        "hip_cm": body.hip_cm,
    }
    for field, label in fields.items():
        diff = body_vals[field] - chart_vals[field]
        if abs(diff) < 0.5:
            reasons.append(f"{label} 기준치 일치")
        elif diff > 0:
            reasons.append(f"{label} +{diff:.1f}cm 여유")
        else:
            reasons.append(f"{label} {diff:.1f}cm (약간 여유)")
    return reasons


def _apply_fit_preference(
    recommended: str,
    fit_preference: str,
) -> str:
    """fit_preference에 따라 사이즈 조정."""
    idx = SIZE_ORDER.index(recommended)
    if fit_preference == "slim" and idx > 0:
        return SIZE_ORDER[idx - 1]
    if fit_preference == "loose" and idx < len(SIZE_ORDER) - 1:
        return SIZE_ORDER[idx + 1]
    return recommended


class SizeRecommender:
    """사이즈 추천 클래스 — 카테고리·성별별 사이즈 차트 기반 최근접 매칭."""

    def recommend(
        self,
        body: BodyInput,
        item_id: str,
        fit_preference: Literal["slim", "regular", "loose"] = "regular",
    ) -> dict:
        """
        체형 측정값과 아이템 ID를 받아 최적 사이즈를 추천합니다.

        Args:
            body: 사용자 체형 입력
            item_id: 의류 아이템 ID (카테고리 분류에 사용)
            fit_preference: 핏 선호도 — slim/regular/loose

        Returns:
            {
                "recommended_size": "L",
                "confidence": 0.87,
                "alternatives": ["M", "XL"],
                "reason": [...],
            }
        """
        category = _get_category(item_id)
        chart = _get_chart(category, body.gender)
        weights = _get_weights(category)

        # 각 사이즈별 거리 계산
        distances = {
            size: _compute_weighted_distance(body, size, chart, weights)
            for size in SIZE_ORDER
        }

        # 거리 기준 정렬
        sorted_sizes = sorted(SIZE_ORDER, key=lambda s: distances[s])
        base_recommended = sorted_sizes[0]
        alternatives_base = sorted_sizes[1:3]  # 차선 2개

        # fit_preference 반영
        recommended = _apply_fit_preference(base_recommended, fit_preference)

        # 최종 recommended가 바뀌었으면 alternatives 재계산
        if recommended != base_recommended:
            alts = [s for s in sorted_sizes if s != recommended][:2]
        else:
            alts = alternatives_base

        confidence = _compute_confidence(body, recommended, chart, weights)
        reason = _build_reason(body, recommended, chart)

        return {
            "recommended_size": recommended,
            "confidence": confidence,
            "alternatives": alts,
            "reason": reason,
            "category": category,
        }

    def get_size_chart(self, item_id: str, gender: str) -> dict[str, dict[str, float]]:
        """아이템 카테고리·성별에 맞는 사이즈 차트를 반환합니다."""
        category = _get_category(item_id)
        return _get_chart(category, gender)
