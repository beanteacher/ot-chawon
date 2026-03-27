package com.otchawon.brand.service.impl;

import com.otchawon.brand.dto.request.CreateBrandRequest;
import com.otchawon.brand.dto.request.UpdateBrandRequest;
import com.otchawon.brand.dto.response.BrandListResponse;
import com.otchawon.brand.dto.response.BrandResponse;
import com.otchawon.brand.entity.Brand;
import com.otchawon.brand.exception.BrandException;
import com.otchawon.brand.repository.BrandRepository;
import com.otchawon.brand.service.BrandService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {

    private final BrandRepository brandRepository;

    @Override
    @Transactional
    public BrandResponse create(CreateBrandRequest request) {
        if (brandRepository.existsByName(request.getName())) {
            throw BrandException.nameAlreadyExists();
        }

        Brand brand = Brand.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .build();

        Brand savedBrand = brandRepository.save(brand);
        log.info("Brand created: id={}, name={}", savedBrand.getId(), savedBrand.getName());
        return BrandResponse.from(savedBrand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandResponse getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(BrandException::notFound);
        return BrandResponse.from(brand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandListResponse getAll() {
        List<Brand> brands = brandRepository.findAll();
        List<BrandResponse> brandResponses = brands.stream()
                .map(BrandResponse::from)
                .collect(Collectors.toList());
        return BrandListResponse.builder()
                .brands(brandResponses)
                .totalCount(brandResponses.size())
                .build();
    }

    @Override
    @Transactional
    public BrandResponse update(Long id, UpdateBrandRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(BrandException::notFound);

        if (request.getName() != null && !request.getName().equals(brand.getName())) {
            if (brandRepository.existsByName(request.getName())) {
                throw BrandException.nameAlreadyExists();
            }
        }

        brand.update(request.getName(), request.getDescription(), request.getLogoUrl(), request.getStatus());
        log.info("Brand updated: id={}", id);
        return BrandResponse.from(brand);
    }
}
