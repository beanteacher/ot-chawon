# Backend Day1 - Service Boundary/API/DB v0

## Service Boundary
- auth-user-service: 인증, 사용자 기본 프로필
- product-service: 상품/카테고리/옵션/에셋 메타
- order-service: 장바구니 이후 주문 생성/상태

## API v0 (<=10)
- POST /api/v1/auth/login
- POST /api/v1/auth/refresh
- GET /api/v1/users/me
- PATCH /api/v1/users/me
- GET /api/v1/products
- GET /api/v1/products/{id}
- POST /api/v1/products
- PATCH /api/v1/products/{id}
- POST /api/v1/orders
- GET /api/v1/orders/{id}

## DB Core Tables
- auth-user-db: users, refresh_tokens
- product-db: products, product_options, product_assets, categories
- order-db: orders, order_items, order_status_history
