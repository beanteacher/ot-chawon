-- fitting-service 피팅 요청 테이블
CREATE TABLE IF NOT EXISTS fitting_requests (
    id                   BIGINT          NOT NULL AUTO_INCREMENT,
    user_id              VARCHAR(100)    NOT NULL COMMENT 'user-service userId',
    item_id              VARCHAR(100)    NOT NULL COMMENT 'product itemId',
    status               VARCHAR(20)     NOT NULL DEFAULT 'QUEUED'
                             COMMENT 'QUEUED | PROCESSING | COMPLETED | FAILED',
    body_measurement     TEXT            COMMENT 'AI에 전달할 신체 측정값 JSON',
    avatar_glb_url       VARCHAR(500)    COMMENT '사용자 아바타 GLB URL',
    fitted_glb_url       VARCHAR(500)    COMMENT 'AI 피팅 결과 GLB URL',
    render_urls          TEXT            COMMENT '렌더링 결과 URL 맵 JSON',
    size_recommendation  TEXT            COMMENT '사이즈 추천 결과 JSON',
    created_at           DATETIME(6)     NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    completed_at         DATETIME(6)     COMMENT '피팅 완료 시각',
    PRIMARY KEY (id),
    INDEX idx_fitting_user_id (user_id),
    INDEX idx_fitting_status (status),
    INDEX idx_fitting_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
