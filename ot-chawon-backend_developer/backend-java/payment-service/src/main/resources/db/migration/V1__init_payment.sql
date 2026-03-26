-- otc_payment_db 초기 스키마
-- payment-service: PG사 결제 연동, 환불 처리

CREATE TABLE payments (
    id                  BIGINT          NOT NULL AUTO_INCREMENT,
    order_id            BIGINT          NOT NULL COMMENT 'order-service의 orders.id (외부 참조)',
    user_id             BIGINT          NOT NULL COMMENT 'user-service의 users.id (외부 참조)',
    pg_transaction_id   VARCHAR(255)    COMMENT 'PG사 트랜잭션 ID',
    amount              INT             NOT NULL COMMENT '결제 금액',
    status              VARCHAR(30)     NOT NULL DEFAULT 'PENDING'
                            COMMENT 'PENDING | COMPLETED | FAILED | CANCELLED | REFUNDED',
    payment_method      VARCHAR(50)     COMMENT 'CARD | VIRTUAL_ACCOUNT | TRANSFER | PHONE',
    paid_at             TIMESTAMP       NULL COMMENT '결제 완료 시각',
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_payments_order_id (order_id),
    INDEX idx_payments_user_id (user_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_pg_transaction_id (pg_transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE refunds (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    payment_id      BIGINT          NOT NULL,
    amount          INT             NOT NULL COMMENT '환불 금액 (전액 또는 부분)',
    reason          VARCHAR(500)    COMMENT '환불 사유',
    status          VARCHAR(30)     NOT NULL DEFAULT 'REQUESTED'
                        COMMENT 'REQUESTED | COMPLETED | FAILED',
    pg_refund_id    VARCHAR(255)    COMMENT 'PG사 환불 트랜잭션 ID',
    refunded_at     TIMESTAMP       NULL COMMENT '환불 완료 시각',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_refunds_payment_id (payment_id),
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
