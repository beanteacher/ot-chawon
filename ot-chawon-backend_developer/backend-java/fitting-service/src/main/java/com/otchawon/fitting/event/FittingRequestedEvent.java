package com.otchawon.fitting.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FittingRequestedEvent {

    private Long fittingId;
    private String userId;
    private String itemId;
    private Map<String, Object> bodyMeasurement;
    private Map<String, Object> renderOptions;
    private String gender;
}
