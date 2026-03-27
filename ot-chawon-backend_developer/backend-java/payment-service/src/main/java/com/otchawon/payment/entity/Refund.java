package com.otchawon.payment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @Column(name = "amount", nullable = false)
    private int amount;

    @Column(name = "reason", length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private RefundStatus status = RefundStatus.REQUESTED;

    @Column(name = "pg_refund_id")
    private String pgRefundId;

    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void complete(String pgRefundId) {
        this.pgRefundId = pgRefundId;
        this.status = RefundStatus.COMPLETED;
        this.refundedAt = LocalDateTime.now();
    }

    public void fail() {
        this.status = RefundStatus.FAILED;
    }
}
