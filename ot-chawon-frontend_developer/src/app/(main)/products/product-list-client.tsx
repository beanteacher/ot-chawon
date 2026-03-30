'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ProductFilter, FilterState } from '@/components/product/product-filter';
import { ProductSort, SortOption } from '@/components/product/product-sort';
import { ProductCard } from '@/components/product/product-card';
import { Spinner } from '@/components/ui/spinner';
import { ProductDto } from '@/services/product/dto/product.dto';

interface ProductItemWithCategory extends ProductDto.Item {
  category: string;
}

interface ProductListClientProps {
  initialProducts: ProductItemWithCategory[];
}

const CATEGORIES = ['전체', '상의', '하의', '아우터', '신발', '가방'] as const;
type Category = typeof CATEGORIES[number];

const PAGE_SIZE = 12;

const DISCOUNT_MAP: Record<number, number> = { 1: 20, 2: 15, 3: 30, 4: 10, 5: 25, 6: 5, 7: 18, 8: 22, 9: 12, 10: 8, 11: 35, 12: 16 };
const SOLD_OUT_IDS: Set<number> = new Set([6, 10]);

const INITIAL_FILTERS: FilterState = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 500000,
  colors: [],
  sizes: [],
};

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('전체');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  const filtered = initialProducts.filter((p) => {
    const discount = DISCOUNT_MAP[p.id] ?? 0;
    const discountedPrice = Math.round(p.price * (1 - discount / 100));
    const priceOk = discountedPrice <= filters.priceMax;
    const categoryOk = activeCategory === '전체' || p.category === activeCategory;
    return priceOk && categoryOk;
  });

  const sorted = [...filtered].sort((a, b) => {
    const da = DISCOUNT_MAP[a.id] ?? 0;
    const db = DISCOUNT_MAP[b.id] ?? 0;
    if (sort === 'price_asc') return Math.round(a.price * (1 - da / 100)) - Math.round(b.price * (1 - db / 100));
    if (sort === 'price_desc') return Math.round(b.price * (1 - db / 100)) - Math.round(a.price * (1 - da / 100));
    if (sort === 'discount') return db - da;
    if (sort === 'newest') return b.id - a.id;
    return a.id - b.id;
  });

  const allProducts = Array.from(
    { length: Math.max(1, Math.ceil(displayCount / (sorted.length || 1))) },
    (_, i) => sorted.map((p) => ({ ...p, _key: `${p.id}-${i}` }))
  ).flat().slice(0, displayCount);

  const hasMore = displayCount < sorted.length * 3;

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((c) => c + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, hasMore]);

  useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [activeCategory, sort, filters]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <main className="min-h-screen bg-oc-black">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white mb-1">상품 목록</h1>
          <p className="text-sm text-oc-gray-500">총 {sorted.length}개의 상품</p>
        </div>

        {/* 카테고리 탭 */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap',
                  activeCategory === cat
                    ? 'bg-oc-primary-500 text-white'
                    : 'bg-oc-gray-900 text-oc-gray-400 border border-oc-gray-700 hover:border-oc-gray-500 hover:text-oc-gray-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
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
                {allProducts.map((product) => {
                  const discount = DISCOUNT_MAP[product.id] ?? 0;
                  const discountedPrice = Math.round(product.price * (1 - discount / 100));
                  return (
                    <Link key={product._key} href={`/products/${product.id}`}>
                      <ProductCard
                        variant="grid"
                        product={{
                          id: String(product.id),
                          brand: product.brandName,
                          name: product.name,
                          price: discountedPrice,
                          ...(discount > 0 && { originalPrice: product.price, discountRate: discount }),
                          ...(product.thumbnailUrl && { imageUrl: product.thumbnailUrl }),
                          isSoldOut: SOLD_OUT_IDS.has(product.id),
                          hasThreeD: product.hasThreeD,
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {allProducts.map((product) => {
                  const discount = DISCOUNT_MAP[product.id] ?? 0;
                  const discountedPrice = Math.round(product.price * (1 - discount / 100));
                  return (
                    <Link key={product._key} href={`/products/${product.id}`}>
                      <ProductCard
                        variant="list"
                        product={{
                          id: String(product.id),
                          brand: product.brandName,
                          name: product.name,
                          price: discountedPrice,
                          ...(discount > 0 && { originalPrice: product.price, discountRate: discount }),
                          ...(product.thumbnailUrl && { imageUrl: product.thumbnailUrl }),
                          isSoldOut: SOLD_OUT_IDS.has(product.id),
                          hasThreeD: product.hasThreeD,
                        }}
                      />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* 무한스크롤 센티널 */}
            <div ref={sentinelRef} className="h-10" />

            {/* 로딩 스피너 */}
            {isLoadingMore && (
              <div className="flex justify-center py-6">
                <Spinner size="md" color="primary" />
              </div>
            )}

            {/* 더 이상 데이터 없음 */}
            {!hasMore && sorted.length > 0 && (
              <p className="text-center text-xs text-oc-gray-600 py-6">모든 상품을 불러왔습니다.</p>
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
