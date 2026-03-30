package com.otchawon.brand.service;
import com.otchawon.brand.dto.BrandDto;


import java.util.List;

public interface BrandAdminService {

    BrandDto.AdminResponse addAdmin(Long brandId, BrandDto.AddAdminRequest request);

    List<BrandDto.AdminResponse> getAdmins(Long brandId);

    void removeAdmin(Long brandId, Long adminId);
}
