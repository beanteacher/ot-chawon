package com.otchawon.product.controller;
import com.otchawon.product.dto.ProductDto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.product.exception.GlobalExceptionHandler;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.service.ProductService;
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
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@Import(GlobalExceptionHandler.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @DisplayName("POST /api/products - 상품 등록 성공 (201)")
    void create_success() throws Exception {
        ProductDto.CreateProductRequest request = ProductDto.CreateProductRequest.builder()
                .name("테스트 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .build();

        ProductDto.ProductResponse response = ProductDto.ProductResponse.builder()
                .id(1L)
                .name("테스트 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .status("ACTIVE")
                .build();

        given(productService.create(any())).willReturn(response);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("테스트 상품"));
    }

    @Test
    @DisplayName("POST /api/products - 필수 필드 누락 시 400")
    void create_validationFail() throws Exception {
        ProductDto.CreateProductRequest request = ProductDto.CreateProductRequest.builder()
                .price(10000)
                .build();

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/products/{id} - 상품 조회 성공 (200)")
    void getById_success() throws Exception {
        ProductDto.ProductResponse response = ProductDto.ProductResponse.builder()
                .id(1L)
                .name("테스트 상품")
                .price(10000)
                .status("ACTIVE")
                .build();

        given(productService.getById(1L)).willReturn(response);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @DisplayName("GET /api/products/{id} - 존재하지 않는 상품 404")
    void getById_notFound() throws Exception {
        given(productService.getById(999L)).willThrow(ProductException.notFound());

        mockMvc.perform(get("/api/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("GET /api/products - 상품 목록 조회 성공")
    void list_success() throws Exception {
        ProductDto.ProductListResponse response = ProductDto.ProductListResponse.builder()
                .products(List.of())
                .totalPages(0)
                .totalElements(0)
                .currentPage(0)
                .build();

        given(productService.search(any(), any())).willReturn(response);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - 소프트 삭제 성공 (204)")
    void delete_success() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - 이미 삭제된 상품 410")
    void delete_alreadyDeleted() throws Exception {
        doThrow(ProductException.alreadyDeleted()).when(productService).softDelete(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isGone());
    }
}
