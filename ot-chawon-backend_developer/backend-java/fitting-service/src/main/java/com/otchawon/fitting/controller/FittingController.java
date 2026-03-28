package com.otchawon.fitting.controller;

import com.otchawon.fitting.dto.request.CreateFittingRequest;
import com.otchawon.fitting.dto.response.FittingResponse;
import com.otchawon.fitting.dto.response.FittingResultResponse;
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
    public ResponseEntity<FittingResponse> createFitting(
            @RequestBody @Valid CreateFittingRequest request) {
        FittingResponse response = fittingService.createFitting(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FittingResponse> getFitting(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        FittingResponse response = fittingService.getFitting(id, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FittingResponse>> getFittingsByUser(
            @PathVariable String userId) {
        List<FittingResponse> responses = fittingService.getFittingsByUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/result")
    public ResponseEntity<FittingResultResponse> getResult(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") String userId) {
        FittingResultResponse response = fittingService.getResult(id, userId);
        return ResponseEntity.ok(response);
    }
}
