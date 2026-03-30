package com.otchawon.order.dto;

import com.otchawon.order.entity.CartItem;
import com.otchawon.order.entity.Order;
import com.otchawon.order.entity.OrderItem;
import com.otchawon.order.entity.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {

    public record AddCartItemRequest(
            @NotNull Long productId,
            Long productOptionId,
            @NotNull @Positive Integer quantity
    ) {}

    public record UpdateCartItemRequest(
            @NotNull @Positive Integer quantity
    ) {}

    public record CreateOrderRequest(
            @NotNull List<Long> cartItemIds,
            @NotBlank String shippingAddress
    ) {}

    public record CartItemResponse(
            Long cartItemId,
            Long productId,
            Long productOptionId,
            int quantity,
            LocalDateTime createdAt
    ) {
        public static CartItemResponse from(CartItem cartItem) {
            return new CartItemResponse(
                    cartItem.getId(),
                    cartItem.getProductId(),
                    cartItem.getProductOptionId(),
                    cartItem.getQuantity(),
                    cartItem.getCreatedAt()
            );
        }
    }

    public record CartResponse(
            Long cartId,
            List<CartItemResponse> items,
            int totalPrice
    ) {}

    public record OrderItemResponse(
            Long orderItemId,
            Long productId,
            Long productOptionId,
            String productName,
            int unitPrice,
            int quantity
    ) {
        public static OrderItemResponse from(OrderItem orderItem) {
            return new OrderItemResponse(
                    orderItem.getId(),
                    orderItem.getProductId(),
                    orderItem.getProductOptionId(),
                    orderItem.getProductName(),
                    orderItem.getUnitPrice(),
                    orderItem.getQuantity()
            );
        }
    }

    public record OrderResponse(
            Long orderId,
            Long userId,
            OrderStatus status,
            int totalPrice,
            String shippingAddress,
            String trackingNumber,
            List<OrderItemResponse> items,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static OrderResponse from(Order order) {
            return new OrderResponse(
                    order.getId(),
                    order.getUserId(),
                    order.getStatus(),
                    order.getTotalPrice(),
                    order.getShippingAddress(),
                    order.getTrackingNumber(),
                    order.getOrderItems().stream()
                            .map(OrderItemResponse::from)
                            .collect(Collectors.toList()),
                    order.getCreatedAt(),
                    order.getUpdatedAt()
            );
        }
    }

    public record OrderListResponse(
            List<OrderResponse> orders,
            int totalPages,
            long totalElements,
            int currentPage
    ) {
        public static OrderListResponse from(Page<Order> page) {
            return new OrderListResponse(
                    page.getContent().stream()
                            .map(OrderResponse::from)
                            .collect(Collectors.toList()),
                    page.getTotalPages(),
                    page.getTotalElements(),
                    page.getNumber()
            );
        }
    }
}
