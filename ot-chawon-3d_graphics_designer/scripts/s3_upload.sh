#!/usr/bin/env bash
# S3 업로드 스크립트
# 의존성: AWS CLI 설치 및 자격증명 설정
# 환경변수: AWS_BUCKET, AWS_REGION
# 사용법: bash scripts/s3_upload.sh [파일경로 또는 "all"]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"

# 환경변수 검사
if [ -z "${AWS_BUCKET:-}" ]; then
  echo "오류: AWS_BUCKET 환경변수가 설정되지 않았습니다." >&2
  exit 1
fi
if [ -z "${AWS_REGION:-}" ]; then
  echo "오류: AWS_REGION 환경변수가 설정되지 않았습니다." >&2
  exit 1
fi

S3_BASE="s3://${AWS_BUCKET}/assets/clothing"

upload_file() {
  local filepath="$1"
  local filename
  filename="$(basename "$filepath")"
  local s3_key="${S3_BASE}/${filename}"

  echo "업로드 중: $filename -> $s3_key"
  aws s3 cp "$filepath" "$s3_key" \
    --region "$AWS_REGION" \
    --content-type "model/gltf-binary" \
    --metadata "brand=$(echo "$filename" | cut -d_ -f1),category=$(echo "$filename" | cut -d_ -f2)"

  echo "  완료: $s3_key"
}

if [ $# -ge 1 ] && [ "$1" != "all" ]; then
  upload_file "$1"
else
  echo "=== 일괄 S3 업로드 시작 ==="
  echo "버킷: s3://${AWS_BUCKET}  |  리전: ${AWS_REGION}"
  echo ""

  UPLOADED=0
  while IFS= read -r -d '' f; do
    upload_file "$f"
    UPLOADED=$((UPLOADED + 1))
  done < <(find "$ROOT/assets/brand" -name "*.glb" -print0 2>/dev/null)

  echo ""
  echo "업로드 완료: ${UPLOADED}개 파일"
fi
