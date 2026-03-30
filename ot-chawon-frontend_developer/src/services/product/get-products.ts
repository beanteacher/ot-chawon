import { serverFetch } from '@/lib/api/client';
import type { ProductDto } from '@/services/product/dto/product.dto';

export async function getProducts(
  page = 0,
  size = 20
): Promise<ProductDto.ListResponse> {
  return serverFetch<ProductDto.ListResponse>(
    `/api/products?page=${page}&size=${size}`
  );
}

export async function getProduct(id: number): Promise<ProductDto.Detail> {
  return serverFetch<ProductDto.Detail>(`/api/products/${id}`);
}
