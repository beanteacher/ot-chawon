package com.otchawon.product.service;
import com.otchawon.product.dto.ProductDto;

import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductDto.ProductResponse create(ProductDto.CreateProductRequest request);

    ProductDto.ProductResponse getById(Long id);

    ProductDto.ProductListResponse search(ProductDto.ProductSearchRequest searchRequest, Pageable pageable);

    ProductDto.ProductResponse update(Long id, ProductDto.UpdateProductRequest request);

    void softDelete(Long id);
}
