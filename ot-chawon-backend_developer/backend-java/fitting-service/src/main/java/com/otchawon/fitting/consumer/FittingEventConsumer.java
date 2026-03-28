package com.otchawon.fitting.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.event.FittingCompletedEvent;
import com.otchawon.fitting.entity.FittingStatus;
import com.otchawon.fitting.service.FittingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FittingEventConsumer {

    private final FittingService fittingService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "fitting.completed", groupId = "fitting-service",
            containerFactory = "kafkaListenerContainerFactory")
    public void consumeFittingCompleted(FittingCompletedEvent event) {
        log.info("fitting.completed 이벤트 수신: fittingId={}, status={}", event.getFittingId(), event.getStatus());
        try {
            String renderUrlsJson = event.getRenderUrls() != null
                    ? objectMapper.writeValueAsString(event.getRenderUrls()) : null;
            String sizeRecJson = event.getSizeRecommendation() != null
                    ? objectMapper.writeValueAsString(event.getSizeRecommendation()) : null;

            fittingService.updateResult(
                    event.getFittingId(),
                    event.getStatus(),
                    event.getFittedGlbUrl(),
                    renderUrlsJson,
                    sizeRecJson
            );
        } catch (Exception e) {
            log.error("fitting.completed 처리 실패: fittingId={}", event.getFittingId(), e);
        }
    }
}
