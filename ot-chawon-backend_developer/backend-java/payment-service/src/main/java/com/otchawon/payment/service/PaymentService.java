package com.otchawon.payment.service;
import com.otchawon.payment.dto.PaymentDto;


public interface PaymentService {
    PaymentDto.PaymentResponse requestPayment(Long userId, PaymentDto.PaymentRequest request);
    PaymentDto.PaymentResponse confirmPayment(Long userId, Long paymentId);
    PaymentDto.PaymentResponse getPayment(Long userId, Long paymentId);
    PaymentDto.PaymentResponse getPaymentByOrderId(Long userId, Long orderId);
    PaymentDto.RefundResponse refundPayment(Long userId, Long paymentId, PaymentDto.RefundRequest request);
}
