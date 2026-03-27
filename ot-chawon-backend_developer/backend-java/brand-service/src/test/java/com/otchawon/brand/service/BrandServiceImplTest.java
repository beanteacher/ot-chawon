package com.otchawon.brand.service;

import com.otchawon.brand.dto.request.CreateBrandRequest;
import com.otchawon.brand.dto.request.UpdateBrandRequest;
import com.otchawon.brand.dto.response.BrandListResponse;
import com.otchawon.brand.dto.response.BrandResponse;
import com.otchawon.brand.entity.Brand;
import com.otchawon.brand.entity.BrandStatus;
import com.otchawon.brand.exception.BrandException;
import com.otchawon.brand.repository.BrandRepository;
import com.otchawon.brand.service.impl.BrandServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class BrandServiceImplTest {

    @InjectMocks
    private BrandServiceImpl brandService;

    @Mock
    private BrandRepository brandRepository;

    @Test
    @DisplayName("브랜드 생성 성공")
    void create_success() {
        CreateBrandRequest request = new CreateBrandRequest("테스트브랜드", "설명", "http://logo.url");
        Brand brand = Brand.builder()
                .id(1L)
                .name("테스트브랜드")
                .description("설명")
                .logoUrl("http://logo.url")
                .build();

        given(brandRepository.existsByName("테스트브랜드")).willReturn(false);
        given(brandRepository.save(any(Brand.class))).willReturn(brand);

        BrandResponse response = brandService.create(request);

        assertThat(response.getName()).isEqualTo("테스트브랜드");
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("브랜드 생성 실패 - 중복 이름")
    void create_fail_duplicateName() {
        CreateBrandRequest request = new CreateBrandRequest("중복브랜드", null, null);

        given(brandRepository.existsByName("중복브랜드")).willReturn(true);

        assertThatThrownBy(() -> brandService.create(request))
                .isInstanceOf(BrandException.class)
                .hasMessageContaining("이미 사용 중인 브랜드명");
    }

    @Test
    @DisplayName("브랜드 단건 조회 성공")
    void getById_success() {
        Brand brand = Brand.builder().id(1L).name("브랜드").build();
        given(brandRepository.findById(1L)).willReturn(Optional.of(brand));

        BrandResponse response = brandService.getById(1L);

        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("브랜드 단건 조회 실패 - 존재하지 않음")
    void getById_notFound() {
        given(brandRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> brandService.getById(999L))
                .isInstanceOf(BrandException.class)
                .hasMessageContaining("브랜드를 찾을 수 없습니다");
    }

    @Test
    @DisplayName("브랜드 목록 조회 성공")
    void getAll_success() {
        Brand brand1 = Brand.builder().id(1L).name("브랜드1").build();
        Brand brand2 = Brand.builder().id(2L).name("브랜드2").build();
        given(brandRepository.findAll()).willReturn(List.of(brand1, brand2));

        BrandListResponse response = brandService.getAll();

        assertThat(response.getBrands()).hasSize(2);
        assertThat(response.getTotalCount()).isEqualTo(2);
    }

    @Test
    @DisplayName("브랜드 수정 성공")
    void update_success() {
        Brand brand = Brand.builder().id(1L).name("기존브랜드").status(BrandStatus.ACTIVE).build();
        UpdateBrandRequest request = new UpdateBrandRequest("새브랜드", null, null, BrandStatus.INACTIVE);

        given(brandRepository.findById(1L)).willReturn(Optional.of(brand));
        given(brandRepository.existsByName("새브랜드")).willReturn(false);

        BrandResponse response = brandService.update(1L, request);

        assertThat(response).isNotNull();
    }
}
