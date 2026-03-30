package com.otchawon.payment.service;
import com.otchawon.payment.dto.PaymentDto;

import com.otchawon.payment.entity.Payment;
import com.otchawon.payment.entity.PaymentStatus;
import com.otchawon.payment.entity.Refund;
import com.otchawon.payment.exception.PaymentException;
import com.otchawon.payment.pg.PgChargeResult;
import com.otchawon.payment.pg.PgClient;
import com.otchawon.payment.pg.PgRefundResult;
import com.otchawon.payment.repository.PaymentRepository;
import com.otchawon.payment.repository.RefundRepository;
import com.otchawon.payment.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private RefundRepository refundRepository;

    @Mock
    private PgClient pgClient;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private PaymentDto.PaymentRequest buildRequest(Long orderId, int amount, String method) {
        try {
            PaymentDto.PaymentRequest req = new PaymentDto.PaymentRequest();
            setField(req, "orderId", orderId);
            setField(req, "amount", amount);
            setField(req, "paymentMethod", method);
            return req;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private PaymentDto.RefundRequest buildPaymentDto.RefundRequest(Integer amount, String reason) {
        try {
            PaymentDto.RefundRequest req = new PaymentDto.RefundRequest();
            setField(req, "amount", amount);
            setField(req, "reason", reason);
            return req;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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

    @Test
    @DisplayName("결제 요청 - 성공")
    void requestPayment_성공() {
        PaymentDto.PaymentRequest request = buildRequest(1L, 50000, "credit_card");

        Payment saved = Payment.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .paymentMethod("credit_card")
                .build();

        given(paymentRepository.findByOrderId(1L)).willReturn(Optional.empty());
        given(paymentRepository.save(any(Payment.class))).willReturn(saved);
        given(pgClient.charge(anyInt(), anyString()))
                .willReturn(new PgChargeResult("TX-001", true, null));

        PaymentDto.PaymentResponse response = paymentService.requestPayment(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getOrderId()).isEqualTo(1L);
        assertThat(response.getAmount()).isEqualTo(50000);
    }

    @Test
    @DisplayName("결제 요청 - 이미 결제된 주문 예외")
    void requestPayment_이미결제_실패() {
        PaymentDto.PaymentRequest request = buildRequest(1L, 50000, "credit_card");

        Payment existing = Payment.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .paymentMethod("credit_card")
                .build();
        existing.complete("TX-EXISTING");

        given(paymentRepository.findByOrderId(1L)).willReturn(Optional.of(existing));

        assertThatThrownBy(() -> paymentService.requestPayment(1L, request))
                .isInstanceOf(PaymentException.class)
                .hasMessageContaining("이미 결제된 주문입니다.");
    }

    @Test
    @DisplayName("결제 확인 - 성공")
    void confirmPayment_성공() {
        Payment payment = Payment.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .paymentMethod("credit_card")
                .build();
        // PENDING 상태

        given(paymentRepository.findById(1L)).willReturn(Optional.of(payment));

        PaymentDto.PaymentResponse response = paymentService.confirmPayment(1L, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(PaymentStatus.COMPLETED);
    }

    @Test
    @DisplayName("결제 조회 - 성공")
    void getPayment_성공() {
        Payment payment = Payment.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .paymentMethod("credit_card")
                .build();

        given(paymentRepository.findById(1L)).willReturn(Optional.of(payment));

        PaymentDto.PaymentResponse response = paymentService.getPayment(1L, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUserId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("결제 조회 - 존재하지 않는 결제 예외")
    void getPayment_없음_예외() {
        given(paymentRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> paymentService.getPayment(1L, 999L))
                .isInstanceOf(PaymentException.class)
                .hasMessageContaining("결제 정보를 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("환불 요청 - 성공")
    void refundPayment_성공() {
        Payment payment = Payment.builder()
                .id(1L)
                .orderId(1L)
                .userId(1L)
                .amount(50000)
                .paymentMethod("credit_card")
                .build();
        payment.complete("TX-001");

        Refund savedRefund = Refund.builder()
                .id(1L)
                .payment(payment)
                .amount(50000)
                .reason("단순 변심")
                .build();

        PaymentDto.RefundRequest request = buildPaymentDto.RefundRequest(null, "단순 변심");

        given(paymentRepository.findById(1L)).willReturn(Optional.of(payment));
        given(refundRepository.save(any(Refund.class))).willReturn(savedRefund);
        given(pgClient.refund(anyString(), anyInt()))
                .willReturn(new PgRefundResult("REFUND-001", true, null));

        PaymentDto.RefundResponse response = paymentService.refundPayment(1L, 1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getPaymentId()).isEqualTo(1L);
    }
}
