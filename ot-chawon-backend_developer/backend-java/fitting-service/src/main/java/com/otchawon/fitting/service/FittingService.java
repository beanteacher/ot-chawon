package com.otchawon.fitting.service;

import com.otchawon.fitting.dto.request.CreateFittingRequest;
import com.otchawon.fitting.dto.response.FittingResponse;
import com.otchawon.fitting.dto.response.FittingResultResponse;
import com.otchawon.fitting.entity.FittingStatus;

import java.util.List;

public interface FittingService {

    FittingResponse createFitting(CreateFittingRequest request);

    FittingResponse getFitting(Long id, String userId);

    List<FittingResponse> getFittingsByUser(String userId);

    void updateResult(Long fittingId, FittingStatus status, String fittedGlbUrl,
                      String renderUrlsJson, String sizeRecommendationJson);

    FittingResultResponse getResult(Long id, String userId);
}
