package com.otchawon.payment.controller;

import com.otchawon.payment.dto.request.PaymentRequest;
import com.otchawon.payment.dto.request.RefundRequest;
import com.otchawon.payment.dto.response.PaymentResponse;
import com.otchawon.payment.dto.response.RefundResponse;
import com.otchawon.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> requestPayment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid PaymentRequest request) {
        PaymentResponse response = paymentService.requestPayment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<PaymentResponse> confirmPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId) {
        PaymentResponse response = paymentService.confirmPayment(userId, paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse> getPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId) {
        PaymentResponse response = paymentService.getPayment(userId, paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) {
        PaymentResponse response = paymentService.getPaymentByOrderId(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<RefundResponse> refundPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId,
            @RequestBody RefundRequest request) {
        RefundResponse response = paymentService.refundPayment(userId, paymentId, request);
        return ResponseEntity.ok(response);
    }
}
