package com.otchawon.fitting.exception;

import org.springframework.http.HttpStatus;

public class FittingException extends RuntimeException {

    private final HttpStatus status;

    public FittingException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static FittingException notFound() {
        return new FittingException("피팅 요청을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
    }

    public static FittingException resultNotReady() {
        return new FittingException("피팅 결과가 아직 준비되지 않았습니다.", HttpStatus.ACCEPTED);
    }

    public static FittingException processingFailed() {
        return new FittingException("피팅 처리에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
