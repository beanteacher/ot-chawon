# Kafka 에러 처리 전략

## 1. Dead Letter Queue (DLQ) 정책

### 개요

컨슈머가 메시지를 처리하는 데 실패하고 재시도 횟수를 모두 소진하면, 해당 메시지는 DLQ(Dead Letter Queue)로 이동합니다.
DLQ는 데이터 유실 없이 실패한 이벤트를 보존하고 추후 수동 또는 자동으로 재처리할 수 있는 안전망입니다.

### DLQ 토픽 명명 규칙

```
{원본 토픽명}.dlq
```

| 원본 토픽 | DLQ 토픽 |
|-----------|---------|
| `otc.order.created` | `otc.order.created.dlq` |
| `otc.payment.completed` | `otc.payment.completed.dlq` |
| `otc.order.confirmed` | `otc.order.confirmed.dlq` |
| `otc.order.cancelled` | `otc.order.cancelled.dlq` |
| `otc.fitting.completed` | `otc.fitting.completed.dlq` |
| `otc.fitting.requested` | `otc.fitting.requested.dlq` |
| `otc.product.updated` | `otc.product.updated.dlq` |

### DLQ 메시지 포맷

DLQ 메시지는 원본 페이로드에 에러 컨텍스트를 추가한 Envelope 구조를 사용합니다.

```json
{
  "originalTopic": "otc.order.created",
  "originalPayload": {
    "eventId": "550e8400-e29b-41d4-a716-446655440001",
    "eventType": "otc.order.created",
    "timestamp": "2026-03-26T10:15:30.000Z",
    "version": "1.0",
    "source": "order-service",
    "orderId": 10042,
    "userId": 305,
    "totalAmount": 89000
  },
  "errorInfo": {
    "errorType": "PROCESSING_FAILED",
    "errorMessage": "PG사 결제 준비 API 호출 실패: Connection timeout",
    "errorCode": "PG_API_TIMEOUT",
    "retryCount": 3,
    "firstFailedAt": "2026-03-26T10:15:35.000Z",
    "lastFailedAt": "2026-03-26T10:16:05.000Z",
    "consumerGroup": "payment-service-group",
    "consumerHost": "payment-service-pod-abc123"
  }
}
```

### DLQ 모니터링 및 재처리 정책

- DLQ 토픽 lag이 0 이상이면 알람 발생 (Slack / PagerDuty 연동).
- DLQ 메시지 보존 기간: **7일** (비즈니스 업무일 기준 처리 가능 시간 확보).
- 재처리 방법:
  1. **자동 재처리**: DLQ Consumer가 주기적으로 재시도 (비즈니스 에러가 아닌 일시적 인프라 오류 한정).
  2. **수동 재처리**: 운영팀이 원인 파악 후 메시지를 원본 토픽으로 재발행.
- 비즈니스 로직 에러(중복 결제, 재고 부족 등)는 자동 재처리하지 않고 수동 검토 필수.

---

## 2. 재시도 전략 (Exponential Backoff)

### 재시도 정책 개요

컨슈머 처리 실패 시 즉시 재시도하면 downstream 서비스 과부하를 유발합니다.
Exponential Backoff + Jitter 전략을 사용해 재시도 간격을 점진적으로 늘립니다.

### 재시도 파라미터

| 파라미터 | 값 | 설명 |
|---------|---|------|
| 최대 재시도 횟수 | 3회 | 초과 시 DLQ로 이동 |
| 초기 대기 시간 | 1초 | 첫 번째 재시도 전 대기 |
| 배수 (multiplier) | 2 | 재시도마다 대기 시간 2배 증가 |
| 최대 대기 시간 | 10초 | 대기 시간 상한선 |
| Jitter | 0~20% 랜덤 | 동시 재시도로 인한 thundering herd 방지 |

### 재시도 시간 계획

```
시도 1: 즉시 처리 시도 → 실패
  ↓ 1초 + jitter(0~0.2초) 대기
시도 2 (1차 재시도): → 실패
  ↓ 2초 + jitter(0~0.4초) 대기
시도 3 (2차 재시도): → 실패
  ↓ 4초 + jitter(0~0.8초) 대기
시도 4 (3차 재시도): → 실패
  ↓ DLQ로 이동
```

### Spring Kafka 설정 예시

```java
@Bean
public DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> kafkaTemplate) {
    // DLQ로 보낼 DeadLetterPublishingRecoverer 설정
    DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(
        kafkaTemplate,
        (record, ex) -> new TopicPartition(record.topic() + ".dlq", record.partition())
    );

    // Exponential Backoff 설정
    ExponentialBackOffWithMaxRetries backOff = new ExponentialBackOffWithMaxRetries(3);
    backOff.setInitialInterval(1000L);   // 1초
    backOff.setMultiplier(2.0);          // 2배 증가
    backOff.setMaxInterval(10000L);      // 최대 10초

    return new DefaultErrorHandler(recoverer, backOff);
}
```

### 재시도 대상 예외 분류

**재시도 수행 (일시적 오류)**:
- `ConnectTimeoutException`: 외부 서비스 연결 타임아웃
- `DataAccessException`: DB 연결 실패, 데드락
- `RestClientException`: FeignClient 호출 실패 (5xx 응답)

**재시도 건너뜀 (즉시 DLQ)**:
- `DeserializationException`: 페이로드 파싱 실패 (스키마 불일치)
- `IllegalArgumentException`: 비즈니스 유효성 검증 실패
- `DuplicateKeyException`: 중복 처리 감지 (이미 처리된 이벤트)

```java
errorHandler.addNotRetryableExceptions(
    DeserializationException.class,
    IllegalArgumentException.class,
    DuplicateKeyException.class
);
```

---

## 3. 멱등성 보장 방법

### 개요

Kafka는 at-least-once 전달을 보장하므로 동일 메시지가 2회 이상 전달될 수 있습니다.
컨슈머는 반드시 **멱등성(Idempotency)**을 보장해야 합니다.

### 멱등성 구현 전략

#### 3-1. eventId 기반 중복 처리 방지

모든 이벤트의 `eventId`(UUID v4)를 처리 전 DB에 기록합니다.
동일 `eventId`가 재전달되면 처리를 건너뜁니다.

```sql
-- 이벤트 처리 이력 테이블 (각 서비스 DB에 생성)
CREATE TABLE processed_events (
  event_id    VARCHAR(36) PRIMARY KEY,   -- UUID
  event_type  VARCHAR(100) NOT NULL,
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_processed_at (processed_at)   -- TTL 정리용
);
```

```java
@Transactional
public void processEvent(OrderCreatedEvent event) {
    // 중복 확인
    if (processedEventRepository.existsById(event.getEventId())) {
        log.info("이미 처리된 이벤트 스킵: eventId={}", event.getEventId());
        return;
    }

    // 비즈니스 로직 수행
    doProcessOrder(event);

    // 처리 이력 저장 (같은 트랜잭션)
    processedEventRepository.save(new ProcessedEvent(event.getEventId(), event.getEventType()));
}
```

#### 3-2. 상태 기반 멱등성

비즈니스 엔티티의 현재 상태를 확인하여 이미 처리된 경우 건너뜁니다.

**예시: otc.payment.completed 수신 시 주문 상태 확인**

```java
@Transactional
public void onPaymentCompleted(PaymentCompletedEvent event) {
    Order order = orderRepository.findById(event.getOrderId())
        .orElseThrow(() -> new OrderNotFoundException(event.getOrderId()));

    // 이미 PAID 상태이면 멱등성에 의해 스킵
    if (order.getStatus() == OrderStatus.PAID) {
        log.warn("이미 결제 완료 처리된 주문: orderId={}, eventId={}",
            event.getOrderId(), event.getEventId());
        return;
    }

    // PAYMENT_REQUESTED 상태에서만 처리 진행
    if (order.getStatus() != OrderStatus.PAYMENT_REQUESTED) {
        throw new IllegalStateException(
            "예상치 못한 주문 상태: " + order.getStatus());
    }

    order.confirm();
    orderRepository.save(order);
}
```

#### 3-3. 프로듀서 멱등성

Kafka 프로듀서는 `enable.idempotence=true` 설정을 사용합니다.
이는 네트워크 오류로 인한 메시지 중복 발행을 Kafka 레벨에서 방지합니다.

```yaml
# application.yml (각 Spring Boot 서비스)
spring:
  kafka:
    producer:
      properties:
        enable.idempotence: true
        acks: all
        retries: 3
        max.in.flight.requests.per.connection: 5
```

#### 3-4. processed_events 테이블 정리 정책

무한 증가를 막기 위해 7일 이후 처리 이력은 배치 삭제합니다.

```sql
-- 7일 이상 된 처리 이력 정리 (매일 새벽 2시 스케줄)
DELETE FROM processed_events
WHERE processed_at < NOW() - INTERVAL 7 DAY
LIMIT 10000;
```

---

## 4. 이벤트 순서 보장

Kafka 파티션 내에서는 메시지 순서가 보장됩니다.
동일 `orderId` 또는 `userId`와 관련된 이벤트는 동일 파티션에 배치되도록 **파티션 키**를 설정합니다.

| 토픽 | 파티션 키 | 이유 |
|------|----------|------|
| `otc.order.created` | `orderId` | 동일 주문의 이벤트 순서 보장 |
| `otc.payment.completed` | `orderId` | 결제-주문 확정 순서 보장 |
| `otc.order.confirmed` | `orderId` | 주문 확정-재고 차감 순서 보장 |
| `otc.order.cancelled` | `orderId` | 취소-환불 순서 보장 |
| `otc.fitting.completed` | `userId` | 동일 사용자 피팅 이력 순서 보장 |
| `otc.fitting.requested` | `fittingRequestId` | 요청별 독립 처리 |
| `otc.product.updated` | `productId` | 동일 상품 업데이트 순서 보장 |

```java
// 프로듀서에서 파티션 키 지정 예시
kafkaTemplate.send("otc.order.created",
    String.valueOf(event.getOrderId()),  // 파티션 키
    event                                // 페이로드
);
```

---

## 5. 토픽 설정 권고

| 설정 | 권고값 | 이유 |
|------|--------|------|
| 파티션 수 | 3 (초기) | 서비스 인스턴스 수에 맞춰 조정 가능 |
| 복제 인수 (replication factor) | 3 | 브로커 장애 시 데이터 유실 방지 |
| 메시지 보존 기간 | 7일 | DLQ 재처리 기간과 일치 |
| 최대 메시지 크기 | 1MB | 피팅 페이로드는 URL만 포함하므로 충분 |
| `min.insync.replicas` | 2 | 프로듀서 `acks=all`과 함께 사용 |
