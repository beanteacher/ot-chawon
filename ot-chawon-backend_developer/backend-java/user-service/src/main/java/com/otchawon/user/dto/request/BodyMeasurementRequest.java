package com.otchawon.user.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 체형 정보 저장/수정 요청 DTO.
 * height, weight는 필수이며 나머지는 선택이다.
 */
@Getter
@NoArgsConstructor
public class BodyMeasurementRequest {

    /** 키 (cm, 양수) */
    @Positive(message = "키는 양수여야 합니다.")
    private Double height;

    /** 몸무게 (kg, 양수) */
    @Positive(message = "몸무게는 양수여야 합니다.")
    private Double weight;

    /** 가슴둘레 (cm, 양수) */
    @Positive(message = "가슴둘레는 양수여야 합니다.")
    private Double chest;

    /** 허리둘레 (cm, 양수) */
    @Positive(message = "허리둘레는 양수여야 합니다.")
    private Double waist;

    /** 엉덩이둘레 (cm, 양수) */
    @Positive(message = "엉덩이둘레는 양수여야 합니다.")
    private Double hip;

    /** 어깨너비 (cm, 양수) */
    @Positive(message = "어깨너비는 양수여야 합니다.")
    private Double shoulder;

    /** 팔 길이 (cm, 양수) */
    @Positive(message = "팔 길이는 양수여야 합니다.")
    private Double armLength;

    /** 다리 길이 (cm, 양수) */
    @Positive(message = "다리 길이는 양수여야 합니다.")
    private Double legLength;
}
