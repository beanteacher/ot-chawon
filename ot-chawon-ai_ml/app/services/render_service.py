"""렌더링 서비스 — trimesh + Pillow 기반 Mock 렌더러."""
import io
from typing import Optional

import numpy as np

try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    trimesh = None  # type: ignore
    TRIMESH_AVAILABLE = False

try:
    from PIL import Image, ImageDraw
    PILLOW_AVAILABLE = True
except ImportError:
    Image = None  # type: ignore
    ImageDraw = None  # type: ignore
    PILLOW_AVAILABLE = False


def _parse_resolution(resolution: str) -> tuple[int, int]:
    """'1080x1080' 형식을 (width, height) 튜플로 변환."""
    try:
        w, h = resolution.lower().split("x")
        return int(w), int(h)
    except Exception:
        return 512, 512


def _generate_placeholder_image(
    angle: int,
    width: int,
    height: int,
    mesh_info: Optional[dict] = None,
) -> bytes:
    """단색 placeholder PNG 이미지 생성 (Pillow)."""
    if not PILLOW_AVAILABLE:
        # Pillow 없을 때 최소 PNG 바이트 반환
        import zlib
        import struct

        def make_png(w: int, h: int) -> bytes:
            def chunk(name: bytes, data: bytes) -> bytes:
                c = zlib.crc32(name + data) & 0xFFFFFFFF
                return struct.pack(">I", len(data)) + name + data + struct.pack(">I", c)

            sig = b"\x89PNG\r\n\x1a\n"
            ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            raw = b"\x00" + b"\xff\x80\x80" * w  # 분홍빛 행
            idat = chunk(b"IDAT", zlib.compress(raw * h))
            iend = chunk(b"IEND", b"")
            return sig + ihdr + idat + iend

        return make_png(min(width, 128), min(height, 128))

    # 각도별 색상 팔레트
    angle_colors = {
        0: (180, 200, 230),    # 전면: 연파랑
        90: (200, 180, 230),   # 우측: 연보라
        180: (180, 230, 200),  # 후면: 연초록
        270: (230, 200, 180),  # 좌측: 연주황
    }
    bg_color = angle_colors.get(angle % 360, (200, 200, 200))

    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # 실루엣 더미 (타원형 몸통)
    cx, cy = width // 2, height // 2
    body_w = int(width * 0.25)
    body_h = int(height * 0.45)
    draw.ellipse(
        [cx - body_w, cy - body_h, cx + body_w, cy + body_h],
        fill=(120, 100, 90),
        outline=(80, 60, 50),
        width=2,
    )

    # 머리
    head_r = int(width * 0.08)
    draw.ellipse(
        [cx - head_r, cy - body_h - head_r * 2, cx + head_r, cy - body_h],
        fill=(220, 180, 140),
        outline=(160, 120, 80),
        width=2,
    )

    # 각도 텍스트
    draw.text((10, 10), f"angle={angle}°", fill=(50, 50, 50))
    if mesh_info:
        draw.text((10, 30), f"verts={mesh_info.get('vertices', '?')}", fill=(50, 50, 50))

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


class RenderService:
    """의류 피팅 씬 렌더링 서비스."""

    def render_scene(
        self,
        mesh: "trimesh.Trimesh | None",
        angles: list[int],
        resolution: str,
    ) -> dict[str, bytes]:
        """
        메쉬를 지정 각도에서 렌더링하여 PNG 바이트 맵 반환.

        Args:
            mesh: trimesh.Trimesh 객체 (None이면 placeholder만 생성)
            angles: 렌더링 각도 목록 (도 단위)
            resolution: '1080x1080' 형식 해상도 문자열

        Returns:
            {"0": <bytes>, "90": <bytes>, ...} — 각도별 PNG 바이트
        """
        width, height = _parse_resolution(resolution)
        mesh_info = None

        if mesh is not None and TRIMESH_AVAILABLE:
            try:
                mesh_info = {
                    "vertices": len(mesh.vertices),
                    "faces": len(mesh.faces),
                }
            except Exception:
                pass

        result: dict[str, bytes] = {}
        for angle in angles:
            img_bytes = _generate_placeholder_image(angle, width, height, mesh_info)
            result[str(angle)] = img_bytes

        return result

    def render_from_vertices(
        self,
        vertices: np.ndarray,
        faces: Optional[np.ndarray],
        angles: list[int],
        resolution: str,
    ) -> dict[str, bytes]:
        """
        버텍스 배열로부터 직접 렌더링.

        Args:
            vertices: shape (N, 3)
            faces: shape (F, 3) 또는 None
            angles: 각도 목록
            resolution: 해상도 문자열

        Returns:
            각도별 PNG 바이트 맵
        """
        mesh = None
        if TRIMESH_AVAILABLE and vertices is not None:
            try:
                if faces is not None:
                    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
                else:
                    mesh = trimesh.PointCloud(vertices)
            except Exception:
                pass

        return self.render_scene(mesh, angles, resolution)
