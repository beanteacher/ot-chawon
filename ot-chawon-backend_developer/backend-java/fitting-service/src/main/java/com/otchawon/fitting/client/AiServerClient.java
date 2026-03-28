package com.otchawon.fitting.client;

import com.otchawon.fitting.event.FittingRequestedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiServerClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${otc.ai-ml.base-url:http://localhost:8000}")
    private String aiBaseUrl;

    public Mono<Map> requestFitting(FittingRequestedEvent event) {
        return webClientBuilder.baseUrl(aiBaseUrl)
                .build()
                .post()
                .uri("/fit")
                .bodyValue(Map.of(
                        "fitting_id", event.getFittingId(),
                        "user_id", event.getUserId(),
                        "item_id", event.getItemId(),
                        "body_measurement", event.getBodyMeasurement(),
                        "render_options", event.getRenderOptions() != null ? event.getRenderOptions() : Map.of()
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .doOnSuccess(res -> log.info("AI 서버 피팅 요청 성공: fittingId={}", event.getFittingId()))
                .doOnError(e -> log.error("AI 서버 피팅 요청 실패: fittingId={}, error={}", event.getFittingId(), e.getMessage()))
                .onErrorResume(e -> AiServerClientFallback.fallback(event.getFittingId(), e));
    }
}
