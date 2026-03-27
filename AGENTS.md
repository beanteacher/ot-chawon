# 옷차원 (Ot-chawon) AI 에이전트 작업 가이드

## 프로젝트 개요

- **프로젝트명**: 옷차원 (Ot-chawon)
- **GitHub**: https://github.com/beanteacher/Ot-chawon (Public)
- **계정**: beanteacher
- **로컬**: `C:\Users\wisecan\Desktop\min\workspace\ot-chawon`

무신사 레퍼런스 멀티 브랜드 패션 커머스. 핵심 차별점: **AI 3D 옷핏** — 체형 기반 가상 피팅 시뮬레이션.

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query, Three.js |
| **Backend** | Java 17, Spring Boot 3, Spring Cloud Gateway, Spring Security, JPA/Hibernate |
| **DB** | MySQL 8 (서비스별 독립 DB), Redis (캐시/세션), Prisma (BFF Read) |
| **AI/ML** | Python 3.11, FastAPI, PyTorch, SMPL/SMPL-X, Stable Diffusion |
| **3D** | Blender, Three.js, glTF/GLB, Draco 압축, PBR 텍스처 |
| **인프라** | AWS (EKS, RDS, S3, CloudFront), Docker, Terraform, GitHub Actions, Grafana/Prometheus |
| **메시징** | Apache Kafka |

---

## 매 세션 필수 규칙

### git push 자동 실행 절대 금지
- 모든 에이전트는 git push를 자동으로 실행하지 않는다.
- push 전 반드시 사용자에게 대상 브랜치·커밋 수·변경 파일·실행 명령어를 보고하고 허가를 받는다.
- `main` 브랜치 직접 push 절대 금지 — PR을 통해 병합.

### 커밋 메시지 컨벤션
- `<type>: <한글 또는 영어 설명>` (scope 표기 금지)
- type: feat / fix / docs / style / refactor / test / chore / perf
- 커밋과 Jira 티켓 연결: `feat: 상품 3D 뷰어 추가 (OTC-123)`

### 필수 준수 사항
1. 커밋 전 반드시 `git status`로 변경 파일 확인
2. 민감 정보(토큰, 비밀번호 등)는 `.env`에 분리 + `.gitignore` 등록
3. 테스트 코드 없는 기능 구현 금지 (FIRST 패턴 준수)
4. 작업 전 항상 최신 코드 `git pull` 동기화
5. UI/UX 시안 미완료 섹션의 FE 선행 구현 금지 (Design-First)

### 스프린트 운영 프로세스

#### 작업 시작 시 (PM 역할)
1. **JIRA 스크럼 발행** — 해당 스프린트의 JIRA 티켓 생성/배정
2. **JIRA 스프린트 시작** — 스프린트 활성화
3. **사용자에게 선보고** — 가장 중요한 작업 1개 + 실제 작업물 경로 (placeholder 금지)
4. Sub Agent 작업 시작

#### 작업 종료 시
1. **각 Worker JIRA 완료 처리** — 작업 완료된 티켓을 "완료" 상태로 전환 (jira_transition_issue)
2. **각 Worker 커밋 내역 정리** — 역할별 git commit (커밋 컨벤션 준수)
3. **PM 커밋 내역 확인 후 보고** — 산출물 경로, DoD 충족 여부, 변경 파일 수 사용자에게 보고
4. **PM PR 생성** — develop 브랜치로 PR 생성 (main 직접 push 금지)
5. **사용자 merge 대기** — 사용자가 PR 승인/merge할 때까지 대기
6. **merge 후 JIRA 스프린트 종료** — 스프린트 완료 처리

### MEMORY.md 업데이트 (필수)
- **작업 종료 시 반드시 `MEMORY.md`를 업데이트**한 뒤 커밋/종료
- 위치: `ot-chawon/MEMORY.md` — 다른 경로 절대 금지
- MEMORY.md 업데이트 없이 커밋/종료 금지

### Design-First 워크플로우 (Sprint 2-4/2-5 교훈)
- **UI/UX 시안(Figma manifest) 완료 후에만 FE 구현 허용** — 시안 없이 FE 코드 작성 절대 금지
- 팀 구성 시 UI/UX 시안 태스크 → FE 구현 태스크 순서로 의존성 설정
- UI/UX manifest 산출물: `ot-chawon-frontend_developer/uiux_designer/figma-manifests/{산출물명}/`
- 필수 4파일: `manifest.json` + `manifest.import-data.json` + `code.js` + `ui.html`
- manifest 형식은 참조 프로젝트(`persona/uiux_designer/`) 확인 후 작성 — 자의적 형식 금지
- code.js는 **ES5 호환 필수** (Figma 런타임 제약): bare catch, arrow function, template literal, forEach 금지

### 팀 리더(Lead) 워커 관리 규칙
- **Worker가 5분 이상 stuck/무한루프일 때 수동 대기 금지** — 리더가 능동적으로 원인을 조사하고 해결 가이드를 제공해야 한다.
- 조사 방법:
  1. 해당 워커의 작업 디렉터리를 직접 Read/Glob으로 확인 (진행 상황 파악)
  2. context7 MCP 등을 활용해 라이브러리/프레임워크 공식 문서 조회 (설정 오류, 올바른 사용법 확인)
  3. 조사 결과를 바탕으로 **구체적인 해결 방안**을 SendMessage로 워커에게 전달
  4. 필요시 Explore agent를 스폰해서 병렬로 원인 분석
- **단순 "상태 확인" 메시지만 반복 전송 금지** — 원인 분석 없는 상태 확인은 의미 없음

### 팀 실행 완료 후 체크리스트 (리더 필수)
팀 셧다운 전에 반드시 아래 항목을 수행한다. **하나라도 누락 시 셧다운 금지.**

1. **JIRA 티켓 상태 업데이트** — 완료된 티켓은 JIRA에서 "진행 중" → "완료" 상태로 전환 (jira_transition_issue 사용)
2. **PM에게 결과 보고** — 각 워커의 산출물 경로·DoD 충족 여부를 PM에게 전달
3. **Worker 산출물 검증** — 셧다운 전 각 워커가 생성한 파일이 실제로 존재하는지 확인
4. **사용자 요청 사항 처리** — 사용자가 대화 중 요청한 질의(PM 문의, 추가 작업 등)를 누락 없이 처리
5. **MEMORY.md 업데이트** — 스프린트 진행 결과를 MEMORY.md에 기록
6. **Slack으로 PM/팀에게 스프린트 완료 알림** — 산출물 요약 포함하여 관련 채널에 메시지 전송
7. **JIRA 티켓에 완료 코멘트 추가** — 각 티켓에 산출물 경로, DoD 충족 여부 코멘트
8. **커밋 생성** — 워커들이 생성한 파일을 역할별로 git commit (커밋 컨벤션 준수)
9. **PR 생성** — develop 브랜치로 PR 생성 (main 직접 push 금지, 사용자 승인 필수)

---

## 상세 규칙 (필요 시 참조)

> 📖 브랜치 전략, PR 규칙, Jira 워크플로우, Slack 채널, FIRST 테스트 원칙, 민감 데이터 처리, 버그 심각도, DoD, 협업 매트릭스:
> [`references/common/operation-rules.md`](references/common/operation-rules.md)
