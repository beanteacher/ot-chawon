package com.otchawon.user.dto.response;

import com.otchawon.user.entity.BodyMeasurement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 체형 정보 응답 DTO.
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BodyMeasurementResponse {

    private Long id;
    private Long userId;
    private Double height;
    private Double weight;
    private Double chest;
    private Double waist;
    private Double hip;
    private Double shoulder;
    private Double armLength;
    private Double legLength;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * BodyMeasurement 엔티티로부터 응답 DTO를 생성한다.
     *
     * @param entity 체형 정보 엔티티
     * @return 체형 정보 응답 DTO
     */
    public static BodyMeasurementResponse from(BodyMeasurement entity) {
        return BodyMeasurementResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .height(entity.getHeight())
                .weight(entity.getWeight())
                .chest(entity.getChest())
                .waist(entity.getWaist())
                .hip(entity.getHip())
                .shoulder(entity.getShoulder())
                .armLength(entity.getArmLength())
                .legLength(entity.getLegLength())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
