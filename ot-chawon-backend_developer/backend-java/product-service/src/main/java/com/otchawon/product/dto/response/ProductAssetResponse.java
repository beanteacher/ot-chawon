package com.otchawon.product.dto.response;

import com.otchawon.product.entity.ProductAsset;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAssetResponse {

    private Long id;
    private Long productId;
    private String glbUrl;
    private String cdnUrl;
    private String thumbnailUrl;
    private String lodLevel;
    private Long fileSize;
    private Integer polygonCount;
    private String textureInfo;
    private String category;
    private String materialType;
    private String rigType;
    private boolean dracoCompressed;
    private LocalDateTime createdAt;

    public static ProductAssetResponse from(ProductAsset asset) {
        return ProductAssetResponse.builder()
                .id(asset.getId())
                .productId(asset.getProductId())
                .glbUrl(asset.getGlbUrl())
                .cdnUrl(asset.getCdnUrl())
                .thumbnailUrl(asset.getThumbnailUrl())
                .lodLevel(asset.getLodLevel())
                .fileSize(asset.getFileSize())
                .polygonCount(asset.getPolygonCount())
                .textureInfo(asset.getTextureInfo())
                .category(asset.getCategory())
                .materialType(asset.getMaterialType())
                .rigType(asset.getRigType())
                .dracoCompressed(asset.isDracoCompressed())
                .createdAt(asset.getCreatedAt())
                .build();
    }
}
