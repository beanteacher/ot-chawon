#!/usr/bin/env bash
# 전체 GLB 에셋 검증 스크립트
# 검증 항목:
#   1. 파일명 패턴: {BRAND}_{CATEGORY}_{ITEM}_{COLOR}_{LOD}.glb
#   2. 파일 크기: LOD0 5MB 이하
#   3. GLB 매직 바이트: 0x46546C67 (glTF)
# 사용법: bash scripts/validate_all.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

PASS=0
FAIL=0
ERRORS=()

# 파일명 패턴 정규식
NAME_PATTERN='^[A-Z][A-Z0-9]+_[A-Z]+_[A-Z]+_[A-Z]+_LOD[0-2]\.glb$'

# LOD별 최대 크기 (bytes)
MAX_LOD0=$((5 * 1024 * 1024))   # 5MB
MAX_LOD1=$((2 * 1024 * 1024))   # 2MB
MAX_LOD2=$((512 * 1024))        # 500KB

check_file() {
  local filepath="$1"
  local filename
  filename="$(basename "$filepath")"
  local ok=true

  # 1. 파일명 패턴 검사
  if ! echo "$filename" | grep -qP "$NAME_PATTERN" 2>/dev/null; then
    if ! echo "$filename" | grep -qE "$NAME_PATTERN" 2>/dev/null; then
      ERRORS+=("FAIL [파일명] $filename — 네이밍 규칙 위반")
      ok=false
    fi
  fi

  # 2. 파일 크기 검사
  local size
  size=$(stat -c%s "$filepath" 2>/dev/null || stat -f%z "$filepath" 2>/dev/null || echo 0)

  if echo "$filename" | grep -q '_LOD0\.glb$'; then
    if [ "$size" -gt "$MAX_LOD0" ]; then
      ERRORS+=("FAIL [크기] $filename — ${size} bytes > 5MB 초과")
      ok=false
    fi
  elif echo "$filename" | grep -q '_LOD1\.glb$'; then
    if [ "$size" -gt "$MAX_LOD1" ]; then
      ERRORS+=("FAIL [크기] $filename — ${size} bytes > 2MB 초과")
      ok=false
    fi
  elif echo "$filename" | grep -q '_LOD2\.glb$'; then
    if [ "$size" -gt "$MAX_LOD2" ]; then
      ERRORS+=("FAIL [크기] $filename — ${size} bytes > 500KB 초과")
      ok=false
    fi
  fi

  # 3. GLB 매직 바이트 검사 (첫 4바이트 = 0x676C5446 "glTF")
  local magic
  magic=$(dd if="$filepath" bs=1 count=4 2>/dev/null | xxd -p 2>/dev/null || hexdump -e '1/1 "%02x"' -n 4 "$filepath" 2>/dev/null || echo "")
  if [ -n "$magic" ] && [ "$magic" != "676c5446" ]; then
    ERRORS+=("FAIL [포맷] $filename — GLB 매직 바이트 불일치 (got: $magic)")
    ok=false
  fi

  if $ok; then
    echo "PASS  $filename (${size} bytes)"
    PASS=$((PASS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
}

echo "=== GLB 에셋 검증 시작 ==="
echo "대상 디렉터리: $ROOT/assets/"
echo ""

# 대상 파일 탐색
GLB_COUNT=0
while IFS= read -r -d '' f; do
  check_file "$f"
  GLB_COUNT=$((GLB_COUNT + 1))
done < <(find "$ROOT/assets" -name "*.glb" -print0 2>/dev/null)

echo ""
echo "=== 검증 결과 ==="
echo "총 파일: $GLB_COUNT  |  PASS: $PASS  |  FAIL: $FAIL"

if [ ${#ERRORS[@]} -gt 0 ]; then
  echo ""
  echo "오류 목록:"
  for err in "${ERRORS[@]}"; do
    echo "  $err"
  done
  exit 1
else
  if [ "$GLB_COUNT" -eq 0 ]; then
    echo ""
    echo "경고: GLB 파일을 찾을 수 없습니다. generate_glb.mjs를 먼저 실행하세요."
    exit 1
  fi
  echo ""
  echo "모든 검증 통과."
  exit 0
fi
