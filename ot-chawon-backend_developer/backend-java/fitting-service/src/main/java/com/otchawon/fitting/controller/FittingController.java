package com.otchawon.fitting.controller;
import com.otchawon.fitting.dto.FittingDto;

import com.otchawon.fitting.service.FittingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fittings")
@RequiredArgsConstructor
public class FittingController {

    private final FittingService fittingService;

    @PostMapping
    public ResponseEntity<FittingDto.Response> createFitting(
            @RequestBody @Valid FittingDto.CreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId) {
        FittingDto.CreateRequest effectiveRequest = (headerUserId != null && !headerUserId.isBlank())
                ? new FittingDto.CreateRequest(headerUserId, request.itemId(), request.bodyMeasurement(), request.renderOptions(), request.gender())
                : request;
        FittingDto.Response response = fittingService.createFitting(effectiveRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FittingDto.Response> getFitting(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        FittingDto.Response response = fittingService.getFitting(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FittingDto.Response>> getFittingsByUser(
            @PathVariable String userId) {
        List<FittingDto.Response> responses = fittingService.getFittingsByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<FittingDto.ResultResponse> getResult(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        FittingDto.ResultResponse response = fittingService.getResult(id, userId);
        return ResponseEntity.ok(response);
    }
}
