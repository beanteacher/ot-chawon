'use client';

import { apiClient } from '@/lib/api/axios';
import type { OrderDto } from '@/services/order/dto/order.dto';

export const orderApi = {
  createOrder: async (req: OrderDto.Request): Promise<OrderDto.Response> => {
    const response = await apiClient.post<OrderDto.Response>('/api/orders', req);
    return response.data;
  },

  getOrder: async (orderId: string): Promise<OrderDto.OrderDetail> => {
    const response = await apiClient.get<OrderDto.OrderDetail>(`/api/orders/${orderId}`);
    return response.data;
  },

  getOrders: async (params?: { status?: OrderDto.OrderStatus; page?: number }): Promise<OrderDto.ListResponse> => {
    const response = await apiClient.get<OrderDto.ListResponse>('/api/orders', { params });
    return response.data;
  },

  cancelOrder: async (orderId: string): Promise<void> => {
    await apiClient.put(`/api/orders/${orderId}/cancel`);
  },
};
