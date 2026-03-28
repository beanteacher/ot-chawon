"""사이즈 추천 서비스 — 체형 측정값 기반 최적 사이즈 매칭."""
from app.schemas.body import BodyInput

# 사이즈 차트: 각 사이즈별 기준 측정값 (cm)
# 여성/남성 공용 참고 기준 (브랜드마다 상이하나 일반 기준값 사용)
SIZE_CHART: dict[str, dict[str, float]] = {
    "XS": {"shoulder_cm": 38.0, "chest_cm": 82.0, "waist_cm": 66.0, "hip_cm": 88.0},
    "S":  {"shoulder_cm": 40.0, "chest_cm": 88.0, "waist_cm": 72.0, "hip_cm": 92.0},
    "M":  {"shoulder_cm": 43.0, "chest_cm": 94.0, "waist_cm": 78.0, "hip_cm": 96.0},
    "L":  {"shoulder_cm": 46.0, "chest_cm": 100.0, "waist_cm": 84.0, "hip_cm": 100.0},
    "XL": {"shoulder_cm": 49.0, "chest_cm": 106.0, "waist_cm": 90.0, "hip_cm": 104.0},
    "XXL": {"shoulder_cm": 52.0, "chest_cm": 112.0, "waist_cm": 96.0, "hip_cm": 108.0},
}

SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"]

# 각 측정 항목의 가중치 (합 = 1.0)
WEIGHTS = {
    "chest_cm": 0.35,
    "waist_cm": 0.30,
    "shoulder_cm": 0.20,
    "hip_cm": 0.15,
}

# 기준 편차 (각 항목의 허용 최대 편차 cm — confidence 계산 기준)
REFERENCE_DEVIATION = {
    "chest_cm": 6.0,
    "waist_cm": 6.0,
    "shoulder_cm": 3.0,
    "hip_cm": 4.0,
}


def _compute_weighted_distance(body: BodyInput, size_key: str) -> float:
    """체형과 사이즈 기준값 간 가중 유클리드 거리."""
    chart = SIZE_CHART[size_key]
    body_vals = {
        "shoulder_cm": body.shoulder_cm,
        "chest_cm": body.chest_cm,
        "waist_cm": body.waist_cm,
        "hip_cm": body.hip_cm,
    }
    dist = sum(
        WEIGHTS[k] * abs(body_vals[k] - chart[k])
        for k in WEIGHTS
    )
    return dist


def _compute_confidence(body: BodyInput, size_key: str) -> float:
    """추천 사이즈에 대한 신뢰도 계산 (0~1)."""
    chart = SIZE_CHART[size_key]
    body_vals = {
        "shoulder_cm": body.shoulder_cm,
        "chest_cm": body.chest_cm,
        "waist_cm": body.waist_cm,
        "hip_cm": body.hip_cm,
    }
    weighted_deviation = sum(
        WEIGHTS[k] * (abs(body_vals[k] - chart[k]) / REFERENCE_DEVIATION[k])
        for k in WEIGHTS
    )
    confidence = max(0.0, 1.0 - weighted_deviation)
    return round(confidence, 4)


def _build_reason(body: BodyInput, size_key: str) -> list[str]:
    """추천 근거 문자열 생성."""
    chart = SIZE_CHART[size_key]
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
        diff = body_vals[field] - chart[field]
        if abs(diff) < 0.5:
            reasons.append(f"{label} 기준치 일치")
        elif diff > 0:
            reasons.append(f"{label} +{diff:.1f}cm 여유")
        else:
            reasons.append(f"{label} {diff:.1f}cm (약간 여유)")
    return reasons


class SizeRecommender:
    """사이즈 추천 클래스 — 사이즈 차트 기반 최근접 매칭."""

    def recommend(self, body: BodyInput, item_id: str) -> dict:
        """
        체형 측정값과 아이템 ID를 받아 최적 사이즈를 추천합니다.

        Args:
            body: 사용자 체형 입력
            item_id: 의류 아이템 ID (미래 아이템별 차트 확장 대비)

        Returns:
            {
                "recommended_size": "L",
                "confidence": 0.87,
                "alternatives": ["M", "XL"],
                "reason": [...],
            }
        """
        # 각 사이즈별 거리 계산
        distances = {
            size: _compute_weighted_distance(body, size)
            for size in SIZE_ORDER
        }

        # 거리 기준 정렬
        sorted_sizes = sorted(SIZE_ORDER, key=lambda s: distances[s])
        recommended = sorted_sizes[0]
        alternatives = sorted_sizes[1:3]  # 차선 2개

        confidence = _compute_confidence(body, recommended)
        reason = _build_reason(body, recommended)

        return {
            "recommended_size": recommended,
            "confidence": confidence,
            "alternatives": alternatives,
            "reason": reason,
        }
