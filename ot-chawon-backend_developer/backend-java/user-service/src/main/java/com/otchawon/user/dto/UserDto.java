package com.otchawon.user.dto;

import com.otchawon.user.entity.BodyMeasurement;
import com.otchawon.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UserDto {

    public record LoginRequest(
            @Email(message = "올바른 이메일 형식이 아닙니다.") @NotBlank(message = "이메일은 필수입니다.") String email,
            @NotBlank(message = "비밀번호는 필수입니다.") String password
    ) {}

    public record SignupRequest(
            @Email(message = "올바른 이메일 형식이 아닙니다.") @NotBlank(message = "이메일은 필수입니다.") String email,
            @NotBlank(message = "비밀번호는 필수입니다.") @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.") String password,
            @NotBlank(message = "이름은 필수입니다.") String name
    ) {}

    public record RefreshRequest(
            @NotBlank(message = "refreshToken은 필수입니다.") String refreshToken
    ) {}

    public record UpdateProfileRequest(
            @NotBlank(message = "이름은 필수입니다.") @Size(max = 100, message = "이름은 최대 100자입니다.") String name,
            @Size(max = 500, message = "주소는 최대 500자입니다.") String address
    ) {}

    public record BodyMeasurementRequest(
            @Positive(message = "키는 양수여야 합니다.") Double height,
            @Positive(message = "몸무게는 양수여야 합니다.") Double weight,
            @Positive(message = "가슴둘레는 양수여야 합니다.") Double chest,
            @Positive(message = "허리둘레는 양수여야 합니다.") Double waist,
            @Positive(message = "엉덩이둘레는 양수여야 합니다.") Double hip,
            @Positive(message = "어깨너비는 양수여야 합니다.") Double shoulder,
            @Positive(message = "팔 길이는 양수여야 합니다.") Double armLength,
            @Positive(message = "다리 길이는 양수여야 합니다.") Double legLength
    ) {}

    public record TokenResponse(
            String accessToken,
            String refreshToken,
            long expiresIn
    ) {}

    public record UserResponse(
            Long id,
            String email,
            String name,
            String role,
            String status,
            LocalDateTime createdAt
    ) {
        public static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole(),
                    user.getStatus(),
                    user.getCreatedAt()
            );
        }
    }

    public record BodyMeasurementResponse(
            Long id,
            Long userId,
            Double height,
            Double weight,
            Double chest,
            Double waist,
            Double hip,
            Double shoulder,
            Double armLength,
            Double legLength,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static BodyMeasurementResponse from(BodyMeasurement entity) {
            return new BodyMeasurementResponse(
                    entity.getId(),
                    entity.getUserId(),
                    entity.getHeight(),
                    entity.getWeight(),
                    entity.getChest(),
                    entity.getWaist(),
                    entity.getHip(),
                    entity.getShoulder(),
                    entity.getArmLength(),
                    entity.getLegLength(),
                    entity.getCreatedAt(),
                    entity.getUpdatedAt()
            );
        }
    }
}
