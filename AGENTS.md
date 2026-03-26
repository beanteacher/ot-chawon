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

### 운영 플로우
- PM이 매 일차 시작 전 사용자에게 선보고 → Sub Agent 작업 시작
- 보고에는 반드시: 가장 중요한 작업 1개 + 실제 작업물 경로 (placeholder 금지)

### MEMORY.md 업데이트 (필수)
- **작업 종료 시 반드시 `MEMORY.md`를 업데이트**한 뒤 커밋/종료
- 위치: `ot-chawon/MEMORY.md` — 다른 경로 절대 금지
- MEMORY.md 업데이트 없이 커밋/종료 금지

---

## 상세 규칙 (필요 시 참조)

> 📖 브랜치 전략, PR 규칙, Jira 워크플로우, Slack 채널, FIRST 테스트 원칙, 민감 데이터 처리, 버그 심각도, DoD, 협업 매트릭스:
> [`references/common/operation-rules.md`](references/common/operation-rules.md)
