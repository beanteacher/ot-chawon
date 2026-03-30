package com.otchawon.order.controller;
import com.otchawon.order.dto.OrderDto;

import com.otchawon.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto.OrderResponse> createOrder(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid OrderDto.CreateOrderRequest request) {
        OrderDto.OrderResponse response = orderService.createFromCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<OrderDto.OrderListResponse> getOrders(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        OrderDto.OrderListResponse response = orderService.getOrders(userId, status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto.OrderResponse> getOrder(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) {
        OrderDto.OrderResponse response = orderService.getOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto.OrderResponse> cancelOrder(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long orderId) {
        OrderDto.OrderResponse response = orderService.cancelOrder(userId, orderId);
        return ResponseEntity.ok(response);
    }
}
