package com.otchawon.payment.service.impl;
import com.otchawon.payment.dto.PaymentDto;

import com.otchawon.payment.entity.Payment;
import com.otchawon.payment.entity.PaymentStatus;
import com.otchawon.payment.entity.Refund;
import com.otchawon.payment.exception.PaymentException;
import com.otchawon.payment.pg.PgChargeResult;
import com.otchawon.payment.pg.PgClient;
import com.otchawon.payment.pg.PgRefundResult;
import com.otchawon.payment.repository.PaymentRepository;
import com.otchawon.payment.repository.RefundRepository;
import com.otchawon.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final PgClient pgClient;

    @Override
    @Transactional
    public PaymentDto.PaymentResponse requestPayment(Long userId, PaymentDto.PaymentRequest request) {
        paymentRepository.findByOrderId(request.getOrderId()).ifPresent(p -> {
            if (p.getStatus() == PaymentStatus.COMPLETED) {
                throw PaymentException.alreadyPaid();
            }
        });

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(userId)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .build();

        Payment saved = paymentRepository.save(payment);

        PgChargeResult result = pgClient.charge(request.getAmount(), request.getPaymentMethod());
        if (result.isSuccess()) {
            saved.complete(result.getTransactionId());
            log.info("결제 완료: userId={}, paymentId={}, txId={}", userId, saved.getId(), result.getTransactionId());
        } else {
            saved.fail();
            log.warn("결제 실패: userId={}, paymentId={}, message={}", userId, saved.getId(), result.getMessage());
            throw PaymentException.paymentFailed(result.getMessage());
        }

        return PaymentDto.PaymentResponse.from(saved);
    }

    @Override
    @Transactional
    public PaymentDto.PaymentResponse confirmPayment(Long userId, Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(PaymentException::notFound);

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw PaymentException.invalidStatus();
        }

        payment.complete(payment.getPgTransactionId());
        log.info("결제 확인 완료: userId={}, paymentId={}", userId, paymentId);

        return PaymentDto.PaymentResponse.from(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto.PaymentResponse getPayment(Long userId, Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(PaymentException::notFound);

        return PaymentDto.PaymentResponse.from(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentDto.PaymentResponse getPaymentByOrderId(Long userId, Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(PaymentException::notFound);

        return PaymentDto.PaymentResponse.from(payment);
    }

    @Override
    @Transactional
    public PaymentDto.RefundResponse refundPayment(Long userId, Long paymentId, PaymentDto.RefundRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(PaymentException::notFound);

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw PaymentException.invalidStatus();
        }

        int refundAmount = (request.getAmount() != null) ? request.getAmount() : payment.getAmount();

        Refund refund = Refund.builder()
                .payment(payment)
                .amount(refundAmount)
                .reason(request.getReason())
                .build();

        Refund savedRefund = refundRepository.save(refund);

        PgRefundResult result = pgClient.refund(payment.getPgTransactionId(), refundAmount);
        if (result.isSuccess()) {
            savedRefund.complete(result.getRefundId());
            payment.refund();
            log.info("환불 완료: userId={}, paymentId={}, refundId={}", userId, paymentId, savedRefund.getId());
        } else {
            savedRefund.fail();
            log.warn("환불 실패: userId={}, paymentId={}, message={}", userId, paymentId, result.getMessage());
            throw PaymentException.refundFailed(result.getMessage());
        }

        return PaymentDto.RefundResponse.from(savedRefund);
    }
}
