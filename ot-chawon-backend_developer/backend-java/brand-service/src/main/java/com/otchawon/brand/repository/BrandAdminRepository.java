package com.otchawon.brand.repository;

import com.otchawon.brand.entity.BrandAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BrandAdminRepository extends JpaRepository<BrandAdmin, Long> {

    List<BrandAdmin> findByBrandId(Long brandId);

    List<BrandAdmin> findByUserId(Long userId);

    boolean existsByBrandIdAndUserId(Long brandId, Long userId);
}
