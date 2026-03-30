-- product_assets 테이블 확장: 3D 에셋 메타데이터 필드 추가 및 unique 제약 변경
-- Sprint 5 SCRUM-44: productId + lodLevel 조합 unique

-- 1. FK 제약 임시 삭제
ALTER TABLE product_assets DROP FOREIGN KEY fk_product_assets_product;

-- 2. 기존 unique 제약 삭제
ALTER TABLE product_assets DROP INDEX uq_product_assets_product_id;

-- 3. 새 컬럼 추가
ALTER TABLE product_assets
    ADD COLUMN lod_level       VARCHAR(10)     NOT NULL DEFAULT 'LOD0' COMMENT 'LOD0 | LOD1 | LOD2',
    ADD COLUMN file_size       BIGINT          NULL     COMMENT 'GLB 파일 크기 (bytes)',
    ADD COLUMN polygon_count   INT             NULL     COMMENT '폴리곤 수',
    ADD COLUMN texture_info    VARCHAR(1000)   NULL     COMMENT '텍스처 정보 (JSON 형태)',
    ADD COLUMN cdn_url         VARCHAR(500)    NULL     COMMENT 'CDN 배포 URL',
    ADD COLUMN category        VARCHAR(20)     NULL     COMMENT '의류 카테고리',
    ADD COLUMN material_type   VARCHAR(50)     NULL     COMMENT '소재 타입';

-- 4. productId + lodLevel 조합 unique 제약 추가
ALTER TABLE product_assets
    ADD CONSTRAINT uq_product_assets_product_lod UNIQUE (product_id, lod_level);

-- 5. FK 제약 복원
ALTER TABLE product_assets
    ADD CONSTRAINT fk_product_assets_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;

-- 6. 인덱스 추가
ALTER TABLE product_assets
    ADD INDEX idx_product_assets_lod_level (lod_level);
