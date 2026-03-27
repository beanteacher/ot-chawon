package com.otchawon.order.dto.response;

import com.otchawon.order.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private Long cartItemId;
    private Long productId;
    private Long productOptionId;
    private int quantity;
    private LocalDateTime createdAt;

    public static CartItemResponse from(CartItem cartItem) {
        return CartItemResponse.builder()
                .cartItemId(cartItem.getId())
                .productId(cartItem.getProductId())
                .productOptionId(cartItem.getProductOptionId())
                .quantity(cartItem.getQuantity())
                .createdAt(cartItem.getCreatedAt())
                .build();
    }
}
