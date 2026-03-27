package com.otchawon.order.dto.response;

import com.otchawon.order.entity.Order;
import com.otchawon.order.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;
    private Long userId;
    private OrderStatus status;
    private int totalPrice;
    private String shippingAddress;
    private String trackingNumber;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus())
                .totalPrice(order.getTotalPrice())
                .shippingAddress(order.getShippingAddress())
                .trackingNumber(order.getTrackingNumber())
                .items(order.getOrderItems().stream()
                        .map(OrderItemResponse::from)
                        .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
