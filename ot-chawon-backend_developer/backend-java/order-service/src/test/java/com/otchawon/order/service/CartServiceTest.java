package com.otchawon.order.service;
import com.otchawon.order.dto.OrderDto;

import com.otchawon.order.entity.Cart;
import com.otchawon.order.entity.CartItem;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.repository.CartItemRepository;
import com.otchawon.order.repository.CartRepository;
import com.otchawon.order.service.impl.CartServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    @Test
    @DisplayName("장바구니 조회 - 성공 (기존 장바구니)")
    void getCart_성공() {
        Cart cart = Cart.builder()
                .id(1L)
                .userId(1L)
                .cartItems(new ArrayList<>())
                .build();

        given(cartRepository.findByUserId(1L)).willReturn(Optional.of(cart));

        OrderDto.CartResponse response = cartService.getCart(1L);

        assertThat(response.getCartId()).isEqualTo(1L);
        assertThat(response.getItems()).isEmpty();
    }

    @Test
    @DisplayName("장바구니 아이템 추가 - 성공")
    void addItem_성공() {
        Cart cart = Cart.builder()
                .id(1L)
                .userId(1L)
                .cartItems(new ArrayList<>())
                .build();

        CartItem savedItem = CartItem.builder()
                .id(1L)
                .cart(cart)
                .productId(100L)
                .productOptionId(1L)
                .quantity(2)
                .build();

        given(cartRepository.findByUserId(1L)).willReturn(Optional.of(cart));
        given(cartItemRepository.save(any(CartItem.class))).willReturn(savedItem);

        OrderDto.AddCartItemRequest request = new OrderDto.AddCartItemRequest();
        setField(request, "productId", 100L);
        setField(request, "productOptionId", 1L);
        setField(request, "quantity", 2);

        OrderDto.CartResponse response = cartService.addItem(1L, request);

        assertThat(response).isNotNull();
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    @DisplayName("장바구니 아이템 수량 수정 - 성공")
    void updateQuantity_성공() {
        Cart cart = Cart.builder()
                .id(1L)
                .userId(1L)
                .cartItems(new ArrayList<>())
                .build();

        CartItem cartItem = CartItem.builder()
                .id(1L)
                .cart(cart)
                .productId(100L)
                .productOptionId(1L)
                .quantity(2)
                .build();

        given(cartItemRepository.findById(1L)).willReturn(Optional.of(cartItem));
        given(cartRepository.findByUserId(1L)).willReturn(Optional.of(cart));

        OrderDto.UpdateCartItemRequest request = new OrderDto.UpdateCartItemRequest();
        setField(request, "quantity", 5);

        OrderDto.CartResponse response = cartService.updateItemQuantity(1L, 1L, request);

        assertThat(response).isNotNull();
        assertThat(cartItem.getQuantity()).isEqualTo(5);
    }

    @Test
    @DisplayName("장바구니 아이템 수량 수정 - 존재하지 않는 아이템 예외")
    void updateQuantity_아이템없음_예외() {
        given(cartItemRepository.findById(999L)).willReturn(Optional.empty());

        OrderDto.UpdateCartItemRequest request = new OrderDto.UpdateCartItemRequest();
        setField(request, "quantity", 5);

        assertThatThrownBy(() -> cartService.updateItemQuantity(1L, 999L, request))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("장바구니 아이템을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("장바구니 아이템 삭제 - 성공")
    void removeItem_성공() {
        Cart cart = Cart.builder().id(1L).userId(1L).cartItems(new ArrayList<>()).build();
        CartItem cartItem = CartItem.builder()
                .id(1L)
                .cart(cart)
                .productId(100L)
                .productOptionId(1L)
                .quantity(2)
                .build();

        given(cartItemRepository.findById(1L)).willReturn(Optional.of(cartItem));

        cartService.removeItem(1L, 1L);

        verify(cartItemRepository).delete(cartItem);
    }

    @Test
    @DisplayName("장바구니 전체 비우기 - 성공")
    void clearCart_성공() {
        Cart cart = Cart.builder()
                .id(1L)
                .userId(1L)
                .cartItems(new ArrayList<>())
                .build();

        given(cartRepository.findByUserId(1L)).willReturn(Optional.of(cart));

        cartService.clearCart(1L);

        assertThat(cart.getCartItems()).isEmpty();
    }

    @Test
    @DisplayName("장바구니 아이템 일괄 삭제 - 성공")
    void removeItems_성공() {
        Cart cart = Cart.builder().id(1L).userId(1L).cartItems(new ArrayList<>()).build();
        CartItem item1 = CartItem.builder().id(1L).cart(cart).productId(100L).productOptionId(1L).quantity(1).build();
        CartItem item2 = CartItem.builder().id(2L).cart(cart).productId(200L).productOptionId(2L).quantity(2).build();

        given(cartItemRepository.findAllById(List.of(1L, 2L))).willReturn(List.of(item1, item2));

        cartService.removeItems(1L, List.of(1L, 2L));

        verify(cartItemRepository).deleteAll(List.of(item1, item2));
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
