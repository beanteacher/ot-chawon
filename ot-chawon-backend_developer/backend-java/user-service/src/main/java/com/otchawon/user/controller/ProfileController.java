package com.otchawon.user.controller;

import com.otchawon.user.dto.request.BodyMeasurementRequest;
import com.otchawon.user.dto.request.UpdateProfileRequest;
import com.otchawon.user.dto.response.BodyMeasurementResponse;
import com.otchawon.user.dto.response.UserResponse;
import com.otchawon.user.security.JwtTokenProvider;
import com.otchawon.user.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 프로필 및 체형 정보 컨트롤러.
 *
 * <ul>
 *   <li>PUT  /api/auth/profile            - 프로필 수정</li>
 *   <li>POST /api/auth/body-measurements  - 체형 정보 저장</li>
 *   <li>GET  /api/auth/body-measurements  - 체형 정보 조회</li>
 *   <li>PUT  /api/auth/body-measurements  - 체형 정보 수정</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 프로필(닉네임, 주소)을 수정한다.
     */
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = extractUserId(authorizationHeader);
        UserResponse response = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 체형 정보를 최초 저장한다.
     */
    @PostMapping("/body-measurements")
    public ResponseEntity<BodyMeasurementResponse> createBodyMeasurement(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody BodyMeasurementRequest request) {
        Long userId = extractUserId(authorizationHeader);
        BodyMeasurementResponse response = profileService.createBodyMeasurement(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 체형 정보를 조회한다.
     */
    @GetMapping("/body-measurements")
    public ResponseEntity<BodyMeasurementResponse> getBodyMeasurement(
            @RequestHeader("Authorization") String authorizationHeader) {
        Long userId = extractUserId(authorizationHeader);
        BodyMeasurementResponse response = profileService.getBodyMeasurement(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * 체형 정보를 수정한다.
     */
    @PutMapping("/body-measurements")
    public ResponseEntity<BodyMeasurementResponse> updateBodyMeasurement(
            @RequestHeader("Authorization") String authorizationHeader,
            @Valid @RequestBody BodyMeasurementRequest request) {
        Long userId = extractUserId(authorizationHeader);
        BodyMeasurementResponse response = profileService.updateBodyMeasurement(userId, request);
        return ResponseEntity.ok(response);
    }

    private Long extractUserId(String bearerToken) {
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return jwtTokenProvider.extractUserId(bearerToken.substring(7));
        }
        throw new IllegalArgumentException("유효하지 않은 Authorization 헤더입니다.");
    }
}
