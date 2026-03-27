import React from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/components/product/ProductCard';

const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    brand: 'MUSINSA STANDARD',
    name: '베이직 오버핏 코튼 티셔츠',
    price: 19900,
    originalPrice: 29900,
    discountRate: 33,
  },
  {
    id: '2',
    brand: 'COVERNAT',
    name: '코버낫 스몰 로고 후드티 블랙',
    price: 59000,
    originalPrice: 79000,
    discountRate: 25,
  },
  {
    id: '3',
    brand: 'POLO RALPH LAUREN',
    name: '클래식 핏 옥스포드 버튼다운 셔츠',
    price: 89000,
  },
  {
    id: '4',
    brand: 'ADIDAS',
    name: '아디다스 트레포일 트랙 재킷',
    price: 109000,
    originalPrice: 139000,
    discountRate: 22,
  },
  {
    id: '5',
    brand: 'NEW BALANCE',
    name: 'NB 993 클래식 운동화',
    price: 179000,
    originalPrice: 199000,
    discountRate: 10,
  },
  {
    id: '6',
    brand: 'UNIQLO',
    name: '드라이 스트레치 슬림 팬츠',
    price: 39900,
  },
  {
    id: '7',
    brand: 'WTAPS',
    name: '더블탭스 밀리터리 셔츠 재킷',
    price: 289000,
    originalPrice: 349000,
    discountRate: 17,
  },
  {
    id: '8',
    brand: 'CARHARTT WIP',
    name: '칼하트 웍인프로그레스 더블니 팬츠',
    price: 149000,
  },
];

interface ProductGridProps {
  title?: string;
  products?: Product[];
}

const ProductGrid = ({ title = '추천 상품', products = DUMMY_PRODUCTS }: ProductGridProps) => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        <a
          href="/products"
          className="text-sm text-oc-gray-500 hover:text-oc-primary-500 transition-colors flex items-center gap-1"
        >
          전체 보기
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export { ProductGrid };
export type { ProductGridProps };
