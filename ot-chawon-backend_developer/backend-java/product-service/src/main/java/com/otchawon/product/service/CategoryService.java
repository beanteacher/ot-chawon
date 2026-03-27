package com.otchawon.product.service;

import com.otchawon.product.dto.request.CreateCategoryRequest;
import com.otchawon.product.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getAll();

    CategoryResponse create(CreateCategoryRequest request);
}
