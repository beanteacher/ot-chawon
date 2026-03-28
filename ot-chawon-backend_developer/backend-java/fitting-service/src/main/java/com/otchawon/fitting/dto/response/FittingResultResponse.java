package com.otchawon.fitting.dto.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.entity.FittingRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FittingResultResponse {

    private String fittedGlbUrl;
    private Map<String, Object> renders;
    private Map<String, Object> sizeRecommendation;
    private Long elapsedMs;

    public static FittingResultResponse from(FittingRequest fitting) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> renders = null;
        Map<String, Object> sizeRec = null;

        try {
            if (fitting.getRenderUrls() != null) {
                renders = mapper.readValue(fitting.getRenderUrls(), new TypeReference<>() {});
            }
            if (fitting.getSizeRecommendation() != null) {
                sizeRec = mapper.readValue(fitting.getSizeRecommendation(), new TypeReference<>() {});
            }
        } catch (Exception e) {
            log.warn("JSON 파싱 실패: {}", e.getMessage());
        }

        long elapsedMs = 0L;
        if (fitting.getCreatedAt() != null && fitting.getCompletedAt() != null) {
            elapsedMs = java.time.Duration.between(fitting.getCreatedAt(), fitting.getCompletedAt()).toMillis();
        }

        return FittingResultResponse.builder()
                .fittedGlbUrl(fitting.getFittedGlbUrl())
                .renders(renders)
                .sizeRecommendation(sizeRec)
                .elapsedMs(elapsedMs)
                .build();
    }
}
