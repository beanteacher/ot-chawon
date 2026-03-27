package com.otchawon.order.service;

import com.otchawon.order.dto.request.AddCartItemRequest;
import com.otchawon.order.dto.request.UpdateCartItemRequest;
import com.otchawon.order.dto.response.CartResponse;

import java.util.List;

public interface CartService {
    CartResponse getCart(Long userId);
    CartResponse addItem(Long userId, AddCartItemRequest request);
    CartResponse updateItemQuantity(Long userId, Long cartItemId, UpdateCartItemRequest request);
    void removeItem(Long userId, Long cartItemId);
    void removeItems(Long userId, List<Long> cartItemIds);
    void clearCart(Long userId);
}
