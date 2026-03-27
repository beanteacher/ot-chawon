import { Suspense } from 'react';
import { Metadata } from 'next';
import { SkeletonCardList } from '@/components/ui/SkeletonCard';
import { ProductListClient } from './ProductListClient';
import { ProductDto } from '@/types/product.dto';

export const metadata: Metadata = {
  title: '상품 목록 | OT-CHAWON',
  description: '다양한 패션 상품을 둘러보세요.',
};

// 더미 데이터 (서버사이드 fetch 대체 — API 미연결 시 폴백)
const DUMMY_PRODUCTS: (ProductDto.Item & { category: string })[] = [
  { id: 1, name: '오버사이즈 코튼 티셔츠', price: 39000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item1.glb', category: '상의' },
  { id: 2, name: '슬림 테이퍼드 데님 팬츠', price: 79000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '하의' },
  { id: 3, name: '울 블렌드 오버핏 코트', price: 189000, brandName: 'ADIDAS', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item3.glb', category: '아우터' },
  { id: 4, name: '클래식 로고 후드티', price: 69000, brandName: 'NIKE', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '상의' },
  { id: 5, name: '리사이클 나일론 백팩', price: 129000, brandName: 'New Balance', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item5.glb', category: '가방' },
  { id: 6, name: '캔버스 로우 스니커즈', price: 59000, brandName: 'Converse', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '신발' },
  { id: 7, name: '와이드 슬랙스', price: 89000, brandName: 'Vans', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '하의' },
  { id: 8, name: '기모 집업 후리스', price: 99000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item8.glb', category: '아우터' },
  { id: 9, name: '체크 패턴 셔츠', price: 55000, brandName: 'ADIDAS', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '상의' },
  { id: 10, name: '카고 숏 팬츠', price: 65000, brandName: 'NIKE', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '하의' },
  { id: 11, name: '린넨 블렌드 반팔 셔츠', price: 45000, brandName: 'New Balance', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item11.glb', category: '상의' },
  { id: 12, name: '스트링 트레이닝 팬츠', price: 49000, brandName: 'Converse', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null, category: '하의' },
];

async function fetchProducts(): Promise<(ProductDto.Item & { category: string })[]> {
  try {
    const { getProducts } = await import('@/services/product/get-products');
    const result = await getProducts(0, 20);
    // API 응답에 category 필드가 없으므로 더미 데이터에서 보완
    return result.items.map((item) => ({
      ...item,
      category: DUMMY_PRODUCTS.find((d) => d.id === item.id)?.category ?? '기타',
    }));
  } catch {
    return DUMMY_PRODUCTS;
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-oc-black p-8"><SkeletonCardList count={12} /></div>}>
      <ProductListClient initialProducts={products} />
    </Suspense>
  );
}
