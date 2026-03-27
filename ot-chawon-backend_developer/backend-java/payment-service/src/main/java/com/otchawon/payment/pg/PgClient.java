package com.otchawon.payment.pg;

public interface PgClient {
    PgChargeResult charge(int amount, String method);
    PgRefundResult refund(String txId, int amount);
}
