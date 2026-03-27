package com.otchawon.payment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentRequest {

    @NotNull(message = "주문 ID는 필수입니다.")
    private Long orderId;

    @Positive(message = "결제 금액은 양수여야 합니다.")
    private int amount;

    @NotBlank(message = "결제 수단은 필수입니다.")
    private String paymentMethod;
}
