package com.otchawon.order.controller;
import com.otchawon.order.dto.OrderDto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.order.entity.OrderStatus;
import com.otchawon.order.exception.GlobalExceptionHandler;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.service.OrderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(OrderController.class)
@Import(GlobalExceptionHandler.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OrderService orderService;

    @Test
    @DisplayName("POST /api/orders - 주문 생성 성공 (201)")
    void createOrder_성공() throws Exception {
        OrderDto.OrderResponse response = OrderDto.OrderResponse.builder()
                .orderId(1L)
                .userId(1L)
                .status(OrderStatus.PENDING)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .items(List.of())
                .build();

        given(orderService.createFromCart(eq(1L), any(OrderDto.CreateOrderRequest.class))).willReturn(response);

        String body = "{\"cartItemIds\":[1,2],\"shippingAddress\":\"서울시 강남구\"}";

        mockMvc.perform(post("/api/orders")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").value(1L))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("POST /api/orders - 장바구니 비어있음 400")
    void createOrder_장바구니없음_400() throws Exception {
        given(orderService.createFromCart(eq(1L), any(OrderDto.CreateOrderRequest.class)))
                .willThrow(OrderException.cartEmpty());

        String body = "{\"cartItemIds\":[1],\"shippingAddress\":\"서울시 강남구\"}";

        mockMvc.perform(post("/api/orders")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/orders - 주문 목록 조회 성공 (200)")
    void getOrders_성공() throws Exception {
        OrderDto.OrderListResponse response = OrderDto.OrderListResponse.builder()
                .orders(List.of())
                .totalElements(0)
                .totalPages(0)
                .currentPage(0)
                .build();

        given(orderService.getOrders(eq(1L), any(), any())).willReturn(response);

        mockMvc.perform(get("/api/orders")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    @DisplayName("GET /api/orders/{orderId} - 주문 단건 조회 성공 (200)")
    void getOrder_성공() throws Exception {
        OrderDto.OrderResponse response = OrderDto.OrderResponse.builder()
                .orderId(1L)
                .userId(1L)
                .status(OrderStatus.PENDING)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .items(List.of())
                .build();

        given(orderService.getOrder(1L, 1L)).willReturn(response);

        mockMvc.perform(get("/api/orders/1")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1L));
    }

    @Test
    @DisplayName("GET /api/orders/{orderId} - 존재하지 않는 주문 404")
    void getOrder_없음_404() throws Exception {
        given(orderService.getOrder(1L, 999L)).willThrow(OrderException.notFound());

        mockMvc.perform(get("/api/orders/999")
                        .header("X-User-Id", 1L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PUT /api/orders/{orderId}/cancel - 주문 취소 성공 (200)")
    void cancelOrder_성공() throws Exception {
        OrderDto.OrderResponse response = OrderDto.OrderResponse.builder()
                .orderId(1L)
                .userId(1L)
                .status(OrderStatus.CANCELLED)
                .totalPrice(10000)
                .shippingAddress("서울시 강남구")
                .items(List.of())
                .build();

        given(orderService.cancelOrder(1L, 1L)).willReturn(response);

        mockMvc.perform(put("/api/orders/1/cancel")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @DisplayName("PUT /api/orders/{orderId}/cancel - 이미 취소된 주문 409")
    void cancelOrder_이미취소_409() throws Exception {
        given(orderService.cancelOrder(1L, 1L)).willThrow(OrderException.alreadyCancelled());

        mockMvc.perform(put("/api/orders/1/cancel")
                        .header("X-User-Id", 1L))
                .andExpect(status().isConflict());
    }
}
