package com.otchawon.product.dto.response;

import com.otchawon.product.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private Long id;
    private Long parentId;
    private String name;
    private int depth;
    private int sortOrder;
    private LocalDateTime createdAt;

    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .parentId(category.getParentId())
                .name(category.getName())
                .depth(category.getDepth())
                .sortOrder(category.getSortOrder())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
