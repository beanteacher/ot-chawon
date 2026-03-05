#!/usr/bin/env bash
set -euo pipefail

for url in \
  http://localhost:8081/api/v1/users/me \
  http://localhost:8082/api/v1/products \
  http://localhost:8083/api/v1/orders/1 \
  http://localhost:8080/api/v1/products; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
  echo "$code $url"
done
