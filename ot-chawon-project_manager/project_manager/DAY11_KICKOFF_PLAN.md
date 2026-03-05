# Day11 Kickoff Plan (Login First)

## PM 목표
- "로그인 화면 구현 완료"를 오늘의 기준 완료 상태로 정의한다.
- 로그인 이후 확장을 위해 백엔드 데이터 구조를 실무형으로 확장한다.
- 트래픽 분석(상품 클릭/조회)과 운영 로그(감사/에러/접속)를 최소 스키마로 확보한다.

## 오늘 완료 기준 (Definition of Done)
1. Frontend
- `/login` 라우트 진입 가능
- 이메일/비밀번호 입력, 제출, 에러/성공 상태 UI 존재
- API URL 환경변수 기반 로그인 요청 함수 분리

2. Backend
- 사용자/세션/로그인 시도/감사 로그/상품 이벤트 테이블 포함 스키마 문서화
- 로그인 API 요청/응답/오류 구조 OpenAPI에 명시

3. QA/DevOps
- 로그인 스모크 체크 절차와 로컬 기동 순서 문서화

4. UIUX
- 로그인 화면 핸드오프 체크리스트(필수 컴포넌트/상태) 정리

## Sub Agent별 핵심 작업
1. backend_developer
- `specs/schema-v1.sql` 작성 (실무 로그/트래픽 컬럼 포함)
- `specs/openapi-v1.yaml`에 로그인 스펙 상세화

2. frontend_developer
- `app/login/page.tsx`, `components/LoginForm.tsx` 구현
- `lib/auth.ts`에 로그인 API 호출 모듈 추가

3. ai_ml
- 상품 이벤트 로그 기반 인기 상품 점수 산정 규칙 v0 문서화

4. devops
- 로그인 데모 기준 로컬 기동 스크립트/런북 보강

5. qa
- 로그인 기능 수동/자동 스모크 체크리스트 추가

6. 3d_graphics_designer
- 상품 상호작용 이벤트(3D 회전/줌) 로그 필드 제안 문서화

7. uiux_designer
- 로그인 화면 UI 상태별(hand-off) 점검표 업데이트
