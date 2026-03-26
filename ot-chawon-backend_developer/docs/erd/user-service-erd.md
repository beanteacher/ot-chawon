# user-service ERD (otc_user_db)

## 테이블 목록

- `users`: 회원 기본 정보
- `refresh_tokens`: JWT Refresh Token 저장
- `body_measurements`: 체형 정보 (AES-256 암호화)

---

## users

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | 회원 ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 이메일 (로그인 ID) |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt 해싱된 비밀번호 |
| nickname | VARCHAR(100) | NULL | 닉네임 |
| address | VARCHAR(500) | NULL | 기본 배송지 |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | USER \| BRAND_ADMIN \| PLATFORM_ADMIN |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE \| INACTIVE \| BANNED |
| created_at | TIMESTAMP | NOT NULL | 생성 시각 |
| updated_at | TIMESTAMP | NOT NULL | 수정 시각 |
| deleted_at | TIMESTAMP | NULL | Soft Delete 시각 |

**인덱스**: `uq_users_email` (UNIQUE)

---

## refresh_tokens

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | NOT NULL, FK(users.id) | 회원 참조 |
| token | VARCHAR(512) | NOT NULL, UNIQUE | Refresh Token 값 |
| expires_at | TIMESTAMP | NOT NULL | 만료 시각 (7일) |
| created_at | TIMESTAMP | NOT NULL | 발급 시각 |

**인덱스**: `idx_refresh_tokens_user_id`, `idx_refresh_tokens_expires_at`

> Redis에 `refresh:{userId}` 키로 TTL 7일 저장이 주 저장소. 이 테이블은 보조 영구 저장소.

---

## body_measurements

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| user_id | BIGINT | NOT NULL, UNIQUE, FK(users.id) | 회원 참조 (1:1) |
| encrypted_height | VARBINARY(256) | NOT NULL | AES-256 암호화된 키(cm) |
| encrypted_weight | VARBINARY(256) | NOT NULL | AES-256 암호화된 몸무게(kg) |
| encrypted_chest | VARBINARY(256) | NULL | AES-256 암호화된 가슴둘레(cm) |
| encrypted_waist | VARBINARY(256) | NULL | AES-256 암호화된 허리둘레(cm) |
| encrypted_hip | VARBINARY(256) | NULL | AES-256 암호화된 엉덩이둘레(cm) |
| encrypted_inseam | VARBINARY(256) | NULL | AES-256 암호화된 안다리길이(cm) |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

**보안**: 암호화 키는 환경변수 `OTC_BODY_ENC_KEY`. fitting-service 외 직접 접근 금지.

---

## ERD 다이어그램

```
users (1) ──── (N) refresh_tokens
users (1) ──── (1) body_measurements
```
