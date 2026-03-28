#!/usr/bin/env bash
# Draco 압축 스크립트
# 의존성: npm install -g gltf-pipeline
# 사용법: bash scripts/draco_compress.sh [입력파일] [출력파일]
#         인자 없이 실행 시 assets/ 하위 모든 GLB를 대상으로 일괄 압축

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

# Draco quantization 비트 설정 (glb-format-spec.md 기준)
DRACO_POSITION=14
DRACO_NORMAL=10
DRACO_TEXCOORD=12

compress_glb() {
  local input="$1"
  local output="${2:-${input%.glb}_draco.glb}"

  echo "압축 중: $input -> $output"
  gltf-pipeline \
    -i "$input" \
    -o "$output" \
    --draco.compressionLevel 7 \
    --draco.quantizePositionBits "$DRACO_POSITION" \
    --draco.quantizeNormalBits "$DRACO_NORMAL" \
    --draco.quantizeTexcoordBits "$DRACO_TEXCOORD"

  local size
  size=$(stat -c%s "$output" 2>/dev/null || stat -f%z "$output")
  echo "  완료: $(basename "$output") (${size} bytes)"

  if [ "$size" -gt $((5 * 1024 * 1024)) ]; then
    echo "  경고: 파일 크기 5MB 초과 — 최적화 필요" >&2
  fi
}

if [ $# -ge 1 ]; then
  # 단일 파일 모드
  compress_glb "$1" "${2:-}"
else
  # 일괄 모드: assets/ 하위 모든 *_LOD*.glb
  echo "일괄 Draco 압축 시작: $ROOT/assets/"
  find "$ROOT/assets" -name "*_LOD*.glb" ! -name "*_draco.glb" | while read -r f; do
    compress_glb "$f"
  done
  echo "일괄 압축 완료."
fi
