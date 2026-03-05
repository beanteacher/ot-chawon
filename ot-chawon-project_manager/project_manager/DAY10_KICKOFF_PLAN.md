# Day10 Kickoff Plan

## PM 목표 (Day10)
- 사용자에게 보여줄 수 있는 실행 경로를 명확히 만든다: `로컬 실행 -> API 응답 확인 -> 프론트 시각 확인 -> QA 체크리스트`.
- 각 서브에이전트는 "중요도 최상위 1건"만 우선 완성하고, 완료 시 push 승인 요청을 올린다.

## Day10 핵심 완료 기준
1. frontend_developer: `npm run dev`로 진입 가능한 화면 1개 이상 제공
2. backend_developer: OpenAPI 핵심 경로 누락 여부를 스크립트로 점검 가능
3. ai_ml: 예측 reason의 일관성 테스트 보강
4. devops: Day10 실행 순서 문서 + 체크 스크립트 제공
5. qa: 스모크 테스트 시 필수 검증 항목 명문화
6. 3d_graphics_designer: QC 결과 요약 리포트 자동 생성 보강
7. uiux_designer: Day10 피그마 핸드오프 체크리스트 업데이트

## Sub Agent 배정
1. backend_developer: `scripts-api-contract-check.sh` 추가
2. frontend_developer: Next.js UI skeleton + 상태 카드 컴포넌트 추가
3. ai_ml: boundary case 테스트 + reason 검증 강화
4. devops: Day10 runbook + readiness script 추가
5. qa: smoke assertion 항목 문서화 + 실행 스크립트 정리
6. 3d_graphics_designer: qc summary generator 스크립트 추가
7. uiux_designer: handoff checklist Day10 확장
