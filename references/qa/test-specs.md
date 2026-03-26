# 옷차원 QA 테스트 규격 및 시나리오

## A. 3D 뷰어 테스트

**목표**: 모든 지원 디바이스에서 GLB 에셋이 정확히 렌더링되고 인터랙션이 정상 동작함을 보장한다.

### 1. 디바이스 및 브라우저 호환성

| 디바이스 | 브라우저 | WebGL 2.0 | 우선순위 |
|---------|---------|-----------|---------|
| Desktop | Chrome 최신 | 필수 | P1 |
| Desktop | Firefox 최신 | 필수 | P1 |
| Desktop | Safari 17+ | 필수 | P1 |
| Mobile | iOS 16+ Safari | 필수 | P1 |
| Mobile | Android Chrome 최신 | 필수 | P1 |
| Tablet | iPad Safari | 권장 | P2 |

**WebGL 2.0 필수 체크 항목**:
- `canvas.getContext('webgl2')` 반환값이 `null`인 경우 폴백 UI(정지 이미지 or 안내 문구) 표시 여부
- WebGL 미지원 브라우저에서 에러 없이 graceful degradation 처리 확인

### 2. GLB 로딩 성능 기준

| 구분 | 허용 기준 | 측정 방법 |
|-----|---------|---------|
| 의류 GLB 초기 로딩 (Draco 압축 적용) | 3G LTE 환경 5초 이내 | Playwright network throttle |
| 아바타 GLB 초기 로딩 | 3G LTE 환경 8초 이내 | Playwright network throttle |
| 뷰어 재오픈 (캐시 히트) | 1초 이내 | CDN 캐시 확인 |
| 에셋 로딩 실패 시 에러 UI | 10초 타임아웃 후 표시 | 네트워크 차단 시뮬레이션 |

### 3. 터치 및 마우스 인터랙션

- **회전**: 드래그(마우스)/스와이프(터치)로 360도 자유 회전 — 끊김 없는 프레임 유지
- **줌**: 휠(마우스)/핀치(터치) — 최소/최대 줌 범위 경계값에서 클램핑 정상 동작
- **재질 확대**: 더블클릭/더블탭으로 특정 부위 클로즈업 — 뷰 복귀 버튼 표시
- **모바일 성능**: 인터랙션 중 FPS 30 이상 유지 (DevTools Performance 측정)

---

## B. AI 피팅 테스트

**목표**: 다양한 체형 입력에 대해 피팅 결과가 허용 오차 내에 있고, 추론 시간이 SLA를 준수함을 보장한다.

### 1. 피팅 결과 정확도

| 검증 항목 | 기준 | 비고 |
|---------|-----|-----|
| 3D 아바타 체형과 입력 파라미터 간 시각적 일치 | 육안 검수 + screenshot 비교 | Playwright visual diff |
| 의류 클리핑 (아바타 몸 관통) | 0건 허용 | GLB 렌더링 후 자동 픽셀 검사 |
| 의류 규격(S/M/L)과 아바타 사이즈 간 피팅 적합도 | 정의된 허용 범위 내 | SMPL 파라미터 매핑 테이블 기준 |

### 2. 추론 시간 SLA

| 상황 | 허용 시간 | 측정 기준 |
|-----|---------|---------|
| 단일 요청 (정상 부하) | 15초 이내 | FastAPI `/fitting/infer` 응답 시간 |
| 큐 대기 포함 (동시 10 요청) | 60초 이내 | k6 부하 시나리오 |
| 타임아웃 처리 | 90초 후 에러 반환 | 클라이언트 폴링 종료 확인 |

### 3. 체형 입력 경계값 및 극단값 테스트

```
# 테스트 파라미터 범위
키(height):     최솟값 140cm, 최댓값 210cm, 경계 초과(139 / 211)
몸무게(weight): 최솟값 35kg,  최댓값 180kg, 경계 초과(34 / 181)
가슴둘레:        60cm ~ 140cm
허리둘레:        50cm ~ 130cm
엉덩이둘레:     60cm ~ 150cm

# 극단값 시나리오
1. 키 210cm + 체중 180kg (최대-최대 조합)
2. 키 140cm + 체중 35kg  (최소-최소 조합)
3. 비율 불균형: 키 200cm + 허리둘레 50cm
4. 경계 초과 입력 → 422 Unprocessable Entity 반환 + 클라이언트 입력 오류 메시지 표시
5. 음수 입력, 문자열 입력 → 클라이언트 단에서 차단, API는 400 반환
```

---

## C. 커머스 플로우 E2E

**목표**: 회원가입부터 배송조회까지 전체 구매 여정에서 데이터 누락 없이 완주함을 검증한다.

### 핵심 E2E 시나리오

```
시나리오 1 — 신규 회원 구매 완주
  1. 회원가입 (이메일 인증 포함)
  2. 로그인 → JWT 발급 확인
  3. 상품 검색 (키워드: "오버핏 자켓")
  4. 상품 상세 진입 → 3D 뷰어 로딩 확인
  5. AI 피팅 실행 → 결과 수신 대기
  6. 사이즈 선택 → 장바구니 담기
  7. 장바구니 확인 → 수량 변경
  8. 주문서 작성 (배송지 입력)
  9. 결제 진행 (테스트 카드 사용)
  10. 주문 완료 페이지 → 주문번호 표시 확인
  11. 마이페이지 > 주문내역 → 방금 주문 조회
  12. 배송조회 링크 활성화 확인

검증 포인트:
  - 10단계: 주문 DB에 레코드 생성 여부 (API GET /orders/{id})
  - 11단계: 주문 상태 "결제완료" 반영 여부
  - 전 단계: 콘솔 에러 0건

시나리오 2 — 장바구니 품절 처리
  1. 상품 장바구니 담기
  2. 재고 0으로 DB 수정 (테스트 픽스처)
  3. 주문서 진행 → "품절" 안내 및 결제 버튼 비활성화 확인

시나리오 3 — 결제 실패 후 재시도
  1. 주문서 작성 완료
  2. 결제 실패 카드번호 입력
  3. 실패 메시지 표시 확인
  4. 재시도 → 정상 결제 완료
  5. 중복 주문 미생성 확인 (주문 1건만 존재해야 함)
```

---

## D. 브랜드 어드민 플로우

**목표**: 브랜드(입점사) 담당자가 상품을 등록하고 3D 에셋을 업로드하여 승인 완료까지 플로우가 정상 동작함을 검증한다.

```
시나리오 — 상품 등록 및 3D 에셋 승인
  1. 브랜드 어드민 로그인
  2. 상품 등록 폼 작성 (상품명, 가격, 카테고리, 사이즈 정보)
  3. 상품 이미지 업로드 → S3 presigned URL 발급 확인
  4. GLB 파일 업로드 (테스트용 Draco 압축 GLB, 약 5MB)
     - 허용 포맷: .glb only
     - 허용 용량: 50MB 이하
     - 초과 파일 → 에러 메시지 확인
  5. 업로드 완료 → 상품 상태 "검토중" 확인
  6. 슈퍼어드민 계정으로 전환 → 상품 승인 처리
  7. 상품 상태 "판매중" 전환 확인
  8. 일반 사용자 계정으로 전환 → 상품 검색 결과 노출 확인
```

---

## E. MSA API 정합성

**목표**: Spring Cloud Gateway 하위 마이크로서비스 간 Kafka 이벤트 및 동기 REST 호출에서 데이터 불일치가 발생하지 않음을 검증한다.

### 검증 대상 서비스 간 데이터 흐름

| 발신 서비스 | 수신 서비스 | 이벤트/API | 검증 항목 |
|-----------|-----------|-----------|---------|
| Order Service | Payment Service | `order.created` (Kafka) | 결제 요청 금액 = 주문 금액 |
| Payment Service | Order Service | `payment.completed` (Kafka) | 주문 상태 "결제완료" 전환 |
| Order Service | Inventory Service | `order.confirmed` (Kafka) | 재고 차감 수량 = 주문 수량 |
| Product Service | Search Service | 상품 등록/수정 이벤트 | 검색 인덱스 동기화 여부 |
| AI Fitting Service | Order Service | 피팅 결과 저장 | 주문과 피팅 결과 ID 연결 |

### Newman 컬렉션 구성

```
newman/
  smoke.postman_collection.json       # 현재 존재 — 전체 서비스 헬스체크
  collections/
    auth-service.postman_collection.json
    product-service.postman_collection.json
    order-service.postman_collection.json
    payment-service.postman_collection.json
    fitting-service.postman_collection.json
    admin-service.postman_collection.json
  environments/
    local.postman_environment.json    # 현재 존재
    dev.postman_environment.json
    staging.postman_environment.json
```

---

## F. 성능 및 부하 테스트

**목표**: 동시 접속 증가 시 3D 에셋 전달과 AI 피팅 큐 처리가 SLA를 벗어나지 않음을 검증한다.

### k6 시나리오

```javascript
// 시나리오 1: 상품 목록 + 3D 에셋 동시 접속
// 목표: VU 200명 동시 접속 시 p95 응답 2초 이내
export const options = {
  scenarios: {
    product_list: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 200 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.01'],  // 에러율 1% 미만
  },
};

// 시나리오 2: AI 피팅 큐 처리
// 목표: VU 50명 동시 피팅 요청 시 큐 처리율 95% 이상 (90초 이내 완료)
export const fittingOptions = {
  scenarios: {
    fitting_queue: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<90000'],  // 90초
    http_req_failed: ['rate<0.05'],
  },
};
```

### 성능 측정 항목

| 항목 | SLA 기준 | 측정 도구 |
|-----|---------|---------|
| 상품 목록 API (`GET /products`) | p95 < 500ms | k6 |
| 상품 상세 API (`GET /products/{id}`) | p95 < 800ms | k6 |
| AI 피팅 요청 (`POST /fitting/infer`) | p95 < 15,000ms | k6 |
| GLB 에셋 다운로드 (CloudFront CDN) | p95 < 3,000ms | k6 |
| 주문 생성 API (`POST /orders`) | p95 < 1,000ms | k6 |

---

## 테스트 환경 매트릭스

### 환경별 구분

| 환경 | URL 패턴 | 용도 | Newman 환경 파일 |
|-----|---------|-----|----------------|
| local | `http://localhost:{port}` | 개발 중 빠른 검증 | `local.postman_environment.json` |
| dev | `https://dev.ot-chawon.com` | 통합 개발 서버 | `dev.postman_environment.json` |
| staging | `https://staging.ot-chawon.com` | 릴리즈 전 최종 검증 | `staging.postman_environment.json` |

### 브라우저 호환성 매트릭스

| 브라우저 | 버전 | WebGL 2.0 | Playwright 지원 | 우선순위 |
|--------|-----|-----------|--------------|---------|
| Chrome | 최신 -1 | O | O | P1 |
| Firefox | 최신 -1 | O | O | P1 |
| Safari | 17+ | O | O (macOS) | P1 |
| iOS Safari | 16+ | O | Playwright + BrowserStack | P1 |
| Android Chrome | 최신 | O | Playwright + BrowserStack | P1 |
| Edge | 최신 | O | O | P2 |

### AI 피팅 체형 파라미터 테스트 매트릭스

| 케이스 | 키 | 몸무게 | 가슴 | 허리 | 엉덩이 | 기대 결과 |
|-------|---|--------|-----|-----|-------|---------|
| 정상 평균 | 170cm | 65kg | 90cm | 75cm | 95cm | 피팅 성공 |
| 최솟값 경계 | 140cm | 35kg | 60cm | 50cm | 60cm | 피팅 성공 |
| 최댓값 경계 | 210cm | 180kg | 140cm | 130cm | 150cm | 피팅 성공 |
| 최솟값 초과 | 139cm | 34kg | 59cm | 49cm | 59cm | 422 에러 |
| 최댓값 초과 | 211cm | 181kg | 141cm | 131cm | 151cm | 422 에러 |
| 비율 극단 | 200cm | 40kg | 62cm | 51cm | 62cm | 피팅 성공 (극단 체형) |
| 음수 입력 | -1cm | -1kg | — | — | — | 클라이언트 차단 |
| 문자열 입력 | "abc" | "xyz" | — | — | — | 클라이언트 차단 |

---

## 버그 리포팅 규칙

### 심각도 분류

| 레벨 | 옷차원 특화 예시 | 처리 목표 |
|-----|---------------|---------|
| **Critical** | 결제 완료 후 주문 미생성 / AI 피팅 결과가 완전히 다른 체형으로 렌더링 / JWT 인증 우회 가능 / 주문 금액 오산정 | 즉시 — 당일 hotfix 브랜치 |
| **High** | 3D 뷰어 전체 화면 블랙아웃 / AI 피팅 요청이 항상 타임아웃 / 장바구니 수량 변경 불가 / GLB 업로드 실패 | 다음 스프린트 최우선 |
| **Medium** | 특정 디바이스에서 3D 회전 버벅임 / 피팅 결과 이미지 저화질 / 배송조회 링크 미활성화 | 현재 스프린트 내 |
| **Low** | 3D 뷰어 배경색 미세 오차 / 상품 설명 줄바꿈 이슈 / 어드민 UI 정렬 틀어짐 | 백로그 등록 후 여유 시 |

### 버그 리포트 필수 포함 항목

```
[버그 리포트 템플릿]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
제목       : [심각도] 증상 요약 (예: [Critical] 결제 완료 후 주문 미생성)
Jira 티켓  : OTC-XXX
심각도     : Critical / High / Medium / Low
발견 환경  : dev / staging / local | 브라우저/OS | 디바이스 모델
재현율     : X/5 회 (예: 5/5, 3/5)
재현 절차  :
  1. ...
  2. ...
  3. ...
기대 동작  : (정상 동작 기술)
실제 동작  : (버그 현상 기술)
첨부 파일  : 스크린샷, 영상, 콘솔 로그, 네트워크 탭 HAR
관련 API   : POST /orders (HTTP 201 기대 → 실제 응답 코드 기재)
관련 서비스: Order Service / Payment Service / ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 우선순위 처리 기준

- **Critical**: 발견 즉시 #bugs 채널 @here 태그 + Jira 생성 + PM에게 DM. 핫픽스 브랜치 개설 요청.
- **High**: 발견 당일 Jira 생성 + #bugs 채널 알림. 다음 스프린트 플래닝에 반드시 포함.
- **Medium/Low**: Jira 생성 후 백로그 정리 시 PM과 우선순위 조율.

---

## 자동화 테스트 전략

### Playwright E2E 시나리오

```
tests/e2e/
  auth/
    signup.spec.ts          # 회원가입 + 이메일 인증 플로우
    login.spec.ts           # 로그인 + JWT 발급
  commerce/
    product-search.spec.ts  # 검색 + 필터 + 정렬
    cart.spec.ts            # 장바구니 담기 + 수량 변경 + 삭제
    checkout.spec.ts        # 주문서 작성 + 결제 완주 (테스트 카드)
    order-history.spec.ts   # 마이페이지 주문내역 + 배송조회
  fitting/
    fitting-flow.spec.ts    # 체형 입력 → 피팅 실행 → 결과 수신
    fitting-boundary.spec.ts# 경계값/극단값 입력 검증
  viewer/
    glb-loading.spec.ts     # GLB 로딩 성능 + 폴백 UI
    interaction.spec.ts     # 회전/줌/더블탭 인터랙션
    webgl-fallback.spec.ts  # WebGL 미지원 시 graceful degradation
  admin/
    product-register.spec.ts# 상품 등록 + GLB 업로드 + 승인 플로우
  visual/
    fitting-result.spec.ts  # 피팅 결과 screenshot 비교 (기준 이미지 대비)
    viewer-render.spec.ts   # 3D 뷰어 렌더링 screenshot 비교
```

**Playwright 설정 원칙**:
- 기본 타임아웃: `navigationTimeout: 30_000`, `actionTimeout: 10_000`
- AI 피팅 대기: `waitForSelector('[data-testid="fitting-result"]', { timeout: 90_000 })`
- Visual diff 허용 오차: `maxDiffPixelRatio: 0.02` (2%)
- 실패 시 자동 스크린샷 + 비디오 저장 (`on: 'on-first-retry'`)

### Newman API 테스트

```bash
# 스모크 테스트 (현재 존재)
newman run newman/smoke.postman_collection.json \
  -e newman/local.postman_environment.json \
  --reporters cli,htmlextra

# 서비스별 풀 테스트
newman run newman/collections/order-service.postman_collection.json \
  -e newman/environments/dev.postman_environment.json \
  --iteration-count 3 \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/order-service-$(date +%Y%m%d).html

# MSA 정합성 테스트 (서비스 체인)
newman run newman/collections/msa-chain.postman_collection.json \
  -e newman/environments/staging.postman_environment.json \
  --reporters cli,htmlextra
```

**각 컬렉션 필수 포함 항목**:
- 상태 코드 검증 (예: `pm.response.to.have.status(201)`)
- 응답 스키마 검증 (`pm.test` + JSON Schema)
- 서비스 간 ID 연결 검증 (예: `order_id`가 payment 응답에 포함되는지)
- 응답 시간 검증 (예: `pm.expect(pm.response.responseTime).to.be.below(1000)`)

### k6 부하 테스트

```
tests/performance/
  k6/
    product-list.js     # GET /products p95 < 500ms, 에러율 < 1%
    fitting-api.js      # POST /fitting/infer VU 50 동시 처리
    glb-cdn.js          # CloudFront GLB 다운로드 p95 < 3,000ms
    order-create.js     # POST /orders 동시 주문 처리
```

---

## 품질 게이트 (스프린트 릴리즈 필수 통과 조건)

릴리즈 PR을 `develop → main`으로 올리기 전 아래 항목이 **모두 통과**해야 한다.

| # | 항목 | 기준 | 담당 |
|---|-----|-----|-----|
| 1 | Playwright E2E (커머스 핵심) | 전체 통과 (0 failed) | QA |
| 2 | Playwright E2E (3D 뷰어 + 피팅) | 전체 통과 (0 failed) | QA |
| 3 | Newman 스모크 테스트 | 전체 통과 (0 failed) | QA |
| 4 | Newman MSA 정합성 | 전체 통과 (0 failed) | QA |
| 5 | Visual Regression | 기준 이미지 대비 diff 2% 이내 | QA |
| 6 | k6 상품 목록 API | p95 < 500ms, 에러율 < 1% | QA |
| 7 | k6 AI 피팅 API | p95 < 15,000ms, 에러율 < 5% | QA |
| 8 | Jest (FE 단위) | 커버리지 70% 이상 | FE |
| 9 | JUnit (BE 단위) | 커버리지 70% 이상 | BE |
| 10 | pytest (AI/ML 단위) | 커버리지 70% 이상 | AI/ML |
| 11 | 미처리 Critical 버그 | 0건 | QA |
| 12 | 미처리 High 버그 | 0건 | QA + PM |

**품질 게이트 실패 시 처리**:
- 게이트 실패 항목을 Jira에 즉시 등록 후 #dev 채널 공지
- PM이 릴리즈 연기 여부 결정
- Critical/High 버그 미해결 상태에서의 릴리즈는 PM + 팀 전원 동의 필요

---

## Sub Agent 간 협업 규칙

### QA가 받는 것 (Input)

| 발신 에이전트 | 전달 내용 | QA 수신 방법 |
|-------------|---------|------------|
| **FE** | 배포 완료 알림, 테스트 가능한 URL | #dev 채널 + Jira 코멘트 |
| **BE** | OpenAPI(Swagger) 명세 업데이트 | Jira 핸드오프 코멘트 + Swagger URL |
| **AI/ML** | 피팅 API 스펙, 입출력 포맷 변경 | Jira 코멘트 (`fitting-service` 티켓) |
| **3D** | GLB 에셋 경로 및 포맷 확정 | Jira 핸드오프 코멘트 + S3 경로 |
| **DevOps** | 환경별 URL, 포트, CDN 경로 | `dev.postman_environment.json` 업데이트 |

### QA가 주는 것 (Output)

| 수신 에이전트 | 전달 내용 | 전달 방법 |
|-------------|---------|---------|
| **PM** | 스프린트 테스트 결과 보고서, 품질 게이트 통과 여부 | Jira + #dev 채널 |
| **FE/BE/AI** | 버그 리포트 (심각도 분류, 재현 절차, 스크린샷) | Jira 버그 티켓 + #bugs 채널 |
| **DevOps** | 부하 테스트 결과 (k6 보고서), 성능 이슈 | Jira + `reports/` 디렉터리 |

### 블로커 발생 시

1. Jira 티켓 상태를 `Blocked`로 전환
2. 블로커 내용을 티켓 코멘트에 기재 (무엇이 없어서 테스트 불가인지 구체적으로)
3. #dev 채널에 블로커 공지 및 담당 에이전트 태그
4. PM에게 DM으로 우선순위 조율 요청

---

## Jira 운영 규칙

- **티켓 없는 테스트 작업 금지** — 모든 테스트 시나리오, 버그 리포트는 Jira 티켓 기준으로 관리한다.
- **버그 티켓 생성 시 필수 필드**: 심각도(Critical/High/Medium/Low), 재현 절차, 환경 정보, 첨부 파일
- **커밋과 티켓 연결** — 자동화 테스트 코드 커밋 시 Jira 번호 포함. 예: `test: 결제 플로우 E2E 추가 (OTC-234)`
- **테스트 결과 코멘트 필수** — 테스트 실행 후 Jira 티켓에 결과(통과/실패, 실행 날짜, 환경) 코멘트 등록
- **상태 전환 규칙**:
  ```
  버그 티켓: Open → In Progress (담당 개발자가 수정 시작) → In Review (QA 재검증) → Done (통과) / Reopened (재현)
  테스트 태스크: To Do → In Progress → Done
  ```

---

## Slack 운영 규칙

| 이벤트 | 채널 | 형식 |
|-------|-----|-----|
| Critical 버그 발견 | #bugs | `[Critical] 제목 — 재현 절차 요약 + Jira 링크` @here |
| High 버그 발견 | #bugs | `[High] 제목 — Jira 링크` |
| 스프린트 테스트 완료 보고 | #dev | 품질 게이트 결과 요약 테이블 |
| 블로커 발생 | #dev | 블로커 내용 + 담당 에이전트 태그 |
| 부하 테스트 결과 이상 | #alerts | k6 보고서 요약 + SLA 초과 항목 |
| 품질 게이트 실패 | #dev | 실패 항목 목록 + 릴리즈 보류 여부 |

---

## 주의사항

### 테스트 데이터 원칙

1. **실 개인정보 사용 금지** — 테스트 픽스처에는 익명 더미 데이터만 사용. 예: `test_user_001@ot-chawon.test`
2. **실 결제 수단 사용 금지** — PG사 테스트 카드번호만 사용. 예: `4111111111111111`
3. **테스트 후 데이터 정리** — E2E 테스트 실행 후 생성된 주문/회원 데이터는 teardown에서 삭제
4. **AI 피팅 테스트에 실 신체 사진 사용 금지** — 픽스처 체형 파라미터(숫자값)만 사용

### 자동화 안정성 원칙

1. **셀렉터 우선순위**: `data-testid` > `aria-label` > CSS 클래스. 클래스 기반 셀렉터는 FE 리팩터링 시 쉽게 깨지므로 최대한 지양한다.
2. **비동기 대기**: `waitForSelector`, `waitForResponse` 사용. 고정 `sleep` 사용 금지.
3. **테스트 간 독립성**: 각 테스트는 독립적인 계정 + 데이터로 실행. 전역 상태 공유 금지.
