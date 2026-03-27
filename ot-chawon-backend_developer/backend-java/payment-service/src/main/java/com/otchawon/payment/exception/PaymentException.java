package com.otchawon.payment.exception;

import org.springframework.http.HttpStatus;

public class PaymentException extends RuntimeException {

    private final HttpStatus status;

    public PaymentException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static PaymentException notFound() {
        return new PaymentException("결제 정보를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static PaymentException alreadyPaid() {
        return new PaymentException("이미 결제된 주문입니다.", HttpStatus.CONFLICT);
    }

    public static PaymentException invalidStatus() {
        return new PaymentException("유효하지 않은 결제 상태입니다.", HttpStatus.BAD_REQUEST);
    }

    public static PaymentException refundFailed(String message) {
        return new PaymentException("환불 처리에 실패했습니다: " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static PaymentException paymentFailed(String message) {
        return new PaymentException("결제 처리에 실패했습니다: " + message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
