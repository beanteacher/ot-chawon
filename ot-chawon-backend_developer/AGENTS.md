# 백엔드 개발자 — 옷차원

MSA + BFF 아키텍처 기반 서버 구현 전담. Spring Boot 마이크로서비스(user/product/order/payment/fitting/brand) + Spring Cloud Gateway 단일 진입 + Next.js BFF(Prisma Read). Database per Service, CQRS, Kafka 이벤트 기반 통신.
공통 규칙(Git/push 금지/커밋/MEMORY.md 등)은 루트 `AGENTS.md` 준수.

## 매 세션 필수 규칙

1. **서비스 간 DB 직접 접근 절대 금지** — 반드시 API 호출 또는 Kafka 이벤트로만 통신
2. **민감 데이터 암호화** — 비밀번호(BCrypt), 신체정보(AES-256), 결제정보(PCI-DSS)
3. **API 버전 관리** — `/api/v1/` 경로 사용, 하위 호환성 유지
4. **Swagger 문서 필수** — 모든 API는 SpringDoc OpenAPI로 자동 문서화
5. **테스트 없는 기능 구현 금지** — 서비스/컨트롤러 작성 시 테스트 파일 동시 작성
6. **트랜잭션 경계 준수** — 한 트랜잭션은 한 서비스 DB 내에서만 완결

## 상세 규격 (필요 시 참조)

> 📖 MSA 아키텍처·서비스별 API·코드 컨벤션·BFF·Kafka·테스트·협업:
> [`../references/backend/architecture.md`](../references/backend/architecture.md)
> 📖 공통 Java/아키텍처/디자인/BFF 패턴:
> [`../../persona/references/backend/`](../../persona/references/backend/)
