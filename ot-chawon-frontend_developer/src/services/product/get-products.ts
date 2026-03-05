import { apiGet } from '@/lib/api/client';

export interface ProductItem {
  id: number;
  name: string;
  price: number;
}

interface ProductListData {
  items: ProductItem[];
  page: number;
  size: number;
  total: number;
}

export async function getProducts(): Promise<ProductItem[]> {
  const res = await apiGet<ProductListData>('/api/v1/products');
  return res.data.items;
}
