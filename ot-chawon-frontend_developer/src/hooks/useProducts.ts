'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/axios';
import type { ProductDto } from '@/types/product.dto';

export function useProducts(page = 0, size = 20) {
  return useQuery<ProductDto.ListResponse>({
    queryKey: ['products', page, size],
    queryFn: async () => {
      const response = await apiClient.get<ProductDto.ListResponse>(
        `/api/products?page=${page}&size=${size}`
      );
      return response.data;
    },
  });
}

export function useProduct(id: number) {
  return useQuery<ProductDto.Detail>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await apiClient.get<ProductDto.Detail>(
        `/api/products/${id}`
      );
      return response.data;
    },
    enabled: id > 0,
  });
}
