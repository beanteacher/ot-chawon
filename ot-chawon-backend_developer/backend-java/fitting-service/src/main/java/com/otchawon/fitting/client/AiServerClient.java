package com.otchawon.fitting.client;

import com.otchawon.fitting.event.FittingRequestedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiServerClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${AI_SERVER_URL:http://ai-server:8090}")
    private String aiBaseUrl;

    public Mono<Map> requestFitting(FittingRequestedEvent event) {
        Map<String, Object> bodyMap = buildBodyMap(event.getBodyMeasurement(), event.getGender());
        return webClientBuilder.baseUrl(aiBaseUrl)
                .build()
                .post()
                .uri("/fit")
                .bodyValue(Map.of(
                        "fitting_id", event.getFittingId(),
                        "user_id", event.getUserId(),
                        "item_id", event.getItemId(),
                        "body", bodyMap,
                        "render_options", event.getRenderOptions() != null ? event.getRenderOptions() : Map.of()
                ))
                .retrieve()
                .bodyToMono(Map.class)
                .doOnSuccess(res -> log.info("AI 서버 피팅 요청 성공: fittingId={}", event.getFittingId()))
                .doOnError(e -> log.error("AI 서버 피팅 요청 실패: fittingId={}, error={}", event.getFittingId(), e.getMessage()))
                .onErrorResume(e -> AiServerClientFallback.fallback(event.getFittingId(), e));
    }

    private Map<String, Object> buildBodyMap(Map<String, Object> bodyMeasurement, String gender) {
        Map<String, Object> body = new HashMap<>();
        if (bodyMeasurement != null) {
            body.put("height_cm", firstNonNull(bodyMeasurement, "height_cm", "height"));
            body.put("weight_kg", firstNonNull(bodyMeasurement, "weight_kg", "weight"));
            body.put("chest_cm", firstNonNull(bodyMeasurement, "chest_cm", "chest"));
            body.put("waist_cm", firstNonNull(bodyMeasurement, "waist_cm", "waist"));
            body.put("hip_cm", firstNonNull(bodyMeasurement, "hip_cm", "hip"));
            body.put("shoulder_cm", firstNonNull(bodyMeasurement, "shoulder_cm", "shoulder"));
            body.put("arm_length_cm", firstNonNull(bodyMeasurement, "arm_length_cm", "arm_length", "armLength"));
            body.put("leg_length_cm", firstNonNull(bodyMeasurement, "leg_length_cm", "leg_length", "legLength"));
            Object genderFromMap = bodyMeasurement.get("gender");
            if (genderFromMap != null) {
                body.put("gender", genderFromMap.toString());
            }
        }
        if (!body.containsKey("gender") || body.get("gender") == null) {
            body.put("gender", gender != null ? gender : "male");
        }
        return body;
    }

    private Object firstNonNull(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            Object val = map.get(key);
            if (val != null) {
                return val;
            }
        }
        return null;
    }
}
