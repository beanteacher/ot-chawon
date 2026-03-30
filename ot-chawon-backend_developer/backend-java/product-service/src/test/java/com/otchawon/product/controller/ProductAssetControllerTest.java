package com.otchawon.product.controller;
import com.otchawon.product.dto.ProductDto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.product.exception.GlobalExceptionHandler;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.service.ProductAssetService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductAssetController.class)
@Import(GlobalExceptionHandler.class)
class ProductAssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductAssetService productAssetService;

    private ProductDto.ProductAssetResponse sampleResponse() {
        return ProductDto.ProductAssetResponse.builder()
                .id(1L)
                .productId(10L)
                .glbUrl("https://storage.otchawon.com/products/10/lod0.glb")
                .cdnUrl("https://cdn.otchawon.com/assets/clothing/10/lod0.glb")
                .thumbnailUrl("https://storage.otchawon.com/products/10/thumb.png")
                .lodLevel("LOD0")
                .fileSize(1024000L)
                .polygonCount(5000)
                .rigType("HUMANOID")
                .dracoCompressed(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/products/{productId}/assets - 상품 에셋 목록 조회 성공 (200)")
    void getAssetsByProductId_success() throws Exception {
        given(productAssetService.getAssetsByProductId(10L)).willReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/v1/products/10/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].productId").value(10L))
                .andExpect(jsonPath("$[0].lodLevel").value("LOD0"));
    }

    @Test
    @DisplayName("GET /api/v1/assets/{assetId} - 에셋 단건 조회 성공 (200)")
    void getAsset_success() throws Exception {
        given(productAssetService.getAsset(1L)).willReturn(sampleResponse());

        mockMvc.perform(get("/api/v1/assets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.glbUrl").value("https://storage.otchawon.com/products/10/lod0.glb"));
    }

    @Test
    @DisplayName("GET /api/v1/assets/{assetId} - 존재하지 않는 에셋 404")
    void getAsset_notFound() throws Exception {
        given(productAssetService.getAsset(999L))
                .willThrow(new ProductException("에셋을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

        mockMvc.perform(get("/api/v1/assets/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/v1/assets - 에셋 생성 성공 (201)")
    void createAsset_success() throws Exception {
        ProductDto.CreateProductAssetRequest request = ProductDto.CreateProductAssetRequest.builder()
                .productId(10L)
                .glbUrl("https://storage.otchawon.com/products/10/lod0.glb")
                .lodLevel("LOD0")
                .build();

        given(productAssetService.createAsset(any())).willReturn(sampleResponse());

        mockMvc.perform(post("/api/v1/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    @DisplayName("POST /api/v1/assets - 필수 필드 누락 시 400")
    void createAsset_validationFail() throws Exception {
        ProductDto.CreateProductAssetRequest request = ProductDto.CreateProductAssetRequest.builder()
                .lodLevel("LOD0")
                .build();

        mockMvc.perform(post("/api/v1/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/v1/assets/{assetId} - 에셋 수정 성공 (200)")
    void updateAsset_success() throws Exception {
        ProductDto.ProductAssetResponse updated = ProductDto.ProductAssetResponse.builder()
                .id(1L)
                .productId(10L)
                .glbUrl("https://storage.otchawon.com/products/10/lod1.glb")
                .lodLevel("LOD1")
                .dracoCompressed(true)
                .createdAt(LocalDateTime.now())
                .build();

        given(productAssetService.updateAsset(eq(1L), any())).willReturn(updated);

        mockMvc.perform(put("/api/v1/assets/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"lodLevel\":\"LOD1\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lodLevel").value("LOD1"));
    }

    @Test
    @DisplayName("DELETE /api/v1/assets/{assetId} - 에셋 삭제 성공 (204)")
    void deleteAsset_success() throws Exception {
        mockMvc.perform(delete("/api/v1/assets/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/v1/assets/{assetId} - 존재하지 않는 에셋 삭제 404")
    void deleteAsset_notFound() throws Exception {
        doThrow(new ProductException("에셋을 찾을 수 없습니다.", HttpStatus.NOT_FOUND))
                .when(productAssetService).deleteAsset(999L);

        mockMvc.perform(delete("/api/v1/assets/999"))
                .andExpect(status().isNotFound());
    }
}
