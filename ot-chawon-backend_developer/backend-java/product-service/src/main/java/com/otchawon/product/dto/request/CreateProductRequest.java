package com.otchawon.product.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotBlank(message = "상품명은 필수입니다.")
    private String name;

    @NotNull(message = "가격은 필수입니다.")
    @Positive(message = "가격은 양수여야 합니다.")
    private Integer price;

    @NotNull(message = "카테고리는 필수입니다.")
    private Long categoryId;

    @NotNull(message = "브랜드는 필수입니다.")
    private Long brandId;

    private String description;

    private String thumbnailUrl;

    private List<ProductOptionRequest> options;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductOptionRequest {
        private String size;
        private String color;
        private int stock;
        private int extraPrice;
    }
}
