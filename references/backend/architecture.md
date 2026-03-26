# 옷차원 Backend 아키텍처 및 코드 패턴

---

## 2. 아키텍처 핵심 규칙 (패턴 B)

### 2-1. Gateway 단일 진입

- 모든 외부 요청은 **Spring Cloud Gateway (port 8080)** 를 통해서만 진입한다.
- 각 마이크로서비스는 외부에서 직접 접근 불가 (내부 네트워크 전용).
- Gateway에서 JWT 검증 → 서비스별 라우팅.
- 라우팅 규칙: `/api/v1/auth/**`, `/api/v1/users/**` → user-service(8081), `/api/v1/products/**` → product-service(8082), `/api/v1/orders/**` → order-service(8083), `/api/v1/payments/**` → payment-service(8084), `/api/v1/fitting/**` → fitting-service(8085), `/api/v1/brands/**` → brand-service(8086).

### 2-2. Database per Service

- 각 서비스는 **전용 MySQL 데이터베이스**만 사용한다. 다른 서비스의 DB에 직접 쿼리 절대 금지.
- 서비스 간 데이터 조회는 반드시 REST API 호출 또는 Kafka 이벤트를 통해서만 수행한다.
- DB 명명 규칙: `otc_{서비스명}_db` (예: `otc_user_db`, `otc_product_db`).

| 서비스 | DB 이름 | 핵심 테이블 |
|--------|---------|-----------|
| user-service | otc_user_db | users, refresh_tokens, body_measurements |
| product-service | otc_product_db | products, categories, product_options, product_assets |
| order-service | otc_order_db | orders, order_items, carts, cart_items |
| payment-service | otc_payment_db | payments, refunds |
| fitting-service | otc_fitting_db | fitting_requests, fitting_results |
| brand-service | otc_brand_db | brands, brand_admins, brand_products |

### 2-3. CQRS

- **Command**: Spring Boot 서비스 레이어에서 직접 JPA/Hibernate 처리.
- **Query (복잡한 읽기)**: Next.js BFF에서 Prisma로 처리. 단순 조회는 Spring에서 직접 처리 허용.
- 쓰기 API와 읽기 API의 응답 구조가 달라도 무방하다.

### 2-4. API Composition

- 클라이언트에 집계된 데이터가 필요한 경우, Gateway 또는 BFF에서 여러 서비스를 병렬 호출 후 조합한다.
- 서비스 간 직접 동기 호출은 **FeignClient** 를 사용하고, 호출 체인은 최대 2단계를 초과하지 않는다.
- 3단계 이상 호출이 필요한 경우 Kafka 이벤트로 전환한다.

### 2-5. Kafka 이벤트

- 서비스 간 결합을 줄여야 하는 상태 변경은 Kafka 이벤트로 처리한다.
- 토픽 명명 규칙: `otc.{서비스}.{이벤트}` (예: `otc.order.created`, `otc.fitting.completed`).
- 컨슈머 그룹 명명: `{서비스명}-group` (예: `fitting-service-group`).
- 이벤트 페이로드는 JSON, 필드는 camelCase.

```
[Kafka 이벤트 흐름 예시]
order-service → otc.order.created → payment-service (결제 요청)
payment-service → otc.payment.completed → order-service (주문 확정)
order-service → otc.order.confirmed → product-service (재고 차감)
fitting-service → otc.fitting.completed → user-service (피팅 이력 업데이트)
```

---

## 3. 옷차원 MSA 서비스 목록과 책임

### 3-1. user-service (port 8081)

**책임**: 회원 인증/인가, 체형 정보 관리

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 회원가입 | `POST /api/v1/auth/register` | 이메일/비밀번호, BCrypt 해싱 |
| 로그인 | `POST /api/v1/auth/login` | JWT Access(15분) + Refresh(7일) 발급 |
| 토큰 갱신 | `POST /api/v1/auth/refresh` | Refresh Token → Access Token 재발급 |
| 로그아웃 | `POST /api/v1/auth/logout` | Refresh Token Redis에서 삭제 |
| 내 프로필 조회 | `GET /api/v1/users/me` | JWT 인증 필수 |
| 프로필 수정 | `PATCH /api/v1/users/me` | 닉네임, 주소 등 |
| 체형정보 저장 | `POST /api/v1/users/me/body` | 키/몸무게/가슴둘레/허리/엉덩이 등, AES-256 암호화 저장 |
| 체형정보 조회 | `GET /api/v1/users/me/body` | fitting-service에서 FeignClient로 호출 |

**JWT 처리 규칙**:
- Access Token: `Authorization: Bearer {token}` 헤더.
- Refresh Token: HttpOnly Cookie.
- Redis에 `refresh:{userId}` 키로 Refresh Token 저장, TTL 7일.
- 블랙리스트: 로그아웃 시 Access Token을 Redis `blacklist:{jti}` 키로 잔여 만료시간만큼 저장.

**체형 데이터 보안**:
- DB 저장 시 AES-256 암호화 (암호화 키는 환경변수 `OTC_BODY_ENC_KEY`).
- fitting-service 외 다른 서비스에서 체형 데이터 직접 접근 금지.

### 3-2. product-service (port 8082)

**책임**: 상품 도메인 전체, 3D 에셋 메타데이터 관리

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 상품 목록 | `GET /api/v1/products` | 페이지네이션, 카테고리/브랜드/가격 필터 |
| 상품 상세 | `GET /api/v1/products/{id}` | 3D 에셋 URL 포함 |
| 상품 등록 | `POST /api/v1/products` | 브랜드 어드민 권한 필요 |
| 상품 수정 | `PATCH /api/v1/products/{id}` | 브랜드 어드민 권한 필요 |
| 상품 삭제 | `DELETE /api/v1/products/{id}` | Soft Delete (status = DELETED) |
| 카테고리 목록 | `GET /api/v1/categories` | 계층형 카테고리 |
| 상품 검색 | `GET /api/v1/products?q={keyword}` | 이름/브랜드 LIKE 검색 |
| 3D 에셋 메타 조회 | `GET /api/v1/products/{id}/asset` | GLB URL, 리깅 파라미터 포함 |

**3D 에셋 메타데이터 스키마**:
```sql
CREATE TABLE product_assets (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id  BIGINT NOT NULL UNIQUE,
  glb_url     VARCHAR(500) NOT NULL,   -- S3/CloudFront URL
  thumbnail_url VARCHAR(500),
  rig_type    VARCHAR(50),             -- 'SMPL', 'SMPL-X'
  draco_compressed BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3-3. order-service (port 8083)

**책임**: 장바구니, 주문 생성, 배송 상태 추적

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 장바구니 조회 | `GET /api/v1/cart` | 로그인 사용자 전용 |
| 장바구니 추가 | `POST /api/v1/cart/items` | 상품ID, 옵션ID, 수량 |
| 장바구니 수정 | `PATCH /api/v1/cart/items/{id}` | 수량 변경 |
| 장바구니 삭제 | `DELETE /api/v1/cart/items/{id}` | 개별 항목 제거 |
| 주문 생성 | `POST /api/v1/orders` | 장바구니 → 주문 변환, Kafka `otc.order.created` 발행 |
| 주문 조회 | `GET /api/v1/orders/{id}` | 주문 상태, 배송 추적 포함 |
| 주문 목록 | `GET /api/v1/orders` | 내 주문 이력, 페이지네이션 |
| 주문 취소 | `POST /api/v1/orders/{id}/cancel` | 결제 전 취소, Kafka `otc.order.cancelled` 발행 |

**주문 상태 흐름**:
```
PENDING → PAYMENT_REQUESTED → PAID → SHIPPING → DELIVERED → COMPLETED
                 ↓
            CANCELLED (결제 전)
                 ↓
             REFUNDED (결제 후)
```

### 3-4. payment-service (port 8084)

**책임**: PG사 결제 연동, 환불 처리

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 결제 요청 | `POST /api/v1/payments` | PG사 API 호출, 주문ID와 연결 |
| 결제 확인 | `POST /api/v1/payments/{id}/confirm` | PG사 웹훅 또는 검증 응답 처리 |
| 결제 조회 | `GET /api/v1/payments/{orderId}` | 주문별 결제 이력 |
| 환불 요청 | `POST /api/v1/payments/{id}/refund` | 전액/부분 환불 |

**PG사 연동 규칙**:
- PG사 API 키는 환경변수 `OTC_PG_SECRET_KEY`, `OTC_PG_CLIENT_KEY`.
- 결제 금액 검증은 반드시 서버 사이드에서 수행 (클라이언트 금액 신뢰 금지).
- Kafka `otc.order.created` 수신 → 결제 준비. 결제 완료 시 `otc.payment.completed` 발행.

### 3-5. fitting-service (port 8085)

**책임**: AI 3D 옷핏 피팅 요청 중개, 결과 캐싱, 피팅 이력 관리

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 피팅 요청 | `POST /api/v1/fitting/requests` | 사용자ID + 상품ID → AI 서버 호출 |
| 피팅 결과 조회 | `GET /api/v1/fitting/requests/{id}` | 상태(PENDING/PROCESSING/DONE/FAILED) + 결과 URL |
| 피팅 이력 목록 | `GET /api/v1/fitting/history` | 내 피팅 이력, 페이지네이션 |
| 피팅 결과 삭제 | `DELETE /api/v1/fitting/requests/{id}` | 이력 삭제 |

### 3-6. brand-service (port 8086)

**책임**: 브랜드 입점사 관리, 멀티테넌트 권한 제어

| 기능 | 엔드포인트 | 설명 |
|------|-----------|------|
| 브랜드 목록 | `GET /api/v1/brands` | 공개 목록, 페이지네이션 |
| 브랜드 상세 | `GET /api/v1/brands/{id}` | 브랜드 정보, 소개, 로고 |
| 브랜드 등록 (어드민) | `POST /api/v1/admin/brands` | 플랫폼 어드민 전용 |
| 브랜드 정보 수정 | `PATCH /api/v1/brands/{id}` | 해당 브랜드 어드민 전용 |
| 브랜드 상품 목록 | `GET /api/v1/brands/{id}/products` | brand-service → product-service FeignClient 호출 |
| 브랜드 어드민 초대 | `POST /api/v1/brands/{id}/admins` | 플랫폼 어드민 또는 브랜드 오너 전용 |

---

## 4. BFF 역할 분담 기준 (패턴 B)

BFF(Next.js, port 3000)는 **읽기 최적화**와 **SSR**에 집중한다. 쓰기 요청은 BFF를 통하지 않고 Gateway로 직접 전달한다.

| 구분 | 처리 주체 | 판단 기준 |
|------|-----------|----------|
| 상품 목록/상세 SSR | BFF (Prisma) | SEO 필요, 복합 조회 |
| 브랜드 페이지 SSR | BFF (Prisma) | SEO 필요 |
| 피팅 결과 렌더링 | BFF | Three.js 렌더링 데이터 조합 |
| 사용자 인증/프로필 쓰기 | Gateway → user-service | 상태 변경 |
| 주문/결제 | Gateway → order/payment-service | 상태 변경, 트랜잭션 |
| 장바구니 (실시간) | Gateway → order-service | 세션 의존, SSR 불필요 |
| 검색 | BFF (Prisma) 또는 Gateway | 노출 빈도 높으면 BFF |

**BFF에서 Spring 서비스 직접 DB 접근 금지**: BFF의 Prisma는 MySQL Read Replica에만 연결한다. 쓰기는 반드시 Spring 서비스 API를 호출한다.

**BFF 환경변수**:
- `INTERNAL_API_BASE_URL`: Spring Gateway 내부 URL (예: `http://gateway:8080`)
- `DATABASE_URL`: MySQL Read Replica DSN (Prisma 전용)

---

## 5. API 설계 컨벤션

### 5-1. URL 규칙

```
/{버전}/{리소스}[/{id}][/{서브리소스}]

예:
GET  /api/v1/products                  -- 목록
GET  /api/v1/products/{id}             -- 단건
POST /api/v1/products                  -- 생성
PATCH /api/v1/products/{id}            -- 부분 수정 (PUT 사용 금지)
DELETE /api/v1/products/{id}           -- 삭제

GET  /api/v1/users/me/body             -- 중첩 리소스
POST /api/v1/fitting/requests          -- 동사형 리소스는 명사로 래핑
POST /api/v1/orders/{id}/cancel        -- 상태 전환 액션은 서브리소스로
```

- URL은 소문자 kebab-case. 동사 사용 금지 (cancel, confirm 등 상태 전환 서브리소스 제외).
- 복수형 리소스명 사용 (`/products`, `/orders`).
- 버전은 `/api/v1/`로 고정 (v2 필요 시 PM 승인 후 추가).

### 5-2. 표준 응답 포맷

모든 API 응답은 아래 Envelope 구조를 따른다.

**성공 응답**:
```json
{
  "success": true,
  "data": { },
  "message": null,
  "traceId": "9f4a8f8a3f7b4e0f"
}
```

**오류 응답**:
```json
{
  "success": false,
  "data": null,
  "message": "유효하지 않은 요청입니다.",
  "traceId": "9f4a8f8a3f7b4e0f"
}
```

**페이지네이션 응답**:
```json
{
  "success": true,
  "data": {
    "content": [ ],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "hasNext": true
  },
  "message": null,
  "traceId": "9f4a8f8a3f7b4e0f"
}
```

### 5-3. HTTP 상태 코드

| 상황 | 코드 |
|------|------|
| 조회 성공 | 200 OK |
| 생성 성공 | 201 Created |
| 처리 성공(응답 바디 없음) | 204 No Content |
| 요청 형식 오류 | 400 Bad Request |
| 인증 실패 | 401 Unauthorized |
| 권한 없음 | 403 Forbidden |
| 리소스 없음 | 404 Not Found |
| 서버 오류 | 500 Internal Server Error |

### 5-4. 페이지네이션

- 쿼리 파라미터: `page` (0-based), `size` (기본값 20, 최대 100).
- 정렬: `sort={필드},{asc|desc}` (예: `sort=createdAt,desc`).

---

## 6. 코드 컨벤션

### 6-1. 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `ProductService`, `FittingRequest` |
| 메서드 / 변수 | camelCase | `findByBrandId`, `totalPrice` |
| 상수 | UPPER_SNAKE_CASE | `MAX_FITTING_CACHE_TTL` |
| 패키지 | 소문자 단어 | `com.otchawon.product.domain` |
| DB 컬럼 | snake_case | `brand_id`, `created_at` |
| Kafka 토픽 | `otc.{서비스}.{이벤트}` | `otc.order.created` |
| 환경변수 | `OTC_` 접두사 + UPPER_SNAKE_CASE | `OTC_JWT_SECRET` |

### 6-2. DTO는 Java Record 사용

```java
// 요청 DTO
public record CreateProductRequest(
    @NotBlank String name,
    @Positive int price,
    Long categoryId,
    Long brandId
) {}

// 응답 DTO
public record ProductResponse(
    Long id,
    String name,
    int price,
    String status,
    String glbUrl
) {}
```

- DTO에 비즈니스 로직 포함 금지. 변환 로직은 별도 Mapper 또는 서비스에서 처리.
- 엔티티를 컨트롤러 레이어에 직접 노출하지 않는다.

### 6-3. 레이어별 책임 (SOLID)

```
Controller  → 요청/응답 변환, 입력 검증(@Valid), HTTP 상태 코드 결정
Service     → 비즈니스 로직, 트랜잭션 경계(@Transactional), 도메인 조합
Repository  → 데이터 접근, JPQL/QueryDSL, 외부 API 연동(FeignClient)
Domain      → 엔티티, 값 객체, 도메인 이벤트 (순수 Java, 프레임워크 의존 최소화)
```

- 서비스는 다른 서비스 레이어를 직접 주입하지 않는다. 서비스 간 통신은 FeignClient 또는 Kafka.
- `@Transactional(readOnly = true)`는 조회 메서드에 반드시 적용.

### 6-4. 디자인 패턴 적용

| 패턴 | 적용 대상 | 이유 |
|------|-----------|------|
| Strategy | 결제 PG사 선택 | PG사 추가 시 코드 변경 최소화 |
| Observer (Kafka) | 주문→결제, 피팅 완료→이력 | 서비스 간 결합 제거 |
| Facade | FittingService의 AI 호출 래핑 | AI 서버 변경에 독립적 |
| Template Method | Kafka 컨슈머 공통 처리 | 오류 처리/로깅 중복 제거 |
| Builder | 복잡한 DTO 생성 | 가독성, 불변성 |

### 6-5. 예외 처리

- 도메인별 커스텀 예외 정의: `OtcException` 추상 클래스 상속.
- `@RestControllerAdvice`의 `GlobalExceptionHandler`에서 일괄 처리.
- 예외 메시지는 한국어로 작성 (사용자 노출 메시지).

```java
// 예시
public class ProductNotFoundException extends OtcException {
    public ProductNotFoundException(Long productId) {
        super("상품을 찾을 수 없습니다. ID: " + productId, HttpStatus.NOT_FOUND);
    }
}
```

### 6-6. 로깅

- `@Slf4j` 사용. `System.out.println` 사용 금지.
- 개인정보(이메일, 체형 수치, 결제 정보)는 로그에 출력 금지.
- INFO: 주요 비즈니스 이벤트 (주문 생성, 결제 완료).
- WARN: 비정상 상황 (재고 부족, 외부 API 타임아웃).
- ERROR: 처리 불가 오류 (DB 연결 실패, 예외 핸들러 미처리).

---

## 7. 피팅 서비스 연동 규칙 (옷차원 핵심)

### 7-1. fitting-service → AI/ML FastAPI 서버 호출 스펙

fitting-service는 Python FastAPI 서버(`AI_ML_BASE_URL`, 기본 포트 8000)를 호출하는 **중개자** 역할이다. AI 서버를 직접 호출하는 다른 서비스는 없다.

**피팅 추론 요청 (fitting-service → AI FastAPI)**:
```
POST {AI_ML_BASE_URL}/api/v1/fitting/infer

요청 바디:
{
  "fittingRequestId": "uuid",
  "userId": 123,
  "productId": 456,
  "bodyMeasurements": {
    "height": 175.0,
    "weight": 68.0,
    "chest": 96.0,
    "waist": 80.0,
    "hip": 98.0,
    "inseam": 78.0
  },
  "productAsset": {
    "glbUrl": "https://cdn.otchawon.com/assets/product/456.glb",
    "rigType": "SMPL-X"
  }
}

응답 바디:
{
  "fittingRequestId": "uuid",
  "status": "PROCESSING",
  "estimatedSeconds": 15
}
```

**피팅 결과 콜백 (AI FastAPI → fitting-service)**:
```
POST {FITTING_SERVICE_CALLBACK_URL}/api/v1/fitting/callback

요청 바디:
{
  "fittingRequestId": "uuid",
  "status": "DONE",
  "resultImageUrl": "https://cdn.otchawon.com/fitting/result/uuid.png",
  "resultGlbUrl": "https://cdn.otchawon.com/fitting/result/uuid.glb",
  "processingTimeMs": 12400,
  "failureReason": null
}
```

- 콜백 요청은 `X-OTC-Callback-Secret` 헤더로 검증한다 (환경변수 `OTC_FITTING_CALLBACK_SECRET`).
- AI 서버가 10초 내 응답하지 않으면 `FAILED` 처리 후 Kafka `otc.fitting.failed` 발행.

### 7-2. 체형 데이터 저장/조회 API

fitting-service는 피팅 요청 시 user-service에서 체형 데이터를 FeignClient로 조회한다.

```java
// fitting-service 내 FeignClient 예시
@FeignClient(name = "user-service", url = "${otc.user-service.url}")
public interface UserServiceClient {
    @GetMapping("/api/v1/users/{userId}/body")
    BodyMeasurementsResponse getBodyMeasurements(@PathVariable Long userId);
}
```

- user-service의 체형 조회 API는 **서비스 내부 전용** 헤더 `X-Internal-Service: fitting-service`를 검증해야 한다.
- 체형 데이터가 없는 사용자가 피팅 요청 시 `422 Unprocessable Entity`와 함께 `"체형 정보를 먼저 등록해주세요."` 메시지를 반환한다.

### 7-3. 피팅 결과 캐싱 전략 (Redis)

동일 사용자가 동일 상품에 대해 피팅 요청 시, 24시간 이내 결과가 있으면 AI 서버를 재호출하지 않고 캐시를 반환한다.

```
Redis 키: fitting:result:{userId}:{productId}
TTL: 86400초 (24시간)
값: 피팅 결과 JSON (resultImageUrl, resultGlbUrl, createdAt)

캐시 무효화 조건:
- 상품 에셋(GLB)이 변경되면 product-service → Kafka otc.product.asset_updated 발행
- fitting-service가 해당 이벤트 수신 시 관련 캐시 키 전체 삭제
```

**캐시 히트율 모니터링**: Prometheus `fitting_cache_hit_total`, `fitting_cache_miss_total` 메트릭 노출.

### 7-4. 비동기 피팅 요청 흐름

피팅 추론은 수 초~수십 초 소요되므로 동기 응답을 반환하지 않는다.

```
[폴링 방식]
1. 클라이언트  → POST /api/v1/fitting/requests
               ← 202 Accepted + { fittingRequestId, status: "PENDING" }
2. fitting-service → AI FastAPI 비동기 호출 (WebClient)
3. AI FastAPI → fitting-service 콜백 (결과 저장)
4. 클라이언트 → GET /api/v1/fitting/requests/{id} (폴링)
               ← { status: "DONE", resultImageUrl, resultGlbUrl }

[Kafka 이벤트 방식 - 선택적]
3. AI 결과 수신 후 → otc.fitting.completed 발행
4. 프론트엔드는 WebSocket(SSE) 구독 또는 폴링으로 상태 확인
```

- 폴링 간격: 클라이언트 3초, 최대 30회 (90초 타임아웃).
- 90초 초과 시 서버에서 `FAILED` 처리.

---

## 8. 브랜드 멀티테넌트 규칙

### 8-1. 브랜드별 데이터 격리

- 각 브랜드의 상품/통계 데이터는 `brand_id` 컬럼으로 구분한다. 물리적 DB 분리는 하지 않는다.
- brand-service의 모든 쓰기 API는 인증된 사용자의 `brandId`와 요청 대상 `brandId`가 일치하는지 반드시 검증한다.
- product-service의 상품 등록/수정/삭제 API는 Gateway에서 전달한 `X-Brand-Id` 헤더와 상품의 `brand_id`를 대조 검증한다.

```java
// 브랜드 소유권 검증 예시 (ServiceLayer)
private void validateBrandOwnership(Long brandId, Long authenticatedBrandId) {
    if (!brandId.equals(authenticatedBrandId)) {
        throw new ForbiddenException("해당 브랜드에 대한 권한이 없습니다.");
    }
}
```

### 8-2. 브랜드 어드민 API 권한 분리

JWT Claim에 `role`과 `brandId`를 포함한다.

| 역할 | JWT role 값 | 접근 가능 범위 |
|------|------------|--------------|
| 일반 사용자 | `USER` | 공개 API, 내 프로필/주문/피팅 이력 |
| 브랜드 어드민 | `BRAND_ADMIN` | 자신의 brandId에 속한 상품 관리 API |
| 플랫폼 어드민 | `PLATFORM_ADMIN` | 전체 관리 API, 브랜드 승인/입점 처리 |

**Gateway 권한 필터 처리**:
- `/api/v1/admin/**` 경로: `PLATFORM_ADMIN` 역할만 허용.
- `/api/v1/brands/{brandId}/**` (쓰기): `BRAND_ADMIN` + 토큰의 `brandId` 일치 확인.
- Gateway에서 1차 검증 후, 각 서비스에서도 2차 검증 수행 (Defense in Depth).

**브랜드 어드민 전용 API 경로 구분**:
```
/api/v1/brands/{brandId}/products      -- 브랜드 어드민: 상품 관리
/api/v1/brands/{brandId}/stats         -- 브랜드 어드민: 판매 통계
/api/v1/admin/brands                   -- 플랫폼 어드민: 입점사 전체 관리
/api/v1/admin/brands/{id}/approve      -- 플랫폼 어드민: 입점 승인
```

---

## 9. 테스트 코드 (FIRST 패턴)

### 9-1. 테스트 구조

```
src/test/java/com/otchawon/{서비스}/
  unit/
    service/      -- 단위 테스트 (Mockito, 외부 의존성 전부 Mock)
    domain/       -- 도메인 객체 단위 테스트
  integration/
    controller/   -- @WebMvcTest 기반 컨트롤러 테스트
    repository/   -- @DataJpaTest, H2 인메모리 DB
  e2e/
    api/          -- @SpringBootTest + TestContainers (MySQL)
```

### 9-2. 서비스 계층 단위 테스트 예시

```java
@ExtendWith(MockitoExtension.class)
class FittingServiceTest {

    @Mock FittingRequestRepository fittingRequestRepository;
    @Mock UserServiceClient userServiceClient;
    @Mock AiFittingClient aiFittingClient;
    @Mock FittingCacheService fittingCacheService;

    @InjectMocks FittingService fittingService;

    @Test
    @DisplayName("체형 정보가 없는 사용자가 피팅 요청 시 예외를 반환한다")
    void requestFitting_whenNoBodyMeasurements_throwsException() {
        // given
        given(userServiceClient.getBodyMeasurements(1L))
            .willThrow(new BodyMeasurementsNotFoundException(1L));

        // when & then
        assertThatThrownBy(() -> fittingService.requestFitting(1L, 100L))
            .isInstanceOf(BodyMeasurementsNotFoundException.class);
        then(aiFittingClient).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("캐시에 결과가 있으면 AI 서버를 호출하지 않는다")
    void requestFitting_whenCacheHit_returnsCachedResult() {
        // given
        FittingResultCache cached = FittingResultCache.of("https://cdn.../result.png", now());
        given(fittingCacheService.get(1L, 100L)).willReturn(Optional.of(cached));

        // when
        FittingResponse result = fittingService.requestFitting(1L, 100L);

        // then
        assertThat(result.status()).isEqualTo(FittingStatus.DONE);
        then(aiFittingClient).shouldHaveNoInteractions();
    }
}
```

### 9-3. 컨트롤러 슬라이스 테스트 예시

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean ProductService productService;

    @Test
    @DisplayName("존재하지 않는 상품 조회 시 404를 반환한다")
    void getProduct_whenNotFound_returns404() throws Exception {
        given(productService.getProduct(999L))
            .willThrow(new ProductNotFoundException(999L));

        mockMvc.perform(get("/api/v1/products/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.success").value(false))
            .andExpect(jsonPath("$.traceId").isNotEmpty());
    }
}
```

### 9-4. 테스트 데이터 규칙

- 픽스처 데이터는 익명 더미 데이터만 사용. 실제 이름, 이메일, 체형 수치 사용 금지.
- `@BeforeEach`에서 상태 초기화. 테스트 간 상태 공유 금지.
- 날짜/시간이 필요한 경우 `Clock.fixed()`로 고정.

---

## 10. BFF 코드 컨벤션 (Next.js, 패턴 B)

### 10-1. 디렉터리 구조

```
nextjs-bff/
  app/
    (shop)/              -- 쇼핑 SSR 페이지 (상품, 브랜드)
    (fitting)/           -- 피팅 관련 페이지
    api/                 -- Route Handlers (내부 API Proxy)
  lib/
    prisma.ts            -- Prisma Client 싱글톤
    api-client.ts        -- Spring Gateway 호출 클라이언트
  prisma/
    schema.prisma        -- Read용 스키마 (MySQL Read Replica)
```

### 10-2. BFF에서 Spring API 호출 규칙

```typescript
// lib/api-client.ts
const INTERNAL_API_BASE = process.env.INTERNAL_API_BASE_URL;

export async function callSpringApi<T>(
  path: string,
  options?: RequestInit,
  accessToken?: string
): Promise<T> {
  const res = await fetch(`${INTERNAL_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options?.headers,
    },
    next: { revalidate: 0 }, // 기본 캐시 비활성화
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message ?? '서버 오류가 발생했습니다.');
  }

  const envelope = await res.json();
  return envelope.data as T;
}
```

### 10-3. Prisma 읽기 규칙

- `prisma.ts`는 싱글톤 패턴으로 클라이언트 재사용.
- Prisma는 **읽기 전용** (SELECT 쿼리만). INSERT/UPDATE/DELETE 절대 금지.
- 복잡한 집계 쿼리는 Prisma `$queryRaw`로 처리하되, SQL 인젝션 방지를 위해 파라미터 바인딩 필수.

### 10-4. 환경변수 규칙

- `INTERNAL_API_BASE_URL`: Spring Gateway 내부 주소.
- `DATABASE_URL`: MySQL Read Replica (Prisma 전용, 쓰기 권한 없는 계정).
- `NEXTAUTH_SECRET`: 세션 서명 키.
- `OTC_FITTING_POLL_INTERVAL_MS`: 피팅 상태 폴링 간격 (기본 3000).

---

## 11. 다른 Sub Agent와의 협업 규칙

### 11-1. Frontend Developer Agent ↔ BE

| 방향 | 협업 항목 | 방법 |
|------|-----------|------|
| BE → FE | API 명세 변경 | Swagger URL 공유 + Slack #dev 알림 |
| BE → FE | 응답 구조 변경 (Breaking Change) | PR 설명에 명시 + FE 에이전트 티켓에 코멘트 |
| FE → BE | 신규 API 요청 | Jira 티켓 생성 후 BE 에이전트에게 할당 |
| FE → BE | 응답 필드 추가 요청 | Slack #dev에 스펙 요청, 협의 후 티켓화 |

**Swagger 기준 연동 원칙**: API 명세는 SpringDoc OpenAPI 자동 생성 기준. FE는 `GET /v3/api-docs`를 단일 진실원천으로 사용한다.

### 11-2. AI/ML Agent ↔ BE

| 방향 | 협업 항목 | 방법 |
|------|-----------|------|
| AI/ML → BE | 피팅 추론 API 스펙 변경 | Jira 티켓 + Slack #dev 알림 |
| AI/ML → BE | 콜백 응답 포맷 변경 | 최소 1 스프린트 전 사전 통보 |
| BE → AI/ML | 입력 데이터 포맷 변경 (체형 필드 추가) | 동일 |

fitting-service의 AI 호출 스펙은 AI/ML Agent가 소유한다. 스펙 변경 시 AI/ML Agent가 먼저 Jira 티켓을 발행하고 BE Agent에게 할당한다.

### 11-3. DevOps Agent ↔ BE

| 방향 | 협업 항목 | 방법 |
|------|-----------|------|
| BE → DevOps | 신규 서비스 환경변수 목록 | Jira 티켓 + `.env.example` 파일 제공 |
| BE → DevOps | 포트/의존성 변경 | `README.md` 업데이트 + DevOps 티켓 코멘트 |
| DevOps → BE | 인프라 URL, CDN 경로 제공 | Slack #dev 또는 Jira 코멘트 |

- BE Agent는 새 서비스 추가 시 `ot-chawon-backend_developer/README.md`의 포트 목록을 반드시 업데이트한다.

### 11-4. QA Agent ↔ BE

- QA Agent가 Critical/High 버그 리포트 발행 시 BE Agent는 당일 티켓 확인 필수.
- 버그 수정 후 수정 내용과 테스트 커버리지를 Jira 코멘트로 남긴다.

---

## 12. Jira / Slack 운영 규칙 (BE 전용 보충)

> 공통 Jira/Slack 규칙은 루트 `AGENTS.md`를 따른다. 아래는 BE 전용 보충 규칙이다.

### 12-1. Jira 티켓 명명

| 유형 | 제목 형식 | 예시 |
|------|-----------|------|
| 신규 API | `[{서비스}] {기능} API 구현` | `[fitting-service] 피팅 요청 API 구현` |
| 버그 수정 | `[{서비스}] {현상} 수정` | `[order-service] 주문 취소 후 재고 미복구 수정` |
| 리팩터링 | `[{서비스}] {대상} 리팩터링` | `[user-service] JWT 필터 레이어 분리 리팩터링` |
| 성능 개선 | `[{서비스}] {대상} 성능 개선` | `[product-service] 상품 목록 쿼리 N+1 개선` |

### 12-2. Slack 알림 규칙 (BE 전용)

| 이벤트 | 채널 | 내용 |
|--------|------|------|
| 신규 API Swagger 배포 | #dev | 엔드포인트 목록 + Swagger URL |
| 서비스 간 계약 변경 (Breaking Change) | #dev | 변경 내용 + 영향 서비스 + 적용 일정 |
| Kafka 토픽 추가/변경 | #dev | 토픽명 + 페이로드 스펙 |
| DB 스키마 마이그레이션 예정 | #dev | 서비스명 + 마이그레이션 내용 + 적용 일정 |

---

## 13. 주의사항

### 13-1. 절대 금지 사항

1. **서비스 간 DB 직접 접근 금지** — JPA 엔티티로 다른 서비스 DB 테이블을 참조하는 코드 작성 금지.
2. **엔티티 컨트롤러 직접 노출 금지** — 반드시 DTO(Record)로 변환 후 반환.
3. **하드코딩된 시크릿 금지** — JWT Secret, PG API 키, 암호화 키는 반드시 환경변수.
4. **체형/결제 데이터 로그 출력 금지** — 개인 민감 정보는 로그에 절대 노출 금지.
5. **BFF에서 DB 쓰기 금지** — Prisma는 Read Replica에만 연결, 쓰기 경로 구성 금지.
6. **테스트 없는 기능 커밋 금지** — 서비스 메서드에는 반드시 대응하는 단위 테스트 존재.
7. **main 브랜치 직접 push 금지** — PR을 통해서만 머지.

### 13-2. 성능 주의 사항

- 상품 목록 API에서 N+1 쿼리 발생하지 않도록 `@EntityGraph` 또는 fetch join 사용.
- 피팅 결과 캐시 TTL(24시간) 내 중복 AI 호출이 발생하는 코드 구조 금지.
- Kafka 컨슈머는 멱등성 보장: 동일 이벤트가 2회 이상 수신되어도 동일 결과.

### 13-3. 보안 주의 사항

- fitting-service 콜백 엔드포인트는 `X-OTC-Callback-Secret` 헤더 검증 없이 처리 금지.
- 브랜드 어드민 API는 JWT의 `brandId` Claim과 대상 리소스의 `brandId` 일치 여부 반드시 검증.
- SQL 인젝션 방지: JPA/Prisma 파라미터 바인딩만 사용, 문자열 직접 연결 금지.

### 13-4. 옷차원 도메인 특수 규칙

- 피팅 요청 시 체형 데이터 조회 실패는 **사일런트 실패 금지** — 반드시 422로 사용자에게 알린다.
- 상품 삭제는 Hard Delete 금지, `status = 'DELETED'` Soft Delete만 허용 (피팅 이력 보존).
- 브랜드 미소속 상품(`brand_id = NULL`)은 등록 불가 — product-service에서 강제 검증.
- 주문 생성 시 product-service에서 재고 확인은 동기 FeignClient 호출, 재고 차감은 비동기 Kafka 이벤트 (`otc.order.confirmed`) 처리.
