package com.otchawon.user.repository;

import com.otchawon.user.entity.BodyMeasurement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 체형 정보 레포지토리.
 */
public interface BodyMeasurementRepository extends JpaRepository<BodyMeasurement, Long> {

    /**
     * 사용자 ID로 체형 정보를 조회한다.
     *
     * @param userId 사용자 ID
     * @return 체형 정보 Optional
     */
    Optional<BodyMeasurement> findByUserId(Long userId);
}
