package com.otchawon.user.service;

import com.otchawon.user.dto.request.BodyMeasurementRequest;
import com.otchawon.user.dto.request.UpdateProfileRequest;
import com.otchawon.user.dto.response.BodyMeasurementResponse;
import com.otchawon.user.dto.response.UserResponse;

/**
 * 프로필 및 체형 정보 서비스 인터페이스.
 */
public interface ProfileService {

    /**
     * 사용자 프로필(닉네임, 주소)을 수정한다.
     *
     * @param userId  인증된 사용자 ID
     * @param request 수정 요청 DTO
     * @return 수정된 사용자 정보
     */
    UserResponse updateProfile(Long userId, UpdateProfileRequest request);

    /**
     * 체형 정보를 저장한다. 이미 존재하면 409 예외를 발생시킨다.
     *
     * @param userId  인증된 사용자 ID
     * @param request 체형 정보 요청 DTO
     * @return 저장된 체형 정보
     */
    BodyMeasurementResponse createBodyMeasurement(Long userId, BodyMeasurementRequest request);

    /**
     * 체형 정보를 조회한다.
     *
     * @param userId 인증된 사용자 ID
     * @return 체형 정보
     */
    BodyMeasurementResponse getBodyMeasurement(Long userId);

    /**
     * 체형 정보를 수정한다. 존재하지 않으면 404 예외를 발생시킨다.
     *
     * @param userId  인증된 사용자 ID
     * @param request 체형 정보 요청 DTO
     * @return 수정된 체형 정보
     */
    BodyMeasurementResponse updateBodyMeasurement(Long userId, BodyMeasurementRequest request);
}
