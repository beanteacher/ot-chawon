package com.otchawon.order.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import com.otchawon.order.entity.Order;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderListResponse {

    private List<OrderResponse> orders;
    private int totalPages;
    private long totalElements;
    private int currentPage;

    public static OrderListResponse from(Page<Order> page) {
        return OrderListResponse.builder()
                .orders(page.getContent().stream()
                        .map(OrderResponse::from)
                        .collect(Collectors.toList()))
                .totalPages(page.getTotalPages())
                .totalElements(page.getTotalElements())
                .currentPage(page.getNumber())
                .build();
    }
}
