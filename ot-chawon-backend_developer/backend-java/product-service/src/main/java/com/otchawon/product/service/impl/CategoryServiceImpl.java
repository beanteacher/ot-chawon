package com.otchawon.product.service.impl;

import com.otchawon.product.dto.request.CreateCategoryRequest;
import com.otchawon.product.dto.response.CategoryResponse;
import com.otchawon.product.entity.Category;
import com.otchawon.product.repository.CategoryRepository;
import com.otchawon.product.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .parentId(request.getParentId())
                .depth(request.getDepth())
                .sortOrder(request.getSortOrder())
                .build();

        Category saved = categoryRepository.save(category);
        log.info("카테고리 등록 완료: categoryId={}", saved.getId());
        return CategoryResponse.from(saved);
    }
}
