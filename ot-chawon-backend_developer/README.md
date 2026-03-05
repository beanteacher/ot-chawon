# ot-chawon-backend_developer

Backend implementation baseline for Ot-chawon.

## Structure
- `backend-java/gateway`: Spring Cloud Gateway (port 8080)
- `backend-java/user-service`: Spring Boot user/auth API (port 8081)
- `backend-java/product-service`: Spring Boot product API (port 8082)
- `backend-java/order-service`: Spring Boot order API (port 8083)
- `nextjs-bff`: Next.js 14 BFF/SSR baseline (port 3000)

## Current scope
- Minimal source baseline to match architecture decision: Java/Spring for core APIs, Next.js for read BFF.
- API response envelope format: `{ success, data, message, traceId }`.
