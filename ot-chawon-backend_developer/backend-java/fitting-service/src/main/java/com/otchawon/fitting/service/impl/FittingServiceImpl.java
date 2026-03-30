package com.otchawon.fitting.service.impl;
import com.otchawon.fitting.dto.FittingDto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.entity.FittingRequest;
import com.otchawon.fitting.entity.FittingStatus;
import com.otchawon.fitting.event.FittingRequestedEvent;
import com.otchawon.fitting.exception.FittingException;
import com.otchawon.fitting.producer.FittingEventProducer;
import com.otchawon.fitting.repository.FittingRequestRepository;
import com.otchawon.fitting.service.FittingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FittingServiceImpl implements FittingService {

    private final FittingRequestRepository fittingRequestRepository;
    private final FittingEventProducer fittingEventProducer;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public FittingDto.Response createFitting(FittingDto.CreateRequest request) {
        String bodyMeasurementJson = null;
        try {
            bodyMeasurementJson = objectMapper.writeValueAsString(request.getBodyMeasurement());
        } catch (Exception e) {
            log.warn("bodyMeasurement 직렬화 실패: {}", e.getMessage());
        }

        FittingRequest fitting = FittingRequest.builder()
                .userId(request.getUserId())
                .itemId(request.getItemId())
                .bodyMeasurement(bodyMeasurementJson)
                .status(FittingStatus.QUEUED)
                .build();

        FittingRequest saved = fittingRequestRepository.save(fitting);
        log.info("피팅 요청 생성: fittingId={}, userId={}", saved.getId(), saved.getUserId());

        FittingRequestedEvent event = FittingRequestedEvent.builder()
                .fittingId(saved.getId())
                .userId(saved.getUserId())
                .itemId(saved.getItemId())
                .bodyMeasurement(request.getBodyMeasurement())
                .renderOptions(request.getRenderOptions())
                .build();

        fittingEventProducer.sendFittingRequested(event);

        return FittingDto.Response.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public FittingDto.Response getFitting(Long id, String userId) {
        FittingRequest fitting = fittingRequestRepository.findByIdAndUserId(id, userId)
                .orElseThrow(FittingException::notFound);
        return FittingDto.Response.from(fitting);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FittingDto.Response> getFittingsByUser(String userId) {
        return fittingRequestRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(FittingDto.Response::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateResult(Long fittingId, FittingStatus status, String fittedGlbUrl,
                             String renderUrlsJson, String sizeRecommendationJson) {
        FittingRequest fitting = fittingRequestRepository.findById(fittingId)
                .orElseThrow(FittingException::notFound);

        if (status == FittingStatus.COMPLETED) {
            fitting.completeWithResult(fittedGlbUrl, renderUrlsJson, sizeRecommendationJson);
        } else {
            fitting.fail();
        }

        log.info("피팅 결과 업데이트: fittingId={}, status={}", fittingId, status);
    }

    @Override
    @Transactional(readOnly = true)
    public FittingDto.ResultResponse getResult(Long id, String userId) {
        FittingRequest fitting = fittingRequestRepository.findByIdAndUserId(id, userId)
                .orElseThrow(FittingException::notFound);

        if (fitting.getStatus() == FittingStatus.QUEUED || fitting.getStatus() == FittingStatus.PROCESSING) {
            throw FittingException.resultNotReady();
        }

        if (fitting.getStatus() == FittingStatus.FAILED) {
            throw FittingException.processingFailed();
        }

        return FittingDto.ResultResponse.from(fitting);
    }
}
