#!/usr/bin/env bash
set -euo pipefail
newman run smoke.postman_collection.json -e local.postman_environment.json
