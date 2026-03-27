package com.otchawon.order.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AddCartItemRequest {

    @NotNull
    private Long productId;

    private Long productOptionId;

    @NotNull
    @Positive
    private Integer quantity;
}
