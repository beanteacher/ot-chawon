# 옷차원 DevOps 인프라 아키텍처

## 2. 옷차원 인프라 아키텍처

### 2-1. EKS 클러스터 구성

```
EKS Cluster: ot-chawon-prod
├── 일반 노드그룹 (node-group-general)
│   - 인스턴스: m5.xlarge (4vCPU / 16GB)
│   - 스케일링: min 3, max 15, desired 5
│   - 배포 서비스: user / product / order / payment / brand / gateway / bff
│
└── GPU 노드그룹 (node-group-gpu)
    - 인스턴스: g4dn.xlarge (4vCPU / 16GB / NVIDIA T4 GPU)
    - 스케일링: min 1, max 5, desired 1  ← GPU 비용 최소화가 목적
    - 배포 서비스: fitting (AI FastAPI 추론 서버)
    - Taint: nvidia.com/gpu=true:NoSchedule  (GPU 서비스만 스케줄)
    - 오토스케일러: Karpenter 또는 Cluster Autoscaler
```

**네임스페이스 구조:**

| 네임스페이스 | 용도 |
|---|---|
| `ot-prod` | 전체 서비스 프로덕션 |
| `ot-staging` | 스테이징 환경 |
| `monitoring` | Prometheus / Grafana / Loki / Alertmanager |
| `kafka` | Kafka (MSK 대신 self-hosted 선택 시) |
| `ingress-nginx` | NGINX Ingress Controller |
| `cert-manager` | TLS 인증서 자동화 |

### 2-2. 서비스별 K8s 배포

각 서비스는 독립적인 Helm 차트를 갖는다. 공통 구조는 다음과 같다.

```
infra/helm/
├── user-service/
├── product-service/
├── order-service/
├── payment-service/
├── fitting-service/      ← GPU 노드 전용 설정 포함
├── brand-service/
├── api-gateway/
└── bff/                  ← Next.js SSR
```

**fitting-service Helm values 핵심 설정 (GPU 톨러레이션):**

```yaml
# infra/helm/fitting-service/values.yaml
replicaCount: 1

image:
  repository: <account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/ot-chawon-fitting
  tag: ""  # CI에서 주입 — latest 절대 금지

resources:
  requests:
    memory: "8Gi"
    cpu: "2"
    nvidia.com/gpu: "1"
  limits:
    memory: "14Gi"
    cpu: "4"
    nvidia.com/gpu: "1"

tolerations:
  - key: "nvidia.com/gpu"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"

nodeSelector:
  node-group: gpu

autoscaling:
  enabled: true
  minReplicas: 1
  maxReplicas: 4
  metrics:
    - type: Resource
      resource:
        name: nvidia.com/gpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Pods
      pods:
        metric:
          name: fitting_inference_queue_length
        target:
          type: AverageValue
          averageValue: "10"
```

**일반 서비스 공통 HPA 정책:**

```yaml
autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 60
  targetMemoryUtilizationPercentage: 70
```

### 2-3. AI 피팅 서버 — 모델 버전 관리

AI 모델 파일(.pt, .onnx)은 S3에 버전별로 저장하고 EFS 또는 S3 마운트로 Pod에 제공한다.

```
s3://ot-chawon-ml-models/
├── fitting/
│   ├── v1.0.0/
│   │   ├── body_estimation.onnx
│   │   └── cloth_warping.onnx
│   ├── v1.1.0/
│   └── latest -> v1.1.0   (심볼릭이 아니라 SSM Parameter로 관리)
```

모델 버전은 AWS SSM Parameter Store에 저장한다.

```
/ot-chawon/fitting/model-version = "v1.1.0"
```

배포 시 init container가 SSM에서 버전을 읽고 S3에서 모델을 다운로드한다.

### 2-4. S3 버킷 구조

```
s3://ot-chawon-assets-prod/
├── brands/{brandId}/
│   ├── products/{productId}/
│   │   ├── images/          ← 상품 이미지 (JPG/WebP)
│   │   └── 3d-assets/       ← GLB 파일 (3D 의류 에셋)
│   │       ├── {productId}.glb
│   │       └── {productId}_lod1.glb   ← LOD 최적화 버전
│   └── brand-profile/       ← 브랜드 로고, 배너
│
├── fitting-results/{userId}/
│   └── {fittingSessionId}.jpg   ← AI 피팅 결과 이미지
│
└── users/{userId}/
    └── avatar/              ← 유저 신체 측정 데이터 기반 아바타
```

**버킷 정책 원칙:**

- `brands/*/3d-assets/` → CloudFront를 통해서만 접근 (OAC 사용)
- `fitting-results/` → Presigned URL로만 접근 (만료: 24시간)
- 퍼블릭 직접 접근 차단 (`Block Public Access` 전체 활성화)

### 2-5. CloudFront CDN 구성

```
배포: ot-chawon-cdn.cloudfront.net

Origins:
  - S3 Origin (OAC): ot-chawon-assets-prod
  - Custom Origin: API Gateway (동적 요청)

캐싱 정책:
  /brands/*/3d-assets/*.glb
    - TTL: 31536000초 (1년)  ← 버전이 바뀌면 파일명 변경
    - Compress: true
    - Cache-Control: public, max-age=31536000, immutable

  /brands/*/products/*/images/*
    - TTL: 86400초 (1일)
    - Compress: true

  /fitting-results/*
    - TTL: 0  ← 캐시 비활성화 (Presigned URL 사용)

  기본 (API):
    - TTL: 0  ← 동적 콘텐츠 캐시 없음
```

**Presigned URL 발급 — 브랜드 파트너 에셋 업로드:**

fitting-service 또는 brand-service가 AWS SDK로 Presigned URL을 생성해 브랜드 파트너에게 제공한다. 업로드 후 Lambda 또는 S3 Event Notification으로 GLB 검증 및 메타데이터 DB 기록을 트리거한다.

```python
# 예시 (brand-service 내부)
presigned_url = s3_client.generate_presigned_url(
    'put_object',
    Params={
        'Bucket': 'ot-chawon-assets-prod',
        'Key': f'brands/{brand_id}/products/{product_id}/3d-assets/{product_id}.glb',
        'ContentType': 'model/gltf-binary',
    },
    ExpiresIn=3600  # 1시간
)
```

### 2-6. RDS — 서비스별 독립 DB

각 마이크로서비스는 독립된 RDS 인스턴스(또는 Multi-AZ 인스턴스 내 독립 DB)를 가진다. 서비스 간 직접 DB 접근은 금지된다.

| 서비스 | DB 인스턴스 식별자 | 엔진 | 스펙 |
|---|---|---|---|
| user | ot-chawon-user-db | MySQL 8.0 | db.t3.medium |
| product | ot-chawon-product-db | MySQL 8.0 | db.m5.large |
| order | ot-chawon-order-db | MySQL 8.0 | db.m5.large |
| payment | ot-chawon-payment-db | MySQL 8.0 | db.m5.xlarge (보안 격리 강화) |
| fitting | ot-chawon-fitting-db | MySQL 8.0 | db.t3.medium |
| brand | ot-chawon-brand-db | MySQL 8.0 | db.t3.medium |

- Multi-AZ: 프로덕션 전 인스턴스 활성화
- 자동 백업: 7일 보존
- 암호화: AWS KMS 키 사용
- Subnet: Private Subnet만 사용 (Public 접근 차단)
- SecurityGroup: EKS 워커노드 SecurityGroup에서만 3306 인바운드 허용

### 2-7. ElastiCache Redis

```
클러스터: ot-chawon-redis
엔진: Redis 7.x
노드 타입: cache.r6g.large
클러스터 모드: 비활성화 (단일 Primary + Replica)
Multi-AZ: 활성화

용도별 DB 인덱스:
  DB 0: 세션 토큰 (user-service)
  DB 1: 피팅 결과 캐시 (fitting-service) — 추론 결과 임시 저장
  DB 2: 상품 재고 캐시 (product-service)
  DB 3: 분산 락 (order-service — 동시 주문 처리)

TTL 정책:
  세션: 7200초 (2시간)
  피팅 결과: 86400초 (24시간)
  재고 캐시: 60초
  분산 락: 30초
```

### 2-8. MSK / Kafka 이벤트 토픽

```
토픽 목록:
  ot.order.created          → payment-service 소비
  ot.payment.completed      → order-service, fitting-service 소비
  ot.payment.failed         → order-service 소비
  ot.fitting.requested      → fitting-service 소비
  ot.fitting.completed      → user-service, order-service 소비
  ot.product.stock.updated  → product-service 소비
  ot.brand.asset.uploaded   → product-service 소비

파티션: 각 토픽 3 파티션
보존 기간: 7일
복제 계수: 3
```

---

## 3. CI/CD 파이프라인

### 3-1. 서비스별 독립 파이프라인 구조

GitHub Actions 워크플로우는 서비스별로 독립 파일로 관리한다. 모노레포 구조에서 경로 필터로 트리거를 분리한다.

```
.github/workflows/
├── deploy-user-service.yml
├── deploy-product-service.yml
├── deploy-order-service.yml
├── deploy-payment-service.yml
├── deploy-fitting-service.yml
├── deploy-brand-service.yml
├── deploy-api-gateway.yml
├── deploy-bff.yml
└── deploy-fitting-model.yml   ← AI 모델 배포 전용
```

### 3-2. 표준 서비스 배포 파이프라인

```yaml
# .github/workflows/deploy-product-service.yml 예시
name: Deploy product-service

on:
  push:
    branches: [main]
    paths:
      - 'ot-chawon-product/**'
      - 'infra/helm/product-service/**'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        working-directory: ot-chawon-product
        run: ./gradlew ktlintCheck  # 또는 npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - name: Unit Tests
        run: ./gradlew test
      - name: Upload coverage
        uses: codecov/codecov-action@v4

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<account-id>:role/GithubActionsECRPush
          aws-region: ap-northeast-2

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and Push
        env:
          IMAGE_TAG: ${{ github.sha }}  # latest 금지 — 커밋 SHA 사용
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/ot-chawon-product:$IMAGE_TAG .
          docker push $ECR_REGISTRY/ot-chawon-product:$IMAGE_TAG

      # ECR 이미지 취약점 스캔 결과 확인
      - name: Check ECR Scan
        run: |
          aws ecr wait image-scan-complete \
            --repository-name ot-chawon-product \
            --image-id imageTag=${{ github.sha }}
          CRITICAL=$(aws ecr describe-image-scan-findings \
            --repository-name ot-chawon-product \
            --image-id imageTag=${{ github.sha }} \
            --query 'imageScanFindings.findingSeverityCounts.CRITICAL' \
            --output text)
          if [ "$CRITICAL" != "None" ] && [ "$CRITICAL" -gt "0" ]; then
            echo "CRITICAL vulnerabilities found: $CRITICAL"
            exit 1
          fi

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<account-id>:role/GithubActionsEKSDeploy
          aws-region: ap-northeast-2

      - name: Update kubeconfig
        run: aws eks update-kubeconfig --name ot-chawon-prod --region ap-northeast-2

      - name: Helm Deploy
        run: |
          helm upgrade --install product-service infra/helm/product-service \
            --namespace ot-prod \
            --set image.tag=${{ github.sha }} \
            --set image.repository=<account-id>.dkr.ecr.ap-northeast-2.amazonaws.com/ot-chawon-product \
            --wait --timeout 5m
```

### 3-3. AI 모델 배포 파이프라인

모델 파일이 크기 때문에 코드 배포와 분리된 전용 파이프라인을 사용한다.

```yaml
# .github/workflows/deploy-fitting-model.yml
name: Deploy AI Fitting Model

on:
  workflow_dispatch:
    inputs:
      model_version:
        description: '배포할 모델 버전 (예: v1.2.0)'
        required: true
      rollback:
        description: '롤백 여부 (true/false)'
        default: 'false'

jobs:
  validate-model:
    runs-on: ubuntu-latest
    steps:
      - name: Check model exists in S3
        run: |
          aws s3 ls s3://ot-chawon-ml-models/fitting/${{ inputs.model_version }}/ \
            || (echo "Model version not found in S3" && exit 1)

      - name: Run model validation test
        run: |
          # 경량 추론 테스트 (GPU 없이 CPU 모드로 스모크 테스트)
          python scripts/validate_model.py \
            --model-path s3://ot-chawon-ml-models/fitting/${{ inputs.model_version }} \
            --mode cpu-smoke

  update-model-version:
    needs: validate-model
    runs-on: ubuntu-latest
    steps:
      - name: Update SSM Parameter
        run: |
          aws ssm put-parameter \
            --name /ot-chawon/fitting/model-version \
            --value "${{ inputs.model_version }}" \
            --type String \
            --overwrite

      - name: Rolling restart fitting-service pods
        run: |
          kubectl rollout restart deployment/fitting-service -n ot-prod
          kubectl rollout status deployment/fitting-service -n ot-prod --timeout=10m

      - name: Notify Slack
        run: |
          curl -X POST ${{ secrets.SLACK_DEVOPS_WEBHOOK }} \
            -d '{"text":"[옷차원] AI 피팅 모델 배포 완료: ${{ inputs.model_version }}"}'
```

---

## 4. 모니터링 전략

### 4-1. Prometheus 수집 대상

```yaml
# prometheus 스크레이프 설정 핵심 항목
scrape_configs:
  - job_name: 'ot-services'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names: [ot-prod]
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true

  - job_name: 'nvidia-gpu'
    static_configs:
      - targets: ['<gpu-node-ip>:9400']  # DCGM Exporter

  - job_name: 'kafka'
    static_configs:
      - targets: ['kafka-exporter:9308']

  - job_name: 'mysql'
    static_configs:
      - targets: ['mysqld-exporter:9104']
```

### 4-2. Grafana 대시보드 구성

**대시보드 1 — 옷차원 서비스 Overview**

| 패널 | 메트릭 | 임계값 |
|---|---|---|
| 전체 API 요청수 (RPS) | `rate(http_requests_total[1m])` | — |
| 서비스별 P95 레이턴시 | `histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` | > 500ms 경고 |
| 서비스별 에러율 | `rate(http_requests_total{status=~"5.."}[1m]) / rate(http_requests_total[1m])` | > 1% 경고 |
| 활성 Pod 수 | `kube_deployment_status_replicas_available` | — |

**대시보드 2 — AI 피팅 서버 (GPU)**

| 패널 | 메트릭 | 임계값 |
|---|---|---|
| GPU 사용률 | `DCGM_FI_DEV_GPU_UTIL` | > 85% 경고 |
| GPU 메모리 사용량 | `DCGM_FI_DEV_FB_USED / DCGM_FI_DEV_FB_TOTAL` | > 90% 위험 |
| 추론 처리 시간 P95 | `histogram_quantile(0.95, rate(fitting_inference_duration_seconds_bucket[5m]))` | > 3초 경고 |
| 추론 큐 대기 길이 | `fitting_inference_queue_length` | > 20 경고 |
| 모델 버전 | `fitting_model_version` (라벨) | — |

**대시보드 3 — 인프라 Overview**

- RDS 연결 수, 슬로우 쿼리 수
- ElastiCache 히트율, 메모리 사용률
- Kafka Consumer Lag (서비스별)
- EKS 노드 CPU/메모리, Pod Pending 수

**대시보드 4 — 비용 모니터링**

- GPU 노드 가동 시간 (일별)
- EC2 On-Demand vs Spot 비율
- S3 전송 비용 (CloudFront vs 직접)

### 4-3. Alertmanager 알람 규칙

```yaml
# rules/ot-chawon-alerts.yml
groups:
  - name: ot-chawon-slo
    rules:
      - alert: HighAPILatency
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket{namespace="ot-prod"}[5m])
          ) > 0.5
        for: 3m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "{{ $labels.service }} P95 레이턴시 {{ $value | humanizeDuration }} 초과"

      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{namespace="ot-prod", status=~"5.."}[5m]) /
          rate(http_requests_total{namespace="ot-prod"}[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "{{ $labels.service }} 에러율 {{ $value | humanizePercentage }}"

      - alert: GPUMemoryCritical
        expr: |
          DCGM_FI_DEV_FB_USED / DCGM_FI_DEV_FB_TOTAL > 0.90
        for: 1m
        labels:
          severity: critical
          team: devops
        annotations:
          summary: "GPU 메모리 {{ $value | humanizePercentage }} — OOM 위험"

      - alert: FittingInferenceSlowdown
        expr: |
          histogram_quantile(0.95,
            rate(fitting_inference_duration_seconds_bucket[5m])
          ) > 3
        for: 5m
        labels:
          severity: warning
          team: ai
        annotations:
          summary: "AI 피팅 추론 P95 {{ $value | humanizeDuration }} 초과"

      - alert: KafkaConsumerLagHigh
        expr: kafka_consumer_group_lag > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "{{ $labels.topic }} 컨슈머 랙 {{ $value }}"

      - alert: PodNotReady
        expr: kube_pod_status_ready{condition="false", namespace="ot-prod"} == 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Pod {{ $labels.pod }} NotReady 상태 5분 초과"
```

알람 라우팅: Slack `#ot-chawon-alerts` (warning), `#ot-chawon-critical` (critical)

---

## 5. 보안 원칙

### 5-1. IAM

- **최소 권한 원칙**: 각 서비스 Pod는 서비스 어카운트(IRSA)를 사용하여 필요한 S3/SQS/SSM 권한만 부여
- GitHub Actions 배포 역할은 ECR Push와 EKS Helm Deploy 권한만 보유. 인프라 변경 권한 없음
- 모든 IAM Role에 `sts:AssumeRole` 조건으로 IP 또는 OIDC 제한

```
IAM Role 목록:
  ot-chawon-fitting-service-role   → S3 읽기(ml-models), SSM 읽기
  ot-chawon-brand-service-role     → S3 Presigned URL 생성(assets-prod/brands/)
  ot-chawon-user-service-role      → 없음 (RDS, Redis만 사용)
  ot-chawon-payment-service-role   → Secrets Manager 읽기 (PG 키)
  GithubActionsECRPush             → ECR Push만
  GithubActionsEKSDeploy           → EKS Helm deploy만
```

### 5-2. VPC / 네트워크 격리

```
VPC: 10.0.0.0/16

Public Subnet:   10.0.1.0/24, 10.0.2.0/24  (ALB, NAT GW)
Private Subnet:  10.0.10.0/24, 10.0.11.0/24 (EKS 워커, RDS, Redis)

SecurityGroup 규칙:
  sg-eks-workers → sg-rds: 3306 허용
  sg-eks-workers → sg-redis: 6379 허용
  sg-alb → sg-eks-workers: 80, 443 허용
  외부 → sg-rds: 차단 (직접 접근 불가)
```

### 5-3. Secrets Manager

DB 패스워드, JWT 시크릿, PG 결제 API 키는 모두 AWS Secrets Manager에 저장한다. 쿠버네티스 Secret에 평문 저장 금지.

```
/ot-chawon/prod/user-service/db-password
/ot-chawon/prod/payment-service/pg-secret-key
/ot-chawon/prod/jwt-secret
/ot-chawon/prod/fitting-service/model-api-key
```

External Secrets Operator를 사용하여 Secrets Manager 값을 K8s Secret으로 동기화한다.

### 5-4. ECR 이미지 보안

- 모든 이미지: ECR 기본 스캔 활성화 (push 시 자동 스캔)
- CRITICAL 취약점 발견 시 배포 파이프라인 자동 중단
- 90일 이상 된 이미지 자동 삭제 (ECR Lifecycle Policy)
- `latest` 태그 이미지는 ECR에 푸시하지 않는다 (파이프라인 규칙으로 강제)

### 5-5. K8s RBAC

```yaml
# 개발팀: 로그 조회, Pod 상태 확인만 허용
kind: ClusterRole
metadata:
  name: ot-chawon-developer
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log", "services"]
    verbs: ["get", "list", "watch"]

# DevOps팀: 전체 ot-prod 네임스페이스 관리
# Admin: 클러스터 전체
```

---

## 6. 3D 에셋 CDN 운영

### 6-1. GLB 파일 업로드 워크플로우

브랜드 파트너가 3D 에셋을 등록하는 흐름은 다음과 같다.

```
브랜드 파트너 대시보드
    ↓ 업로드 요청
brand-service (Presigned URL 발급, 유효시간 1시간)
    ↓ S3 직접 업로드 (PUT)
s3://ot-chawon-assets-prod/brands/{brandId}/products/{productId}/3d-assets/{productId}.glb
    ↓ S3 Event Notification (ObjectCreated)
Lambda: ot-chawon-asset-processor
    ├── GLB 파일 유효성 검증 (파일 형식, 크기 제한 50MB)
    ├── 로우 폴리곤 LOD 버전 생성 (gltf-transform 사용)
    ├── product-service DB에 에셋 URL 저장
    └── Kafka 토픽 ot.brand.asset.uploaded 발행
```

### 6-2. CloudFront 무효화 정책

에셋 교체 시(동일 productId 재업로드) CloudFront 캐시를 무효화한다.

```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/brands/${BRAND_ID}/products/${PRODUCT_ID}/3d-assets/*"
```

이 작업은 brand-service에서 에셋 교체 API 호출 시 자동으로 트리거된다.

### 6-3. S3 버킷 정책 예시

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOACOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ot-chawon-assets-prod/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>"
        }
      }
    }
  ]
}
```

---

## 7. 다른 Sub-Agent와의 협업 규칙

### 7-1. Backend / AI Sub-Agent와의 협업

| 상황 | 처리 방식 |
|---|---|
| 새 마이크로서비스 추가 요청 | 백엔드 에이전트가 서비스 코드 작성 → DevOps가 ECR 레포, Helm 차트, GitHub Actions 파이프라인 생성 |
| AI 모델 업데이트 | AI 에이전트가 S3에 모델 버전 업로드 → DevOps가 `deploy-fitting-model.yml` 워크플로우 실행 |
| DB 스키마 변경 | 백엔드 에이전트가 마이그레이션 스크립트 작성 → DevOps가 RDS 접근 및 실행 환경 제공 |
| 환경 변수 / 시크릿 추가 | 백엔드 에이전트가 변수명 목록 전달 → DevOps가 Secrets Manager에 등록 후 External Secrets 설정 |
| 트래픽 급증 대응 | 모니터링 알람 수신 → HPA 최대값 임시 조정, GPU 노드 수동 스케일아웃 |

### 7-2. 작업 요청 인터페이스

다른 에이전트가 DevOps에 작업을 요청할 때는 다음 정보를 명시한다.

```
서비스명: product-service
작업 유형: 신규 환경변수 추가
변수명: ELASTICSEARCH_URL
시크릿 여부: 아니오 (ConfigMap으로 관리)
환경: prod
```

---

## 8. Jira / Slack 운영 규칙

### 8-1. Jira 이슈 분류

| 이슈 유형 | 라벨 | 예시 |
|---|---|---|
| 인프라 프로비저닝 | `infra` | EKS 노드그룹 추가, RDS 스펙 업그레이드 |
| CI/CD 파이프라인 | `cicd` | 신규 서비스 파이프라인 구성 |
| 모니터링/알람 | `monitoring` | 새 알람 규칙 추가 |
| 보안 | `security` | IAM 정책 수정, 취약점 패치 |
| 인시던트 대응 | `incident` | 장애 대응 및 RCA 작성 |
| GPU 최적화 | `gpu-cost` | 스팟 인스턴스 전환, 스케일링 정책 조정 |

인프라 변경은 반드시 Jira 이슈 생성 후 작업을 시작한다. `terraform apply` 전에 이슈 번호를 커밋 메시지에 포함한다.

예: `feat(infra): add gpu node group scale-up policy [OT-234]`

### 8-2. Slack 채널

| 채널 | 용도 |
|---|---|
| `#ot-chawon-devops` | DevOps 팀 내부 논의, 배포 공지 |
| `#ot-chawon-alerts` | Alertmanager warning 알람 |
| `#ot-chawon-critical` | Alertmanager critical 알람 (즉시 대응 필요) |
| `#ot-chawon-deployments` | GitHub Actions 배포 성공/실패 알림 |
| `#ot-chawon-general` | 전체 팀 공지 |

**배포 공지 형식 (`#ot-chawon-deployments`):**

```
[배포] product-service v2.3.1 (commit: a1b2c3d)
환경: production
배포자: github-actions
상태: 성공
소요시간: 3분 42초
```

### 8-3. 인시던트 대응 절차

1. `#ot-chawon-critical` 알람 수신
2. Jira 인시던트 이슈 생성 (우선순위: Highest)
3. Slack `#ot-chawon-critical`에 대응 시작 선언
4. 원인 파악 (Grafana 대시보드 → Loki 로그 → kubectl describe)
5. 임시 조치 (트래픽 차단, 이전 버전 롤백, 스케일아웃)
6. 근본 원인 수정 및 재배포
7. Jira 이슈에 RCA(Root Cause Analysis) 작성 후 종료

---

## 9. 주의사항

### 9-1. GPU 비용 관리 (최우선 주의)

- GPU 노드그룹 최소 레플리카는 항상 1로 유지한다. 0으로 설정하면 콜드 스타트 지연이 5분 이상 발생하여 사용자 경험에 치명적이다.
- GPU 노드 `g4dn.xlarge`의 온디맨드 비용은 월 약 $400이다. 스팟 인스턴스 사용 시 최대 70% 절감 가능하지만, 추론 서버 특성상 중단 내성이 필요하다. 중단 시 큐 재처리 로직을 구현한 후 스팟으로 전환한다.
- GPU 사용률이 30% 미만인 시간대(새벽 2-6시)는 Karpenter로 노드를 자동 회수한다.
- 매월 첫 번째 월요일에 AWS Cost Explorer에서 GPU 노드 비용을 리뷰하고 Jira에 `gpu-cost` 이슈로 기록한다.

### 9-2. Terraform 작업 규칙

- `terraform apply`는 반드시 `terraform plan` 출력을 Jira 이슈에 첨부한 후 팀 리뷰(최소 1명)를 받는다.
- 프로덕션 RDS 및 EKS 클러스터 변경은 `terraform plan -target` 으로 영향 범위를 최소화한다.
- `terraform destroy`는 절대 프로덕션 환경에 실행하지 않는다. 실수를 방지하기 위해 프로덕션 Terraform 상태 파일은 별도 S3 버킷에 격리하고 DynamoDB 락을 사용한다.
- 상태 파일 백엔드: `s3://ot-chawon-terraform-state-prod/` (버저닝 + MFA Delete 활성화)

### 9-3. 이미지 태그 규칙

- ECR에 `latest` 태그 이미지를 푸시하거나 Helm values에 `latest`를 사용하는 것을 금지한다.
- 모든 이미지 태그는 GitHub Actions에서 `${{ github.sha }}` (40자 커밋 SHA)를 사용한다.
- 이미지 태그 불변성: ECR 이미지 태그 덮어쓰기 방지 설정을 활성화한다.

### 9-4. 배포 금지 시간대

- 매주 금요일 오후 5시 ~ 월요일 오전 10시: 프로덕션 배포 금지 (핫픽스 제외)
- 세일 이벤트 기간 (기획팀 사전 공지): 배포 동결. 동결 기간 중 긴급 배포 시 CTO 승인 필요
- 배포 동결 일정은 Jira 캘린더와 `#ot-chawon-devops`에 사전 공지한다.

### 9-5. 데이터 보호

- RDS 스냅샷은 최소 7일 보존, 결제 서비스 DB는 30일 보존한다.
- S3 피팅 결과 이미지는 유저 탈퇴 후 30일 이내에 자동 삭제 (S3 Lifecycle Policy).
- 개인식별정보(이름, 주소, 신체 측정값)가 포함된 S3 버킷은 KMS 서버 측 암호화 강제 적용.

### 9-6. AI 모델 배포 주의사항

- 모델 배포는 반드시 스테이징 환경에서 추론 정확도 테스트를 먼저 수행한다.
- 모델 롤백은 SSM Parameter를 이전 버전으로 되돌리고 `kubectl rollout restart`로 처리한다. 코드 롤백과 달리 모델 롤백은 5분 이내에 완료되어야 한다.
- 신규 모델 배포 시 피팅 추론 P95 레이턴시가 기존 대비 20% 이상 증가하면 즉시 롤백한다.
