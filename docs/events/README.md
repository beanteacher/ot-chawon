# 옷차원 Kafka 이벤트 개요

## 1. 이벤트 아키텍처 개요

옷차원(ot-chawon)은 MSA 구조에서 서비스 간 비동기 통신을 위해 Apache Kafka를 사용합니다.
서비스 간 직접 동기 호출 체인이 3단계를 초과하거나, 상태 변경의 결합을 줄여야 하는 경우 Kafka 이벤트로 처리합니다.

### 토픽 명명 규칙

```
otc.{서비스명}.{이벤트명}
```

예: `otc.order.created`, `otc.payment.completed`, `otc.fitting.completed`

### 컨슈머 그룹 명명 규칙

```
{서비스명}-group
```

예: `payment-service-group`, `order-service-group`, `product-service-group`

### 페이로드 규칙

- 직렬화 포맷: JSON
- 필드 네이밍: camelCase
- 모든 이벤트에 공통 메타데이터 포함 (eventId, eventType, timestamp, version, source)

---

## 2. 전체 이벤트 목록

| 토픽명 | 프로듀서 | 컨슈머 | 설명 |
|--------|---------|--------|------|
| `otc.order.created` | order-service | payment-service | 주문 생성 → 결제 요청 트리거 |
| `otc.payment.completed` | payment-service | order-service | 결제 완료 → 주문 확정 처리 |
| `otc.order.confirmed` | order-service | product-service | 주문 확정 → 재고 차감 |
| `otc.order.cancelled` | order-service | payment-service | 주문 취소 → 환불 처리 |
| `otc.fitting.completed` | fitting-service | user-service | 피팅 완료 → 사용자 피팅 이력 업데이트 |
| `otc.fitting.requested` | fitting-service | AI 추론 서버 | 피팅 요청 → AI 추론 서버 작업 큐 |
| `otc.product.updated` | product-service | (캐시 레이어) | 상품 정보 변경 → 캐시 무효화 |

---

## 3. 이벤트 흐름 다이어그램

### 3-1. 주문 → 결제 흐름

```
[사용자]
  │
  ▼ POST /api/v1/orders
[order-service]
  │  주문 생성 (상태: PENDING → PAYMENT_REQUESTED)
  │
  ├──► [Kafka] otc.order.created
  │              │
  │              ▼
  │        [payment-service]  (컨슈머 그룹: payment-service-group)
  │              │  PG사 결제 처리
  │              │
  │              ├──► 결제 성공: [Kafka] otc.payment.completed
  │              │                    │
  │              │                    ▼
  │              │              [order-service]  (컨슈머 그룹: order-service-group)
  │              │                    │  주문 상태: PAID
  │              │                    │
  │              │                    ├──► [Kafka] otc.order.confirmed
  │              │                    │                 │
  │              │                    │                 ▼
  │              │                    │           [product-service]  (컨슈머 그룹: product-service-group)
  │              │                    │                 │  재고 차감
  │              │                    │
  │              └──► 결제 실패: 주문 상태: CANCELLED
```

### 3-2. 주문 취소 → 환불 흐름

```
[사용자]
  │
  ▼ POST /api/v1/orders/{id}/cancel
[order-service]
  │  주문 상태: CANCELLED / REFUNDED
  │
  └──► [Kafka] otc.order.cancelled
                    │
                    ▼
              [payment-service]  (컨슈머 그룹: payment-service-group)
                    │  환불 처리 (전액/부분)
```

### 3-3. 피팅 요청 흐름

```
[사용자]
  │
  ▼ POST /api/v1/fitting/requests
[fitting-service]
  │  피팅 요청 생성 (상태: PENDING)
  │
  ├──► [Kafka] otc.fitting.requested
  │                  │
  │                  ▼
  │           [AI 추론 서버]  (컨슈머 그룹: ai-inference-group)
  │                  │  3D 피팅 추론 수행
  │                  │  완료 시 fitting-service REST 콜백 또는 결과 저장
  │
  └── 피팅 완료 시 ──► [Kafka] otc.fitting.completed
                              │
                              ▼
                        [user-service]  (컨슈머 그룹: user-service-group)
                              │  피팅 이력 업데이트
```

### 3-4. 상품 업데이트 → 캐시 무효화 흐름

```
[브랜드 어드민]
  │
  ▼ PATCH /api/v1/products/{id}
[product-service]
  │  상품 정보 변경
  │
  └──► [Kafka] otc.product.updated
                    │
                    ▼
              [캐시 레이어 / BFF]  (컨슈머 그룹: cache-invalidation-group)
                    │  Redis 캐시 무효화
```

---

## 4. 프로듀서 / 컨슈머 매핑 테이블

| 토픽명 | 프로듀서 서비스 | 컨슈머 서비스 | 컨슈머 그룹 |
|--------|--------------|-------------|-----------|
| `otc.order.created` | order-service (8083) | payment-service (8084) | `payment-service-group` |
| `otc.payment.completed` | payment-service (8084) | order-service (8083) | `order-service-group` |
| `otc.order.confirmed` | order-service (8083) | product-service (8082) | `product-service-group` |
| `otc.order.cancelled` | order-service (8083) | payment-service (8084) | `payment-service-group` |
| `otc.fitting.completed` | fitting-service (8085) | user-service (8081) | `user-service-group` |
| `otc.fitting.requested` | fitting-service (8085) | AI 추론 서버 | `ai-inference-group` |
| `otc.product.updated` | product-service (8082) | 캐시 레이어 | `cache-invalidation-group` |

---

## 5. 상세 문서 링크

- [이벤트 스키마 상세](./event-schemas.md) - 각 토픽별 JSON 페이로드 스키마
- [에러 처리 전략](./error-handling.md) - DLQ, 재시도, 멱등성 보장
