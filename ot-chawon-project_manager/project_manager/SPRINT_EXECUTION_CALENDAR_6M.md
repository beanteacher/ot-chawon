# 스프린트 실행 달력 (개발자별 시점/업무)

## Sprint 1 (주1-2): 로그인 기반 구축
- Backend: 인증 테이블/로그인 API 계약/에러코드 정의
- Frontend: `/login` UI + 인증 요청 모듈
- UI/UX: 로그인 화면/상태 handoff
- QA: 로그인 스모크 체크리스트
- DevOps: 로컬 실행 체크 스크립트
- PM: 도메인/범위/DoD 확정

## Sprint 2 (주3-4): 인증 안정화 + 상품 read 시작
- Backend: refresh/logout/session revoke, 제품 목록 API
- Frontend: 로그인 후 진입 라우팅, 상품 목록 기본 화면
- QA: 인증 계약 테스트 자동화
- DevOps: API/FE 동시 기동 runbook
- PM: M1 리뷰 및 리스크 정리

## Sprint 3 (주5-6): 상품 목록/필터
- Backend: 상품/카테고리/브랜드 조회 + 정렬/필터
- Frontend: 목록/필터 UI
- UI/UX: 목록/카드/필터 패턴 handoff
- QA: 목록 조건별 회귀 케이스

## Sprint 4 (주7-8): 상품 상세 + 이벤트 로깅
- Backend: 상품 상세 + product_event_logs 적재 API
- Frontend: 상세 화면 + 조회/클릭 이벤트 송신
- AI/ML: 이벤트 기반 인기 점수 규칙 v1
- QA: 이벤트 적재 검증 시나리오

## Sprint 5 (주9-10): 장바구니/주문 기본
- Backend: cart/order 생성, 재고 차감 기본 플로우
- Frontend: 장바구니/주문 화면
- QA: 주문 스모크 시나리오
- PM: M2 게이트 점검

## Sprint 6 (주11-12): 운영 로그/대시보드 기초
- Backend: audit_logs/ops 지표 API
- Frontend: 운영 상태 대시보드 v1
- DevOps: 로그 수집 파이프라인 정비
- QA: 운영 시나리오 점검

## Sprint 7 (주13-14): 3D 뷰어 통합 1차
- 3D: 핵심 상품군 GLB 준비/QC
- Frontend: 상세 페이지 3D 뷰어 연동
- Backend: 3D 이벤트 타입 적재
- QA: 3D 렌더/인터랙션 체크

## Sprint 8 (주15-16): 3D 경험 안정화
- 3D: 성능 최적화(폴리곤/텍스처)
- Frontend: 디바이스별 3D 폴백 처리
- DevOps: 정적 자산 배포/캐싱 정책
- PM: M3 게이트 점검

## Sprint 9 (주17-18): AI 피팅 베타 1차
- AI/ML: 사이즈 추천 API 고도화 + reason 체계
- Backend: AI API 연동 게이트웨이
- Frontend: 피팅 입력 폼 + 결과 표시
- QA: 추천 결과 계약/회귀 테스트

## Sprint 10 (주19-20): AI 피팅 베타 2차
- AI/ML: 모델/룰 튜닝, 평가 리포트
- Frontend: 추천 UX 개선(가이드 문구)
- PM: 베타 KPI 점검

## Sprint 11 (주21-22): 성능/보안 강화
- Backend: 로그인 시도 제한/계정 잠금 정책
- DevOps: 부하테스트, 관측성/알림 강화
- QA: 성능/보안 회귀 테스트
- PM: 출시 위험요소 제거 계획

## Sprint 12 (주23-24): 출시 안정화
- 전 팀: 버그버시/회귀/문서화/릴리즈 리허설
- PM: 최종 출시 판정 및 인수인계
- QA: go/no-go 최종 리포트

## 역할별 집중 타이밍 요약
- Backend 집중: S1~S6, S9, S11
- Frontend 집중: S1~S5, S7~S10
- AI/ML 집중: S4, S9~S10
- 3D 집중: S7~S8
- DevOps 집중: S1~S2, S6, S8, S11~S12
- QA 집중: 전 스프린트 (S1부터 게이트 참여)
- UI/UX 집중: S1, S3, S5, S9
