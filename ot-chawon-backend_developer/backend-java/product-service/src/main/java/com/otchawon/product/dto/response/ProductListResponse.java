package com.otchawon.product.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListResponse {

    private List<ProductResponse> products;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}
