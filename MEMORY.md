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
- UI/UX 디자이너 Sprint 1 업무 부재 → Sprint 2에서 시안 작업 시작 예정
