'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/components/product/ProductCard';
import type { SortOption } from '@/hooks/useSearch';

const SORT_OPTIONS: SortOption[] = ['인기순', '최신순', '가격순'];

interface SearchResultsProps {
  results: Product[];
  isLoading: boolean;
  totalCount: number;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  className?: string;
}

const SearchResults = ({
  results,
  isLoading,
  totalCount,
  sortOption,
  onSortChange,
  className,
}: SearchResultsProps) => {
  return (
    <div className={cn('w-full', className)}>
      {/* 결과 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#BDBDBD]">
          총{' '}
          <span className="text-[#F9F9F9] font-semibold">{totalCount.toLocaleString()}</span>
          건
        </p>
        <div className="flex items-center gap-1">
          {SORT_OPTIONS.map((option, index) => (
            <React.Fragment key={option}>
              <button
                type="button"
                onClick={() => onSortChange(option)}
                className={cn(
                  'text-sm transition-colors px-1',
                  sortOption === option
                    ? 'text-[#FF6B35] font-semibold'
                    : 'text-[#9E9E9E] hover:text-[#F9F9F9]'
                )}
              >
                {option}
              </button>
              {index < SORT_OPTIONS.length - 1 && (
                <span className="text-[#616161] text-xs">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 스켈레톤 로딩 */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-[#333333] rounded-xl mb-3" />
              <div className="h-3 bg-[#333333] rounded w-1/3 mb-2" />
              <div className="h-4 bg-[#333333] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#333333] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* 결과 그리드 */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export { SearchResults };
export type { SearchResultsProps };
