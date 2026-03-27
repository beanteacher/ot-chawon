package com.otchawon.product.service;

import com.otchawon.product.dto.request.CreateProductAssetRequest;
import com.otchawon.product.dto.request.UpdateProductAssetRequest;
import com.otchawon.product.dto.response.ProductAssetResponse;

import java.util.List;

public interface ProductAssetService {

    List<ProductAssetResponse> getAssetsByProductId(Long productId);

    ProductAssetResponse getAsset(Long assetId);

    ProductAssetResponse createAsset(CreateProductAssetRequest request);

    ProductAssetResponse updateAsset(Long assetId, UpdateProductAssetRequest request);

    void deleteAsset(Long assetId);
}
