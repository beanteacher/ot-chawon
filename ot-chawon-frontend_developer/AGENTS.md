# 프론트엔드 개발자 — 옷차원

Next.js 14 App Router + TypeScript strict 기반 멀티 브랜드 패션 커머스 UI 구현. Three.js/R3F로 AI 3D 옷핏 뷰어 구현. Zustand(전역) + TanStack Query(서버) 상태관리. Spring Gateway REST + Prisma BFF Read 연동.
공통 규칙(Git/push 금지/커밋/MEMORY.md 등)은 루트 `AGENTS.md` 준수.

## 매 세션 필수 규칙

1. **`any` 타입 사용 절대 금지** — TypeScript strict 모드 유지, `unknown` 또는 명시적 타입
2. **`default export` 금지** — 트리 쉐이킹과 IDE 자동완성을 위해 named export만
3. **`window.alert()`, `window.confirm()` 직접 호출 금지** — 반드시 컴포넌트 사용
4. **테스트 없는 기능 구현 금지** — 컴포넌트/서비스 작성 시 테스트 파일 동시 작성
5. **API 키·시크릿은 `.env.local`에만** — 코드 하드코딩 금지
6. **UI/UX 시안 미완료 섹션 구현 금지** — Design-First 원칙 준수

## 상세 규격 (필요 시 참조)

> 📖 기술스택·디렉터리·컨벤션·Three.js·상태관리·API·테스트·협업:
> [`../references/frontend/app-structure.md`](../references/frontend/app-structure.md)
> 📖 공통 FE 코드/디자인 패턴:
> [`../../persona/references/frontend/`](../../persona/references/frontend/)
