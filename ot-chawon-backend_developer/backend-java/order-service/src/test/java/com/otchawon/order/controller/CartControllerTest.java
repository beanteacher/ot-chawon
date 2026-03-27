package com.otchawon.order.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.order.dto.request.AddCartItemRequest;
import com.otchawon.order.dto.request.UpdateCartItemRequest;
import com.otchawon.order.dto.response.CartItemResponse;
import com.otchawon.order.dto.response.CartResponse;
import com.otchawon.order.exception.GlobalExceptionHandler;
import com.otchawon.order.exception.OrderException;
import com.otchawon.order.service.CartService;
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
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CartController.class)
@Import(GlobalExceptionHandler.class)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CartService cartService;

    @Test
    @DisplayName("GET /api/carts - 장바구니 조회 성공 (200)")
    void getCart_성공() throws Exception {
        CartResponse response = CartResponse.builder()
                .cartId(1L)
                .items(List.of())
                .totalPrice(0)
                .build();

        given(cartService.getCart(1L)).willReturn(response);

        mockMvc.perform(get("/api/carts")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartId").value(1L))
                .andExpect(jsonPath("$.items").isArray());
    }

    @Test
    @DisplayName("POST /api/carts/items - 장바구니 아이템 추가 성공 (200)")
    void addItem_성공() throws Exception {
        CartItemResponse itemResponse = CartItemResponse.builder()
                .cartItemId(1L)
                .productId(100L)
                .productOptionId(1L)
                .quantity(2)
                .build();

        CartResponse response = CartResponse.builder()
                .cartId(1L)
                .items(List.of(itemResponse))
                .totalPrice(2)
                .build();

        given(cartService.addItem(eq(1L), any(AddCartItemRequest.class))).willReturn(response);

        String body = "{\"productId\":100,\"productOptionId\":1,\"quantity\":2}";

        mockMvc.perform(post("/api/carts/items")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartId").value(1L))
                .andExpect(jsonPath("$.items[0].productId").value(100L));
    }

    @Test
    @DisplayName("POST /api/carts/items - 필수 필드 누락 시 400")
    void addItem_유효성실패() throws Exception {
        String body = "{\"quantity\":2}";

        mockMvc.perform(post("/api/carts/items")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("PUT /api/carts/items/{cartItemId} - 수량 수정 성공 (200)")
    void updateQuantity_성공() throws Exception {
        CartResponse response = CartResponse.builder()
                .cartId(1L)
                .items(List.of())
                .totalPrice(0)
                .build();

        given(cartService.updateItemQuantity(eq(1L), eq(1L), any(UpdateCartItemRequest.class))).willReturn(response);

        String body = "{\"quantity\":5}";

        mockMvc.perform(put("/api/carts/items/1")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cartId").value(1L));
    }

    @Test
    @DisplayName("DELETE /api/carts/items/{cartItemId} - 아이템 삭제 성공 (204)")
    void removeItem_성공() throws Exception {
        mockMvc.perform(delete("/api/carts/items/1")
                        .header("X-User-Id", 1L))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/carts/items/{cartItemId} - 존재하지 않는 아이템 404")
    void removeItem_없음_예외() throws Exception {
        doThrow(OrderException.cartItemNotFound()).when(cartService).removeItem(1L, 999L);

        mockMvc.perform(delete("/api/carts/items/999")
                        .header("X-User-Id", 1L))
                .andExpect(status().isNotFound());
    }
}
