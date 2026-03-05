#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 <filename.glb>"
  exit 1
fi

name=$(basename "$1")
pattern='^[A-Z0-9]+_[A-Z0-9]+_[A-Z0-9]+_(HIGH|MID|LOW)\.glb$'
if [[ "$name" =~ $pattern ]]; then
  echo "OK: $name"
else
  echo "INVALID: $name"
  exit 2
fi
