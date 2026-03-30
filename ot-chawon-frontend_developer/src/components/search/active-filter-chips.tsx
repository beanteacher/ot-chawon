'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { SearchFilters } from '@/hooks/useSearch';

interface ActiveFilter {
  key: keyof SearchFilters;
  label: string;
  value?: string;
}

interface ActiveFilterChipsProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters, value?: string) => void;
  className?: string;
}

const ActiveFilterChips = ({ filters, onRemove, className }: ActiveFilterChipsProps) => {
  const activeFilters: ActiveFilter[] = [];

  if (filters.category !== '전체') {
    activeFilters.push({ key: 'category', label: filters.category });
  }
  if (filters.priceRange !== '전체') {
    activeFilters.push({ key: 'priceRange', label: filters.priceRange });
  }
  filters.brands.forEach((brand) => {
    activeFilters.push({ key: 'brands', label: brand, value: brand });
  });
  filters.sizes.forEach((size) => {
    activeFilters.push({ key: 'sizes', label: size, value: size });
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <span className="text-sm text-[#9E9E9E] flex-shrink-0">적용된 필터:</span>
      {activeFilters.map((filter) => (
        <span
          key={`${filter.key}-${filter.label}`}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 h-7 rounded-full',
            'bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] text-sm'
          )}
        >
          {filter.label}
          <button
            type="button"
            onClick={() => onRemove(filter.key, filter.value)}
            className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-[#FF6B35]/30 transition-colors"
            aria-label={`${filter.label} 필터 제거`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </div>
  );
};

export { ActiveFilterChips };
export type { ActiveFilterChipsProps };
