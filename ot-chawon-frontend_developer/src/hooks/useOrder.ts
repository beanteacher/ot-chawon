'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/services/orderApi';
import type { OrderDto } from '@/types/order.dto';

export const ORDER_QUERY_KEY = ['orders'] as const;

export function useOrders(status?: OrderDto.OrderStatus, page?: number) {
  return useQuery<OrderDto.ListResponse>({
    queryKey: [...ORDER_QUERY_KEY, status, page],
    queryFn: () => {
      const params: { status?: OrderDto.OrderStatus; page?: number } = {};
      if (status !== undefined) params.status = status;
      if (page !== undefined) params.page = page;
      return orderApi.getOrders(params);
    },
  });
}

export function useOrderDetail(orderId: string | undefined) {
  return useQuery<OrderDto.OrderDetail>({
    queryKey: [...ORDER_QUERY_KEY, orderId],
    queryFn: () => orderApi.getOrder(orderId!),
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (req: OrderDto.Request) => orderApi.createOrder(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY });
    },
  });
}
