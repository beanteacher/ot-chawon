import { serverFetch } from '@/lib/api/client';
import type { OrderDto } from '@/services/order/dto/order.dto';

export async function getOrder(orderId: string): Promise<OrderDto.Response> {
  return serverFetch<OrderDto.Response>(`/api/orders/${orderId}`);
}

export async function getOrders(page = 0, size = 10): Promise<OrderDto.ListResponse> {
  return serverFetch<OrderDto.ListResponse>(`/api/orders?page=${page}&size=${size}`);
}
