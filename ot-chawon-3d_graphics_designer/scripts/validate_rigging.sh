#!/usr/bin/env bash
# validate_rigging.sh: SMPL-24 리깅 GLB 유효성 검사
# - skins 존재 확인
# - joint count = 24 확인
# - 파일 크기 5MB 이하 확인

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

RIGGED_ASSETS=(
  "$ROOT/assets/clothing/top/MUSINSA_TOP_TSHIRT_BLACK_RIGGED.glb"
  "$ROOT/assets/clothing/bottom/MUSINSA_BOTTOM_PANTS_NAVY_RIGGED.glb"
  "$ROOT/assets/clothing/outer/MUSINSA_OUTER_COAT_BEIGE_RIGGED.glb"
)

MAX_SIZE_BYTES=$((5 * 1024 * 1024))  # 5MB
PASS=0
FAIL=0

echo "=== SMPL-24 리깅 GLB 유효성 검사 ==="
echo ""

for glb in "${RIGGED_ASSETS[@]}"; do
  filename=$(basename "$glb")
  echo "--- $filename ---"

  # 1. 파일 존재 확인
  if [ ! -f "$glb" ]; then
    echo "  [FAIL] 파일 없음: $glb"
    FAIL=$((FAIL + 1))
    continue
  fi

  # 2. 파일 크기 확인 (5MB 이하)
  file_size=$(wc -c < "$glb")
  if [ "$file_size" -le "$MAX_SIZE_BYTES" ]; then
    echo "  [PASS] 파일 크기: ${file_size} bytes (<= 5MB)"
  else
    echo "  [FAIL] 파일 크기: ${file_size} bytes (5MB 초과)"
    FAIL=$((FAIL + 1))
    continue
  fi

  # 3. GLB JSON 파싱: skins 존재 확인 + joint count 확인
  result=$(GLB_PATH="$glb" node --eval "
    const fs = require('fs');
    const buf = fs.readFileSync(process.env.GLB_PATH);

    // GLB 헤더 파싱
    const magic = buf.readUInt32LE(0);
    if (magic !== 0x46546C67) {
      console.log('FAIL:not_glb');
      process.exit(0);
    }

    // JSON chunk 추출 (offset 12)
    const jsonChunkLen = buf.readUInt32LE(12);
    const jsonChunkType = buf.readUInt32LE(16);
    if (jsonChunkType !== 0x4E4F534A) {
      console.log('FAIL:no_json_chunk');
      process.exit(0);
    }
    const jsonStr = buf.slice(20, 20 + jsonChunkLen).toString('utf8').replace(/\0+\$/, '').trimEnd();
    const gltf = JSON.parse(jsonStr);

    // skins 배열 존재 확인
    if (!gltf.skins || gltf.skins.length === 0) {
      console.log('FAIL:no_skins');
      process.exit(0);
    }

    // joint count 확인
    const jointCount = gltf.skins[0].joints ? gltf.skins[0].joints.length : 0;
    if (jointCount !== 24) {
      console.log('FAIL:joint_count=' + jointCount);
      process.exit(0);
    }

    // JOINTS_0 + WEIGHTS_0 어트리뷰트 존재 확인
    const prim = gltf.meshes && gltf.meshes[0] && gltf.meshes[0].primitives && gltf.meshes[0].primitives[0];
    if (!prim || (prim.attributes.JOINTS_0 === undefined)) {
      console.log('FAIL:no_JOINTS_0');
      process.exit(0);
    }
    if (!prim || (prim.attributes.WEIGHTS_0 === undefined)) {
      console.log('FAIL:no_WEIGHTS_0');
      process.exit(0);
    }

    console.log('PASS:joints=' + jointCount + ':skin=' + gltf.skins[0].name);
  " 2>&1)

  if [[ "$result" == PASS:* ]]; then
    echo "  [PASS] GLB 구조: skins 존재, ${result#PASS:}"
    PASS=$((PASS + 1))
  else
    echo "  [FAIL] GLB 구조: ${result#FAIL:}"
    FAIL=$((FAIL + 1))
  fi

  echo ""
done

echo "=== 결과: PASS=$PASS, FAIL=$FAIL ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
