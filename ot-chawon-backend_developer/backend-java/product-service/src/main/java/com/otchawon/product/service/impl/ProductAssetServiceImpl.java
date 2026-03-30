package com.otchawon.product.service.impl;
import com.otchawon.product.dto.ProductDto;

import com.otchawon.product.entity.ProductAsset;
import com.otchawon.product.exception.ProductException;
import com.otchawon.product.repository.ProductAssetRepository;
import com.otchawon.product.service.ProductAssetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductAssetServiceImpl implements ProductAssetService {

    private final ProductAssetRepository productAssetRepository;

    @Value("${cdn.base-url:https://cdn.otchawon.com}")
    private String cdnBaseUrl;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto.ProductAssetResponse> getAssetsByProductId(Long productId) {
        return productAssetRepository.findAllByProductId(productId)
                .stream()
                .map(ProductDto.ProductAssetResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto.ProductAssetResponse getAsset(Long assetId) {
        ProductAsset asset = productAssetRepository.findById(assetId)
                .orElseThrow(() -> new ProductException("에셋을 찾을 수 없습니다.", org.springframework.http.HttpStatus.NOT_FOUND));
        return ProductDto.ProductAssetResponse.from(asset);
    }

    @Override
    @Transactional
    public ProductDto.ProductAssetResponse createAsset(ProductDto.CreateProductAssetRequest request) {
        String lodLevel = request.getLodLevel() != null ? request.getLodLevel() : "LOD0";
        String cdnUrl = buildCdnUrl(request.getProductId(), lodLevel);

        ProductAsset asset = request.toEntity(cdnUrl);
        ProductAsset saved = productAssetRepository.save(asset);

        log.info("에셋 생성 완료: assetId={}, productId={}", saved.getId(), saved.getProductId());
        return ProductDto.ProductAssetResponse.from(saved);
    }

    @Override
    @Transactional
    public ProductDto.ProductAssetResponse updateAsset(Long assetId, ProductDto.UpdateProductAssetRequest request) {
        ProductAsset asset = productAssetRepository.findById(assetId)
                .orElseThrow(() -> new ProductException("에셋을 찾을 수 없습니다.", org.springframework.http.HttpStatus.NOT_FOUND));

        String newLodLevel = request.getLodLevel() != null ? request.getLodLevel() : asset.getLodLevel();
        String cdnUrl = buildCdnUrl(asset.getProductId(), newLodLevel);

        boolean dracoCompressed = request.getDracoCompressed() != null ? request.getDracoCompressed() : asset.isDracoCompressed();

        asset.update(
                request.getGlbUrl(),
                request.getThumbnailUrl(),
                request.getRigType(),
                dracoCompressed,
                request.getLodLevel(),
                request.getFileSize(),
                request.getPolygonCount(),
                request.getTextureInfo(),
                cdnUrl,
                request.getCategory(),
                request.getMaterialType()
        );

        log.info("에셋 수정 완료: assetId={}", assetId);
        return ProductDto.ProductAssetResponse.from(asset);
    }

    @Override
    @Transactional
    public void deleteAsset(Long assetId) {
        ProductAsset asset = productAssetRepository.findById(assetId)
                .orElseThrow(() -> new ProductException("에셋을 찾을 수 없습니다.", org.springframework.http.HttpStatus.NOT_FOUND));

        productAssetRepository.delete(asset);
        log.info("에셋 삭제 완료: assetId={}", assetId);
    }

    private String buildCdnUrl(Long productId, String lodLevel) {
        return cdnBaseUrl + "/assets/clothing/" + productId + "/" + lodLevel.toLowerCase() + ".glb";
    }
}
