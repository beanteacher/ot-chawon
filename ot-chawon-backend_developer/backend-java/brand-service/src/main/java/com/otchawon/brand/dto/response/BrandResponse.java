package com.otchawon.brand.dto.response;

import com.otchawon.brand.entity.Brand;
import com.otchawon.brand.entity.BrandStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponse {

    private Long id;
    private String name;
    private String description;
    private String logoUrl;
    private BrandStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BrandResponse from(Brand brand) {
        return BrandResponse.builder()
                .id(brand.getId())
                .name(brand.getName())
                .description(brand.getDescription())
                .logoUrl(brand.getLogoUrl())
                .status(brand.getStatus())
                .createdAt(brand.getCreatedAt())
                .updatedAt(brand.getUpdatedAt())
                .build();
    }
}
