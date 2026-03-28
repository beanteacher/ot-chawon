-- product_assets 테이블 확장: 3D 에셋 메타데이터 필드 추가 및 unique 제약 변경
-- Sprint 5 SCRUM-44: productId + lodLevel 조합 unique (기존 productId만 unique → 변경)

-- 기존 unique 제약 삭제
ALTER TABLE product_assets DROP INDEX uq_product_assets_product_id;

-- 새 컬럼 추가
ALTER TABLE product_assets
    ADD COLUMN lod_level       VARCHAR(10)     NOT NULL DEFAULT 'LOD0' COMMENT 'LOD0 | LOD1 | LOD2' AFTER draco_compressed,
    ADD COLUMN file_size       BIGINT          NULL     COMMENT 'GLB 파일 크기 (bytes)' AFTER lod_level,
    ADD COLUMN polygon_count   INT             NULL     COMMENT '폴리곤 수' AFTER file_size,
    ADD COLUMN texture_info    VARCHAR(1000)   NULL     COMMENT '텍스처 정보 (JSON 형태)' AFTER polygon_count,
    ADD COLUMN cdn_url         VARCHAR(500)    NULL     COMMENT 'CDN 배포 URL' AFTER texture_info,
    ADD COLUMN category        VARCHAR(20)     NULL     COMMENT '의류 카테고리 (TOP | BOTTOM | DRESS 등)' AFTER cdn_url,
    ADD COLUMN material_type   VARCHAR(50)     NULL     COMMENT '소재 타입 (COTTON | POLYESTER 등)' AFTER category;

-- productId + lodLevel 조합 unique 제약 추가
ALTER TABLE product_assets
    ADD CONSTRAINT uq_product_assets_product_lod UNIQUE (product_id, lod_level);

-- 인덱스 추가
ALTER TABLE product_assets
    ADD INDEX idx_product_assets_product_id (product_id),
    ADD INDEX idx_product_assets_lod_level (lod_level);
