import { Suspense } from 'react';
import { Metadata } from 'next';
import { Spinner } from '@/components/ui/Spinner';
import { SearchClient } from './SearchClient';
import type { Product } from '@/components/product/ProductCard';

interface SearchPageProps {
  searchParams: { q?: string; category?: string; priceRange?: string; brands?: string; sizes?: string };
}

export const metadata: Metadata = {
  title: '검색 | OT-CHAWON',
  description: '원하는 상품을 검색해보세요.',
};

const MOCK_PRODUCTS: Product[] = [
  { id: '1', brand: '나이키', name: '오버사이즈 코트 윈터 에디션', price: 189000, originalPrice: 250000, discountRate: 24 },
  { id: '2', brand: '아디다스', name: '데님 팬츠 와이드핏 블루', price: 79000, originalPrice: 99000, discountRate: 20 },
  { id: '3', brand: '자라', name: '나이키 스니커즈 에어맥스 270', price: 139000 },
  { id: '4', brand: 'H&M', name: '울 니트 스웨터 크루넥', price: 49000, originalPrice: 69000, discountRate: 29 },
  { id: '5', brand: '유니클로', name: '가죽 재킷 라이더 블랙', price: 219000 },
  { id: '6', brand: '무신사', name: '린넨 셔츠 오버핏 화이트', price: 39000 },
  { id: '7', brand: '나이키', name: '크롭 티셔츠 베이직 라운드', price: 29000, discountRate: 10, originalPrice: 32000 },
  { id: '8', brand: '아디다스', name: '후드 집업 그레이 멜란지', price: 89000 },
  { id: '9', brand: '자라', name: '와이드 팬츠 블랙 기본핏', price: 59000, originalPrice: 79000, discountRate: 25 },
  { id: '10', brand: 'H&M', name: '봄 자켓 라이트 베이지', price: 119000 },
  { id: '11', brand: '유니클로', name: '스트라이프 셔츠 컬러블록', price: 45000 },
  { id: '12', brand: '무신사', name: '데님 미니스커트 라이트 블루', price: 55000, originalPrice: 69000, discountRate: 20 },
];

function serverFilterProducts(query: string, category?: string, brands?: string): Product[] {
  let result = [...MOCK_PRODUCTS];
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }
  if (category && category !== '전체') {
    result = result.filter((p) => p.brand === category);
  }
  if (brands) {
    const brandList = brands.split(',').filter(Boolean);
    if (brandList.length > 0) {
      result = result.filter((p) => brandList.includes(p.brand));
    }
  }
  return result;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q ?? '';
  const initialResults = query
    ? serverFilterProducts(query, searchParams.category, searchParams.brands)
    : [];

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    }>
      <SearchClient initialQuery={query} initialResults={initialResults} />
    </Suspense>
  );
}
