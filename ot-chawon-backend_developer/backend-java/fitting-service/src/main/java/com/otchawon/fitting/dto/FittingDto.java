package com.otchawon.fitting.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.entity.FittingRequest;
import com.otchawon.fitting.entity.FittingStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;

public class FittingDto {

    public record CreateRequest(
            @NotBlank(message = "userId는 필수입니다.") String userId,
            @NotBlank(message = "itemId는 필수입니다.") String itemId,
            @NotNull(message = "bodyMeasurement는 필수입니다.") Map<String, Object> bodyMeasurement,
            Map<String, Object> renderOptions
    ) {}

    public record Response(
            Long id,
            String userId,
            String itemId,
            FittingStatus status,
            LocalDateTime createdAt,
            LocalDateTime completedAt
    ) {
        public static Response from(FittingRequest fitting) {
            return new Response(
                    fitting.getId(),
                    fitting.getUserId(),
                    fitting.getItemId(),
                    fitting.getStatus(),
                    fitting.getCreatedAt(),
                    fitting.getCompletedAt()
            );
        }
    }

    @Slf4j
    public static class ResultResponse {
        private final String fittedGlbUrl;
        private final Map<String, Object> renders;
        private final Map<String, Object> sizeRecommendation;
        private final Long elapsedMs;

        public ResultResponse(String fittedGlbUrl, Map<String, Object> renders,
                              Map<String, Object> sizeRecommendation, Long elapsedMs) {
            this.fittedGlbUrl = fittedGlbUrl;
            this.renders = renders;
            this.sizeRecommendation = sizeRecommendation;
            this.elapsedMs = elapsedMs;
        }

        public String getFittedGlbUrl() { return fittedGlbUrl; }
        public Map<String, Object> getRenders() { return renders; }
        public Map<String, Object> getSizeRecommendation() { return sizeRecommendation; }
        public Long getElapsedMs() { return elapsedMs; }

        public static ResultResponse from(FittingRequest fitting) {
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

            return new ResultResponse(fitting.getFittedGlbUrl(), renders, sizeRec, elapsedMs);
        }
    }
}
