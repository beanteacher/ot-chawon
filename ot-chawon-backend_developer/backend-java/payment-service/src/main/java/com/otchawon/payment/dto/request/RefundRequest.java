package com.otchawon.payment.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefundRequest {
    private String reason;
    private Integer amount;
}
