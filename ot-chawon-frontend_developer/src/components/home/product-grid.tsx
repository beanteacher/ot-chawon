import React from 'react';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/components/product/product-card';

interface ProductGridProps {
  title?: string;
  products?: Product[];
}

const ProductGrid = ({ title = '추천 상품', products = [] }: ProductGridProps) => {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-oc-gray-900">{title}</h2>
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

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-oc-gray-600">
          <p className="text-sm">추천 상품이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export { ProductGrid };
export type { ProductGridProps };
