package com.otchawon.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshRequest {

    @NotBlank(message = "refreshToken은 필수입니다.")
    private String refreshToken;
}
