"""SMPL-X 어댑터 추상 클래스 — 실제 모델과 Mock 구현의 공통 인터페이스."""
from abc import ABC, abstractmethod
import numpy as np

try:
    import trimesh
except ImportError:
    trimesh = None  # type: ignore


class SMPLXAdapter(ABC):
    """SMPL-X 메쉬 생성 추상 인터페이스."""

    @abstractmethod
    def generate_mesh(self, betas: np.ndarray, pose: str) -> "trimesh.Trimesh":
        """
        shape 벡터(betas)와 pose를 받아 body mesh를 반환합니다.

        Args:
            betas: 10D SMPL-X shape 파라미터 벡터
            pose: 'a-pose' | 't-pose'

        Returns:
            trimesh.Trimesh 객체
        """

    @abstractmethod
    def get_joint_positions(self, betas: np.ndarray) -> np.ndarray:
        """
        betas로부터 24개 관절 위치를 반환합니다.

        Args:
            betas: 10D shape 파라미터 벡터

        Returns:
            shape (24, 3) numpy 배열 (미터 단위)
        """
