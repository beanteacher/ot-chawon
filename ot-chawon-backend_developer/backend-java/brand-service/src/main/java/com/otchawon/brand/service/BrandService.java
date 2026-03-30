package com.otchawon.brand.service;
import com.otchawon.brand.dto.BrandDto;


public interface BrandService {

    BrandDto.Response create(BrandDto.CreateRequest request);

    BrandDto.Response getById(Long id);

    BrandDto.ListResponse getAll();

    BrandDto.Response update(Long id, BrandDto.UpdateRequest request);
}
