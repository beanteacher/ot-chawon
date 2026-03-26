-- otc_order_db 초기 스키마
-- order-service: 장바구니, 주문 생성, 배송 상태 추적

CREATE TABLE carts (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    user_id     BIGINT      NOT NULL COMMENT 'user-service의 users.id (외부 참조)',
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_carts_user_id (user_id),
    INDEX idx_carts_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
    id                  BIGINT      NOT NULL AUTO_INCREMENT,
    cart_id             BIGINT      NOT NULL,
    product_id          BIGINT      NOT NULL COMMENT 'product-service의 products.id (외부 참조)',
    product_option_id   BIGINT      NOT NULL COMMENT 'product-service의 product_options.id (외부 참조)',
    quantity            INT         NOT NULL DEFAULT 1,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_cart_items_cart_id (cart_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 주문 상태: PENDING → PAYMENT_REQUESTED → PAID → SHIPPING → DELIVERED → COMPLETED
--                                    ↓                    ↓
--                               CANCELLED             REFUNDED
CREATE TABLE orders (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    user_id             BIGINT          NOT NULL COMMENT 'user-service의 users.id (외부 참조)',
    status              VARCHAR(30)     NOT NULL DEFAULT 'PENDING'
                            COMMENT 'PENDING | PAYMENT_REQUESTED | PAID | SHIPPING | DELIVERED | COMPLETED | CANCELLED | REFUNDED',
    total_price         INT             NOT NULL,
    shipping_address    VARCHAR(500)    NOT NULL,
    tracking_number     VARCHAR(100)    COMMENT '운송장 번호',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    order_id            BIGINT          NOT NULL,
    product_id          BIGINT          NOT NULL COMMENT 'product-service의 products.id (외부 참조)',
    product_option_id   BIGINT          NOT NULL COMMENT 'product-service의 product_options.id (외부 참조)',
    product_name        VARCHAR(255)    NOT NULL COMMENT '주문 시점 상품명 스냅샷',
    unit_price          INT             NOT NULL COMMENT '주문 시점 단가 스냅샷',
    quantity            INT             NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_order_items_order_id (order_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
