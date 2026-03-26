# order-service ERD (otc_order_db)

## 테이블 목록

- `carts`: 사용자별 장바구니
- `cart_items`: 장바구니 항목
- `orders`: 주문
- `order_items`: 주문 항목 (스냅샷)

---

## carts

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | NOT NULL, UNIQUE | user-service의 users.id (외부 참조, 1:1) |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## cart_items

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| cart_id | BIGINT | NOT NULL, FK(carts.id) | 장바구니 참조 |
| product_id | BIGINT | NOT NULL | product-service의 products.id (외부 참조) |
| product_option_id | BIGINT | NOT NULL | product-service의 product_options.id (외부 참조) |
| quantity | INT | NOT NULL, DEFAULT 1 | 수량 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## orders

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | NOT NULL | user-service의 users.id (외부 참조) |
| status | VARCHAR(30) | NOT NULL, DEFAULT 'PENDING' | 주문 상태 |
| total_price | INT | NOT NULL | 총 결제 금액 |
| shipping_address | VARCHAR(500) | NOT NULL | 배송지 |
| tracking_number | VARCHAR(100) | NULL | 운송장 번호 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**주문 상태 흐름**:
```
PENDING → PAYMENT_REQUESTED → PAID → SHIPPING → DELIVERED → COMPLETED
                    ↓
               CANCELLED (결제 전)
                    ↓
                REFUNDED (결제 후)
```

---

## order_items

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| order_id | BIGINT | NOT NULL, FK(orders.id) | 주문 참조 |
| product_id | BIGINT | NOT NULL | product-service의 products.id (외부 참조) |
| product_option_id | BIGINT | NOT NULL | product-service의 product_options.id (외부 참조) |
| product_name | VARCHAR(255) | NOT NULL | 주문 시점 상품명 스냅샷 |
| unit_price | INT | NOT NULL | 주문 시점 단가 스냅샷 |
| quantity | INT | NOT NULL | 수량 |

> `product_name`, `unit_price`는 주문 시점 스냅샷. 상품 정보 변경 시에도 주문 이력 보존.

---

## ERD 다이어그램

```
carts      (1) ──── (N) cart_items
orders     (1) ──── (N) order_items
```
