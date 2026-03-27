package com.otchawon.product.service;

import com.otchawon.product.dto.request.CreateProductRequest;
import com.otchawon.product.dto.request.ProductSearchRequest;
import com.otchawon.product.dto.request.UpdateProductRequest;
import com.otchawon.product.dto.response.ProductListResponse;
import com.otchawon.product.dto.response.ProductResponse;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponse create(CreateProductRequest request);

    ProductResponse getById(Long id);

    ProductListResponse search(ProductSearchRequest searchRequest, Pageable pageable);

    ProductResponse update(Long id, UpdateProductRequest request);

    void softDelete(Long id);
}
