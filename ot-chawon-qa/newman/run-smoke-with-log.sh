#!/usr/bin/env bash
set -euo pipefail

out="${1:-../docs/smoke-last-run.log}"
mkdir -p "$(dirname "$out")"

newman run smoke.postman_collection.json -e local.postman_environment.json | tee "$out"
