package com.otchawon.order.service.impl;
import com.otchawon.order.dto.OrderDto;

import com.otchawon.order.entity.Cart;
import com.otchawon.order.entity.CartItem;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.repository.CartItemRepository;
import com.otchawon.order.repository.CartRepository;
import com.otchawon.order.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    @Transactional(readOnly = true)
    public OrderDto.CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toOrderDto.CartResponse(cart);
    }

    @Override
    @Transactional
    public OrderDto.CartResponse addItem(Long userId, OrderDto.AddCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = CartItem.builder()
                .cart(cart)
                .productId(request.getProductId())
                .productOptionId(request.getProductOptionId() != null ? request.getProductOptionId() : 0L)
                .quantity(request.getQuantity())
                .build();

        cartItemRepository.save(cartItem);
        log.info("장바구니 아이템 추가: userId={}, productId={}", userId, request.getProductId());

        Cart updatedCart = cartRepository.findByUserId(userId).orElseThrow(OrderException::notFound);
        return toOrderDto.CartResponse(updatedCart);
    }

    @Override
    @Transactional
    public OrderDto.CartResponse updateItemQuantity(Long userId, Long cartItemId, OrderDto.UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(OrderException::cartItemNotFound);

        cartItem.updateQuantity(request.getQuantity());
        log.info("장바구니 아이템 수량 수정: userId={}, cartItemId={}", userId, cartItemId);

        Cart cart = cartRepository.findByUserId(userId).orElseThrow(OrderException::notFound);
        return toOrderDto.CartResponse(cart);
    }

    @Override
    @Transactional
    public void removeItem(Long userId, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(OrderException::cartItemNotFound);

        cartItemRepository.delete(cartItem);
        log.info("장바구니 아이템 삭제: userId={}, cartItemId={}", userId, cartItemId);
    }

    @Override
    @Transactional
    public void removeItems(Long userId, List<Long> cartItemIds) {
        List<CartItem> items = cartItemRepository.findAllById(cartItemIds);
        cartItemRepository.deleteAll(items);
        log.info("장바구니 아이템 일괄 삭제: userId={}, count={}", userId, items.size());
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getCartItems().clear();
            log.info("장바구니 전체 비우기: userId={}", userId);
        }
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .userId(userId)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private OrderDto.CartResponse toOrderDto.CartResponse(Cart cart) {
        List<OrderDto.CartItemResponse> items = cart.getCartItems().stream()
                .map(OrderDto.CartItemResponse::from)
                .collect(Collectors.toList());

        int totalPrice = cart.getCartItems().stream()
                .mapToInt(item -> item.getQuantity())
                .sum();

        return OrderDto.CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalPrice(totalPrice)
                .build();
    }
}
