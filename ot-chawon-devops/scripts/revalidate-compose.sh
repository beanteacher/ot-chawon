#!/usr/bin/env bash
set -euo pipefail

echo '[1/3] docker version'
docker --version

echo '[2/3] compose version'
docker compose version

echo '[3/3] compose config validation'
docker compose -f docker-compose.yml config >/tmp/otc_compose_rendered.yml

echo 'OK: compose validation passed'
