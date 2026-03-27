package com.otchawon.brand.service;

import com.otchawon.brand.dto.request.CreateBrandRequest;
import com.otchawon.brand.dto.request.UpdateBrandRequest;
import com.otchawon.brand.dto.response.BrandListResponse;
import com.otchawon.brand.dto.response.BrandResponse;

public interface BrandService {

    BrandResponse create(CreateBrandRequest request);

    BrandResponse getById(Long id);

    BrandListResponse getAll();

    BrandResponse update(Long id, UpdateBrandRequest request);
}
