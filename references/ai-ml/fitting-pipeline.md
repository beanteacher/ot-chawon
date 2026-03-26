# 옷차원 AI 피팅 파이프라인 상세

## 책임 범위

### 1. 체형 예측 모델 (Body Shape Estimation)

- **입력**: 키(height_cm), 몸무게(weight_kg), 성별(gender), 어깨너비(shoulder_cm), 가슴둘레(chest_cm), 허리둘레(waist_cm), 엉덩이둘레(hip_cm)
- **출력**: SMPL β 파라미터 10개 벡터 + 키·몸무게 기반 자세 파라미터(θ)
- **V0**: 룰 기반 회귀 → `app/services/size_rule.py`
- **V1 이후**: PyTorch MLP로 β 벡터 직접 예측, MLflow 실험 추적 필수
- SMPL 파라미터 생성 범위: β 각 항목 [-5, 5] 클램핑

### 2. 3D 아바타 생성 (Avatar Mesh Generation)

- SMPL-X 라이브러리를 통해 β, θ → `.obj` / `.glb` 아바타 메쉬 생성
- 기본 자세(A-pose)로 생성 후 3D팀 리깅 스펙에 맞게 좌표계 정렬
- 생성 메쉬: `tmp/avatars/{session_id}.glb` 임시 저장 후 S3 업로드, 로컬 즉시 삭제
- 메쉬 품질: Trimesh 검증 통과 (non-manifold 엣지 0, 고립 정점 0)

### 3. 가상 피팅 엔진 (Virtual Try-On)

- 의류 3D 모델 입력: 3D팀 납품 리깅 `.glb` (S3 `assets/clothing/{item_id}.glb`)
- V0: 아바타 SMPL 파라미터 + 의류 기준 사이즈 스케일링(Blend Shape 기반)
- V1 이후: 물리 시뮬레이션(XPBD) 또는 딥러닝 피팅(GarmentNet 계열)
- 피팅 실패(관통/극단 변형) 시 오류 코드 `FIT_FAIL` 반환

### 4. 피팅 결과 렌더링

- Open3D 또는 Blender Headless를 통한 다각도 이미지 생성
  - 전면(0°), 측면(90°), 후면(180°) 각각 1080×1080 PNG
  - 추가 옵션: 45° 쿼터뷰 2장 (FE 요청 시)
- S3 `renders/{session_id}/front.png` 등 업로드 후 CloudFront URL 반환

### 5. 사이즈 추천 (Size Recommendation)

- 체형 측정값 vs 의류 사이즈 스펙 비교
- 반환: `{ recommended_size, confidence, reason[] }`
- 신뢰도(confidence) < 0.5 인 경우 추가 측정 항목 입력 요청 메시지 포함

---

## AI 파이프라인 아키텍처

```
[사용자 체형 입력]
       │
       ▼
[BE fitting-service] ──POST──▶ [AI 추론 서버 FastAPI]
                                      │
                          ┌───────────┴────────────┐
                          │                        │
                    [body_shape]             [size_recommend]
                    β 파라미터 예측          사이즈 추천 (< 1초)
                          │
                    [avatar_gen]
                    SMPL-X 메쉬 생성
                          │
                    [garment_fit]
                    의류 피팅 (S3에서 clothing GLB 수신)
                          │
                    [render]
                    다각도 렌더링 PNG/GLB → S3 업로드
                          │
                          ▼
              결과 URL 반환 → BE → FE 표시
```

### 비동기 처리 전략

- 전체 추론 예상 시간: **3~10초** (GPU 환경 기준)
- BE fitting-service는 `/fit` 요청 시 `job_id` 즉시 수신, 폴링 또는 WebSocket으로 완료 통보
- 추론 결과: Redis TTL 1시간 캐싱 (`fit:{job_id}` 키)
- 사이즈 추천은 동기 처리 (`/size/predict`)

---

## 엔드포인트 목록

| 메서드 | 경로 | 역할 | 동기/비동기 |
|--------|------|------|------------|
| GET | `/health` | 헬스체크 | 동기 |
| POST | `/size/predict` | 사이즈 추천 | 동기 |
| POST | `/fit` | 피팅 작업 요청, `job_id` 반환 | 비동기 |
| GET | `/fit/{job_id}/status` | 피팅 작업 상태/결과 조회 | 동기 |
| POST | `/avatar` | 아바타 메쉬 단독 생성 | 비동기 |
| POST | `/render` | 피팅 완료 후 렌더링 재요청 | 비동기 |
| GET | `/metrics` | Prometheus 메트릭 노출 | 동기 |

---

## 입출력 스키마

### POST /fit 요청

```json
{
  "user_id": "uuid",
  "item_id": "string",
  "body": {
    "height_cm": 175.0,
    "weight_kg": 68.0,
    "gender": "male",
    "shoulder_cm": 44.0,
    "chest_cm": 96.0,
    "waist_cm": 80.0,
    "hip_cm": 95.0
  },
  "render_options": {
    "angles": [0, 90, 180],
    "resolution": "1080x1080"
  }
}
```

### GET /fit/{job_id}/status 응답

```json
{
  "job_id": "uuid",
  "status": "completed",
  "result": {
    "renders": {
      "front": "https://cdn.ot-chawon.com/renders/{job_id}/front.png",
      "side": "...",
      "back": "..."
    },
    "glb_url": "https://cdn.ot-chawon.com/scenes/{job_id}/fitted.glb",
    "size_recommendation": {
      "recommended_size": "M",
      "confidence": 0.87,
      "reason": ["가슴둘레 +4cm 여유", "허리둘레 +6cm 여유"]
    }
  },
  "elapsed_ms": 4320
}
```

---

## 데이터셋 구축 규칙

### 체형-사이즈 매핑 데이터
- 수집 항목: 키, 몸무게, 성별, 어깨너비, 가슴/허리/엉덩이 둘레, 실제 구매 사이즈
- 데이터 소스: 사용자 동의 기반 수집 또는 공개 데이터셋 (CAESAR, SizeKorea)
- 익명화 필수: `user_id` 해시 처리
- 최소 학습 데이터: 사이즈 레이블당 500건 이상 확보 후 ML 모델 전환

### 의류 3D 모델 데이터
- 3D팀 납품: 리깅 `.glb`, SMPL-X 바인드 포즈 기준
- 메타데이터: `assets/clothing/{item_id}/metadata.json`
- 대용량 데이터셋(> 100MB): DVC 사용, S3 원격 저장소

---

## 모델 서빙 규칙

### GPU 배치 처리
- SMPL-X 및 피팅 모델: 서버 시작 시 1회 로딩 후 메모리 유지
- 동시 요청 배치 처리: `asyncio.Queue`, 배치 크기 최대 8
- CUDA OOM 발생 시: 배치 크기 반감 재시도, 3회 실패 시 `GPU_OOM` 오류 반환

### 모델 로딩 최적화
- `torch.compile()` + `torch.float16` 혼합 정밀도
- SMPL-X 모델 파일 경로: 환경변수 `SMPLX_MODEL_PATH`
- Cold start 허용 시간: 30초 이내

### 헬스체크 및 모니터링
- `/health`: GPU 가용 여부, 모델 로딩 상태, Redis 연결 상태
- `/metrics`: Prometheus 포맷 — `fit_inference_duration_seconds`, `gpu_memory_used_bytes`, `fit_queue_length`, `fit_error_total`
- Grafana 알람: `inference_p95 > 8s`

---

## 성능 목표

| 지표 | 목표 | 측정 기준 |
|------|------|----------|
| 피팅 추론 레이턴시 | P95 < 5초 | GPU 1장, 배치 1, 단독 요청 |
| 사이즈 추천 레이턴시 | P95 < 1초 | CPU 기준 |
| 동시 요청 처리 | 50 concurrent | 큐잉 허용, 최대 대기 30초 |
| 피팅 성공률 | > 95% | `FIT_FAIL` 제외 |
| 사이즈 추천 정확도 (Top-1) | > 75% | 검증 데이터셋 기준 |
| GPU 메모리 사용량 | < 10GB per worker | NVIDIA A10G 24GB 기준 |

---

## 협업 규칙

### 3D팀 → AI/ML (에셋 수령)
- 3D팀 `.glb` 에셋 납품 완료 시 S3 경로 + `item_id` Jira 코멘트 전달
- 수령 즉시 검증: Trimesh watertight, SMPL-X 조인트 바인딩, PBR 4채널
- 검증 실패 시 Jira 상세 오류 기재 후 3D팀 재납품 요청

### AI/ML → BE fitting-service
- 추론 API 스펙: `docs/openapi.yaml`
- 오류 코드: `FIT_FAIL`, `GPU_OOM`, `ASSET_NOT_FOUND`, `INVALID_BODY`
- BE fitting-service 포트: `8001`, 환경변수 `AI_SERVER_URL`

### AI/ML → FE
- 렌더링 이미지 포맷 및 CloudFront URL 패턴 FE와 협의 후 고정
- GLB 씬 크기 목표: < 5MB, Draco 압축 적용
- 피팅 상태값: `queued` / `processing` / `completed` / `failed`

---

## 테스트 규칙

```
tests/
  unit/          # test_size_rule.py, test_body_shape.py, test_fit_pipeline.py
  integration/   # test_api_health.py, test_api_size_predict.py, test_api_fit.py
  benchmark/     # test_inference_perf.py, test_size_accuracy.py
```

```bash
# CI 필수
pytest tests/unit tests/integration -v --cov=app --cov-report=term-missing

# GPU 환경 수동
pytest tests/benchmark -v -m gpu --timeout=120
```

- GPU 의존 테스트: `@pytest.mark.gpu`, CI 기본 제외
- 커버리지 최소: `app/services/` 80%, `app/models/` 70%
- 배포 기준: 신규 모델이 기존 대비 Top-1 정확도 +2%p 이상

---

## 주의사항

### 개인정보 (체형 데이터 보호)
- 키, 몸무게, 둘레 정보는 민감 개인정보로 취급
- 추론 서버 로그에 체형 수치값 출력 금지 — `user_id`와 `job_id`만 로깅
- Redis 캐싱 시 체형 원본 데이터 저장 금지 — 렌더링 결과 URL만 캐싱
- 추론 완료 후 임시 메쉬 파일 즉시 삭제

### 라이선스
- SMPL/SMPL-X: 비상업적 연구 목적 라이선스 — 상용화 전환 시 라이선스 구매 필요
- 공개 데이터셋 사용 조건 문서화: `docs/dataset_licenses.md`

### GPU 비용 관리
- 미사용 시 GPU 인스턴스 즉시 종료
- 배치 처리 미적용 상태에서 50 concurrent 부하 테스트 금지
