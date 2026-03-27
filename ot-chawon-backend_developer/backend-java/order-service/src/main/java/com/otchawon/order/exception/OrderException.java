package com.otchawon.order.exception;

import org.springframework.http.HttpStatus;

public class OrderException extends RuntimeException {

    private final HttpStatus status;

    public OrderException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static OrderException notFound() {
        return new OrderException("주문을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static OrderException cartEmpty() {
        return new OrderException("장바구니가 비어있습니다.", HttpStatus.BAD_REQUEST);
    }

    public static OrderException cartItemNotFound() {
        return new OrderException("장바구니 아이템을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static OrderException invalidStatus() {
        return new OrderException("유효하지 않은 주문 상태입니다.", HttpStatus.BAD_REQUEST);
    }

    public static OrderException alreadyCancelled() {
        return new OrderException("이미 취소된 주문입니다.", HttpStatus.CONFLICT);
    }
}
