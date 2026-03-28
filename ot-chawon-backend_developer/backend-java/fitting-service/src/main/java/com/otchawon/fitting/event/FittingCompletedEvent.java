package com.otchawon.fitting.event;

import com.otchawon.fitting.entity.FittingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FittingCompletedEvent {

    private Long fittingId;
    private FittingStatus status;
    private String fittedGlbUrl;
    private Map<String, Object> renderUrls;
    private Map<String, Object> sizeRecommendation;
    private Long elapsedMs;
}
