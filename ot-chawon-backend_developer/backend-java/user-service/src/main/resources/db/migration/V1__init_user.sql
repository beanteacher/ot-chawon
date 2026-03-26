-- otc_user_db 초기 스키마
-- user-service: 회원 인증/인가, 체형 정보 관리

CREATE TABLE users (
    id                BIGINT          NOT NULL AUTO_INCREMENT,
    email             VARCHAR(255)    NOT NULL,
    password_hash     VARCHAR(255)    NOT NULL,
    nickname          VARCHAR(100),
    address           VARCHAR(500),
    role              VARCHAR(20)     NOT NULL DEFAULT 'USER' COMMENT 'USER | BRAND_ADMIN | PLATFORM_ADMIN',
    status            VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | INACTIVE | BANNED',
    created_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at        TIMESTAMP       NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Token 저장 (Redis 보조 영구 저장소)
-- Redis에 refresh:{userId} 키로 저장하지만 DB에도 이중 저장
CREATE TABLE refresh_tokens (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    user_id     BIGINT          NOT NULL,
    token       VARCHAR(512)    NOT NULL,
    expires_at  TIMESTAMP       NOT NULL,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_tokens_token (token),
    INDEX idx_refresh_tokens_user_id (user_id),
    INDEX idx_refresh_tokens_expires_at (expires_at),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 체형 정보 (AES-256 암호화 저장, 컬럼명 encrypted_ prefix)
-- 암호화 키: 환경변수 OTC_BODY_ENC_KEY
CREATE TABLE body_measurements (
    id                      BIGINT          NOT NULL AUTO_INCREMENT,
    user_id                 BIGINT          NOT NULL,
    encrypted_height        VARBINARY(256)  NOT NULL COMMENT 'AES-256 암호화된 키(cm)',
    encrypted_weight        VARBINARY(256)  NOT NULL COMMENT 'AES-256 암호화된 몸무게(kg)',
    encrypted_chest         VARBINARY(256)  COMMENT 'AES-256 암호화된 가슴둘레(cm)',
    encrypted_waist         VARBINARY(256)  COMMENT 'AES-256 암호화된 허리둘레(cm)',
    encrypted_hip           VARBINARY(256)  COMMENT 'AES-256 암호화된 엉덩이둘레(cm)',
    encrypted_inseam        VARBINARY(256)  COMMENT 'AES-256 암호화된 안다리길이(cm)',
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_body_measurements_user_id (user_id),
    CONSTRAINT fk_body_measurements_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
