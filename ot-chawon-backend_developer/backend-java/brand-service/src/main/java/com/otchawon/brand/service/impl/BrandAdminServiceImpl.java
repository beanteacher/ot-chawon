package com.otchawon.brand.service.impl;

import com.otchawon.brand.dto.request.AddBrandAdminRequest;
import com.otchawon.brand.dto.response.BrandAdminResponse;
import com.otchawon.brand.entity.BrandAdmin;
import com.otchawon.brand.exception.BrandException;
import com.otchawon.brand.repository.BrandAdminRepository;
import com.otchawon.brand.repository.BrandRepository;
import com.otchawon.brand.service.BrandAdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BrandAdminServiceImpl implements BrandAdminService {

    private final BrandAdminRepository brandAdminRepository;
    private final BrandRepository brandRepository;

    @Override
    @Transactional
    public BrandAdminResponse addAdmin(Long brandId, AddBrandAdminRequest request) {
        if (!brandRepository.existsById(brandId)) {
            throw BrandException.notFound();
        }

        if (brandAdminRepository.existsByBrandIdAndUserId(brandId, request.getUserId())) {
            throw BrandException.adminAlreadyExists();
        }

        BrandAdmin brandAdmin = BrandAdmin.builder()
                .brandId(brandId)
                .userId(request.getUserId())
                .role(request.getRole())
                .build();

        BrandAdmin savedAdmin = brandAdminRepository.save(brandAdmin);
        log.info("BrandAdmin added: brandId={}, userId={}", brandId, request.getUserId());
        return BrandAdminResponse.from(savedAdmin);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BrandAdminResponse> getAdmins(Long brandId) {
        if (!brandRepository.existsById(brandId)) {
            throw BrandException.notFound();
        }

        return brandAdminRepository.findByBrandId(brandId).stream()
                .map(BrandAdminResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeAdmin(Long brandId, Long adminId) {
        BrandAdmin brandAdmin = brandAdminRepository.findById(adminId)
                .orElseThrow(() -> new BrandException("어드민을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

        if (!brandAdmin.getBrandId().equals(brandId)) {
            throw new BrandException("해당 브랜드의 어드민이 아닙니다.", HttpStatus.BAD_REQUEST);
        }

        brandAdminRepository.delete(brandAdmin);
        log.info("BrandAdmin removed: brandId={}, adminId={}", brandId, adminId);
    }
}
