package com.otchawon.product.repository;

import com.otchawon.product.entity.ProductAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductAssetRepository extends JpaRepository<ProductAsset, Long> {

    Optional<ProductAsset> findByProductId(Long productId);
}
