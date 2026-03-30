package com.otchawon.product.service;
import com.otchawon.product.dto.ProductDto;


import java.util.List;

public interface ProductAssetService {

    List<ProductDto.ProductAssetResponse> getAssetsByProductId(Long productId);

    ProductDto.ProductAssetResponse getAsset(Long assetId);

    ProductDto.ProductAssetResponse createAsset(ProductDto.CreateProductAssetRequest request);

    ProductDto.ProductAssetResponse updateAsset(Long assetId, ProductDto.UpdateProductAssetRequest request);

    void deleteAsset(Long assetId);
}
