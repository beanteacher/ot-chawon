# fitting-service ERD (otc_fitting_db)

## 테이블 목록

- `fitting_requests`: 피팅 요청 (AI 서버 호출 중개)
- `fitting_results`: 피팅 결과 (AI 서버 응답 저장)

---

## fitting_requests

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| request_uuid | VARCHAR(36) | NOT NULL, UNIQUE | AI 서버 호출 시 사용하는 UUID |
| user_id | BIGINT | NOT NULL | user-service의 users.id (외부 참조) |
| product_id | BIGINT | NOT NULL | product-service의 products.id (외부 참조) |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | PENDING \| PROCESSING \| DONE \| FAILED |
| ai_request_payload | JSON | NULL | AI 서버에 전송한 요청 페이로드 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**인덱스**: `idx_fitting_requests_user_id`, `idx_fitting_requests_status`, `idx_fitting_requests_product_id`

---

## fitting_results

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| fitting_request_id | BIGINT | NOT NULL, UNIQUE, FK(fitting_requests.id) | 피팅 요청 참조 (1:1) |
| result_image_url | VARCHAR(500) | NULL | 피팅 결과 이미지 URL (S3/CloudFront) |
| result_glb_url | VARCHAR(500) | NULL | 피팅 결과 GLB URL |
| smpl_params | JSON | NULL | SMPL 파라미터 (shape, pose 등) |
| error_message | VARCHAR(1000) | NULL | FAILED 상태일 때 오류 메시지 |
| created_at | TIMESTAMP | NOT NULL | |

---

## AI 서버 연동 흐름

```
fitting-service → POST {AI_ML_BASE_URL}/api/v1/fitting/infer
  요청: fittingRequestId, userId, productId, bodyMeasurements, productAsset
  응답: resultImageUrl, resultGlbUrl, smplParams

완료 후 Kafka: otc.fitting.completed → user-service (피팅 이력 업데이트)
```

---

## ERD 다이어그램

```
fitting_requests (1) ──── (1) fitting_results
```
