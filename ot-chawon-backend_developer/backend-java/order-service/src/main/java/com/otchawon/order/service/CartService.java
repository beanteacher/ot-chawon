package com.otchawon.order.service;
import com.otchawon.order.dto.OrderDto;


import java.util.List;

public interface CartService {
    OrderDto.CartResponse getCart(Long userId);
    OrderDto.CartResponse addItem(Long userId, OrderDto.AddCartItemRequest request);
    OrderDto.CartResponse updateItemQuantity(Long userId, Long cartItemId, OrderDto.UpdateCartItemRequest request);
    void removeItem(Long userId, Long cartItemId);
    void removeItems(Long userId, List<Long> cartItemIds);
    void clearCart(Long userId);
}
