package com.otchawon.fitting.service;
import com.otchawon.fitting.dto.FittingDto;

import com.otchawon.fitting.entity.FittingStatus;

import java.util.List;

public interface FittingService {

    FittingDto.Response createFitting(FittingDto.CreateRequest request);

    FittingDto.Response getFitting(Long id, String userId);

    List<FittingDto.Response> getFittingsByUser(String userId);

    void updateResult(Long fittingId, FittingStatus status, String fittedGlbUrl,
                      String renderUrlsJson, String sizeRecommendationJson);

    FittingDto.ResultResponse getResult(Long id, String userId);
}
