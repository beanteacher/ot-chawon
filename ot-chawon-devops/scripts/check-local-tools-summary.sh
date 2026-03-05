#!/usr/bin/env bash
set -euo pipefail

missing=0
for cmd in docker python3 npm newman pytest; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "OK,$cmd"
  else
    echo "MISSING,$cmd"
    missing=1
  fi
done

if [ "$missing" -eq 0 ]; then
  echo "SUMMARY,READY"
else
  echo "SUMMARY,BLOCKED"
fi
