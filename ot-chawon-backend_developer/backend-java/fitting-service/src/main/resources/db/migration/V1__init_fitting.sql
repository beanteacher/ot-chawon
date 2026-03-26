-- otc_fitting_db 초기 스키마
-- fitting-service: AI 3D 옷핏 피팅 요청 중개, 결과 캐싱, 피팅 이력 관리

CREATE TABLE fitting_requests (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    request_uuid        VARCHAR(36)     NOT NULL COMMENT 'AI 서버 호출 시 사용하는 UUID',
    user_id             BIGINT          NOT NULL COMMENT 'user-service의 users.id (외부 참조)',
    product_id          BIGINT          NOT NULL COMMENT 'product-service의 products.id (외부 참조)',
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                            COMMENT 'PENDING | PROCESSING | DONE | FAILED',
    ai_request_payload  JSON            COMMENT 'AI 서버에 전송한 요청 페이로드 (body_measurements 포함)',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_fitting_requests_uuid (request_uuid),
    INDEX idx_fitting_requests_user_id (user_id),
    INDEX idx_fitting_requests_status (status),
    INDEX idx_fitting_requests_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE fitting_results (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    fitting_request_id  BIGINT          NOT NULL,
    result_image_url    VARCHAR(500)    COMMENT '피팅 결과 이미지 URL (S3/CloudFront)',
    result_glb_url      VARCHAR(500)    COMMENT '피팅 결과 GLB URL',
    smpl_params         JSON            COMMENT 'SMPL 파라미터 (shape, pose 등)',
    error_message       VARCHAR(1000)   COMMENT 'FAILED 상태일 때 오류 메시지',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_fitting_results_request_id (fitting_request_id),
    CONSTRAINT fk_fitting_results_request FOREIGN KEY (fitting_request_id) REFERENCES fitting_requests (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
