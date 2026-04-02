package com.otchawon.order.service.impl;
import com.otchawon.order.dto.OrderDto;

import com.otchawon.order.entity.*;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.repository.CartItemRepository;
import com.otchawon.order.repository.CartRepository;
import com.otchawon.order.repository.OrderRepository;
import com.otchawon.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional
    public OrderDto.OrderResponse createFromCart(Long userId, OrderDto.CreateOrderRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(OrderException::cartEmpty);

        List<CartItem> selectedItems = cart.getCartItems().stream()
                .filter(item -> request.cartItemIds().contains(item.getId()))
                .collect(Collectors.toList());

        if (selectedItems.isEmpty()) {
            throw OrderException.cartEmpty();
        }

        int totalPrice = selectedItems.stream()
                .mapToInt(item -> item.getQuantity())
                .sum();

        Order order = Order.builder()
                .userId(userId)
                .totalPrice(totalPrice)
                .shippingAddress(request.shippingAddress())
                .build();

        List<OrderItem> orderItems = selectedItems.stream()
                .map(cartItem -> OrderItem.builder()
                        .order(order)
                        .productId(cartItem.getProductId())
                        .productOptionId(cartItem.getProductOptionId())
                        .productName("상품명")
                        .unitPrice(0)
                        .quantity(cartItem.getQuantity())
                        .build())
                .collect(Collectors.toList());

        order.getOrderItems().addAll(orderItems);
        Order saved = orderRepository.save(order);

        cartItemRepository.deleteAll(selectedItems);
        log.info("주문 생성 완료: userId={}, orderId={}", userId, saved.getId());

        return OrderDto.OrderResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto.OrderResponse getOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(OrderException::notFound);

        return OrderDto.OrderResponse.from(order);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto.OrderListResponse getOrders(Long userId, String status, Pageable pageable) {
        Page<Order> page;

        if (status != null && !status.isBlank()) {
            OrderStatus orderStatus;
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw OrderException.invalidStatus();
            }
            page = orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, orderStatus, pageable);
        } else {
            page = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }

        return OrderDto.OrderListResponse.from(page);
    }

    @Override
    @Transactional
    public OrderDto.OrderResponse cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .filter(o -> o.getUserId().equals(userId))
                .orElseThrow(OrderException::notFound);

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw OrderException.alreadyCancelled();
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PAYMENT_REQUESTED) {
            throw OrderException.invalidStatus();
        }

        order.cancel();
        log.info("주문 취소 완료: userId={}, orderId={}", userId, orderId);

        return OrderDto.OrderResponse.from(order);
    }
}
