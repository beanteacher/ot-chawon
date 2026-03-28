package com.otchawon.fitting.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFittingRequest {

    @NotBlank(message = "userId는 필수입니다.")
    private String userId;

    @NotBlank(message = "itemId는 필수입니다.")
    private String itemId;

    @NotNull(message = "bodyMeasurement는 필수입니다.")
    private Map<String, Object> bodyMeasurement;

    private Map<String, Object> renderOptions;
}
