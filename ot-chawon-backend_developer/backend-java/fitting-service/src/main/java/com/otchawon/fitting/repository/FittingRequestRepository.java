package com.otchawon.fitting.repository;

import com.otchawon.fitting.entity.FittingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FittingRequestRepository extends JpaRepository<FittingRequest, Long> {

    List<FittingRequest> findAllByUserIdOrderByCreatedAtDesc(String userId);

    Optional<FittingRequest> findByIdAndUserId(Long id, String userId);
}
