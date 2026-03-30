package com.otchawon.order.service;
import com.otchawon.order.dto.OrderDto;

import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderDto.OrderResponse createFromCart(Long userId, OrderDto.CreateOrderRequest request);
    OrderDto.OrderResponse getOrder(Long userId, Long orderId);
    OrderDto.OrderListResponse getOrders(Long userId, String status, Pageable pageable);
    OrderDto.OrderResponse cancelOrder(Long userId, Long orderId);
}
