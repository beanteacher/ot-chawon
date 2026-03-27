package com.otchawon.order.controller;

import com.otchawon.order.dto.request.AddCartItemRequest;
import com.otchawon.order.dto.request.UpdateCartItemRequest;
import com.otchawon.order.dto.response.CartResponse;
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
    public ResponseEntity<CartResponse> getCart(@RequestHeader("X-User-Id") Long userId) {
        CartResponse response = cartService.getCart(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody @Valid AddCartItemRequest request) {
        CartResponse response = cartService.addItem(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateQuantity(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long cartItemId,
            @RequestBody @Valid UpdateCartItemRequest request) {
        CartResponse response = cartService.updateItemQuantity(userId, cartItemId, request);
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
