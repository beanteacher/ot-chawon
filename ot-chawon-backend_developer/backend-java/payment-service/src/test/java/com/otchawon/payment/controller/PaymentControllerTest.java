package com.otchawon.payment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.payment.dto.response.PaymentResponse;
import com.otchawon.payment.dto.response.RefundResponse;
import com.otchawon.payment.entity.PaymentStatus;
import com.otchawon.payment.exception.GlobalExceptionHandler;
import com.otchawon.payment.exception.PaymentException;
import com.otchawon.payment.service.PaymentService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PaymentController.class)
@Import(GlobalExceptionHandler.class)
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    @DisplayName("POST /api/payments - 결제 요청 성공 (201)")
    void requestPayment_성공() throws Exception {
        PaymentResponse response = PaymentResponse.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .status(PaymentStatus.COMPLETED)
                .paymentMethod("credit_card")
                .build();

        given(paymentService.requestPayment(eq(1L), any())).willReturn(response);

        String body = "{\"orderId\":1,\"amount\":50000,\"paymentMethod\":\"credit_card\"}";

        mockMvc.perform(post("/api/payments")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    @DisplayName("POST /api/payments - 이미 결제된 주문 409")
    void requestPayment_이미결제_409() throws Exception {
        given(paymentService.requestPayment(eq(1L), any()))
                .willThrow(PaymentException.alreadyPaid());

        String body = "{\"orderId\":1,\"amount\":50000,\"paymentMethod\":\"credit_card\"}";

        mockMvc.perform(post("/api/payments")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("POST /api/payments/{paymentId}/confirm - 결제 확인 성공 (200)")
    void confirmPayment_성공() throws Exception {
        PaymentResponse response = PaymentResponse.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .status(PaymentStatus.COMPLETED)
                .paymentMethod("credit_card")
                .build();

        given(paymentService.confirmPayment(1L, 1L)).willReturn(response);

        mockMvc.perform(post("/api/payments/1/confirm")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    @DisplayName("GET /api/payments/{paymentId} - 결제 조회 성공 (200)")
    void getPayment_성공() throws Exception {
        PaymentResponse response = PaymentResponse.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .status(PaymentStatus.COMPLETED)
                .paymentMethod("credit_card")
                .build();

        given(paymentService.getPayment(1L, 1L)).willReturn(response);

        mockMvc.perform(get("/api/payments/1")
                        .header("X-User-Id", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(50000));
    }

    @Test
    @DisplayName("GET /api/payments/{paymentId} - 존재하지 않는 결제 404")
    void getPayment_없음_404() throws Exception {
        given(paymentService.getPayment(1L, 999L))
                .willThrow(PaymentException.notFound());

        mockMvc.perform(get("/api/payments/999")
                        .header("X-User-Id", 1L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/payments/{paymentId}/refund - 환불 요청 성공 (200)")
    void refundPayment_성공() throws Exception {
        RefundResponse response = RefundResponse.builder()
                .id(1L)
                .paymentId(1L)
                .amount(50000)
                .reason("단순 변심")
                .build();

        given(paymentService.refundPayment(eq(1L), eq(1L), any())).willReturn(response);

        String body = "{\"reason\":\"단순 변심\"}";

        mockMvc.perform(post("/api/payments/1/refund")
                        .header("X-User-Id", 1L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentId").value(1L));
    }
}
