'use client';

import { apiClient } from '@/lib/api/axios';
import type { PaymentDto } from '@/types/payment.dto';

export const paymentApi = {
  requestPayment: async (req: PaymentDto.Request): Promise<PaymentDto.Response> => {
    const response = await apiClient.post<PaymentDto.Response>('/api/payments', req);
    return response.data;
  },

  confirmPayment: async (paymentId: number): Promise<PaymentDto.Response> => {
    const response = await apiClient.post<PaymentDto.Response>(`/api/payments/${paymentId}/confirm`);
    return response.data;
  },

  getPayment: async (paymentId: number): Promise<PaymentDto.Response> => {
    const response = await apiClient.get<PaymentDto.Response>(`/api/payments/${paymentId}`);
    return response.data;
  },
};
