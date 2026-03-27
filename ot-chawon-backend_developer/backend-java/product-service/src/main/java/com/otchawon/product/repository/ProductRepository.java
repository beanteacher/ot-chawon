package com.otchawon.product.repository;

import com.otchawon.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByDeletedAtIsNull(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.deletedAt IS NULL" +
            " AND (:keyword IS NULL OR p.name LIKE %:keyword%)" +
            " AND (:categoryId IS NULL OR p.categoryId = :categoryId)" +
            " AND (:brandId IS NULL OR p.brandId = :brandId)" +
            " AND (:minPrice IS NULL OR p.price >= :minPrice)" +
            " AND (:maxPrice IS NULL OR p.price <= :maxPrice)" +
            " AND (:status IS NULL OR p.status = :status)")
    Page<Product> search(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("status") String status,
            Pageable pageable);
}
