# 옷차원 서비스별 ERD 문서

각 마이크로서비스의 독립 DB 스키마 정의입니다. Database per Service 패턴 적용.

---

## 서비스-DB 매핑

| 서비스 | DB | 포트 | 마이그레이션 파일 |
|---|---|---|---|
| user-service | otc_user_db | 8081 | [V1__init_user.sql](./user-service-erd.md) |
| product-service | otc_product_db | 8082 | [V1__init_product.sql](./product-service-erd.md) |
| order-service | otc_order_db | 8083 | [V1__init_order.sql](./order-service-erd.md) |
| payment-service | otc_payment_db | 8084 | [V1__init_payment.sql](./payment-service-erd.md) |
| fitting-service | otc_fitting_db | 8085 | [V1__init_fitting.sql](./fitting-service-erd.md) |
| brand-service | otc_brand_db | 8086 | [V1__init_brand.sql](./brand-service-erd.md) |

---

## 서비스 간 데이터 참조 규칙

- 서비스 간 직접 JOIN 금지 (Database per Service 원칙)
- 동기 참조: FeignClient REST 호출 (최대 2단계 체인)
- 비동기 참조: Kafka 이벤트 (`otc.{서비스}.{이벤트}` 형식)
- 외부 참조 컬럼은 코멘트에 `{서비스명}의 {테이블}.{컬럼} (외부 참조)` 표시
