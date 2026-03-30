package com.otchawon.product.service;
import com.otchawon.product.dto.ProductDto;

import com.otchawon.product.entity.ProductAsset;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.repository.ProductAssetRepository;
import com.otchawon.product.service.impl.ProductAssetServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProductAssetServiceImplTest {

    @Mock
    private ProductAssetRepository productAssetRepository;

    @InjectMocks
    private ProductAssetServiceImpl productAssetService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(productAssetService, "cdnBaseUrl", "https://cdn.otchawon.com");
    }

    private ProductAsset sampleAsset() {
        return ProductAsset.builder()
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
                .build();
    }

    @Test
    @DisplayName("에셋 목록 조회 - 상품 ID로 조회 성공")
    void getAssetsByProductId_success() {
        given(productAssetRepository.findAllByProductId(10L)).willReturn(List.of(sampleAsset()));

        List<ProductDto.ProductAssetResponse> result = productAssetService.getAssetsByProductId(10L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getProductId()).isEqualTo(10L);
        assertThat(result.get(0).getLodLevel()).isEqualTo("LOD0");
    }

    @Test
    @DisplayName("에셋 단건 조회 - 성공")
    void getAsset_success() {
        given(productAssetRepository.findById(1L)).willReturn(Optional.of(sampleAsset()));

        ProductDto.ProductAssetResponse result = productAssetService.getAsset(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getGlbUrl()).isEqualTo("https://storage.otchawon.com/products/10/lod0.glb");
    }

    @Test
    @DisplayName("에셋 단건 조회 - 존재하지 않는 ID 예외")
    void getAsset_notFound() {
        given(productAssetRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> productAssetService.getAsset(999L))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("에셋을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("에셋 생성 - CDN URL 자동 생성 및 저장 성공")
    void createAsset_success() {
        ProductDto.CreateProductAssetRequest request = ProductDto.CreateProductAssetRequest.builder()
                .productId(10L)
                .glbUrl("https://storage.otchawon.com/products/10/lod0.glb")
                .lodLevel("LOD0")
                .fileSize(1024000L)
                .polygonCount(5000)
                .build();

        ProductAsset saved = sampleAsset();
        given(productAssetRepository.save(any(ProductAsset.class))).willReturn(saved);

        ProductDto.ProductAssetResponse result = productAssetService.createAsset(request);

        assertThat(result.getProductId()).isEqualTo(10L);
        assertThat(result.getCdnUrl()).isEqualTo("https://cdn.otchawon.com/assets/clothing/10/lod0.glb");
        verify(productAssetRepository).save(any(ProductAsset.class));
    }

    @Test
    @DisplayName("에셋 수정 - 성공")
    void updateAsset_success() {
        ProductAsset asset = sampleAsset();
        given(productAssetRepository.findById(1L)).willReturn(Optional.of(asset));

        ProductDto.UpdateProductAssetRequest request = ProductDto.UpdateProductAssetRequest.builder()
                .lodLevel("LOD1")
                .polygonCount(3000)
                .build();

        ProductDto.ProductAssetResponse result = productAssetService.updateAsset(1L, request);

        assertThat(result).isNotNull();
        verify(productAssetRepository).findById(1L);
    }

    @Test
    @DisplayName("에셋 수정 - 존재하지 않는 ID 예외")
    void updateAsset_notFound() {
        given(productAssetRepository.findById(999L)).willReturn(Optional.empty());

        ProductDto.UpdateProductAssetRequest request = ProductDto.UpdateProductAssetRequest.builder().build();

        assertThatThrownBy(() -> productAssetService.updateAsset(999L, request))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("에셋을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("에셋 삭제 - 성공")
    void deleteAsset_success() {
        ProductAsset asset = sampleAsset();
        given(productAssetRepository.findById(1L)).willReturn(Optional.of(asset));

        productAssetService.deleteAsset(1L);

        verify(productAssetRepository).delete(asset);
    }

    @Test
    @DisplayName("에셋 삭제 - 존재하지 않는 ID 예외")
    void deleteAsset_notFound() {
        given(productAssetRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> productAssetService.deleteAsset(999L))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("에셋을 찾을 수 없습니다.");
    }
}
