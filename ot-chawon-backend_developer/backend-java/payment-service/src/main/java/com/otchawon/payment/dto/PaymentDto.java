package com.otchawon.payment.dto;

import com.otchawon.payment.entity.Payment;
import com.otchawon.payment.entity.PaymentStatus;
import com.otchawon.payment.entity.Refund;
import com.otchawon.payment.entity.RefundStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class PaymentDto {

    public record PaymentRequest(
            @NotNull(message = "주문 ID는 필수입니다.") Long orderId,
            @Positive(message = "결제 금액은 양수여야 합니다.") int amount,
            @NotBlank(message = "결제 수단은 필수입니다.") String paymentMethod
    ) {}

    public record RefundRequest(
            String reason,
            Integer amount
    ) {}

    public record PaymentResponse(
            Long id,
            Long orderId,
            Long userId,
            String pgTransactionId,
            int amount,
            PaymentStatus status,
            String paymentMethod,
            LocalDateTime paidAt,
            LocalDateTime createdAt
    ) {
        public static PaymentResponse from(Payment payment) {
            return new PaymentResponse(
                    payment.getId(),
                    payment.getOrderId(),
                    payment.getUserId(),
                    payment.getPgTransactionId(),
                    payment.getAmount(),
                    payment.getStatus(),
                    payment.getPaymentMethod(),
                    payment.getPaidAt(),
                    payment.getCreatedAt()
            );
        }
    }

    public record RefundResponse(
            Long id,
            Long paymentId,
            int amount,
            String reason,
            RefundStatus status,
            String pgRefundId,
            LocalDateTime refundedAt,
            LocalDateTime createdAt
    ) {
        public static RefundResponse from(Refund refund) {
            return new RefundResponse(
                    refund.getId(),
                    refund.getPayment().getId(),
                    refund.getAmount(),
                    refund.getReason(),
                    refund.getStatus(),
                    refund.getPgRefundId(),
                    refund.getRefundedAt(),
                    refund.getCreatedAt()
            );
        }
    }
}
