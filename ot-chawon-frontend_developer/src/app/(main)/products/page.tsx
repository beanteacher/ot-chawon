import { Suspense } from 'react';
import { Metadata } from 'next';
import { SkeletonCardList } from '@/components/ui/skeleton-card';
import { ProductListClient } from './product-list-client';
import { ProductDto } from '@/services/product/dto/product.dto';

export const metadata: Metadata = {
  title: '상품 목록 | OT-CHAWON',
  description: '다양한 패션 상품을 둘러보세요.',
};

async function fetchProducts(): Promise<(ProductDto.Item & { category: string })[]> {
  try {
    const { getProducts } = await import('@/services/product/get-products');
    const result = await getProducts(0, 20);
    return result.items.map((item) => ({
      ...item,
      category: '기타',
    }));
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-oc-gray-50 p-8"><SkeletonCardList count={12} /></div>}>
      <ProductListClient initialProducts={products} />
    </Suspense>
  );
}
