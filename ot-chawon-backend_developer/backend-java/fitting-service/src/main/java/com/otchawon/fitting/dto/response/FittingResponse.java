package com.otchawon.fitting.dto.response;

import com.otchawon.fitting.entity.FittingRequest;
import com.otchawon.fitting.entity.FittingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FittingResponse {

    private Long id;
    private String userId;
    private String itemId;
    private FittingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public static FittingResponse from(FittingRequest fitting) {
        return FittingResponse.builder()
                .id(fitting.getId())
                .userId(fitting.getUserId())
                .itemId(fitting.getItemId())
                .status(fitting.getStatus())
                .createdAt(fitting.getCreatedAt())
                .completedAt(fitting.getCompletedAt())
                .build();
    }
}
