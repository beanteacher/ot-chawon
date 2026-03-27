package com.otchawon.product.controller;

import com.otchawon.product.dto.request.CreateProductAssetRequest;
import com.otchawon.product.dto.request.UpdateProductAssetRequest;
import com.otchawon.product.dto.response.ProductAssetResponse;
import com.otchawon.product.service.ProductAssetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductAssetController {

    private final ProductAssetService productAssetService;

    @GetMapping("/api/v1/products/{productId}/assets")
    public ResponseEntity<List<ProductAssetResponse>> getAssetsByProductId(@PathVariable Long productId) {
        List<ProductAssetResponse> response = productAssetService.getAssetsByProductId(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/products/{productId}/assets/{assetId}")
    public ResponseEntity<ProductAssetResponse> getAssetByProductIdAndAssetId(
            @PathVariable Long productId,
            @PathVariable Long assetId) {
        ProductAssetResponse response = productAssetService.getAsset(assetId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<ProductAssetResponse> getAsset(@PathVariable Long assetId) {
        ProductAssetResponse response = productAssetService.getAsset(assetId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/assets")
    public ResponseEntity<ProductAssetResponse> createAsset(@Valid @RequestBody CreateProductAssetRequest request) {
        ProductAssetResponse response = productAssetService.createAsset(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<ProductAssetResponse> updateAsset(
            @PathVariable Long assetId,
            @RequestBody UpdateProductAssetRequest request) {
        ProductAssetResponse response = productAssetService.updateAsset(assetId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long assetId) {
        productAssetService.deleteAsset(assetId);
        return ResponseEntity.noContent().build();
    }
}
