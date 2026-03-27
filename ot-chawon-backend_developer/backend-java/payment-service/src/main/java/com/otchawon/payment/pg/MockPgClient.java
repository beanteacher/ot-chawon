package com.otchawon.payment.pg;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Slf4j
@Component
public class MockPgClient implements PgClient {

    @Override
    public PgChargeResult charge(int amount, String method) {
        String transactionId = UUID.randomUUID().toString();
        log.info("Mock PG 결제 처리: amount={}, method={}, txId={}", amount, method, transactionId);
        return new PgChargeResult(transactionId, true, "결제 성공");
    }

    @Override
    public PgRefundResult refund(String txId, int amount) {
        String refundId = UUID.randomUUID().toString();
        log.info("Mock PG 환불 처리: txId={}, amount={}, refundId={}", txId, amount, refundId);
        return new PgRefundResult(refundId, true, "환불 성공");
    }
}
