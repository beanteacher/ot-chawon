# 옷차원 프로젝트 MEMORY

## Sprint 1 (2026-03-26) — 기반 구축 완료

### 완료 티켓 (8/8)

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-26 | MySQL ERD & Flyway 마이그레이션 | Backend | ot-chawon-backend_developer/backend-java/, docs/erd/ |
| SCRUM-25 | Spring Cloud Gateway + JWT | Backend | ot-chawon-backend_developer/gateway-service/ |
| SCRUM-28 | Next.js 14 App Router 초기 세팅 | Frontend | ot-chawon-frontend_developer/src/ |
| SCRUM-29 | FastAPI AI 추론 서버 기본 구조 | AI/ML | ot-chawon-ai_ml/app/ |
| SCRUM-30 | GLB/SMPL 인터페이스 명세 | 3D+AI+PM | docs/3d-spec/, docs/smpl-spec/ |
| SCRUM-23 | Docker Compose 로컬 환경 | DevOps | ot-chawon-devops/docker-compose.yml |
| SCRUM-24 | GitHub Actions CI 파이프라인 | DevOps | .github/workflows/ci.yml |
| SCRUM-27 | Kafka 이벤트 스키마 | Backend+PM | docs/events/ |

### 주요 결정 사항
- 6개 서비스별 독립 DB (Database per Service): otc_user_db ~ otc_brand_db
- Gateway(8080) → 6개 서비스 라우팅 (8081~8086)
- JWT: Access 15분, Refresh 7일 (Redis), 블랙리스트 지원
- Kafka 토픽 명명: otc.{서비스}.{이벤트}, 컨슈머 그룹: {서비스명}-group
- SMPL β 파라미터 10개 벡터 (범위 [-5, 5])
- GLB 에셋: Draco 압축, kebab-case 명명, SMPL 24 joints A-pose

### 브랜치 상태
- `develop` 브랜치 생성, 8개 커밋 push 완료
- PR 생성 대기 (gh CLI 인증 필요)

### 미처리 사항
- ~~UI/UX 디자이너 Sprint 1 업무 부재~~ → Sprint 2-1에서 해결됨

---

## Sprint 2 (2026-04-03 ~ 04-09) — 데일리 스프린트 체제

Sprint 2를 5일 단위 데일리 스프린트로 분할 운영. BE+FE+UI/UX 혼합 배정.

### JIRA 스프린트 구조
| 스프린트 | 날짜 | 핵심 작업 |
|---------|------|----------|
| Sprint 2-1 | 4/3 금 | 디자인 시스템 + 인증 API |
| Sprint 2-2 | 4/6 월 | 폼/모달 + 로그인 UI + 인증 완성 |
| Sprint 2-3 | 4/7 화 | 토스트/스켈레톤 + 프로필 API + 체형정보 |
| Sprint 2-4 | 4/8 수 | 에러 페이지 + UI/UX 시안 3건 |
| Sprint 2-5 | 4/9 목 | 장바구니 시안 + 반응형 + QA |

### Sprint 2-1 Day 1 (2026-03-26 구현) — 완료

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-64 | 디자인 토큰/테마 설정 | UI | tailwind.config.ts, globals.css (CSS 변수, 다크모드) |
| SCRUM-65 | 공통 컴포넌트 (Button, Input, Select, Checkbox, Label) | UI | src/components/ui/ (6파일) |
| SCRUM-66 | 공통 레이아웃 (Header, Footer, MobileNav, Sidebar) | UI | src/components/layout/ (5파일), layout.tsx 수정 |
| SCRUM-31 | BE 회원가입/로그인 API (JWT+BCrypt+Redis) | BE | user-service/src/main/java/com/otchawon/user/ (15파일) |

**커밋**: `8c7d1db` (33파일, +1810줄) on `develop`

### 신규 생성 UI/UX 티켓 (17건)
- Sprint-2: SCRUM-64~72 (디자인 토큰, 공통 컴포넌트, 레이아웃, 폼, 모달, 토스트, 스켈레톤, 에러 페이지, 반응형)
- Sprint-3: SCRUM-73~77 (상품 카드, 테이블, 검색, 상품 페이지, 마이페이지)
- Sprint-4: SCRUM-78~80 (장바구니, 주문/결제, 주문 내역)

### Sprint 2-2 (2026-03-26 구현) — 완료

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-67 | 폼 컴포넌트 (Textarea, FormField) | FE | src/components/ui/Textarea.tsx, FormField.tsx |
| SCRUM-68 | 모달/다이얼로그 (Modal, ConfirmDialog) | FE | src/components/ui/Modal.tsx, ConfirmDialog.tsx |
| SCRUM-69 | 로그인 페이지 실제 구현 | FE | src/app/(auth)/login/page.tsx |
| SCRUM-69 | 회원가입 페이지 실제 구현 | FE | src/app/(auth)/signup/page.tsx |
| — | BE 프로필 조회 API (GET /api/auth/me) | BE | AuthController.java, AuthService, AuthServiceImpl, gateway application.yml |

**커밋**: `d7e54e0` (11파일, +594줄) on `develop`

**구현 상세**:
- Textarea: label, error, helperText, maxLength 카운터, resize 옵션
- FormField: label + children + error 래퍼, required 마크(*), role="alert" 접근성
- Modal: createPortal, ESC/overlay 닫기, body scroll lock, size(sm/md/lg/xl), aria-modal
- ConfirmDialog: Modal 기반, primary/danger variant, loading 지원
- 로그인: useLogin() 훅 연동, 성공 시 router.push('/'), 에러 표시, loading 상태
- 회원가입: apiClient POST /api/auth/signup, 성공 시 /login 리다이렉트
- BE /api/auth/me: JWT → extractUserId → UserResponse 반환, Gateway 라우트 추가
- UI 컴포넌트 배럴 export (index.ts) 갱신 완료
- TypeScript tsc --noEmit 에러 0건

### Sprint 2-3 (2026-03-26 구현) — 완료

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-69 | 토스트/알림 컴포넌트 | FE | src/components/ui/Toast.tsx, ToastProvider.tsx, src/hooks/useToast.ts |
| SCRUM-70 | 로딩 스피너/스켈레톤 UI | FE | src/components/ui/Spinner.tsx, Skeleton.tsx, SkeletonCard.tsx, SkeletonList.tsx |
| SCRUM-71 | 에러 페이지 (404/500/403) | FE | src/app/not-found.tsx, error.tsx, (main)/forbidden/page.tsx, src/components/error/ErrorFallback.tsx |
| — | BE 프로필 수정 API + 체형정보 CRUD | BE | ProfileController.java, ProfileService, ProfileServiceImpl, BodyMeasurement.java, BodyMeasurementRepository, DTOs, V2 마이그레이션 |

**구현 상세**:
- Toast: success/error/warning/info 4타입, 자동 dismiss(3초), 스택형 다중 토스트, 액션 버튼, aria-live 접근성
- ToastProvider: createPortal 기반 앱 레벨 컨테이너, providers.tsx에 추가
- useToast: Zustand store 기반 토스트 상태 관리 훅
- Spinner: size(sm/md/lg), color variants, 인라인/전역 로딩
- Skeleton: variant(text/circular/rectangular), animation(pulse/wave), aria-hidden
- SkeletonCard/SkeletonList: 상품 카드/리스트 스켈레톤 프리셋
- 404 페이지: Next.js 14 not-found.tsx, 홈으로 버튼
- 500 페이지: error.tsx ('use client'), reset() 재시도 기능
- 403 페이지: forbidden/page.tsx, 홈으로/뒤로가기 버튼
- ErrorFallback: 재사용 가능한 에러 UI 컴포넌트
- BE ProfileController: PUT /api/auth/profile, POST/GET/PUT /api/auth/body-measurements
- BodyMeasurement 엔티티: height, weight, chest, waist, hip, shoulder, armLength, legLength
- V2 Flyway 마이그레이션: body_measurements 테이블 생성
- UI 컴포넌트 배럴 export (index.ts) 갱신 완료
- TypeScript tsc --noEmit 에러 0건

### Sprint 2-4 (2026-03-27 구현) — 완료

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-59 | 메인 페이지(상품 피드) UI/UX 시안 | UI/UX+FE | uiux_designer/figma-manifests/main-page-hifi/, src/components/home/, src/components/product/ProductCard.tsx |
| SCRUM-60 | 상품 목록/상세 페이지 UI/UX 시안 | UI/UX+FE | uiux_designer/figma-manifests/product-list-hifi/, product-detail-hifi/, src/components/product/ |
| SCRUM-61 | AI 3D 피팅 결과 페이지 UI/UX 시안 | UI/UX+FE | uiux_designer/figma-manifests/fitting-input-hifi/, fitting-result-hifi/, src/components/fitting/ |

### Sprint 2-5 (2026-03-27 구현) — 완료

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-63 | 장바구니/주문 플로우 UI/UX 시안 | UI/UX+FE | uiux_designer/figma-manifests/cart-hifi/, order-flow-hifi/, src/components/cart/, order/ |
| SCRUM-72 | 반응형/모바일 대응 점검 | FE | 전체 페이지 320px~1440px breakpoint 대응 |

**커밋**: `0d3e0c5` (75파일, +8,751줄) on `develop`

**UI/UX Figma Manifest 12건 (B&W 톤)**: design-system-init, components-hifi, auth-pages-hifi, error-pages-hifi, main-page-hifi, product-list-hifi, product-detail-hifi, fitting-input-hifi, fitting-result-hifi, cart-hifi, order-flow-hifi, products-fitting

**신규**: uiux_designer/AGENTS.md (UI/UX 디자이너 에이전트 가이드)

---

## Sprint 3-1 (2026-03-27) — UI/UX 시안 + FE 보강

### 완료 티켓 (5/5)

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-73 | 상품 카드 컴포넌트 (리스트/그리드) | FE | src/components/product/ProductCard.tsx, src/app/(main)/products/page.tsx |
| SCRUM-74 | 테이블 컴포넌트 (정렬, 페이지네이션) | UI/UX | uiux_designer/figma-manifests/table-hifi/ (4파일) |
| SCRUM-75 | 검색 UI (검색바, 필터 패널) | UI/UX | uiux_designer/figma-manifests/search-ui-hifi/ (4파일) |
| SCRUM-76 | 상품 목록/상세 페이지 구현 | FE | products/page.tsx, products/[id]/page.tsx, SizeGuide.tsx 신규 |
| SCRUM-77 | 마이페이지 (프로필, 주문내역, 피팅이력) | UI/UX | uiux_designer/figma-manifests/mypage-hifi/ (4파일) |

**커밋**: `f890616` (17파일, +2,858줄) on `develop`

**UI/UX Figma Manifest 3건 추가 (B&W 톤)**: table-hifi, search-ui-hifi, mypage-hifi
**FE 보강**: ProductCard variant(grid/list)/품절뱃지/3D뱃지, 무한스크롤(IntersectionObserver), SizeGuide 모달, 카테고리 탭 네비게이션

---

## Sprint 3-2 (2026-03-27) — 시안 기반 FE 구현 + SSR 적용 + BE API

### 완료 티켓 (7/7)

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-81 | 테이블 컴포넌트 FE 구현 | FE | src/components/ui/Table.tsx, Pagination.tsx, __tests__/ |
| SCRUM-82 | 검색 페이지 FE 구현 | FE | src/app/(main)/search/, src/components/search/ (8파일), src/hooks/useSearch.ts |
| SCRUM-83 | 마이페이지 FE 구현 | FE | src/app/(main)/mypage/, src/components/mypage/ (6파일) |
| SCRUM-84 | 상품/검색 SSR 적용 | FE | products/page.tsx, ProductListClient.tsx, [id]/page.tsx, ProductDetailClient.tsx, search/SearchClient.tsx |
| SCRUM-37 | 상품 목록/상세/검색 SSR (잔여) | FE | products/, search/ SSR 전환 완료 |
| SCRUM-35 | 상품 CRUD API | BE | product-service/ (Entity 4, Repo 4, DTO 7, Service 4, Controller 2, Exception 2, Test 2) |
| SCRUM-36 | 브랜드 CRUD API | BE | brand-service/ (Entity 5, Repo 3, DTO 6, Service 4, Controller 2, Exception 2, FeignClient 2, Test 2) |

**커밋**: `f465042` (FE 31파일, +3,627줄), `e7c1565` (BE 54파일, +2,167줄) on `develop`

**FE 테스트**: Table 22/22, SearchBar 11/11, MyPage 9/9 통과
**BE 테스트**: ProductService 5/5, ProductController 6/6, BrandService 5/5, BrandController 5/5 통과

**주요 구현 내용**:
- **테이블**: 제네릭 Table<T> 컴포넌트(정렬/빈 상태/hover), Pagination(말줄임/페이지크기 선택)
- **검색**: SearchBar(자동완성/debounce), FilterPanel(카테고리/가격/브랜드/사이즈 4열), ActiveFilterChips, NoSearchResult, RecentKeywords(localStorage), PopularKeywords(순위+트렌드)
- **마이페이지**: 탭 네비게이션(hash), ProfileSection(편집 모달), OrderHistory(상태뱃지 5종), FittingGallery(그리드), AddressManagement(CRUD)
- **SSR**: products/page.tsx + [id]/page.tsx + search/page.tsx Server Component 전환, generateMetadata(OG), Suspense boundary, 클라이언트 분리(ProductListClient, ProductDetailClient, SearchClient)
- **상품 API**: POST/GET/PUT/DELETE /api/products + 카테고리/브랜드 필터/키워드 검색 + 페이지네이션 + Soft Delete
- **브랜드 API**: POST/GET/PUT /api/brands + 어드민 초대/관리(OWNER/ADMIN) + FeignClient(product-service)

### 다음 작업 (Sprint 4)
- ~~SCRUM-78~80 UI/UX 시안 (장바구니, 주문/결제, 주문 내역)~~ → Sprint 4-1에서 장바구니 완료
- ~~BE: 장바구니 API~~ → Sprint 4-1에서 완료
- BE: 주문/결제 API (Sprint 4-2)
- FE: 주문/결제 플로우 FE 구현 (Sprint 4-2)
- ~~Gateway 라우팅~~ → Sprint 4-1에서 완료

---

## Sprint 4-1 (2026-03-27) — 장바구니/주문 CRUD API + FE 장바구니 UI

### 완료 티켓 (2/2)

| JIRA | 요약 | 담당 | 산출물 경로 |
|------|------|------|------------|
| SCRUM-38 | BE: 장바구니 CRUD API + 주문 생성/취소 API | BE | order-service/ (Entity 5, Repo 4, DTO 8, Service 2, Controller 2, Exception 2, Test 4) |
| SCRUM-78 | UI: 장바구니 UI 컴포넌트 | FE | src/components/cart/, src/types/cart.dto.ts, src/services/cartApi.ts, src/store/cartStore.ts, src/hooks/useCart.ts |

**커밋**: `4c22c18` (BE 31파일, +1,605줄), `8dcbdad` (FE 8파일, +504줄), `69c5aff` (Gateway 1파일, +21줄) on `develop`

**BE 테스트**: CartService 7/7, OrderService 7/7, CartController 6/6, OrderController 7/7 — 총 27개 통과
**FE 테스트**: CartItem 6/6, CartSummary 3/3, Cart빈상태 2/2 — 총 11개 통과

**주요 구현 내용**:
- **BE Cart API**: GET/POST/PUT/DELETE /api/carts/items — 장바구니 CRUD (getOrCreateCart 패턴)
- **BE Order API**: POST/GET /api/orders, PUT /api/orders/{id}/cancel — 장바구니→주문 전환, 주문 취소
- **BE Entity**: Cart, CartItem, Order, OrderItem, OrderStatus(8종 상태) — V1__init_order.sql 스키마 기반
- **FE Cart**: CartDto 타입, cartApi 서비스, cartStore (Zustand), useCart 훅 (TanStack Query)
- **FE Cart Page**: DUMMY_CART_ITEMS → API 연동, 로딩/에러 UI, 전체선택/개별선택/수량변경/삭제
- **Gateway**: /api/carts/**, /api/orders/** → order-service(8083) 라우팅 추가

### 다음 작업 (Sprint 4-2)
- SCRUM-39: BE PG사 결제 연동 API
- SCRUM-79: FE 주문/결제 플로우 UI
- SCRUM-80: FE 주문 내역/상세 페이지
