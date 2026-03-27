package com.otchawon.brand.dto.response;

import com.otchawon.brand.entity.BrandAdmin;
import com.otchawon.brand.entity.BrandRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandAdminResponse {

    private Long id;
    private Long brandId;
    private Long userId;
    private BrandRole role;
    private LocalDateTime createdAt;

    public static BrandAdminResponse from(BrandAdmin brandAdmin) {
        return BrandAdminResponse.builder()
                .id(brandAdmin.getId())
                .brandId(brandAdmin.getBrandId())
                .userId(brandAdmin.getUserId())
                .role(brandAdmin.getRole())
                .createdAt(brandAdmin.getCreatedAt())
                .build();
    }
}
