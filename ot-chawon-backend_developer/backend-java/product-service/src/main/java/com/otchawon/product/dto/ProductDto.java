package com.otchawon.product.dto;

import com.otchawon.product.entity.Category;
import com.otchawon.product.entity.Product;
import com.otchawon.product.entity.ProductAsset;
import com.otchawon.product.entity.ProductOption;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.List;

public class ProductDto {

    public record CreateCategoryRequest(
            @NotBlank(message = "카테고리명은 필수입니다.") String name,
            Long parentId,
            int depth,
            int sortOrder
    ) {}

    public record CreateProductRequest(
            @NotBlank(message = "상품명은 필수입니다.") String name,
            @NotNull(message = "가격은 필수입니다.") @Positive(message = "가격은 양수여야 합니다.") Integer price,
            @NotNull(message = "카테고리는 필수입니다.") Long categoryId,
            @NotNull(message = "브랜드는 필수입니다.") Long brandId,
            String description,
            String thumbnailUrl,
            List<ProductOptionRequest> options
    ) {}

    public record ProductOptionRequest(
            String size,
            String color,
            int stock,
            int extraPrice
    ) {}

    public record UpdateProductRequest(
            String name,
            Integer price,
            String description,
            String status,
            Long categoryId
    ) {}

    public record ProductSearchRequest(
            String keyword,
            Long categoryId,
            Long brandId,
            Integer minPrice,
            Integer maxPrice,
            String status
    ) {}

    public record CreateProductAssetRequest(
            @NotNull(message = "상품 ID는 필수입니다.") Long productId,
            @NotBlank(message = "GLB URL은 필수입니다.") String glbUrl,
            String thumbnailUrl,
            String lodLevel,
            Long fileSize,
            Integer polygonCount,
            String textureInfo,
            String category,
            String materialType,
            String rigType,
            boolean dracoCompressed
    ) {
        public ProductAsset toEntity(String cdnUrl) {
            return ProductAsset.builder()
                    .productId(productId())
                    .glbUrl(glbUrl())
                    .thumbnailUrl(thumbnailUrl())
                    .lodLevel(lodLevel() != null ? lodLevel() : "LOD0")
                    .fileSize(fileSize())
                    .polygonCount(polygonCount())
                    .textureInfo(textureInfo())
                    .cdnUrl(cdnUrl)
                    .category(category())
                    .materialType(materialType())
                    .rigType(rigType())
                    .dracoCompressed(dracoCompressed())
                    .build();
        }
    }

    public record UpdateProductAssetRequest(
            String glbUrl,
            String thumbnailUrl,
            String lodLevel,
            Long fileSize,
            Integer polygonCount,
            String textureInfo,
            String category,
            String materialType,
            String rigType,
            Boolean dracoCompressed
    ) {}

    public record CategoryResponse(
            Long id,
            Long parentId,
            String name,
            int depth,
            int sortOrder,
            LocalDateTime createdAt
    ) {
        public static CategoryResponse from(Category category) {
            return new CategoryResponse(
                    category.getId(),
                    category.getParentId(),
                    category.getName(),
                    category.getDepth(),
                    category.getSortOrder(),
                    category.getCreatedAt()
            );
        }
    }

    public record ProductOptionResponse(
            Long id,
            String size,
            String color,
            int stock,
            int extraPrice
    ) {
        public static ProductOptionResponse from(ProductOption option) {
            return new ProductOptionResponse(
                    option.getId(),
                    option.getSize(),
                    option.getColor(),
                    option.getStock(),
                    option.getExtraPrice()
            );
        }
    }

    public record ProductAssetResponse(
            Long id,
            Long productId,
            String glbUrl,
            String cdnUrl,
            String thumbnailUrl,
            String lodLevel,
            Long fileSize,
            Integer polygonCount,
            String textureInfo,
            String category,
            String materialType,
            String rigType,
            boolean dracoCompressed,
            LocalDateTime createdAt
    ) {
        public static ProductAssetResponse from(ProductAsset asset) {
            return new ProductAssetResponse(
                    asset.getId(),
                    asset.getProductId(),
                    asset.getGlbUrl(),
                    asset.getCdnUrl(),
                    asset.getThumbnailUrl(),
                    asset.getLodLevel(),
                    asset.getFileSize(),
                    asset.getPolygonCount(),
                    asset.getTextureInfo(),
                    asset.getCategory(),
                    asset.getMaterialType(),
                    asset.getRigType(),
                    asset.isDracoCompressed(),
                    asset.getCreatedAt()
            );
        }
    }

    public record ProductResponse(
            Long id,
            Long brandId,
            Long categoryId,
            String name,
            String description,
            int price,
            String status,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<ProductOptionResponse> options,
            List<ProductAssetResponse> assets
    ) {
        public static ProductResponse from(Product product) {
            return new ProductResponse(
                    product.getId(), product.getBrandId(), product.getCategoryId(),
                    product.getName(), product.getDescription(), product.getPrice(),
                    product.getStatus(), product.getCreatedAt(), product.getUpdatedAt(),
                    null, null
            );
        }

        public static ProductResponse from(Product product, List<ProductOptionResponse> options) {
            return new ProductResponse(
                    product.getId(), product.getBrandId(), product.getCategoryId(),
                    product.getName(), product.getDescription(), product.getPrice(),
                    product.getStatus(), product.getCreatedAt(), product.getUpdatedAt(),
                    options, null
            );
        }

        public static ProductResponse from(Product product, List<ProductOptionResponse> options,
                                           List<ProductAssetResponse> assets) {
            return new ProductResponse(
                    product.getId(), product.getBrandId(), product.getCategoryId(),
                    product.getName(), product.getDescription(), product.getPrice(),
                    product.getStatus(), product.getCreatedAt(), product.getUpdatedAt(),
                    options, assets
            );
        }
    }

    public record ProductListResponse(
            List<ProductResponse> products,
            int totalPages,
            long totalElements,
            int currentPage
    ) {}
}
