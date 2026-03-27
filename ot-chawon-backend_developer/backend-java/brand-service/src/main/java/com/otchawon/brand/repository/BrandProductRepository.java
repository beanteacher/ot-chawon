package com.otchawon.brand.repository;

import com.otchawon.brand.entity.BrandProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BrandProductRepository extends JpaRepository<BrandProduct, Long> {

    List<BrandProduct> findByBrandId(Long brandId);

    List<BrandProduct> findByProductId(Long productId);
}
