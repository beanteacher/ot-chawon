package com.otchawon.payment.pg;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PgRefundResult {
    private final String refundId;
    private final boolean success;
    private final String message;
}
