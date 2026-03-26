-- otc_brand_db 초기 스키마
-- brand-service: 브랜드 입점사 관리, 멀티테넌트 권한 제어

CREATE TABLE brands (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(100)    NOT NULL,
    description     TEXT,
    logo_url        VARCHAR(500),
    website_url     VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | INACTIVE | PENDING',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_brands_name (name),
    INDEX idx_brands_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 브랜드 어드민: user-service의 users.id와 연결 (멀티테넌트 권한)
CREATE TABLE brand_admins (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    brand_id    BIGINT      NOT NULL,
    user_id     BIGINT      NOT NULL COMMENT 'user-service의 users.id (외부 참조)',
    role        VARCHAR(20) NOT NULL DEFAULT 'ADMIN' COMMENT 'OWNER | ADMIN',
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_brand_admins_brand_user (brand_id, user_id),
    INDEX idx_brand_admins_user_id (user_id),
    CONSTRAINT fk_brand_admins_brand FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 브랜드-상품 연관 (product-service의 products.id 참조)
-- brand-service는 product-service를 FeignClient로 호출하지만
-- 빠른 브랜드별 상품 목록 캐싱을 위해 product_id만 저장
CREATE TABLE brand_products (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    brand_id    BIGINT      NOT NULL,
    product_id  BIGINT      NOT NULL COMMENT 'product-service의 products.id (외부 참조)',
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_brand_products_brand_product (brand_id, product_id),
    INDEX idx_brand_products_brand_id (brand_id),
    CONSTRAINT fk_brand_products_brand FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
