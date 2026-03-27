package com.otchawon.product.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductAssetRequest {

    private String glbUrl;
    private String thumbnailUrl;
    private String lodLevel;
    private Long fileSize;
    private Integer polygonCount;
    private String textureInfo;
    private String category;
    private String materialType;
    private String rigType;
    private Boolean dracoCompressed;
}
