package com.otchawon.fitting.service;
import com.otchawon.fitting.dto.FittingDto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.otchawon.fitting.entity.FittingRequest;
import com.otchawon.fitting.entity.FittingStatus;
import com.otchawon.fitting.exception.FittingException;
import com.otchawon.fitting.producer.FittingEventProducer;
import com.otchawon.fitting.repository.FittingRequestRepository;
import com.otchawon.fitting.service.impl.FittingServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FittingServiceImplTest {

    @Mock
    private FittingRequestRepository fittingRequestRepository;

    @Mock
    private FittingEventProducer fittingEventProducer;

    @Spy
    private ObjectMapper objectMapper;

    @InjectMocks
    private FittingServiceImpl fittingService;

    @Test
    @DisplayName("피팅 요청 생성 - 성공 및 Kafka 이벤트 발행")
    void createFitting_성공() {
        FittingRequest saved = FittingRequest.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.QUEUED)
                .bodyMeasurement("{\"height\":175}")
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingRequestRepository.save(any(FittingRequest.class))).willReturn(saved);

        FittingDto.CreateRequest request = FittingDto.CreateRequest.builder()
                .userId("user-1")
                .itemId("item-1")
                .bodyMeasurement(Map.of("height", 175))
                .build();

        FittingDto.Response response = fittingService.createFitting(request);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo(FittingStatus.QUEUED);
        verify(fittingEventProducer).sendFittingRequested(any());
    }

    @Test
    @DisplayName("피팅 단건 조회 - 성공")
    void getFitting_성공() {
        FittingRequest fitting = FittingRequest.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.PROCESSING)
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingRequestRepository.findByIdAndUserId(1L, "user-1")).willReturn(Optional.of(fitting));

        FittingDto.Response response = fittingService.getFitting(1L, "user-1");

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getStatus()).isEqualTo(FittingStatus.PROCESSING);
    }

    @Test
    @DisplayName("피팅 단건 조회 - 없는 경우 예외")
    void getFitting_없음_예외() {
        given(fittingRequestRepository.findByIdAndUserId(999L, "user-1")).willReturn(Optional.empty());

        assertThatThrownBy(() -> fittingService.getFitting(999L, "user-1"))
                .isInstanceOf(FittingException.class)
                .hasMessageContaining("피팅 요청을 찾을 수 없습니다.");
    }

    @Test
    @DisplayName("사용자 피팅 목록 조회 - 성공")
    void getFittingsByUser_성공() {
        List<FittingRequest> fittings = List.of(
                FittingRequest.builder().id(1L).userId("user-1").itemId("item-1")
                        .status(FittingStatus.COMPLETED).createdAt(LocalDateTime.now()).build(),
                FittingRequest.builder().id(2L).userId("user-1").itemId("item-2")
                        .status(FittingStatus.QUEUED).createdAt(LocalDateTime.now()).build()
        );

        given(fittingRequestRepository.findAllByUserIdOrderByCreatedAtDesc("user-1")).willReturn(fittings);

        List<FittingDto.Response> responses = fittingService.getFittingsByUser("user-1");

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getId()).isEqualTo(1L);
    }

    @Test
    @DisplayName("피팅 결과 조회 - 결과 미준비 예외 (QUEUED 상태)")
    void getResult_미준비_예외() {
        FittingRequest fitting = FittingRequest.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.QUEUED)
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingRequestRepository.findByIdAndUserId(1L, "user-1")).willReturn(Optional.of(fitting));

        assertThatThrownBy(() -> fittingService.getResult(1L, "user-1"))
                .isInstanceOf(FittingException.class)
                .hasMessageContaining("피팅 결과가 아직 준비되지 않았습니다.");
    }

    @Test
    @DisplayName("피팅 결과 업데이트 - COMPLETED 상태로 업데이트")
    void updateResult_completed_성공() {
        FittingRequest fitting = FittingRequest.builder()
                .id(1L)
                .userId("user-1")
                .itemId("item-1")
                .status(FittingStatus.PROCESSING)
                .createdAt(LocalDateTime.now())
                .build();

        given(fittingRequestRepository.findById(1L)).willReturn(Optional.of(fitting));

        fittingService.updateResult(1L, FittingStatus.COMPLETED,
                "https://cdn.example.com/fitted.glb",
                "{\"front\":\"https://cdn.example.com/front.jpg\"}",
                "{\"size\":\"M\"}");

        assertThat(fitting.getStatus()).isEqualTo(FittingStatus.COMPLETED);
        assertThat(fitting.getFittedGlbUrl()).isEqualTo("https://cdn.example.com/fitted.glb");
    }
}
