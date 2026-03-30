package com.otchawon.user.service.impl;
import com.otchawon.user.dto.UserDto;

import com.otchawon.user.entity.BodyMeasurement;
import com.otchawon.user.entity.User;
import com.otchawon.user.exception.AuthException;
import com.otchawon.user.repository.BodyMeasurementRepository;
import com.otchawon.user.repository.UserRepository;
import com.otchawon.user.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * 프로필 및 체형 정보 서비스 구현체.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final BodyMeasurementRepository bodyMeasurementRepository;

    @Override
    @Transactional
    public UserDto.UserResponse updateProfile(Long userId, UserDto.UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(AuthException::userNotFound);
        user.updateProfile(request.getNickname(), request.getAddress());
        log.info("프로필 수정 완료: userId={}", userId);
        return UserDto.UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserDto.BodyMeasurementResponse createBodyMeasurement(Long userId, UserDto.BodyMeasurementRequest request) {
        if (bodyMeasurementRepository.findByUserId(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "체형 정보가 이미 존재합니다. PUT 메서드로 수정하세요.");
        }

        BodyMeasurement measurement = BodyMeasurement.builder()
                .userId(userId)
                .height(request.getHeight())
                .weight(request.getWeight())
                .chest(request.getChest())
                .waist(request.getWaist())
                .hip(request.getHip())
                .shoulder(request.getShoulder())
                .armLength(request.getArmLength())
                .legLength(request.getLegLength())
                .build();

        BodyMeasurement saved = bodyMeasurementRepository.save(measurement);
        log.info("체형 정보 저장 완료: userId={}", userId);
        return UserDto.BodyMeasurementResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto.BodyMeasurementResponse getBodyMeasurement(Long userId) {
        BodyMeasurement measurement = bodyMeasurementRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "체형 정보가 존재하지 않습니다."));
        return UserDto.BodyMeasurementResponse.from(measurement);
    }

    @Override
    @Transactional
    public UserDto.BodyMeasurementResponse updateBodyMeasurement(Long userId, UserDto.BodyMeasurementRequest request) {
        BodyMeasurement measurement = bodyMeasurementRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "체형 정보가 존재하지 않습니다. POST 메서드로 먼저 저장하세요."));

        measurement.update(
                request.getHeight(),
                request.getWeight(),
                request.getChest(),
                request.getWaist(),
                request.getHip(),
                request.getShoulder(),
                request.getArmLength(),
                request.getLegLength()
        );

        log.info("체형 정보 수정 완료: userId={}", userId);
        return UserDto.BodyMeasurementResponse.from(measurement);
    }
}
