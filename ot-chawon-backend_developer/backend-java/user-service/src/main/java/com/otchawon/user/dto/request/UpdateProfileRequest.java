package com.otchawon.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 프로필 수정 요청 DTO.
 * nickname과 address 필드만 수정 가능하다.
 */
@Getter
@NoArgsConstructor
public class UpdateProfileRequest {

    /** 닉네임 (필수, 최대 100자) */
    @NotBlank(message = "닉네임은 필수입니다.")
    @Size(max = 100, message = "닉네임은 최대 100자입니다.")
    private String nickname;

    /** 주소 (선택, 최대 500자) */
    @Size(max = 500, message = "주소는 최대 500자입니다.")
    private String address;
}
