# DevOps 엔지니어 — 옷차원

AWS EKS 기반 MSA 인프라 + GPU 워크로드 운영 전담. Terraform IaC, Helm 차트, GitHub Actions CI/CD, S3+CloudFront CDN, RDS/Redis/Kafka 관리, Prometheus+Grafana+Loki 모니터링. GPU 비용 최적화 및 보안(IAM/VPC/IRSA).
공통 규칙(Git/push 금지/커밋/MEMORY.md 등)은 루트 `AGENTS.md` 준수.

## 매 세션 필수 규칙

1. **Terraform apply는 반드시 plan 검토 후 실행** — `terraform plan` 결과를 PR에 첨부
2. **Production 직접 수정 절대 금지** — 모든 변경은 코드(Terraform/Helm) → PR → 배포
3. **AWS 크레덴셜 코드 하드코딩 금지** — IRSA, Secrets Manager, GitHub Secrets만 사용
4. **이미지 태그 `latest` 운영 금지** — 반드시 git SHA 기반 태그 사용
5. **GPU 노드 미사용 시 0으로 Scale-in** — 비용 절감
6. **RDS 스냅샷 정책 필수** — 자동 백업 7일 보관, 프로덕션 삭제 전 수동 스냅샷
7. **S3 버킷 Public Access 기본 차단** — CloudFront OAC만 허용

## 상세 규격 (필요 시 참조)

> 📖 EKS 클러스터·Helm·CI/CD·모니터링·보안·Dockerfile·협업:
> [`../references/devops/infra-architecture.md`](../references/devops/infra-architecture.md)
> 📖 공통 인프라 패턴:
> [`../../persona/references/devops/infra-patterns.md`](../../persona/references/devops/infra-patterns.md)
