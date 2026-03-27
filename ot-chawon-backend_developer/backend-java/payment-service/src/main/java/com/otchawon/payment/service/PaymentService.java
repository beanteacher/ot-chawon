package com.otchawon.payment.service;

import com.otchawon.payment.dto.request.PaymentRequest;
import com.otchawon.payment.dto.request.RefundRequest;
import com.otchawon.payment.dto.response.PaymentResponse;
import com.otchawon.payment.dto.response.RefundResponse;

public interface PaymentService {
    PaymentResponse requestPayment(Long userId, PaymentRequest request);
    PaymentResponse confirmPayment(Long userId, Long paymentId);
    PaymentResponse getPayment(Long userId, Long paymentId);
    PaymentResponse getPaymentByOrderId(Long userId, Long orderId);
    RefundResponse refundPayment(Long userId, Long paymentId, RefundRequest request);
}
