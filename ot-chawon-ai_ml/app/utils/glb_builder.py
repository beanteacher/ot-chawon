"""GLB 빌더 — trimesh.Trimesh를 GLB 바이너리로 변환하고 PBR 머티리얼을 적용합니다."""
import io
import numpy as np

try:
    import trimesh
    from trimesh.visual.material import PBRMaterial
except ImportError as e:
    raise ImportError("trimesh가 설치되어 있지 않습니다. pip install trimesh") from e


# 피부톤 기본 색상 (RGBA, 0-255)
SKIN_COLOR_RGBA = [210, 180, 140, 255]


def build_avatar_glb(mesh: "trimesh.Trimesh", joints: np.ndarray) -> bytes:
    """
    trimesh.Trimesh와 관절 위치를 받아 GLB 바이너리를 반환합니다.

    Args:
        mesh: body mesh (trimesh.Trimesh)
        joints: shape (24, 3) 관절 위치 배열

    Returns:
        GLB 포맷 bytes
    """
    # ── PBR 머티리얼 적용 ──────────────────────────────────────────────────
    skin_color = np.array(SKIN_COLOR_RGBA, dtype=np.uint8)
    pbr_material = PBRMaterial(
        baseColorFactor=skin_color / 255.0,
        metallicFactor=0.0,
        roughnessFactor=0.8,
        name="skin_material",
    )
    mesh.visual = trimesh.visual.TextureVisuals(material=pbr_material)

    # ── 관절을 Point Cloud로 씬에 추가 ────────────────────────────────────
    scene = trimesh.Scene()
    scene.add_geometry(mesh, node_name="body_mesh")

    # 관절 포인트를 작은 구로 표현
    for i, joint_pos in enumerate(joints):
        joint_sphere = trimesh.creation.icosphere(subdivisions=1, radius=0.015)
        joint_sphere.apply_translation(joint_pos)
        # 관절은 붉은색으로 표시
        joint_sphere.visual.vertex_colors = np.array([255, 80, 80, 200], dtype=np.uint8)
        scene.add_geometry(joint_sphere, node_name=f"joint_{i:02d}")

    # ── GLB 직렬화 ────────────────────────────────────────────────────────
    glb_buffer = io.BytesIO()
    scene.export(glb_buffer, file_type="glb")
    return glb_buffer.getvalue()
