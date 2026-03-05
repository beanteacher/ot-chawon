#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] user-service"
( cd backend-java/user-service && mvn spring-boot:run )

echo "[2/5] product-service"
( cd backend-java/product-service && mvn spring-boot:run )

echo "[3/5] order-service"
( cd backend-java/order-service && mvn spring-boot:run )

echo "[4/5] gateway"
( cd backend-java/gateway && mvn spring-boot:run )

echo "[5/5] nextjs-bff"
( cd nextjs-bff && npm run dev )
