# brand-service ERD (otc_brand_db)

## 테이블 목록

- `brands`: 브랜드 기본 정보
- `brand_admins`: 브랜드 어드민 (멀티테넌트 권한)
- `brand_products`: 브랜드-상품 연관

---

## brands

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL, UNIQUE | 브랜드명 |
| description | TEXT | NULL | 브랜드 소개 |
| logo_url | VARCHAR(500) | NULL | 로고 이미지 URL |
| website_url | VARCHAR(500) | NULL | 브랜드 공식 웹사이트 |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | ACTIVE \| INACTIVE \| PENDING |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## brand_admins

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| brand_id | BIGINT | NOT NULL, FK(brands.id) | 브랜드 참조 |
| user_id | BIGINT | NOT NULL | user-service의 users.id (외부 참조) |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'ADMIN' | OWNER \| ADMIN |
| created_at | TIMESTAMP | NOT NULL | |

**제약**: `uq_brand_admins_brand_user` (brand_id, user_id 복합 UNIQUE)

> 멀티테넌트 권한 제어: 브랜드별 어드민 독립 관리. 플랫폼 어드민 또는 브랜드 OWNER가 초대.

---

## brand_products

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| id | BIGINT | PK, AUTO_INCREMENT | |
| brand_id | BIGINT | NOT NULL, FK(brands.id) | 브랜드 참조 |
| product_id | BIGINT | NOT NULL | product-service의 products.id (외부 참조) |
| created_at | TIMESTAMP | NOT NULL | |

**제약**: `uq_brand_products_brand_product` (brand_id, product_id 복합 UNIQUE)

> 브랜드 상품 목록 빠른 조회용 캐싱 테이블. 실제 상품 상세 정보는 product-service FeignClient 호출.

---

## ERD 다이어그램

```
brands (1) ──── (N) brand_admins
brands (1) ──── (N) brand_products
```
