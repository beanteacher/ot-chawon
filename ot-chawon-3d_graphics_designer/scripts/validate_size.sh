#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <file.glb> <max_mb>"
  exit 1
fi

file="$1"
max_mb="$2"
if [ ! -f "$file" ]; then
  echo "file not found: $file"
  exit 1
fi

size_bytes=$(stat -c%s "$file")
max_bytes=$((max_mb * 1024 * 1024))

if [ "$size_bytes" -le "$max_bytes" ]; then
  echo "OK: $file"
else
  echo "TOO_LARGE: $file"
  exit 2
fi
