"""피팅 서비스 — 체형 → 아바타 → 의류 변형 → 렌더링 파이프라인."""
import time
import logging
from pathlib import Path
from typing import Optional

import numpy as np

from app.schemas.body import BodyInput
from app.schemas.fit import FitResult, RenderOptions
from app.services.blendshape_engine import BlendShapeEngine
from app.services.render_service import RenderService
from app.services.size_recommender import SizeRecommender

logger = logging.getLogger(__name__)

try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    trimesh = None  # type: ignore
    TRIMESH_AVAILABLE = False

# 로컬 GLB 에셋 기본 경로 (없으면 Mock 메쉬 사용)
ASSETS_DIR = Path(__file__).parent.parent.parent / "assets" / "clothing"


def _load_clothing_mesh(item_id: str) -> Optional["trimesh.Trimesh"]:
    """item_id로 의류 GLB 로드. 파일 없으면 Mock 메쉬 반환."""
    if TRIMESH_AVAILABLE:
        # 로컬 파일 탐색
        for ext in [".glb", ".obj", ".ply"]:
            path = ASSETS_DIR / f"{item_id}{ext}"
            if path.exists():
                try:
                    scene = trimesh.load(str(path))
                    if isinstance(scene, trimesh.Scene):
                        meshes = list(scene.geometry.values())
                        if meshes:
                            return trimesh.util.concatenate(meshes)
                    elif isinstance(scene, trimesh.Trimesh):
                        return scene
                except Exception as e:
                    logger.warning("GLB 로드 실패 item_id=%s: %s", item_id, e)

        # 로컬 파일 없을 때 Mock 의류 메쉬 생성
        return _create_mock_clothing_mesh()
    return None


def _create_mock_clothing_mesh() -> Optional["trimesh.Trimesh"]:
    """trimesh 사용 가능 시 Mock 의류 메쉬(박스) 생성."""
    if not TRIMESH_AVAILABLE:
        return None
    try:
        # 단순 박스로 상의 형태 근사
        mesh = trimesh.creation.box(extents=[0.5, 0.7, 0.3])
        # 상체 위치로 이동
        mesh.apply_translation([0, 1.1, 0])
        return mesh
    except Exception as e:
        logger.warning("Mock 메쉬 생성 실패: %s", e)
        return None


def _get_avatar_bounds(body: BodyInput) -> dict:
    """체형 기반 아바타 바운딩 박스 추정."""
    height_m = body.height_cm / 100.0
    return {
        "min": [-0.3, 0.0, -0.2],
        "max": [0.3, height_m, 0.2],
    }


def _build_glb_url(item_id: str, job_id: str) -> str:
    """피팅 결과 GLB URL 생성 (CDN 또는 로컬 경로)."""
    return f"/static/fits/{job_id}/{item_id}_fitted.glb"


def _build_render_urls(render_bytes: dict[str, bytes], job_id: str) -> dict[str, str]:
    """렌더 바이트 맵을 URL 맵으로 변환."""
    return {
        angle: f"/static/fits/{job_id}/render_{angle}deg.png"
        for angle in render_bytes
    }


class FittingService:
    """의류 피팅 추론 파이프라인 서비스."""

    def __init__(self):
        self.blendshape_engine = BlendShapeEngine()
        self.render_service = RenderService()
        self.size_recommender = SizeRecommender()

    async def fit_clothing(
        self,
        body: BodyInput,
        item_id: str,
        render_options: RenderOptions,
        job_id: str = "local",
    ) -> FitResult:
        """
        의류 피팅 전체 파이프라인 실행.

        파이프라인:
          1. body → avatar bounds 계산
          2. item_id → 의류 메쉬 로드
          3. BlendShapeEngine으로 메쉬 변형
          4. RenderService로 다각도 렌더링
          5. SizeRecommender로 사이즈 추천
          6. FitResult 반환

        Args:
            body: 사용자 체형 입력
            item_id: 의류 아이템 ID
            render_options: 렌더 각도 및 해상도 옵션
            job_id: 작업 ID (URL 경로 생성용)

        Returns:
            FitResult (renders URL 맵, glb_url, size_recommendation)
        """
        t_start = time.monotonic()
        logger.info("피팅 시작 item_id=%s job_id=%s", item_id, job_id)

        # 1. 아바타 바운딩 박스 계산
        avatar_bounds = _get_avatar_bounds(body)

        # 2. 의류 메쉬 로드
        clothing_mesh = _load_clothing_mesh(item_id)

        # 3. 메쉬 변형
        fitted_mesh = clothing_mesh
        if clothing_mesh is not None and TRIMESH_AVAILABLE:
            try:
                deformed_verts = self.blendshape_engine.apply_deformation(
                    clothing_vertices=np.array(clothing_mesh.vertices),
                    avatar_bounds=avatar_bounds,
                    body=body,
                )
                fitted_mesh = trimesh.Trimesh(
                    vertices=deformed_verts,
                    faces=clothing_mesh.faces,
                    process=False,
                )
                logger.info("BlendShape 변형 완료: %d verts", len(deformed_verts))
            except Exception as e:
                logger.warning("BlendShape 변형 실패, 원본 메쉬 사용: %s", e)
                fitted_mesh = clothing_mesh

        # 4. 렌더링
        render_bytes = self.render_service.render_scene(
            mesh=fitted_mesh,
            angles=render_options.angles,
            resolution=render_options.resolution,
        )
        render_urls = _build_render_urls(render_bytes, job_id)

        # 5. 사이즈 추천
        size_rec = self.size_recommender.recommend(body=body, item_id=item_id)

        elapsed_ms = int((time.monotonic() - t_start) * 1000)
        logger.info("피팅 완료 job_id=%s elapsed=%dms", job_id, elapsed_ms)

        return FitResult(
            renders=render_urls,
            glb_url=_build_glb_url(item_id, job_id),
            size_recommendation=size_rec,
        )
