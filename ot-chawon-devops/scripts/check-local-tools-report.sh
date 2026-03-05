#!/usr/bin/env bash
set -euo pipefail

out="${1:-docs/local-tools-report.md}"
mkdir -p "$(dirname "$out")"

{
  echo "# Local Tools Report"
  echo
  for cmd in docker python3 npm newman pytest; do
    if command -v "$cmd" >/dev/null 2>&1; then
      echo "- OK: $cmd"
    else
      echo "- MISSING: $cmd"
    fi
  done
} > "$out"

echo "written: $out"
