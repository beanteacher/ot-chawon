package com.otchawon.order.service;

import com.otchawon.order.dto.request.CreateOrderRequest;
import com.otchawon.order.dto.response.OrderListResponse;
import com.otchawon.order.dto.response.OrderResponse;
import com.otchawon.order.entity.*;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.repository.CartItemRepository;
import com.otchawon.order.repository.CartRepository;
import com.otchawon.order.repository.OrderRepository;
import com.otchawon.order.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    @DisplayName("장바구니에서 주문 생성 - 성공")
    void createFromCart_성공() {
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
        cart.getCartItems().add(cartItem);

        Order savedOrder = Order.builder()
                .id(1L)
                .userId(1L)
                .totalPrice(2)
                .shippingAddress("서울시 강남구")
                .orderItems(new ArrayList<>())
                .build();

        given(cartRepository.findByUserId(1L)).willReturn(Optional.of(cart));
        given(orderRepository.save(any(Order.class))).willReturn(savedOrder);

        CreateOrderRequest request = new CreateOrderRequest();
        setField(request, "cartItemIds", List.of(1L));
        setField(request, "shippingAddress", "서울시 강남구");

        OrderResponse response = orderService.createFromCart(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("장바구니에서 주문 생성 - 장바구니 없음 예외")
    void createFromCart_장바구니없음_예외() {
        given(cartRepository.findByUserId(1L)).willReturn(Optional.empty());

        CreateOrderRequest request = new CreateOrderRequest();
        setField(request, "cartItemIds", List.of(1L));
        setField(request, "shippingAddress", "서울시 강남구");

        assertThatThrownBy(() -> orderService.createFromCart(1L, request))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("장바구니가 비어있습니다.");
    }

    @Test
    @DisplayName("주문 단건 조회 - 성공")
    void getOrder_성공() {
        Order order = Order.builder()
                .id(1L)
                .userId(1L)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .orderItems(new ArrayList<>())
                .build();

        given(orderRepository.findById(1L)).willReturn(Optional.of(order));

        OrderResponse response = orderService.getOrder(1L, 1L);

        assertThat(response.getOrderId()).isEqualTo(1L);
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("주문 단건 조회 - 존재하지 않는 주문 예외")
    void getOrder_없음_예외() {
        given(orderRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrder(1L, 999L))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("주문을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("주문 목록 조회 - 성공")
    void getOrders_성공() {
        Order order = Order.builder()
                .id(1L)
                .userId(1L)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .orderItems(new ArrayList<>())
                .build();

        Pageable pageable = PageRequest.of(0, 20);
        Page<Order> page = new PageImpl<>(List.of(order), pageable, 1);

        given(orderRepository.findByUserIdOrderByCreatedAtDesc(1L, pageable)).willReturn(page);

        OrderListResponse response = orderService.getOrders(1L, null, pageable);

        assertThat(response.getOrders()).hasSize(1);
        assertThat(response.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("주문 취소 - 성공")
    void cancelOrder_성공() {
        Order order = Order.builder()
                .id(1L)
                .userId(1L)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .orderItems(new ArrayList<>())
                .build();

        given(orderRepository.findById(1L)).willReturn(Optional.of(order));

        OrderResponse response = orderService.cancelOrder(1L, 1L);

        assertThat(response.getStatus()).isEqualTo(OrderStatus.CANCELLED);
    }

    @Test
    @DisplayName("주문 취소 - 이미 취소된 주문 예외")
    void cancelOrder_이미취소_실패() {
        Order order = Order.builder()
                .id(1L)
                .userId(1L)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .orderItems(new ArrayList<>())
                .build();
        order.cancel(); // CANCELLED 상태로 변경

        given(orderRepository.findById(1L)).willReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.cancelOrder(1L, 1L))
                .isInstanceOf(OrderException.class)
                .hasMessageContaining("이미 취소된 주문입니다.");
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
