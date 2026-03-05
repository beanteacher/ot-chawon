#!/usr/bin/env bash
set -euo pipefail

manifest="${1:-assets/manifest-v0.csv}"
if [ ! -f "$manifest" ]; then
  echo "manifest not found: $manifest"
  exit 1
fi

failed=0
while IFS=',' read -r brand item color lod filename target; do
  if [ "$brand" = "brand" ]; then
    continue
  fi
  if ./scripts/validate_name.sh "$filename" >/dev/null 2>&1; then
    echo "OK: $filename"
  else
    echo "INVALID: $filename"
    failed=1
  fi
done < "$manifest"

exit $failed
