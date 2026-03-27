package com.otchawon.payment.pg;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PgChargeResult {
    private final String transactionId;
    private final boolean success;
    private final String message;
}
