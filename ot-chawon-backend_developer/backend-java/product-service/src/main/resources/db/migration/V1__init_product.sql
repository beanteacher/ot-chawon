-- otc_product_db 초기 스키마
-- product-service: 상품 도메인 전체, 3D 에셋 메타데이터 관리

CREATE TABLE categories (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    parent_id   BIGINT          NULL COMMENT '최상위 카테고리는 NULL',
    name        VARCHAR(100)    NOT NULL,
    depth       INT             NOT NULL DEFAULT 0 COMMENT '계층 깊이 (0: 최상위)',
    sort_order  INT             NOT NULL DEFAULT 0,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_categories_parent_id (parent_id),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    brand_id        BIGINT          NOT NULL COMMENT 'brand-service의 brands.id (외부 참조)',
    category_id     BIGINT          NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    price           INT             NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE | INACTIVE | DELETED',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP       NULL COMMENT 'Soft Delete',
    PRIMARY KEY (id),
    INDEX idx_products_brand_id (brand_id),
    INDEX idx_products_category_id (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_name (name),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_options (
    id          BIGINT          NOT NULL AUTO_INCREMENT,
    product_id  BIGINT          NOT NULL,
    size        VARCHAR(20)     COMMENT 'XS | S | M | L | XL | XXL 등',
    color       VARCHAR(50),
    stock       INT             NOT NULL DEFAULT 0,
    extra_price INT             NOT NULL DEFAULT 0 COMMENT '기본 가격 대비 추가 금액',
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_product_options_product_id (product_id),
    CONSTRAINT fk_product_options_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3D 에셋 메타데이터 (GLB 파일 정보)
CREATE TABLE product_assets (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    product_id          BIGINT          NOT NULL,
    glb_url             VARCHAR(500)    NOT NULL COMMENT 'S3/CloudFront GLB 파일 URL',
    thumbnail_url       VARCHAR(500)    COMMENT '3D 썸네일 이미지 URL',
    rig_type            VARCHAR(50)     COMMENT 'SMPL | SMPL-X',
    draco_compressed    BOOLEAN         NOT NULL DEFAULT TRUE COMMENT 'Draco 압축 적용 여부',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_product_assets_product_id (product_id),
    CONSTRAINT fk_product_assets_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
