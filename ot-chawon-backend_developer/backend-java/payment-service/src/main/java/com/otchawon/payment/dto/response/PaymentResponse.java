package com.otchawon.payment.dto.response;

import com.otchawon.payment.entity.Payment;
import com.otchawon.payment.entity.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponse {

    private Long id;
    private Long orderId;
    private Long userId;
    private String pgTransactionId;
    private int amount;
    private PaymentStatus status;
    private String paymentMethod;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public static PaymentResponse from(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .pgTransactionId(payment.getPgTransactionId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
