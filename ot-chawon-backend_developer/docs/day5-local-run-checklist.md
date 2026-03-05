# Day5 Local Run Checklist (Backend)

## Start order
1. user-service (8081)
2. product-service (8082)
3. order-service (8083)
4. gateway (8080)
5. nextjs-bff (3000)

## Quick checks
- GET http://localhost:8081/api/v1/users/me
- GET http://localhost:8082/api/v1/products
- POST http://localhost:8083/api/v1/orders
- GET http://localhost:8080/api/v1/products (gateway route)
