'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ProductFilter, FilterState } from '@/components/product/ProductFilter';
import { ProductSort, SortOption } from '@/components/product/ProductSort';
import { ProductDto } from '@/types/product.dto';

// 더미 데이터
const DUMMY_PRODUCTS: ProductDto.Item[] = [
  { id: 1, name: '오버사이즈 코튼 티셔츠', price: 39000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item1.glb' },
  { id: 2, name: '슬림 테이퍼드 데님 팬츠', price: 79000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 3, name: '울 블렌드 오버핏 코트', price: 189000, brandName: 'ADIDAS', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item3.glb' },
  { id: 4, name: '클래식 로고 후드티', price: 69000, brandName: 'NIKE', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 5, name: '리사이클 나일론 백팩', price: 129000, brandName: 'New Balance', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item5.glb' },
  { id: 6, name: '캔버스 로우 스니커즈', price: 59000, brandName: 'Converse', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 7, name: '와이드 슬랙스', price: 89000, brandName: 'Vans', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 8, name: '기모 집업 후리스', price: 99000, brandName: '무신사 스탠다드', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item8.glb' },
  { id: 9, name: '체크 패턴 셔츠', price: 55000, brandName: 'ADIDAS', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 10, name: '카고 숏 팬츠', price: 65000, brandName: 'NIKE', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
  { id: 11, name: '린넨 블렌드 반팔 셔츠', price: 45000, brandName: 'New Balance', thumbnailUrl: '', hasThreeD: true, glbAssetKey: 'item11.glb' },
  { id: 12, name: '스트링 트레이닝 팬츠', price: 49000, brandName: 'Converse', thumbnailUrl: '', hasThreeD: false, glbAssetKey: null },
];

const DISCOUNT_MAP: Record<number, number> = { 1: 20, 2: 15, 3: 30, 4: 10, 5: 25, 6: 5, 7: 18, 8: 22, 9: 12, 10: 8, 11: 35, 12: 16 };

function ProductListCard({ product }: { product: ProductDto.Item }) {
  const discount = DISCOUNT_MAP[product.id] ?? 0;
  const discountedPrice = Math.round(product.price * (1 - discount / 100));

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-oc-gray-800 rounded-xl overflow-hidden mb-3">
        {product.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnailUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-oc-gray-800 to-oc-gray-700">
            <svg className="w-12 h-12 text-oc-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-oc-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}%
          </div>
        )}
        {product.hasThreeD && (
          <div className="absolute top-2 right-2 bg-oc-gray-900/80 text-oc-primary-400 text-2xs font-medium px-2 py-1 rounded border border-oc-primary-500/40">
            3D
          </div>
        )}

        {/* 호버 오버레이 */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
            상세 보기
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs text-oc-gray-500 mb-0.5">{product.brandName}</p>
        <p className="text-sm text-white font-medium line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{discountedPrice.toLocaleString()}원</span>
          {discount > 0 && (
            <span className="text-xs text-oc-gray-600 line-through">{product.price.toLocaleString()}원</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ProductListCardHorizontal({ product }: { product: ProductDto.Item }) {
  const discount = DISCOUNT_MAP[product.id] ?? 0;
  const discountedPrice = Math.round(product.price * (1 - discount / 100));

  return (
    <Link href={`/products/${product.id}`} className="group flex gap-4 p-3 rounded-xl bg-oc-gray-900 hover:bg-oc-gray-800 transition-colors border border-oc-gray-800">
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-oc-gray-800">
        {product.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnailUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-oc-gray-800 to-oc-gray-700">
            <svg className="w-8 h-8 text-oc-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-oc-gray-500 mb-0.5">{product.brandName}</p>
        <p className="text-sm text-white font-medium line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center gap-2">
          {discount > 0 && <span className="text-xs text-oc-primary-500 font-bold">{discount}%</span>}
          <span className="text-sm font-bold text-white">{discountedPrice.toLocaleString()}원</span>
          {discount > 0 && <span className="text-xs text-oc-gray-600 line-through">{product.price.toLocaleString()}원</span>}
        </div>
        {product.hasThreeD && (
          <span className="inline-block mt-1 text-2xs text-oc-primary-400 border border-oc-primary-500/40 px-1.5 py-0.5 rounded">3D</span>
        )}
      </div>
    </Link>
  );
}

const INITIAL_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 500000,
  colors: [],
  sizes: [],
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    filters.colors.length +
    filters.sizes.length +
    (filters.priceMax < 500000 ? 1 : 0);

  const removeFilter = (type: keyof FilterState, value?: string) => {
    if (type === 'priceMax') {
      setFilters((f) => ({ ...f, priceMax: 500000 }));
    } else if (value && Array.isArray(filters[type])) {
      setFilters((f) => ({
        ...f,
        [type]: (f[type] as string[]).filter((v) => v !== value),
      }));
    }
  };

  // 필터 적용 (가격 필터만 적용)
  const filtered = DUMMY_PRODUCTS.filter((p) => {
    const discount = DISCOUNT_MAP[p.id] ?? 0;
    const discountedPrice = Math.round(p.price * (1 - discount / 100));
    return discountedPrice <= filters.priceMax;
  });

  // 정렬
  const sorted = [...filtered].sort((a, b) => {
    const da = DISCOUNT_MAP[a.id] ?? 0;
    const db = DISCOUNT_MAP[b.id] ?? 0;
    if (sort === 'price_asc') return Math.round(a.price * (1 - da / 100)) - Math.round(b.price * (1 - db / 100));
    if (sort === 'price_desc') return Math.round(b.price * (1 - db / 100)) - Math.round(a.price * (1 - da / 100));
    if (sort === 'discount') return db - da;
    if (sort === 'newest') return b.id - a.id;
    return a.id - b.id;
  });

  return (
    <main className="min-h-screen bg-oc-black">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">상품 목록</h1>
          <p className="text-sm text-oc-gray-500">총 {sorted.length}개의 상품</p>
        </div>

        {/* 활성 필터 태그 */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.categories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-oc-primary-500/20 border border-oc-primary-500/40 text-oc-primary-400 text-xs rounded-full">
                {cat}
                <button onClick={() => removeFilter('categories', cat)} className="hover:text-white">×</button>
              </span>
            ))}
            {filters.brands.map((brand) => (
              <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-oc-primary-500/20 border border-oc-primary-500/40 text-oc-primary-400 text-xs rounded-full">
                {brand}
                <button onClick={() => removeFilter('brands', brand)} className="hover:text-white">×</button>
              </span>
            ))}
            {filters.priceMax < 500000 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-oc-primary-500/20 border border-oc-primary-500/40 text-oc-primary-400 text-xs rounded-full">
                ~{filters.priceMax.toLocaleString()}원
                <button onClick={() => removeFilter('priceMax')} className="hover:text-white">×</button>
              </span>
            )}
            <button
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="text-xs text-oc-gray-500 hover:text-white transition-colors underline"
            >
              전체 초기화
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* 필터 사이드바 (데스크탑) */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-4">
              <ProductFilter filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* 상품 목록 */}
          <div className="flex-1 min-w-0">
            {/* 툴바 */}
            <div className="flex items-center justify-between mb-4">
              {/* 모바일 필터 버튼 */}
              <button
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm text-oc-gray-300 border border-oc-gray-700 rounded-md hover:border-oc-gray-500 transition-colors bg-oc-gray-900"
                onClick={() => setMobileFilterOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                필터
                {activeFilterCount > 0 && (
                  <span className="bg-oc-primary-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="hidden lg:block" />

              <div className="flex items-center gap-3">
                <ProductSort value={sort} onChange={setSort} />

                {/* 뷰 토글 */}
                <div className="flex border border-oc-gray-700 rounded-md overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'grid' ? 'bg-oc-gray-700 text-white' : 'bg-oc-gray-900 text-oc-gray-500 hover:text-oc-gray-300'
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 transition-colors',
                      viewMode === 'list' ? 'bg-oc-gray-700 text-white' : 'bg-oc-gray-900 text-oc-gray-500 hover:text-oc-gray-300'
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* 상품 그리드/리스트 */}
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-oc-gray-600">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">조건에 맞는 상품이 없습니다.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map((product) => (
                  <ProductListCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sorted.map((product) => (
                  <ProductListCardHorizontal key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 필터 드로어 */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-oc-gray-900 border-t border-oc-gray-800 animate-slide-up">
            <div className="sticky top-0 bg-oc-gray-900 px-4 pt-4 pb-2 border-b border-oc-gray-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">필터</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="text-oc-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <ProductFilter
                filters={filters}
                onChange={setFilters}
                onClose={() => setMobileFilterOpen(false)}
                isMobile
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
