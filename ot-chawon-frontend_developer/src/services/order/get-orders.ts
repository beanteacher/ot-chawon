import { serverFetch } from '@/lib/api/client';
import type { OrderDto } from '@/types/order.dto';

export async function getOrder(orderId: string): Promise<OrderDto.Response> {
  return serverFetch<OrderDto.Response>(`/api/orders/${orderId}`);
}
