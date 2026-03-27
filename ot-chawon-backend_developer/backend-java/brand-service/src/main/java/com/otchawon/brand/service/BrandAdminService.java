package com.otchawon.brand.service;

import com.otchawon.brand.dto.request.AddBrandAdminRequest;
import com.otchawon.brand.dto.response.BrandAdminResponse;

import java.util.List;

public interface BrandAdminService {

    BrandAdminResponse addAdmin(Long brandId, AddBrandAdminRequest request);

    List<BrandAdminResponse> getAdmins(Long brandId);

    void removeAdmin(Long brandId, Long adminId);
}
