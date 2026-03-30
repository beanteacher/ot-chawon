package com.otchawon.brand.dto;

import com.otchawon.brand.entity.Brand;
import com.otchawon.brand.entity.BrandAdmin;
import com.otchawon.brand.entity.BrandRole;
import com.otchawon.brand.entity.BrandStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class BrandDto {

    public record CreateRequest(
            @NotBlank(message = "브랜드명은 필수입니다.") String name,
            String description,
            String logoUrl
    ) {}

    public record UpdateRequest(
            String name,
            String description,
            String logoUrl,
            BrandStatus status
    ) {}

    public record AddAdminRequest(
            @NotNull(message = "userId는 필수입니다.") Long userId,
            BrandRole role
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            String logoUrl,
            BrandStatus status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static Response from(Brand brand) {
            return new Response(
                    brand.getId(),
                    brand.getName(),
                    brand.getDescription(),
                    brand.getLogoUrl(),
                    brand.getStatus(),
                    brand.getCreatedAt(),
                    brand.getUpdatedAt()
            );
        }
    }

    public record AdminResponse(
            Long id,
            Long brandId,
            Long userId,
            BrandRole role,
            LocalDateTime createdAt
    ) {
        public static AdminResponse from(BrandAdmin brandAdmin) {
            return new AdminResponse(
                    brandAdmin.getId(),
                    brandAdmin.getBrandId(),
                    brandAdmin.getUserId(),
                    brandAdmin.getRole(),
                    brandAdmin.getCreatedAt()
            );
        }
    }

    public record ListResponse(
            List<Response> brands,
            long totalCount
    ) {}
}
