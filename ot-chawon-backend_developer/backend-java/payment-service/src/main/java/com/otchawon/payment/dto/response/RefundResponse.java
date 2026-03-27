package com.otchawon.payment.dto.response;

import com.otchawon.payment.entity.Refund;
import com.otchawon.payment.entity.RefundStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RefundResponse {

    private Long id;
    private Long paymentId;
    private int amount;
    private String reason;
    private RefundStatus status;
    private String pgRefundId;
    private LocalDateTime refundedAt;
    private LocalDateTime createdAt;

    public static RefundResponse from(Refund refund) {
        return RefundResponse.builder()
                .id(refund.getId())
                .paymentId(refund.getPayment().getId())
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .status(refund.getStatus())
                .pgRefundId(refund.getPgRefundId())
                .refundedAt(refund.getRefundedAt())
                .createdAt(refund.getCreatedAt())
                .build();
    }
}
