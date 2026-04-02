package com.otchawon.brand.service.impl;
import com.otchawon.brand.dto.BrandDto;

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
    public BrandDto.Response create(BrandDto.CreateRequest request) {
        if (brandRepository.existsByName(request.name())) {
            throw BrandException.nameAlreadyExists();
        }

        Brand brand = Brand.builder()
                .name(request.name())
                .description(request.description())
                .logoUrl(request.logoUrl())
                .build();

        Brand savedBrand = brandRepository.save(brand);
        log.info("Brand created: id={}, name={}", savedBrand.getId(), savedBrand.getName());
        return BrandDto.Response.from(savedBrand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandDto.Response getById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(BrandException::notFound);
        return BrandDto.Response.from(brand);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandDto.ListResponse getAll() {
        List<Brand> brands = brandRepository.findAll();
        List<BrandDto.Response> brandResponses = brands.stream()
                .map(BrandDto.Response::from)
                .collect(Collectors.toList());
        return new BrandDto.ListResponse(brandResponses, brandResponses.size());
    }

    @Override
    @Transactional
    public BrandDto.Response update(Long id, BrandDto.UpdateRequest request) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(BrandException::notFound);

        if (request.name() != null && !request.name().equals(brand.getName())) {
            if (brandRepository.existsByName(request.name())) {
                throw BrandException.nameAlreadyExists();
            }
        }

        brand.update(request.name(), request.description(), request.logoUrl(), request.status());
        log.info("Brand updated: id={}", id);
        return BrandDto.Response.from(brand);
    }
}
