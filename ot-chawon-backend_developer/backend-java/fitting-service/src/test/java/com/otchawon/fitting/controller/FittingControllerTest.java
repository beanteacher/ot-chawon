package com.otchawon.fitting.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.dto.request.CreateFittingRequest;
import com.otchawon.fitting.dto.response.FittingResponse;
import com.otchawon.fitting.dto.response.FittingResultResponse;
import com.otchawon.fitting.entity.FittingStatus;
import com.otchawon.fitting.exception.FittingException;
import com.otchawon.fitting.exception.GlobalExceptionHandler;
import com.otchawon.fitting.service.FittingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FittingController.class)
@Import(GlobalExceptionHandler.class)
class FittingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private FittingService fittingService;

    @Test
    @DisplayName("POST /api/v1/fittings - 피팅 요청 생성 성공 (201)")
    void createFitting_성공() throws Exception {
        FittingResponse response = FittingResponse.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.QUEUED)
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingService.createFitting(any(CreateFittingRequest.class))).willReturn(response);

        String body = objectMapper.writeValueAsString(CreateFittingRequest.builder()
                .userId("user-1")
                .itemId("item-1")
                .bodyMeasurement(Map.of("height", 175, "weight", 70))
                .build());

        mockMvc.perform(post("/api/v1/fittings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("QUEUED"));
    }

    @Test
    @DisplayName("POST /api/v1/fittings - 필수 필드 누락 시 400")
    void createFitting_필수필드누락_400() throws Exception {
        String body = "{\"itemId\":\"item-1\"}";

        mockMvc.perform(post("/api/v1/fittings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/v1/fittings/{id} - 피팅 단건 조회 성공 (200)")
    void getFitting_성공() throws Exception {
        FittingResponse response = FittingResponse.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.PROCESSING)
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingService.getFitting(1L, "user-1")).willReturn(response);

        mockMvc.perform(get("/api/v1/fittings/1")
                        .header("X-User-Id", "user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("PROCESSING"));
    }

    @Test
    @DisplayName("GET /api/v1/fittings/{id} - 존재하지 않는 피팅 404")
    void getFitting_없음_404() throws Exception {
        given(fittingService.getFitting(999L, "user-1")).willThrow(FittingException.notFound());

        mockMvc.perform(get("/api/v1/fittings/999")
                        .header("X-User-Id", "user-1"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/v1/fittings/user/{userId} - 사용자 피팅 목록 조회 성공 (200)")
    void getFittingsByUser_성공() throws Exception {
        FittingResponse r1 = FittingResponse.builder()
                .id(1L).userId("user-1").itemId("item-1")
                .status(FittingStatus.COMPLETED).createdAt(LocalDateTime.now()).build();
        FittingResponse r2 = FittingResponse.builder()
                .id(2L).userId("user-1").itemId("item-2")
                .status(FittingStatus.QUEUED).createdAt(LocalDateTime.now()).build();

        given(fittingService.getFittingsByUser("user-1")).willReturn(List.of(r1, r2));

        mockMvc.perform(get("/api/v1/fittings/user/user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    @DisplayName("GET /api/v1/fittings/{id}/result - 완료된 피팅 결과 조회 성공 (200)")
    void getResult_성공() throws Exception {
        FittingResultResponse response = FittingResultResponse.builder()
                .fittedGlbUrl("https://cdn.example.com/fitted.glb")
                .renders(Map.of("front", "https://cdn.example.com/front.jpg"))
                .sizeRecommendation(Map.of("size", "M"))
                .elapsedMs(1200L)
                .build();

        given(fittingService.getResult(1L, "user-1")).willReturn(response);

        mockMvc.perform(get("/api/v1/fittings/1/result")
                        .header("X-User-Id", "user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fittedGlbUrl").value("https://cdn.example.com/fitted.glb"))
                .andExpect(jsonPath("$.elapsedMs").value(1200));
    }
}
