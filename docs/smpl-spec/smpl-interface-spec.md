# SMPL 파라미터 인터페이스 명세

## 1. SMPL β 파라미터 (Body Shape)

### 개요
SMPL(Skinned Multi-Person Linear Model) β(beta) 파라미터는 사람의 체형을 주성분 분석(PCA)으로 표현한 10차원 벡터입니다.
각 β 값은 체형의 주요 변형 축(키, 체중, 체형 비율 등)을 나타냅니다.

### β 파라미터 스펙
| 항목 | 값 |
|------|-----|
| 벡터 크기 | 10 (β[0] ~ β[9]) |
| 유효 범위 | **[-5, 5]** (각 항목 클램핑) |
| 데이터 타입 | `float32` |
| 기본값 (평균 체형) | `[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]` |

### β 주요 축 설명 (참고용, SMPL 모델 기준)
| Index | 주요 영향 | 양(+) 방향 | 음(-) 방향 |
|-------|----------|-----------|-----------|
| β[0] | 전반적 체형 크기 | 크고 무거운 체형 | 작고 가벼운 체형 |
| β[1] | 키/신장 | 키 큼 | 키 작음 |
| β[2] | 가슴/몸통 부피 | 가슴 넓음 | 가슴 좁음 |
| β[3] | 허리 두께 | 허리 두꺼움 | 허리 얇음 |
| β[4] | 팔다리 길이 | 팔다리 긺 | 팔다리 짧음 |
| β[5] | 어깨 너비 | 어깨 넓음 | 어깨 좁음 |
| β[6] | 힙 부피 | 힙 큼 | 힙 작음 |
| β[7] | 상체/하체 비율 | 상체 발달 | 하체 발달 |
| β[8] | 근육량/체지방 비율 | 근육형 | 지방형 |
| β[9] | 기타 체형 변형 | — | — |

> 주의: β 파라미터의 정확한 의미는 사용하는 SMPL/SMPL-X 모델 버전에 따라 다를 수 있습니다.
> 모델 파일 경로: 환경변수 `SMPLX_MODEL_PATH`

---

## 2. Body Input 스펙

### 체형 입력 파라미터
AI 추론 서버에 전달하는 사용자 체형 측정값:

| 필드명 | 타입 | 단위 | 유효 범위 | 필수 | 설명 |
|--------|------|------|----------|------|------|
| `height_cm` | float | cm | (0, 300] | 필수 | 키 |
| `weight_kg` | float | kg | (0, 500] | 필수 | 몸무게 |
| `gender` | string | — | `"male"`, `"female"` | 필수 | 성별 |
| `shoulder_cm` | float | cm | (0, 200] | 필수 | 어깨너비 |
| `chest_cm` | float | cm | (0, 300] | 필수 | 가슴둘레 |
| `waist_cm` | float | cm | (0, 300] | 필수 | 허리둘레 |
| `hip_cm` | float | cm | (0, 300] | 필수 | 엉덩이둘레 |

---

## 3. 출력 스펙

### β 파라미터 출력
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `betas` | `float32[10]` | SMPL β 파라미터 10개 벡터, 범위 [-5, 5] |

### θ Pose 파라미터 출력
| 필드명 | 타입 | 설명 |
|--------|------|------|
| `thetas` | `float32[72]` | SMPL pose 파라미터 (24 joints × 3 axis-angle) |
| `global_orient` | `float32[3]` | 전역 방향 (axis-angle) |

### 기본 자세
- 출력 기본 포즈: **A-Pose** (양팔 약 45° 하향)
- 좌표계: **Y-up**, 스케일 단위: **미터(m)**

---

## 4. JSON 스키마 예시

### Body Input (요청)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "BodyInput",
  "type": "object",
  "required": ["height_cm", "weight_kg", "gender", "shoulder_cm", "chest_cm", "waist_cm", "hip_cm"],
  "properties": {
    "height_cm": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 300,
      "description": "키 (cm)"
    },
    "weight_kg": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 500,
      "description": "몸무게 (kg)"
    },
    "gender": {
      "type": "string",
      "enum": ["male", "female"],
      "description": "성별"
    },
    "shoulder_cm": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 200,
      "description": "어깨너비 (cm)"
    },
    "chest_cm": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 300,
      "description": "가슴둘레 (cm)"
    },
    "waist_cm": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 300,
      "description": "허리둘레 (cm)"
    },
    "hip_cm": {
      "type": "number",
      "exclusiveMinimum": 0,
      "maximum": 300,
      "description": "엉덩이둘레 (cm)"
    }
  }
}
```

### SMPL 파라미터 출력 (응답)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SmplOutput",
  "type": "object",
  "required": ["betas", "thetas", "global_orient"],
  "properties": {
    "betas": {
      "type": "array",
      "items": { "type": "number", "minimum": -5, "maximum": 5 },
      "minItems": 10,
      "maxItems": 10,
      "description": "SMPL β 파라미터 10개 벡터"
    },
    "thetas": {
      "type": "array",
      "items": { "type": "number" },
      "minItems": 72,
      "maxItems": 72,
      "description": "SMPL pose 파라미터 (24 joints × 3 axis-angle)"
    },
    "global_orient": {
      "type": "array",
      "items": { "type": "number" },
      "minItems": 3,
      "maxItems": 3,
      "description": "전역 방향 axis-angle"
    }
  }
}
```

### 실제 요청/응답 예시
```json
// POST /fit 요청 body.body 부분
{
  "height_cm": 175.0,
  "weight_kg": 68.0,
  "gender": "male",
  "shoulder_cm": 44.0,
  "chest_cm": 96.0,
  "waist_cm": 80.0,
  "hip_cm": 95.0
}

// AI 내부 처리 결과 (SMPL 파라미터)
{
  "betas": [0.3, -0.5, 0.8, -0.2, 0.1, 0.4, -0.3, 0.0, 0.2, -0.1],
  "thetas": [0.0, 0.0, 0.0, /* ... 72개 값 ... */],
  "global_orient": [0.0, 0.0, 0.0]
}
```

---

## 5. FE ↔ AI 데이터 흐름

```
[FE - 사용자 체형 입력]
    height_cm, weight_kg, gender,
    shoulder_cm, chest_cm, waist_cm, hip_cm
         │
         │  POST /api/v1/fit  (BE fitting-service)
         ▼
[BE fitting-service :8001]
    user_id, item_id, body: BodyInput
         │
         │  POST /fit  (AI 추론 서버)
         ▼
[AI 추론 서버 FastAPI :8000]
    ① body_shape:  BodyInput → β[10] 예측 (size_rule.py / PyTorch MLP)
    ② avatar_gen:  β + θ → SMPL-X 메쉬(.glb) 생성
    ③ garment_fit: 의류 GLB (S3) + 아바타 메쉬 → 피팅
    ④ render:      피팅 결과 → 다각도 PNG (0°/90°/180°) + GLB → S3
         │
         │  job_id 즉시 반환 (비동기)
         ▼
[BE fitting-service]
    Redis에서 fit:{job_id} 폴링 또는 WebSocket
         │
         │  GET /api/v1/fit/{job_id}/status
         ▼
[FE - 피팅 결과 표시]
    renders: { front, side, back }  (CloudFront URL)
    glb_url: fitted.glb             (CloudFront URL)
    size_recommendation: { recommended_size, confidence, reason[] }
```

### 비동기 처리 상태값
| 상태 | 설명 |
|------|------|
| `queued` | 큐에 등록됨, 처리 대기 중 |
| `processing` | 추론 진행 중 |
| `completed` | 완료, 결과 URL 이용 가능 |
| `failed` | 실패, error_code 참고 |

### 오류 코드
| 코드 | 설명 |
|------|------|
| `FIT_FAIL` | 피팅 실패 (관통/극단 변형) |
| `GPU_OOM` | GPU 메모리 부족 |
| `ASSET_NOT_FOUND` | 의류 GLB 에셋 없음 |
| `INVALID_BODY` | 유효하지 않은 체형 입력값 |
| `JOB_NOT_FOUND` | job_id를 찾을 수 없음 |

### Redis 캐싱 규칙
- 캐시 키: `fit:{job_id}`
- TTL: **1시간 (3600초)**
- 저장 내용: 렌더링 결과 URL만 캐싱 (체형 원본 데이터 저장 **금지**)
- 추론 완료 후 임시 메쉬 파일 즉시 삭제

---

## 6. V0 구현: 룰 기반 회귀

### 사이즈 추천 로직 (`app/services/size_rule.py`)
- 체형 측정값 vs 의류 사이즈 스펙 비교
- 반환: `{ recommended_size, confidence, reason[] }`
- confidence < 0.5 시 추가 측정 항목 입력 요청 메시지 포함

### β 파라미터 예측 (V0)
- 룰 기반 회귀로 height_cm, weight_kg 등에서 β 벡터 근사 계산
- 각 β 항목 범위 클램핑: `max(-5, min(5, beta_i))`

### V1 이후 계획
- PyTorch MLP로 β 벡터 직접 예측
- MLflow 실험 추적 필수
- `torch.compile()` + `torch.float16` 혼합 정밀도 적용

---

## 7. 관련 파일 경로

| 파일 | 설명 |
|------|------|
| `ot-chawon-ai_ml/app/schemas/body.py` | BodyInput Pydantic 스키마 |
| `ot-chawon-ai_ml/app/schemas/fit.py` | FitRequest/FitResponse 스키마 |
| `ot-chawon-ai_ml/app/services/size_rule.py` | V0 사이즈 추천 룰 기반 서비스 |
| `ot-chawon-ai_ml/app/routers/fit.py` | /fit 엔드포인트 |
| `ot-chawon-ai_ml/app/routers/avatar.py` | /avatar 엔드포인트 |
| `references/ai-ml/fitting-pipeline.md` | AI 파이프라인 상세 문서 |
| `docs/3d-spec/glb-format-spec.md` | GLB 포맷 요구사항 명세 |
