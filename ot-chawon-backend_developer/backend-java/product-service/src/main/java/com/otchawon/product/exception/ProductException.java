package com.otchawon.product.exception;

import org.springframework.http.HttpStatus;

public class ProductException extends RuntimeException {

    private final HttpStatus status;

    public ProductException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static ProductException notFound() {
        return new ProductException("상품을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static ProductException alreadyDeleted() {
        return new ProductException("이미 삭제된 상품입니다.", HttpStatus.GONE);
    }

    public static ProductException categoryNotFound() {
        return new ProductException("카테고리를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }
}
