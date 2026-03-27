package com.otchawon.product.repository;

import com.otchawon.product.entity.ProductAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductAssetRepository extends JpaRepository<ProductAsset, Long> {

    List<ProductAsset> findAllByProductId(Long productId);

    Optional<ProductAsset> findByProductId(Long productId);

    Optional<ProductAsset> findByProductIdAndLodLevel(Long productId, String lodLevel);
}
