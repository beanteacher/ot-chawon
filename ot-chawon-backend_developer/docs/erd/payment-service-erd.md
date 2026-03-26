# payment-service ERD (otc_payment_db)

## 테이블 목록

- `payments`: 결제 정보
- `refunds`: 환불 정보

---

## payments

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| order_id | BIGINT | NOT NULL, UNIQUE | order-service의 orders.id (외부 참조, 1:1) |
| user_id | BIGINT | NOT NULL | user-service의 users.id (외부 참조) |
| pg_transaction_id | VARCHAR(255) | NULL | PG사 트랜잭션 ID |
| amount | INT | NOT NULL | 결제 금액 |
| status | VARCHAR(30) | NOT NULL, DEFAULT 'PENDING' | PENDING \| COMPLETED \| FAILED \| CANCELLED \| REFUNDED |
| payment_method | VARCHAR(50) | NULL | CARD \| VIRTUAL_ACCOUNT \| TRANSFER \| PHONE |
| paid_at | TIMESTAMP | NULL | 결제 완료 시각 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_payments_user_id`, `idx_payments_status`, `idx_payments_pg_transaction_id`

> Kafka `otc.order.created` 수신 시 레코드 생성. 결제 완료 시 `otc.payment.completed` 발행.

---

## refunds

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| payment_id | BIGINT | NOT NULL, FK(payments.id) | 결제 참조 |
| amount | INT | NOT NULL | 환불 금액 (전액 또는 부분) |
| reason | VARCHAR(500) | NULL | 환불 사유 |
| status | VARCHAR(30) | NOT NULL, DEFAULT 'REQUESTED' | REQUESTED \| COMPLETED \| FAILED |
| pg_refund_id | VARCHAR(255) | NULL | PG사 환불 트랜잭션 ID |
| refunded_at | TIMESTAMP | NULL | 환불 완료 시각 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## ERD 다이어그램

```
payments (1) ──── (N) refunds
```
