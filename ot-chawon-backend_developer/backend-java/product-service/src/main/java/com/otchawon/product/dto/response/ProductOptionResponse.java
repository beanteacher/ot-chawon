package com.otchawon.product.dto.response;

import com.otchawon.product.entity.ProductOption;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductOptionResponse {

    private Long id;
    private String size;
    private String color;
    private int stock;
    private int extraPrice;

    public static ProductOptionResponse from(ProductOption option) {
        return ProductOptionResponse.builder()
                .id(option.getId())
                .size(option.getSize())
                .color(option.getColor())
                .stock(option.getStock())
                .extraPrice(option.getExtraPrice())
                .build();
    }
}
