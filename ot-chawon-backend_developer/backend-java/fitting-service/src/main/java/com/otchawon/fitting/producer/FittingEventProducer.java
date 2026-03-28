package com.otchawon.fitting.producer;

import com.otchawon.fitting.event.FittingRequestedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FittingEventProducer {

    private static final String TOPIC = "fitting.requested";

    private final KafkaTemplate<String, FittingRequestedEvent> kafkaTemplate;

    public void sendFittingRequested(FittingRequestedEvent event) {
        kafkaTemplate.send(TOPIC, String.valueOf(event.getFittingId()), event);
        log.info("fitting.requested 이벤트 발행: fittingId={}", event.getFittingId());
    }
}
