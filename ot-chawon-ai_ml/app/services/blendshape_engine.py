"""체형 기반 의류 메쉬 변형 엔진 — SMPL 24 joints 영역별 블렌드쉐이프."""
import numpy as np
from app.schemas.body import BodyInput

# SMPL 24 joints 인덱스 기반 영역 분류
# 0:pelvis, 1:left_hip, 2:right_hip, 3:spine1, 4:left_knee, 5:right_knee,
# 6:spine2, 7:left_ankle, 8:right_ankle, 9:spine3, 10:left_foot, 11:right_foot,
# 12:neck, 13:left_collar, 14:right_collar, 15:head,
# 16:left_shoulder, 17:right_shoulder, 18:left_elbow, 19:right_elbow,
# 20:left_wrist, 21:right_wrist, 22:left_hand, 23:right_hand

# 신체 영역 기준 Y 좌표 비율 (정규화된 메쉬 기준, 단위: 비율)
REGION_Y_BOUNDS = {
    "shoulder": (0.75, 1.0),   # 어깨 ~ 머리
    "chest": (0.55, 0.75),     # 가슴 영역
    "waist": (0.40, 0.55),     # 허리 영역
    "hip": (0.25, 0.40),       # 엉덩이 영역
    "upper_arm": (0.60, 0.80), # 상완 (XZ 오프셋이 큰 경우)
    "lower_body": (0.0, 0.25), # 다리 영역
}

# 기준 체형 (M 사이즈 남성 기준)
REFERENCE_BODY = {
    "shoulder_cm": 44.0,
    "chest_cm": 96.0,
    "waist_cm": 80.0,
    "hip_cm": 95.0,
    "height_cm": 175.0,
}


class BlendShapeEngine:
    """체형 비율 기반 의류 메쉬 변형 클래스."""

    def __init__(self, reference: dict | None = None):
        self.reference = reference or REFERENCE_BODY

    def apply_deformation(
        self,
        clothing_vertices: np.ndarray,
        avatar_bounds: dict,
        body: BodyInput,
    ) -> np.ndarray:
        """
        의류 메쉬 버텍스를 체형에 맞게 변형합니다.

        Args:
            clothing_vertices: shape (N, 3) — 의류 메쉬 버텍스 좌표 (X, Y, Z)
            avatar_bounds: {"min": [x,y,z], "max": [x,y,z]} — 아바타 바운딩 박스
            body: 사용자 체형 입력

        Returns:
            변형된 버텍스 np.ndarray, shape (N, 3)
        """
        if clothing_vertices.shape[1] != 3:
            raise ValueError(f"clothing_vertices must be shape (N, 3), got {clothing_vertices.shape}")

        verts = clothing_vertices.copy().astype(np.float64)
        n_verts = verts.shape[0]

        # 체형 스케일 비율 계산
        shoulder_ratio = body.shoulder_cm / self.reference["shoulder_cm"]
        chest_ratio = body.chest_cm / self.reference["chest_cm"]
        waist_ratio = body.waist_cm / self.reference["waist_cm"]
        hip_ratio = body.hip_cm / self.reference["hip_cm"]
        height_ratio = body.height_cm / self.reference["height_cm"]

        # 바운딩 박스에서 Y 범위 계산
        y_min = avatar_bounds.get("min", [0, 0, 0])[1]
        y_max = avatar_bounds.get("max", [0, 2, 0])[1]
        y_range = y_max - y_min if y_max != y_min else 1.0

        # 각 버텍스의 정규화된 Y 위치 (0~1)
        y_norm = (verts[:, 1] - y_min) / y_range

        # 높이 스케일링 (Y축)
        verts[:, 1] = verts[:, 1] * height_ratio

        # 영역별 XZ 스케일링 (둘레 기반)
        for i in range(n_verts):
            y = y_norm[i]

            if REGION_Y_BOUNDS["shoulder"][0] <= y <= REGION_Y_BOUNDS["shoulder"][1]:
                scale_xz = shoulder_ratio
            elif REGION_Y_BOUNDS["chest"][0] <= y < REGION_Y_BOUNDS["chest"][1]:
                # 어깨→가슴 선형 보간
                t = (y - REGION_Y_BOUNDS["chest"][0]) / (
                    REGION_Y_BOUNDS["chest"][1] - REGION_Y_BOUNDS["chest"][0]
                )
                scale_xz = chest_ratio + t * (shoulder_ratio - chest_ratio)
            elif REGION_Y_BOUNDS["waist"][0] <= y < REGION_Y_BOUNDS["waist"][1]:
                # 가슴→허리 선형 보간
                t = (y - REGION_Y_BOUNDS["waist"][0]) / (
                    REGION_Y_BOUNDS["waist"][1] - REGION_Y_BOUNDS["waist"][0]
                )
                scale_xz = waist_ratio + t * (chest_ratio - waist_ratio)
            elif REGION_Y_BOUNDS["hip"][0] <= y < REGION_Y_BOUNDS["hip"][1]:
                # 허리→힙 선형 보간
                t = (y - REGION_Y_BOUNDS["hip"][0]) / (
                    REGION_Y_BOUNDS["hip"][1] - REGION_Y_BOUNDS["hip"][0]
                )
                scale_xz = hip_ratio + t * (waist_ratio - hip_ratio)
            else:
                # 하체는 hip 비율 유지
                scale_xz = hip_ratio

            verts[i, 0] *= scale_xz
            verts[i, 2] *= scale_xz

        return verts

    def compute_ratios(self, body: BodyInput) -> dict:
        """체형 비율 딕셔너리 반환 (디버깅/로깅용)."""
        return {
            "shoulder_ratio": body.shoulder_cm / self.reference["shoulder_cm"],
            "chest_ratio": body.chest_cm / self.reference["chest_cm"],
            "waist_ratio": body.waist_cm / self.reference["waist_cm"],
            "hip_ratio": body.hip_cm / self.reference["hip_cm"],
            "height_ratio": body.height_cm / self.reference["height_cm"],
        }
