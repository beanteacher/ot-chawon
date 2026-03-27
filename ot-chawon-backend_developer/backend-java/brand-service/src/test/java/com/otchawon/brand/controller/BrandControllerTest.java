package com.otchawon.brand.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.brand.dto.request.CreateBrandRequest;
import com.otchawon.brand.dto.response.BrandListResponse;
import com.otchawon.brand.dto.response.BrandResponse;
import com.otchawon.brand.entity.BrandStatus;
import com.otchawon.brand.exception.BrandException;
import com.otchawon.brand.exception.GlobalExceptionHandler;
import com.otchawon.brand.service.BrandService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BrandController.class)
@Import(GlobalExceptionHandler.class)
class BrandControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BrandService brandService;

    @Test
    @DisplayName("POST /api/brands - 브랜드 등록 성공 (201)")
    void create_success() throws Exception {
        CreateBrandRequest request = new CreateBrandRequest("테스트브랜드", "설명", "http://logo.url");
        BrandResponse response = BrandResponse.builder()
                .id(1L)
                .name("테스트브랜드")
                .status(BrandStatus.ACTIVE)
                .build();

        given(brandService.create(any(CreateBrandRequest.class))).willReturn(response);

        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("테스트브랜드"));
    }

    @Test
    @DisplayName("POST /api/brands - 유효성 검사 실패 (400)")
    void create_validation_fail() throws Exception {
        CreateBrandRequest request = new CreateBrandRequest("", null, null);

        mockMvc.perform(post("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/brands - 브랜드 목록 조회 성공 (200)")
    void getAll_success() throws Exception {
        BrandResponse brand = BrandResponse.builder().id(1L).name("브랜드1").status(BrandStatus.ACTIVE).build();
        BrandListResponse response = BrandListResponse.builder()
                .brands(List.of(brand))
                .totalCount(1)
                .build();

        given(brandService.getAll()).willReturn(response);

        mockMvc.perform(get("/api/brands"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCount").value(1))
                .andExpect(jsonPath("$.brands[0].name").value("브랜드1"));
    }

    @Test
    @DisplayName("GET /api/brands/{id} - 브랜드 상세 조회 성공 (200)")
    void getById_success() throws Exception {
        BrandResponse response = BrandResponse.builder().id(1L).name("브랜드").status(BrandStatus.ACTIVE).build();
        given(brandService.getById(1L)).willReturn(response);

        mockMvc.perform(get("/api/brands/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @DisplayName("GET /api/brands/{id} - 브랜드 없음 (404)")
    void getById_notFound() throws Exception {
        given(brandService.getById(999L)).willThrow(BrandException.notFound());

        mockMvc.perform(get("/api/brands/999"))
                .andExpect(status().isNotFound());
    }
}
