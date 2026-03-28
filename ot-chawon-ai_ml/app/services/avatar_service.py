"""AvatarService — 체형 파라미터에서 SMPL-X 아바타 GLB를 생성합니다."""
import time
import base64
import numpy as np
from app.schemas.body import BodyInput
from app.services.smplx_adapter import SMPLXAdapter
from app.services.smplx_mock import MockSMPLXAdapter
from app.utils.glb_builder import build_avatar_glb


def _body_to_betas(body: BodyInput) -> np.ndarray:
    """
    체형 파라미터를 10D SMPL-X shape 벡터(betas)로 변환합니다.

    변환 로직:
      beta[0]: 신장 — 평균 170cm 기준 정규화
      beta[1]: 체중 — 평균 65kg 기준 정규화
      beta[2]: 어깨너비 — 평균 42cm 기준
      beta[3]: 가슴둘레 — 평균 90cm 기준
      beta[4]: 허리둘레 — 평균 75cm 기준
      beta[5]: 엉덩이둘레 — 평균 92cm 기준
      beta[6]: 성별 인코딩 (male=0.5, female=-0.5)
      beta[7~9]: 0 (미사용 — 실제 SMPL-X 모델용 예약)
    """
    avg_height = 170.0
    avg_weight = 65.0
    avg_shoulder = 42.0
    avg_chest = 90.0
    avg_waist = 75.0
    avg_hip = 92.0

    betas = np.zeros(10, dtype=np.float32)
    betas[0] = (body.height_cm - avg_height) / 30.0
    betas[1] = (body.weight_kg - avg_weight) / 30.0
    betas[2] = (body.shoulder_cm - avg_shoulder) / 10.0
    betas[3] = (body.chest_cm - avg_chest) / 20.0
    betas[4] = (body.waist_cm - avg_waist) / 20.0
    betas[5] = (body.hip_cm - avg_hip) / 20.0
    betas[6] = 0.5 if body.gender == "male" else -0.5

    # betas 범위 클리핑 (-3 ~ 3)
    betas = np.clip(betas, -3.0, 3.0)
    return betas


class AvatarService:
    """SMPL-X 아바타 생성 서비스."""

    def __init__(self, adapter: SMPLXAdapter | None = None):
        self._adapter: SMPLXAdapter = adapter or MockSMPLXAdapter()

    async def generate_avatar(self, body: BodyInput, pose: str) -> dict:
        """
        체형 파라미터와 포즈로 아바타 GLB를 생성합니다.

        Returns:
            {
                "glb_bytes": bytes,
                "vertex_count": int,
                "joint_count": int,
                "glb_size_bytes": int,
                "generation_time_ms": float,
                "betas": list[float],
            }
        """
        start = time.monotonic()

        betas = _body_to_betas(body)

        mesh = self._adapter.generate_mesh(betas, pose)
        joints = self._adapter.get_joint_positions(betas)

        glb_bytes = build_avatar_glb(mesh, joints)

        elapsed_ms = (time.monotonic() - start) * 1000.0

        return {
            "glb_bytes": glb_bytes,
            "vertex_count": len(mesh.vertices),
            "joint_count": len(joints),
            "glb_size_bytes": len(glb_bytes),
            "generation_time_ms": round(elapsed_ms, 2),
            "betas": betas.tolist(),
        }
