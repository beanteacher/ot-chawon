package com.otchawon.product.dto.request;

import com.otchawon.product.entity.ProductAsset;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductAssetRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotBlank(message = "GLB URL은 필수입니다.")
    private String glbUrl;

    private String thumbnailUrl;

    @Builder.Default
    private String lodLevel = "LOD0";

    private Long fileSize;

    private Integer polygonCount;

    private String textureInfo;

    private String category;

    private String materialType;

    private String rigType;

    @Builder.Default
    private boolean dracoCompressed = true;

    public ProductAsset toEntity(String cdnUrl) {
        return ProductAsset.builder()
                .productId(this.productId)
                .glbUrl(this.glbUrl)
                .thumbnailUrl(this.thumbnailUrl)
                .lodLevel(this.lodLevel != null ? this.lodLevel : "LOD0")
                .fileSize(this.fileSize)
                .polygonCount(this.polygonCount)
                .textureInfo(this.textureInfo)
                .cdnUrl(cdnUrl)
                .category(this.category)
                .materialType(this.materialType)
                .rigType(this.rigType)
                .dracoCompressed(this.dracoCompressed)
                .build();
    }
}
