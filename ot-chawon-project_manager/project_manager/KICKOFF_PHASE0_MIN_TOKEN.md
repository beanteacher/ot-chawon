# Phase 0 킥오프 지시서 (Min Token 운영)

목표: 토큰 소모를 최소화하면서 각 Sub Agent가 즉시 착수한다.

## 공통 운영 규칙 (중요)
- Slack/Jira MCP는 킥오프 단계에서 사용 금지.
- 진행 보고는 로컬 파일로만 남긴다.
- 보고 포맷은 5줄 이내로 유지한다.
- 각 에이전트는 "오늘 산출물 1개"만 먼저 만든다.
- 질문이 없으면 바로 구현/작성부터 시작한다.
- 커밋은 자율 진행, push는 반드시 사용자 승인 후 진행한다.

## 보고 위치
- 폴더: `workspace/persona/project_manager/reports/`
- 파일명: `<agent-name>-day1.md`

## Day 1: PM이 각 Sub Agent에게 줄 첫 작업

### 1) backend_developer
- 산출물: `reports/backend_developer-day1.md`
- 첫 작업:
  1. MSA 서비스 경계(최소: auth/user, product, order) 확정
  2. API 경로 초안 작성 (`/api/v1/...`)
  3. DB per Service 테이블 최소 초안 작성
- 완료 기준: "서비스 경계 + API 10개 이내 + 핵심 테이블 목록" 문서화

### 2) frontend_developer
- 산출물: `reports/frontend_developer-day1.md`
- 첫 작업:
  1. App Router 기준 페이지 뼈대 라우트 확정
  2. 공통 레이아웃 + `ui/Button`, `ui/Input` 최소 컴포넌트 범위 확정
  3. API 연동용 gateway baseURL 전략 한 줄 확정
- 완료 기준: "초기 폴더 구조 + 첫 화면 라우트 목록" 문서화

### 3) uiux_designer
- 산출물: `reports/uiux_designer-day1.md`
- 첫 작업:
  1. Design Token v0 확정 (색/타이포/간격)
  2. MVP P0 화면 3개 우선순위 고정 (홈/목록/상세)
  3. 컴포넌트 우선순위 5개 선정
- 완료 기준: "토큰 표 + P0 화면 우선순위" 문서화

### 4) 3d_graphics_designer
- 산출물: `reports/3d_graphics_designer-day1.md`
- 첫 작업:
  1. GLB 납품 규격 v0 확정 (폴리곤/텍스처/용량)
  2. 파일 네이밍 규칙 확정
  3. 샘플 에셋 1개 제작 계획 작성
- 완료 기준: "에셋 규격표 + 샘플 제작 체크리스트" 문서화

### 5) ai_ml_engineer
- 산출물: `reports/ai_ml_engineer-day1.md`
- 첫 작업:
  1. V0 범위 고정: "사이즈 추천" 우선, "이미지 피팅"은 연구 트랙
  2. 입력/출력 스키마 확정 (키, 몸무게, 성별 등)
  3. FastAPI 엔드포인트 2개 정의 (`/health`, `/size/predict`)
- 완료 기준: "V0 API 스펙 + 최소 데이터 스키마" 문서화

### 6) qa_engineer
- 산출물: `reports/qa_engineer-day1.md`
- 첫 작업:
  1. Phase 0 완료 기준(DoD) 테스트 관점 정의
  2. API 기본 검증 체크리스트 작성 (상태코드/응답스키마)
  3. 3D/AI는 스모크 케이스만 우선 정의
- 완료 기준: "DoD 체크리스트 + 스모크 테스트 목록" 문서화

### 7) devops_engineer
- 산출물: `reports/devops_engineer-day1.md`
- 첫 작업:
  1. 로컬 개발용 `docker-compose` 최소 구성안 정의
  2. 환경변수 표준 파일(.env.example) 항목 정의
  3. CI 최소 파이프라인(빌드/테스트) 범위 정의
- 완료 기준: "로컬 실행 최소 스택 + CI 최소 범위" 문서화

### 8) project_manager
- 산출물: `reports/project_manager-day1.md`
- 첫 작업:
  1. 위 7개 Day1 산출물 수집
  2. 충돌 사항(의존성/우선순위) 3개 이내로 정리
  3. Sprint 1 목표 1문장 확정
- 완료 기준: "Sprint 1 Goal + 작업 순서표" 문서화

## 토큰 절약용 커뮤니케이션 룰
- 1회 메시지 최대 8줄
- 상태 보고 형식 고정:
  1. 한 일
  2. 막힌 점
  3. 다음 한 일
- Slack/Jira 이슈 생성은 "Sprint 1 목표 확정 후"에만 수행
