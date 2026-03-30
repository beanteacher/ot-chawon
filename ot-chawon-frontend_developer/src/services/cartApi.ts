'use client';

import { apiClient } from '@/lib/api/axios';
import type { CartDto } from '@/services/cart/dto/cart.dto';

export const cartApi = {
  getCart: async (): Promise<CartDto.Response> => {
    const response = await apiClient.get<CartDto.Response>('/api/carts');
    return response.data;
  },

  addCartItem: async (req: CartDto.AddItemRequest): Promise<CartDto.Item> => {
    const response = await apiClient.post<CartDto.Item>('/api/carts/items', req);
    return response.data;
  },

  updateCartItemQuantity: async (
    cartItemId: number,
    quantity: number
  ): Promise<CartDto.Item> => {
    const response = await apiClient.put<CartDto.Item>(
      `/api/carts/items/${cartItemId}`,
      { quantity } satisfies CartDto.UpdateQuantityRequest
    );
    return response.data;
  },

  removeCartItem: async (cartItemId: number): Promise<void> => {
    await apiClient.delete(`/api/carts/items/${cartItemId}`);
  },

  removeCartItems: async (cartItemIds: number[]): Promise<void> => {
    await apiClient.delete('/api/carts/items', { data: { cartItemIds } });
  },
};
