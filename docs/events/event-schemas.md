# Kafka 이벤트 스키마 상세

## 공통 메타데이터

모든 이벤트 페이로드는 아래 공통 메타데이터 필드를 포함합니다.

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "otc.order.created",
  "timestamp": "2026-03-26T10:15:30.000Z",
  "version": "1.0",
  "source": "order-service"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `eventId` | string (UUID v4) | 필수 | 이벤트 고유 식별자, 멱등성 보장에 사용 |
| `eventType` | string | 필수 | 토픽명과 동일 |
| `timestamp` | string (ISO 8601) | 필수 | 이벤트 발행 시각 (UTC) |
| `version` | string | 필수 | 스키마 버전 (현재: "1.0") |
| `source` | string | 필수 | 이벤트를 발행한 서비스명 |

---

## 버전 관리 정책

- 스키마 버전은 `version` 필드로 관리합니다 (Semantic Versioning의 MAJOR.MINOR).
- **하위 호환 변경** (필드 추가, 선택 필드 변경): MINOR 버전 증가 (예: `1.0` → `1.1`).
- **파괴적 변경** (필드 삭제, 타입 변경, 필드명 변경): MAJOR 버전 증가 (예: `1.0` → `2.0`).
- MAJOR 버전이 변경되면 신규 토픽을 생성하고 기존 토픽은 최소 2주간 병행 운영 후 deprecated.
- 컨슈머는 `version` 필드를 반드시 확인하고, 알 수 없는 MAJOR 버전은 DLQ로 이동.

---

## 1. otc.order.created

**프로듀서**: order-service
**컨슈머**: payment-service (그룹: `payment-service-group`)
**목적**: 주문 생성 시 결제 서비스에 결제 준비를 트리거합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440001",
  "eventType": "otc.order.created",
  "timestamp": "2026-03-26T10:15:30.000Z",
  "version": "1.0",
  "source": "order-service",
  "orderId": 10042,
  "userId": 305,
  "totalAmount": 89000,
  "currency": "KRW",
  "items": [
    {
      "productId": 721,
      "productName": "슬림 핏 데님 재킷",
      "optionId": 1043,
      "optionName": "M / 인디고 블루",
      "quantity": 1,
      "unitPrice": 89000
    }
  ],
  "shippingAddress": {
    "recipient": "홍길동",
    "phone": "010-1234-5678",
    "zipCode": "06235",
    "address": "서울시 강남구 테헤란로 123",
    "addressDetail": "456동 789호"
  },
  "orderCreatedAt": "2026-03-26T10:15:29.500Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `orderId` | number | 필수 | order-service의 주문 PK |
| `userId` | number | 필수 | 주문한 사용자 ID |
| `totalAmount` | number | 필수 | 결제 요청 총액 (원 단위) |
| `currency` | string | 필수 | 통화 코드 (현재 "KRW" 고정) |
| `items` | array | 필수 | 주문 상품 목록 (최소 1개) |
| `items[].productId` | number | 필수 | 상품 ID |
| `items[].productName` | string | 필수 | 상품명 (결제 내역 표시용) |
| `items[].optionId` | number | 선택 | 옵션 ID (옵션 없는 상품은 null) |
| `items[].optionName` | string | 선택 | 옵션명 (예: "M / 블랙") |
| `items[].quantity` | number | 필수 | 주문 수량 |
| `items[].unitPrice` | number | 필수 | 단품 가격 |
| `shippingAddress` | object | 필수 | 배송지 정보 |
| `shippingAddress.recipient` | string | 필수 | 수령인 이름 |
| `shippingAddress.phone` | string | 필수 | 수령인 연락처 |
| `shippingAddress.zipCode` | string | 필수 | 우편번호 |
| `shippingAddress.address` | string | 필수 | 기본 주소 |
| `shippingAddress.addressDetail` | string | 선택 | 상세 주소 |
| `orderCreatedAt` | string (ISO 8601) | 필수 | 주문 생성 시각 |

---

## 2. otc.payment.completed

**프로듀서**: payment-service
**컨슈머**: order-service (그룹: `order-service-group`)
**목적**: PG사 결제 완료 후 주문 서비스에 주문 확정을 알립니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440002",
  "eventType": "otc.payment.completed",
  "timestamp": "2026-03-26T10:16:05.000Z",
  "version": "1.0",
  "source": "payment-service",
  "paymentId": 8801,
  "orderId": 10042,
  "userId": 305,
  "paidAmount": 89000,
  "currency": "KRW",
  "paymentMethod": "CARD",
  "pgTransactionId": "toss_20260326_10042_abc123",
  "pgProvider": "TOSS_PAYMENTS",
  "paidAt": "2026-03-26T10:16:04.800Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `paymentId` | number | 필수 | payment-service의 결제 PK |
| `orderId` | number | 필수 | 연관 주문 ID |
| `userId` | number | 필수 | 결제한 사용자 ID |
| `paidAmount` | number | 필수 | 실제 결제된 금액 (원 단위) |
| `currency` | string | 필수 | 통화 코드 ("KRW" 고정) |
| `paymentMethod` | string | 필수 | 결제 수단 (CARD / VIRTUAL_ACCOUNT / TRANSFER) |
| `pgTransactionId` | string | 필수 | PG사 트랜잭션 고유 ID |
| `pgProvider` | string | 필수 | PG사 식별자 (TOSS_PAYMENTS 등) |
| `paidAt` | string (ISO 8601) | 필수 | 결제 완료 시각 |

---

## 3. otc.order.confirmed

**프로듀서**: order-service
**컨슈머**: product-service (그룹: `product-service-group`)
**목적**: 결제 확정 후 product-service에 재고 차감을 요청합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440003",
  "eventType": "otc.order.confirmed",
  "timestamp": "2026-03-26T10:16:10.000Z",
  "version": "1.0",
  "source": "order-service",
  "orderId": 10042,
  "userId": 305,
  "items": [
    {
      "productId": 721,
      "optionId": 1043,
      "quantity": 1
    }
  ],
  "confirmedAt": "2026-03-26T10:16:09.900Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `orderId` | number | 필수 | 확정된 주문 ID |
| `userId` | number | 필수 | 주문한 사용자 ID |
| `items` | array | 필수 | 재고 차감 대상 상품 목록 |
| `items[].productId` | number | 필수 | 상품 ID |
| `items[].optionId` | number | 선택 | 옵션 ID (null이면 기본 재고 차감) |
| `items[].quantity` | number | 필수 | 차감할 수량 |
| `confirmedAt` | string (ISO 8601) | 필수 | 주문 확정 시각 |

---

## 4. otc.order.cancelled

**프로듀서**: order-service
**컨슈머**: payment-service (그룹: `payment-service-group`)
**목적**: 주문 취소 시 payment-service에 환불 처리를 요청합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440004",
  "eventType": "otc.order.cancelled",
  "timestamp": "2026-03-26T11:00:00.000Z",
  "version": "1.0",
  "source": "order-service",
  "orderId": 10042,
  "userId": 305,
  "cancelReason": "고객 변심",
  "refundAmount": 89000,
  "refundType": "FULL",
  "paymentId": 8801,
  "cancelledAt": "2026-03-26T10:59:59.000Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `orderId` | number | 필수 | 취소된 주문 ID |
| `userId` | number | 필수 | 주문한 사용자 ID |
| `cancelReason` | string | 선택 | 취소 사유 |
| `refundAmount` | number | 필수 | 환불 금액 (원 단위) |
| `refundType` | string | 필수 | 환불 유형 (FULL / PARTIAL) |
| `paymentId` | number | 선택 | 결제 ID (결제 전 취소 시 null) |
| `cancelledAt` | string (ISO 8601) | 필수 | 주문 취소 시각 |

---

## 5. otc.fitting.completed

**프로듀서**: fitting-service
**컨슈머**: user-service (그룹: `user-service-group`)
**목적**: AI 피팅 추론 완료 후 user-service에 피팅 이력을 저장합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440005",
  "eventType": "otc.fitting.completed",
  "timestamp": "2026-03-26T10:30:00.000Z",
  "version": "1.0",
  "source": "fitting-service",
  "fittingRequestId": 2201,
  "userId": 305,
  "productId": 721,
  "resultStatus": "DONE",
  "resultImageUrl": "https://cdn.otchawon.com/fitting/results/2201_result.png",
  "resultGlbUrl": "https://cdn.otchawon.com/fitting/results/2201_result.glb",
  "fittingScore": 87.5,
  "completedAt": "2026-03-26T10:29:58.000Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `fittingRequestId` | number | 필수 | fitting-service의 요청 PK |
| `userId` | number | 필수 | 피팅 요청한 사용자 ID |
| `productId` | number | 필수 | 피팅 대상 상품 ID |
| `resultStatus` | string | 필수 | 결과 상태 (DONE / FAILED) |
| `resultImageUrl` | string | 선택 | 2D 피팅 결과 이미지 URL (FAILED 시 null) |
| `resultGlbUrl` | string | 선택 | 3D GLB 결과 파일 URL (FAILED 시 null) |
| `fittingScore` | number | 선택 | AI 피팅 적합도 점수 0~100 (FAILED 시 null) |
| `completedAt` | string (ISO 8601) | 필수 | 피팅 완료 시각 |

---

## 6. otc.fitting.requested

**프로듀서**: fitting-service
**컨슈머**: AI 추론 서버 (그룹: `ai-inference-group`)
**목적**: 사용자가 피팅을 요청하면 AI 추론 서버에 작업을 큐잉합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440006",
  "eventType": "otc.fitting.requested",
  "timestamp": "2026-03-26T10:25:00.000Z",
  "version": "1.0",
  "source": "fitting-service",
  "fittingRequestId": 2201,
  "userId": 305,
  "productId": 721,
  "glbAssetUrl": "https://cdn.otchawon.com/products/721/model.glb",
  "rigType": "SMPL",
  "bodyMeasurements": {
    "height": 175.0,
    "weight": 68.0,
    "chest": 92.0,
    "waist": 76.0,
    "hip": 94.0,
    "shoulderWidth": 43.0
  },
  "priority": "NORMAL",
  "requestedAt": "2026-03-26T10:24:59.500Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `fittingRequestId` | number | 필수 | fitting-service의 요청 PK |
| `userId` | number | 필수 | 피팅 요청한 사용자 ID |
| `productId` | number | 필수 | 피팅 대상 상품 ID |
| `glbAssetUrl` | string | 필수 | 의류 3D GLB 에셋 URL |
| `rigType` | string | 필수 | 리깅 파라미터 타입 (SMPL / SMPL-X) |
| `bodyMeasurements` | object | 필수 | 사용자 체형 데이터 (user-service에서 복호화 후 전달) |
| `bodyMeasurements.height` | number | 필수 | 키 (cm) |
| `bodyMeasurements.weight` | number | 필수 | 몸무게 (kg) |
| `bodyMeasurements.chest` | number | 필수 | 가슴둘레 (cm) |
| `bodyMeasurements.waist` | number | 필수 | 허리둘레 (cm) |
| `bodyMeasurements.hip` | number | 필수 | 엉덩이둘레 (cm) |
| `bodyMeasurements.shoulderWidth` | number | 선택 | 어깨너비 (cm) |
| `priority` | string | 필수 | 처리 우선순위 (NORMAL / HIGH) |
| `requestedAt` | string (ISO 8601) | 필수 | 피팅 요청 시각 |

---

## 7. otc.product.updated

**프로듀서**: product-service
**컨슈머**: 캐시 레이어 / BFF (그룹: `cache-invalidation-group`)
**목적**: 상품 정보 변경 시 BFF/Redis 캐시를 무효화합니다.

### 페이로드 스키마

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440007",
  "eventType": "otc.product.updated",
  "timestamp": "2026-03-26T14:00:00.000Z",
  "version": "1.0",
  "source": "product-service",
  "productId": 721,
  "brandId": 15,
  "changedFields": ["price", "stockQuantity", "description"],
  "changeType": "UPDATE",
  "updatedAt": "2026-03-26T13:59:59.000Z"
}
```

### 필드 정의

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `productId` | number | 필수 | 변경된 상품 ID |
| `brandId` | number | 필수 | 상품을 소유한 브랜드 ID |
| `changedFields` | array of string | 선택 | 변경된 필드명 목록 (캐시 선택적 무효화에 활용) |
| `changeType` | string | 필수 | 변경 유형 (CREATE / UPDATE / DELETE) |
| `updatedAt` | string (ISO 8601) | 필수 | 변경 시각 |
