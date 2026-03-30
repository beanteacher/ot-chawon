package com.otchawon.product.service;
import com.otchawon.product.dto.ProductDto;

import com.otchawon.product.entity.Product;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.repository.ProductOptionRepository;
import com.otchawon.product.repository.ProductRepository;
import com.otchawon.product.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductOptionRepository productOptionRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("상품 등록 - 성공")
    void create_success() {
        ProductDto.CreateProductRequest request = ProductDto.CreateProductRequest.builder()
                .name("테스트 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .description("설명")
                .build();

        Product saved = Product.builder()
                .id(1L)
                .name("테스트 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .description("설명")
                .status("ACTIVE")
                .build();

        given(productRepository.save(any(Product.class))).willReturn(saved);
        given(productOptionRepository.findByProductId(1L)).willReturn(List.of());

        ProductDto.ProductResponse response = productService.create(request);

        assertThat(response.getName()).isEqualTo("테스트 상품");
        assertThat(response.getPrice()).isEqualTo(10000);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("상품 조회 - 존재하지 않는 ID")
    void getById_notFound() {
        given(productRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(999L))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("상품을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("상품 조회 - 삭제된 상품")
    void getById_alreadyDeleted() {
        Product deleted = Product.builder()
                .id(1L)
                .name("삭제 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .status("DELETED")
                .build();
        deleted.softDelete();

        given(productRepository.findById(1L)).willReturn(Optional.of(deleted));

        assertThatThrownBy(() -> productService.getById(1L))
                .isInstanceOf(ProductException.class);
    }

    @Test
    @DisplayName("상품 목록 검색 - 성공")
    void search_success() {
        Product product = Product.builder()
                .id(1L)
                .name("테스트 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .status("ACTIVE")
                .build();

        Pageable pageable = PageRequest.of(0, 20);
        Page<Product> page = new PageImpl<>(List.of(product), pageable, 1);

        given(productRepository.search(any(), any(), any(), any(), any(), any(), any())).willReturn(page);

        ProductDto.ProductSearchRequest searchRequest = ProductDto.ProductSearchRequest.builder().build();
        ProductDto.ProductListResponse response = productService.search(searchRequest, pageable);

        assertThat(response.getProducts()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("상품 소프트 삭제 - 이미 삭제된 경우 예외")
    void softDelete_alreadyDeleted() {
        Product deleted = Product.builder()
                .id(1L)
                .name("삭제 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .status("ACTIVE")
                .build();
        deleted.softDelete();

        given(productRepository.findById(1L)).willReturn(Optional.of(deleted));

        assertThatThrownBy(() -> productService.softDelete(1L))
                .isInstanceOf(ProductException.class)
                .hasMessageContaining("이미 삭제된 상품입니다.");
    }

    @Test
    @DisplayName("상품 수정 - 성공")
    void update_success() {
        Product product = Product.builder()
                .id(1L)
                .name("원래 상품")
                .price(10000)
                .categoryId(1L)
                .brandId(1L)
                .status("ACTIVE")
                .build();

        given(productRepository.findById(1L)).willReturn(Optional.of(product));

        ProductDto.UpdateProductRequest request = ProductDto.UpdateProductRequest.builder()
                .name("수정된 상품")
                .price(20000)
                .build();

        ProductDto.ProductResponse response = productService.update(1L, request);

        assertThat(response.getName()).isEqualTo("수정된 상품");
        assertThat(response.getPrice()).isEqualTo(20000);
    }
}
