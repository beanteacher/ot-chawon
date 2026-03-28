"""CI/테스트용 MockSMPLXAdapter — trimesh 기반 parametric capsule body 생성."""
import numpy as np
from app.services.smplx_adapter import SMPLXAdapter

try:
    import trimesh
    from trimesh.creation import capsule, cylinder
except ImportError as e:
    raise ImportError("trimesh가 설치되어 있지 않습니다. pip install trimesh") from e


class MockSMPLXAdapter(SMPLXAdapter):
    """
    PyTorch/SMPL-X 없이 동작하는 Mock 어댑터.
    trimesh의 Capsule/Cylinder를 조합해 간소화된 바디 모델을 생성합니다.
    """

    # SMPL-X 표준 신체 비율 상수 (신장 대비)
    _HEAD_RATIO = 0.13
    _TORSO_RATIO = 0.35
    _LEG_RATIO = 0.47
    _ARM_RATIO = 0.33
    _NECK_RATIO = 0.05

    def generate_mesh(self, betas: np.ndarray, pose: str) -> "trimesh.Trimesh":
        """체형 파라미터 기반 capsule body mesh 생성."""
        height_m, torso_r, hip_r, shoulder_r, arm_r, leg_r = self._betas_to_dims(betas)

        meshes: list["trimesh.Trimesh"] = []

        # ── 머리 ──────────────────────────────────────────────────────────────
        head_r = height_m * 0.09
        head_h = height_m * self._HEAD_RATIO
        head_z = height_m * 0.91
        head = capsule(radius=head_r, height=head_h)
        head.apply_translation([0, 0, head_z])
        meshes.append(head)

        # ── 목 ───────────────────────────────────────────────────────────────
        neck_r = head_r * 0.5
        neck_h = height_m * self._NECK_RATIO
        neck_z = height_m * 0.86
        neck_mesh = cylinder(radius=neck_r, height=neck_h)
        neck_mesh.apply_translation([0, 0, neck_z])
        meshes.append(neck_mesh)

        # ── 상체 (torso) ──────────────────────────────────────────────────────
        torso_h = height_m * self._TORSO_RATIO
        torso_z = height_m * 0.53 + torso_h / 2
        torso = capsule(radius=torso_r, height=torso_h)
        torso.apply_translation([0, 0, height_m * 0.53])
        meshes.append(torso)

        # ── 골반/엉덩이 ──────────────────────────────────────────────────────
        pelvis_h = height_m * 0.08
        pelvis = capsule(radius=hip_r, height=pelvis_h)
        pelvis.apply_translation([0, 0, height_m * 0.47])
        meshes.append(pelvis)

        # ── 팔 (좌우 대칭) ────────────────────────────────────────────────────
        arm_h = height_m * self._ARM_RATIO
        arm_offset_y = shoulder_r + arm_r
        arm_z = height_m * 0.73

        for side in (-1, 1):
            arm = capsule(radius=arm_r, height=arm_h)
            # 팔은 Y축 방향으로 회전
            arm.apply_transform(trimesh.transformations.rotation_matrix(
                np.pi / 2 if pose == "t-pose" else np.pi / 4,
                [0, 0, 1]
            ))
            if pose == "t-pose":
                arm.apply_translation([side * (shoulder_r + arm_h / 2), 0, arm_z])
            else:
                # a-pose: 약 45도 각도
                arm.apply_translation([side * arm_offset_y * 1.2, 0, arm_z - arm_h * 0.3])
            meshes.append(arm)

        # ── 다리 (좌우 대칭) ──────────────────────────────────────────────────
        leg_h = height_m * self._LEG_RATIO
        leg_offset_x = hip_r * 0.5
        leg_z = height_m * 0.47 - leg_h / 2

        for side in (-1, 1):
            leg = capsule(radius=leg_r, height=leg_h)
            leg.apply_translation([side * leg_offset_x, 0, leg_z])
            meshes.append(leg)

        # ── 메쉬 합치기 ──────────────────────────────────────────────────────
        combined = trimesh.util.concatenate(meshes)
        combined = trimesh.Trimesh(
            vertices=combined.vertices,
            faces=combined.faces,
            process=True,
        )
        return combined

    def get_joint_positions(self, betas: np.ndarray) -> np.ndarray:
        """24개 관절 위치를 신장 비례로 수학적으로 계산 (미터 단위)."""
        height_m = self._get_height_m(betas)
        h = height_m

        # SMPL 표준 24개 관절 위치 정의 (Z=높이, X=좌우, Y=전후)
        joints = np.array([
            [0.0,    0.0,    h * 0.47],   # 0: 골반 (root)
            [-0.09,  0.0,    h * 0.47],   # 1: 왼쪽 엉덩이
            [0.09,   0.0,    h * 0.47],   # 2: 오른쪽 엉덩이
            [0.0,    0.0,    h * 0.55],   # 3: 척추1
            [-0.09,  0.0,    h * 0.27],   # 4: 왼쪽 무릎
            [0.09,   0.0,    h * 0.27],   # 5: 오른쪽 무릎
            [0.0,    0.0,    h * 0.63],   # 6: 척추2
            [-0.09,  0.0,    h * 0.05],   # 7: 왼쪽 발목
            [0.09,   0.0,    h * 0.05],   # 8: 오른쪽 발목
            [0.0,    0.0,    h * 0.70],   # 9: 척추3
            [-0.10,  0.02,   h * 0.02],   # 10: 왼쪽 발
            [0.10,   0.02,   h * 0.02],   # 11: 오른쪽 발
            [0.0,    0.0,    h * 0.80],   # 12: 목
            [-0.16,  0.0,    h * 0.76],   # 13: 왼쪽 어깨
            [0.16,   0.0,    h * 0.76],   # 14: 오른쪽 어깨
            [0.0,    0.0,    h * 0.86],   # 15: 머리
            [-0.28,  0.0,    h * 0.73],   # 16: 왼쪽 팔꿈치
            [0.28,   0.0,    h * 0.73],   # 17: 오른쪽 팔꿈치
            [-0.40,  0.0,    h * 0.60],   # 18: 왼쪽 손목
            [0.40,   0.0,    h * 0.60],   # 19: 오른쪽 손목
            [-0.43,  0.02,   h * 0.57],   # 20: 왼쪽 손
            [0.43,   0.02,   h * 0.57],   # 21: 오른쪽 손
            [-0.44,  0.02,   h * 0.55],   # 22: 왼쪽 손끝
            [0.44,   0.02,   h * 0.55],   # 23: 오른쪽 손끝
        ], dtype=np.float32)

        return joints

    # ── 내부 헬퍼 ────────────────────────────────────────────────────────────

    def _get_height_m(self, betas: np.ndarray) -> float:
        """betas[0]에서 신장(m) 복원. 기본 평균 1.70m."""
        base_height = 1.70
        return float(base_height + betas[0] * 0.20)

    def _betas_to_dims(self, betas: np.ndarray) -> tuple:
        """betas 벡터에서 주요 신체 치수(미터)를 추출."""
        height_m = self._get_height_m(betas)
        # betas[1]: 체중 인자 (radius 스케일)
        weight_factor = 1.0 + float(betas[1]) * 0.15
        torso_r = 0.16 * weight_factor
        hip_r = 0.14 * weight_factor
        shoulder_r = 0.19 * weight_factor
        arm_r = 0.04 * weight_factor
        leg_r = 0.07 * weight_factor
        return height_m, torso_r, hip_r, shoulder_r, arm_r, leg_r
