'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/search/search-bar';
import { FilterPanel } from '@/components/search/filter-panel';
import { ActiveFilterChips } from '@/components/search/active-filter-chips';
import { SearchResults } from '@/components/search/search-results';
import { NoSearchResult } from '@/components/search/no-search-result';
import { RecentKeywords, addRecentKeyword } from '@/components/search/recent-keywords';
import { PopularKeywords } from '@/components/search/popular-keywords';
import type { SearchFilters } from '@/hooks/useSearch';
import type { Product } from '@/components/product/product-card';

interface SearchClientProps {
  initialQuery: string;
  initialResults: Product[];
}

export function SearchClient({ initialQuery, initialResults }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    searchQuery,
    filters,
    sortOption,
    setSortOption,
    results,
    isLoading,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    setQuery,
    setFilter,
    clearFilter,
    clearAllFilters,
    executeSearch,
  } = useSearch(initialQuery);

  const [showFilter, setShowFilter] = useState(true);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));

  // initialResults를 초기 표시에 활용 (useSearch가 덮어쓰기 전)
  const displayResults = results.length > 0 || hasSearched ? results : initialResults;

  // URL에 검색어/필터 반영
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (filters.category !== '전체') params.set('category', filters.category);
    if (filters.priceRange !== '전체') params.set('priceRange', filters.priceRange);
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.sizes.length > 0) params.set('sizes', filters.sizes.join(','));
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [searchQuery, filters, router]);

  // URL searchParams에서 필터 초기화
  useEffect(() => {
    const category = searchParams.get('category');
    const priceRange = searchParams.get('priceRange');
    const brands = searchParams.get('brands');
    const sizes = searchParams.get('sizes');
    if (category) setFilter('category', category);
    if (priceRange) setFilter('priceRange', priceRange);
    if (brands) setFilter('brands', brands.split(','));
    if (sizes) setFilter('sizes', sizes.split(','));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      addRecentKeyword(query.trim());
      setHasSearched(true);
    }
    executeSearch(query);
  };

  const handleKeywordClick = (keyword: string) => {
    handleSearch(keyword);
  };

  const handleFilterRemove = (key: keyof SearchFilters, value?: string) => {
    if ((key === 'brands' || key === 'sizes') && value) {
      const current = filters[key] as string[];
      setFilter(key, current.filter((v) => v !== value));
    } else {
      clearFilter(key);
    }
  };

  const hasActiveFilters =
    filters.category !== '전체' ||
    filters.priceRange !== '전체' ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0;

  return (
    <main className="min-h-screen bg-oc-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[80px] py-8">
        {/* 검색바 영역 */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setQuery}
            onSearch={handleSearch}
            suggestions={suggestions}
            showSuggestions={showSuggestions}
            onShowSuggestions={setShowSuggestions}
          />
        </div>

        {/* 검색 전: 최근 검색어 + 인기 검색어 */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <RecentKeywords onKeywordClick={handleKeywordClick} />
            <PopularKeywords onKeywordClick={handleKeywordClick} />
          </div>
        )}

        {/* 검색 후 */}
        {hasSearched && (
          <>
            {/* 필터 토글 버튼 (모바일) */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <button
                type="button"
                onClick={() => setShowFilter((v) => !v)}
                className={cn(
                  'flex items-center gap-2 px-4 h-9 rounded-md border text-sm transition-colors',
                  showFilter
                    ? 'border-[#FF6B35] text-[#FF6B35]'
                    : 'border-oc-gray-300 text-oc-gray-500'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2M13 16h-2" />
                </svg>
                필터
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                )}
              </button>
            </div>

            {/* 필터 패널 */}
            <div className={cn('mb-5', !showFilter && 'hidden md:block')}>
              <FilterPanel
                filters={filters}
                onFilterChange={setFilter}
                onClearAll={clearAllFilters}
                onApply={() => setShowFilter(false)}
              />
            </div>

            {/* 적용된 필터 칩 */}
            {hasActiveFilters && (
              <div className="mb-4 overflow-x-auto pb-1">
                <ActiveFilterChips
                  filters={filters}
                  onRemove={handleFilterRemove}
                />
              </div>
            )}

            {/* 검색 결과 or 결과 없음 */}
            {!isLoading && displayResults.length === 0 ? (
              <NoSearchResult
                keyword={searchQuery}
                onKeywordClick={handleKeywordClick}
              />
            ) : (
              <SearchResults
                results={displayResults}
                isLoading={isLoading}
                totalCount={displayResults.length}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
