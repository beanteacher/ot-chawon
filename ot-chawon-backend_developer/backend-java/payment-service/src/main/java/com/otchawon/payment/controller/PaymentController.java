package com.otchawon.payment.controller;
import com.otchawon.payment.dto.PaymentDto;

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
    public ResponseEntity<PaymentDto.PaymentResponse> requestPayment(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid PaymentDto.PaymentRequest request) {
        PaymentDto.PaymentResponse response = paymentService.requestPayment(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{paymentId}/confirm")
    public ResponseEntity<PaymentDto.PaymentResponse> confirmPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId) {
        PaymentDto.PaymentResponse response = paymentService.confirmPayment(userId, paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDto.PaymentResponse> getPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId) {
        PaymentDto.PaymentResponse response = paymentService.getPayment(userId, paymentId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDto.PaymentResponse> getPaymentByOrderId(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) {
        PaymentDto.PaymentResponse response = paymentService.getPaymentByOrderId(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<PaymentDto.RefundResponse> refundPayment(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long paymentId,
            @RequestBody PaymentDto.RefundRequest request) {
        PaymentDto.RefundResponse response = paymentService.refundPayment(userId, paymentId, request);
        return ResponseEntity.ok(response);
    }
}
