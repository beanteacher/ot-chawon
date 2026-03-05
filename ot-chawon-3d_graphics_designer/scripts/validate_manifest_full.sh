#!/usr/bin/env bash
set -euo pipefail

manifest="${1:-assets/manifest-v0.csv}"
root="${2:-.}"

failed=0
while IFS=',' read -r brand item color lod filename target_size_mb; do
  if [ "$brand" = "brand" ]; then
    continue
  fi
  file_path="$root/$filename"
  if ! ./scripts/validate_name.sh "$filename" >/dev/null 2>&1; then
    echo "INVALID_NAME: $filename"
    failed=1
    continue
  fi
  if [ -f "$file_path" ]; then
    if ! ./scripts/validate_size.sh "$file_path" "$target_size_mb" >/dev/null 2>&1; then
      echo "INVALID_SIZE: $filename"
      failed=1
    else
      echo "OK: $filename"
    fi
  else
    echo "MISSING_FILE: $filename"
  fi
done < "$manifest"

exit $failed
