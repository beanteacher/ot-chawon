package com.otchawon.product.dto.response;

import com.otchawon.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private Long brandId;
    private Long categoryId;
    private String name;
    private String description;
    private int price;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProductOptionResponse> options;
    private List<ProductAssetResponse> assets;

    public static ProductResponse from(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static ProductResponse from(Product product, List<ProductOptionResponse> options) {
        return ProductResponse.builder()
                .id(product.getId())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .options(options)
                .build();
    }

    public static ProductResponse from(Product product, List<ProductOptionResponse> options, List<ProductAssetResponse> assets) {
        return ProductResponse.builder()
                .id(product.getId())
                .brandId(product.getBrandId())
                .categoryId(product.getCategoryId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .options(options)
                .assets(assets)
                .build();
    }
}
