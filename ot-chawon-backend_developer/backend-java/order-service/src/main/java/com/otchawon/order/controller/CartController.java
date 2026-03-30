package com.otchawon.order.controller;
import com.otchawon.order.dto.OrderDto;

import com.otchawon.order.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<OrderDto.CartResponse> getCart(@RequestHeader("X-User-Id") Long userId) {
        OrderDto.CartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<OrderDto.CartResponse> addItem(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid OrderDto.AddCartItemRequest request) {
        OrderDto.CartResponse response = cartService.addItem(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<OrderDto.CartResponse> updateQuantity(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long cartItemId,
            @RequestBody @Valid OrderDto.UpdateCartItemRequest request) {
        OrderDto.CartResponse response = cartService.updateItemQuantity(userId, cartItemId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long cartItemId) {
        cartService.removeItem(userId, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/items")
    public ResponseEntity<Void> removeItems(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody List<Long> cartItemIds) {
        cartService.removeItems(userId, cartItemIds);
        return ResponseEntity.noContent().build();
    }
}
