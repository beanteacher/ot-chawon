package com.otchawon.order.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdateCartItemRequest {

    @NotNull
    @Positive
    private Integer quantity;
}
