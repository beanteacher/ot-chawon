package com.otchawon.brand.exception;

import org.springframework.http.HttpStatus;

public class BrandException extends RuntimeException {

    private final HttpStatus status;

    public BrandException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static BrandException notFound() {
        return new BrandException("브랜드를 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static BrandException nameAlreadyExists() {
        return new BrandException("이미 사용 중인 브랜드명입니다.", HttpStatus.CONFLICT);
    }

    public static BrandException adminAlreadyExists() {
        return new BrandException("이미 등록된 어드민입니다.", HttpStatus.CONFLICT);
    }
}
