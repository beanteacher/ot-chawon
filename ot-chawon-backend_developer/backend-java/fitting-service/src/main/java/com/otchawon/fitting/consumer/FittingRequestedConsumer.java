package com.otchawon.fitting.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.client.AiServerClient;
import com.otchawon.fitting.entity.FittingStatus;
import com.otchawon.fitting.event.FittingRequestedEvent;
import com.otchawon.fitting.service.FittingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class FittingRequestedConsumer {

    private final AiServerClient aiServerClient;
    private final FittingService fittingService;
    private final ObjectMapper objectMapper;



    @KafkaListener(topics = "fitting.requested", groupId = "fitting-ai-caller",
            containerFactory = "fittingRequestedListenerContainerFactory")
    public void consumeFittingRequested(FittingRequestedEvent event) {
        log.info("fitting.requested 수신 → AI 서버 호출: fittingId={}", event.getFittingId());
        try {
            Map result = aiServerClient.requestFitting(event).block();
            if (result == null || "FAILED".equals(result.get("status"))) {
                log.warn("AI 서버 피팅 실패: fittingId={}", event.getFittingId());
                fittingService.updateResult(event.getFittingId(), FittingStatus.FAILED, null, null, null);
                return;
            }

            // Extract nested result object
            Object resultObj = result.get("result");
            if (!(resultObj instanceof Map)) {
                log.warn("AI 서버 응답에 result 필드 없음: fittingId={}", event.getFittingId());
                fittingService.updateResult(event.getFittingId(), FittingStatus.FAILED, null, null, null);
                return;
            }
            Map resultMap = (Map) resultObj;

            Object glbUrlObj = resultMap.get("glb_url");
            String glbUrl = glbUrlObj != null ? glbUrlObj.toString() : null;

            String rendersJson = null;
            Object renders = resultMap.get("renders");
            if (renders instanceof Map) {
                rendersJson = objectMapper.writeValueAsString(renders);
            }

            String sizeRecJson = null;
            Object sizeRec = resultMap.get("size_recommendation");
            if (sizeRec instanceof Map) {
                sizeRecJson = objectMapper.writeValueAsString(sizeRec);
            }

            fittingService.updateResult(event.getFittingId(), FittingStatus.COMPLETED, glbUrl, rendersJson, sizeRecJson);
            log.info("피팅 결과 저장 완료: fittingId={}, glbUrl={}", event.getFittingId(), glbUrl);

        } catch (Exception e) {
            log.error("fitting.requested 처리 실패: fittingId={}", event.getFittingId(), e);
            try {
                fittingService.updateResult(event.getFittingId(), FittingStatus.FAILED, null, null, null);
            } catch (Exception ex) {
                log.error("피팅 실패 상태 업데이트 실패: fittingId={}", event.getFittingId(), ex);
            }
        }
    }
}
