package com.otchawon.fitting.client;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
public class AiServerClientFallback {

    private AiServerClientFallback() {}

    public static Mono<Map> fallback(Long fittingId, Throwable cause) {
        log.warn("AI 서버 폴백 처리: fittingId={}, cause={}", fittingId, cause.getMessage());
        return Mono.just(Map.of(
                "fitting_id", fittingId,
                "status", "FAILED",
                "error", cause.getMessage() != null ? cause.getMessage() : "AI 서버 연결 실패"
        ));
    }
}
