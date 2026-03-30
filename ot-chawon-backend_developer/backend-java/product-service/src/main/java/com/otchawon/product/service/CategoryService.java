package com.otchawon.product.service;
import com.otchawon.product.dto.ProductDto;


import java.util.List;

public interface CategoryService {

    List<ProductDto.CategoryResponse> getAll();

    ProductDto.CategoryResponse create(ProductDto.CreateCategoryRequest request);
}
