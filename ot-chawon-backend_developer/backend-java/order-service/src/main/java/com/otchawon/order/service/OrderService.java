package com.otchawon.order.service;

import com.otchawon.order.dto.request.CreateOrderRequest;
import com.otchawon.order.dto.response.OrderListResponse;
import com.otchawon.order.dto.response.OrderResponse;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createFromCart(Long userId, CreateOrderRequest request);
    OrderResponse getOrder(Long userId, Long orderId);
    OrderListResponse getOrders(Long userId, String status, Pageable pageable);
    OrderResponse cancelOrder(Long userId, Long orderId);
}
