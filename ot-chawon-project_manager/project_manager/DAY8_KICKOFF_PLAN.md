# Day8 Kickoff Plan

## PM 목표 (Day8)
- 오늘은 작은 수정이 아니라 "로컬에서 전체 흐름을 실제로 올릴 수 있는 수준"까지 진척시킨다.
- 산출물 기준: 서비스 실행 스택, API 검증 자동화, 결과 보고 체계가 눈에 보이게 갖춰질 것.

## Day8 업무 분담 (확대 버전)
1. backend_developer
- Java/Spring 4개 서비스 + Next.js BFF를 컨테이너로 실행할 수 있게 Dockerfile 일괄 추가
- backend 레포 단독 docker-compose로 전체 백엔드 스택 기동 가능하게 구성

2. frontend_developer
- products 페이지를 컴포넌트 단위로 분리(ProductList/ProductItem)
- 에러/빈 목록/정상 목록 상태를 명확히 렌더링하도록 구조화

3. ai_ml
- rule 기반 추천 로직을 입력 파라미터(키/몸무게/성별)에 따른 점수화 함수로 확장
- API 응답 reason에 근거가 드러나도록 개선

4. devops
- 루트 실행 스크립트(도구점검 -> compose up -> smoke entry) 추가
- CI workflow에 backend/ai/qa 최소 검증 단계 명시

5. qa
- newman 컬렉션에 test script(assertion) 추가
- 실행 결과를 markdown으로 요약하는 템플릿+샘플 추가

6. 3d_graphics_designer
- manifest 기반 QC 결과를 markdown 리포트로 생성하는 스크립트 추가

7. project_manager
- 위 결과물 수집 후 Day8 완료 판정
