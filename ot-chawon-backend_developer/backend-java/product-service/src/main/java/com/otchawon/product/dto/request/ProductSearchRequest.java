package com.otchawon.product.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {

    private String keyword;
    private Long categoryId;
    private Long brandId;
    private Integer minPrice;
    private Integer maxPrice;
    private String status;
}
