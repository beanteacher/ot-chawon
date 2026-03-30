package com.otchawon.product.controller;
import com.otchawon.product.dto.ProductDto;

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
    public ResponseEntity<List<ProductDto.ProductAssetResponse>> getAssetsByProductId(@PathVariable Long productId) {
        List<ProductDto.ProductAssetResponse> response = productAssetService.getAssetsByProductId(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/products/{productId}/assets/{assetId}")
    public ResponseEntity<ProductDto.ProductAssetResponse> getAssetByProductIdAndAssetId(
            @PathVariable Long productId,
            @PathVariable Long assetId) {
        ProductDto.ProductAssetResponse response = productAssetService.getAsset(assetId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<ProductDto.ProductAssetResponse> getAsset(@PathVariable Long assetId) {
        ProductDto.ProductAssetResponse response = productAssetService.getAsset(assetId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/assets")
    public ResponseEntity<ProductDto.ProductAssetResponse> createAsset(@Valid @RequestBody ProductDto.CreateProductAssetRequest request) {
        ProductDto.ProductAssetResponse response = productAssetService.createAsset(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<ProductDto.ProductAssetResponse> updateAsset(
            @PathVariable Long assetId,
            @RequestBody ProductDto.UpdateProductAssetRequest request) {
        ProductDto.ProductAssetResponse response = productAssetService.updateAsset(assetId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/v1/assets/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long assetId) {
        productAssetService.deleteAsset(assetId);
        return ResponseEntity.noContent().build();
    }
}
