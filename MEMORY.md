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
