# product-service ERD (otc_product_db)

## 테이블 목록

- `categories`: 계층형 카테고리
- `products`: 상품 기본 정보
- `product_options`: 상품 옵션 (사이즈/색상/재고)
- `product_assets`: 3D GLB 에셋 메타데이터

---

## categories

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| parent_id | BIGINT | NULL, FK(categories.id) | 최상위 카테고리는 NULL |
| name | VARCHAR(100) | NOT NULL | 카테고리명 |
| depth | INT | NOT NULL, DEFAULT 0 | 계층 깊이 (0: 최상위) |
| sort_order | INT | NOT NULL, DEFAULT 0 | 정렬 순서 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## products

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| brand_id | BIGINT | NOT NULL | brand-service의 brands.id (외부 참조) |
| category_id | BIGINT | NOT NULL, FK(categories.id) | 카테고리 |
| name | VARCHAR(255) | NOT NULL | 상품명 |
| description | TEXT | NULL | 상품 설명 |
| price | INT | NOT NULL | 기본 가격 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE \| INACTIVE \| DELETED |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |
| deleted_at | TIMESTAMP | NULL | Soft Delete 시각 |

**인덱스**: `idx_products_brand_id`, `idx_products_category_id`, `idx_products_status`, `idx_products_name`

---

## product_options

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| product_id | BIGINT | NOT NULL, FK(products.id) | 상품 참조 |
| size | VARCHAR(20) | NULL | XS \| S \| M \| L \| XL \| XXL |
| color | VARCHAR(50) | NULL | 색상명 |
| stock | INT | NOT NULL, DEFAULT 0 | 재고 수량 |
| extra_price | INT | NOT NULL, DEFAULT 0 | 기본 가격 대비 추가 금액 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## product_assets

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| product_id | BIGINT | NOT NULL, UNIQUE, FK(products.id) | 상품 참조 (1:1) |
| glb_url | VARCHAR(500) | NOT NULL | S3/CloudFront GLB 파일 URL |
| thumbnail_url | VARCHAR(500) | NULL | 3D 썸네일 이미지 URL |
| rig_type | VARCHAR(50) | NULL | SMPL \| SMPL-X |
| draco_compressed | BOOLEAN | NOT NULL, DEFAULT TRUE | Draco 압축 적용 여부 |
| created_at | TIMESTAMP | NOT NULL | |

---

## ERD 다이어그램

```
categories (1) ──── (N) categories (self-reference, parent_id)
categories (1) ──── (N) products
products   (1) ──── (N) product_options
products   (1) ──── (1) product_assets
```
