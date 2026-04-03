'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { SearchFilters } from '@/hooks/useSearch';
import { DEFAULT_FILTERS } from '@/hooks/useSearch';

const CATEGORIES = ['전체', '상의', '하의', '아우터', '신발', '가방', '액세서리'];
const PRICE_RANGES = ['전체', '~5만원', '5~10만원', '10~20만원', '20만원~'];
const BRANDS = ['나이키', '아디다스', '자라', 'H&M', '유니클로', '무신사'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  onClearAll: () => void;
  onApply: () => void;
  className?: string;
}

const FilterPanel = ({ filters, onFilterChange, onClearAll, onApply, className }: FilterPanelProps) => {
  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange('brands', next);
  };

  const handleSizeToggle = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange('sizes', next);
  };

  const priceMaxFormatted = filters.priceMax >= 200000 ? '20만원~' : `${(filters.priceMax / 10000).toFixed(0)}만원`;

  return (
    <div
      className={cn(
        'w-full bg-white border border-oc-gray-300 rounded-lg p-5',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 카테고리 */}
        <div>
          <h3 className="text-sm font-semibold text-oc-gray-900 mb-3">카테고리</h3>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={() => onFilterChange('category', cat)}
                  className="w-4 h-4 accent-[#FF6B35] cursor-pointer"
                />
                <span
                  className={cn(
                    'text-sm transition-colors',
                    filters.category === cat ? 'text-[#FF6B35] font-medium' : 'text-oc-gray-500 group-hover:text-oc-gray-900'
                  )}
                >
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 가격대 */}
        <div>
          <h3 className="text-sm font-semibold text-oc-gray-900 mb-3">가격대</h3>
          <div className="flex flex-col gap-2 mb-4">
            {PRICE_RANGES.map((range) => (
              <label key={range} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="priceRange"
                  value={range}
                  checked={filters.priceRange === range}
                  onChange={() => onFilterChange('priceRange', range)}
                  className="w-4 h-4 accent-[#FF6B35] cursor-pointer"
                />
                <span
                  className={cn(
                    'text-sm transition-colors',
                    filters.priceRange === range ? 'text-[#FF6B35] font-medium' : 'text-oc-gray-500 group-hover:text-oc-gray-900'
                  )}
                >
                  {range}
                </span>
              </label>
            ))}
          </div>
          {/* 가격 슬라이더 */}
          <div>
            <div className="flex justify-between text-xs text-[#9E9E9E] mb-2">
              <span>0원</span>
              <span className="text-[#FF6B35]">{priceMaxFormatted}</span>
            </div>
            <input
              type="range"
              min={0}
              max={200000}
              step={10000}
              value={filters.priceMax}
              onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
              className="w-full accent-[#FF6B35] cursor-pointer"
            />
          </div>
        </div>

        {/* 브랜드 */}
        <div>
          <h3 className="text-sm font-semibold text-oc-gray-900 mb-3">브랜드</h3>
          <div className="flex flex-col gap-2">
            {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded accent-[#FF6B35] cursor-pointer"
                />
                <span
                  className={cn(
                    'text-sm transition-colors',
                    filters.brands.includes(brand) ? 'text-[#FF6B35] font-medium' : 'text-oc-gray-500 group-hover:text-oc-gray-900'
                  )}
                >
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 사이즈 */}
        <div>
          <h3 className="text-sm font-semibold text-oc-gray-900 mb-3">사이즈</h3>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={cn(
                  'h-9 rounded-md text-sm font-medium border transition-colors',
                  filters.sizes.includes(size)
                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                    : 'bg-transparent border-oc-gray-300 text-oc-gray-500 hover:border-oc-gray-900 hover:text-oc-gray-900'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-oc-gray-300">
        <button
          type="button"
          onClick={onClearAll}
          className={cn(
            'px-4 h-9 rounded-md text-sm font-medium border border-oc-gray-300',
            'text-oc-gray-500 hover:text-oc-gray-900 hover:border-oc-gray-900 transition-colors'
          )}
        >
          초기화
        </button>
        <button
          type="button"
          onClick={onApply}
          className={cn(
            'px-5 h-9 rounded-md text-sm font-semibold',
            'bg-[#FF6B35] hover:bg-[#E55A24] text-white transition-colors'
          )}
        >
          필터 적용
        </button>
      </div>
    </div>
  );
};

export { FilterPanel, DEFAULT_FILTERS };
export type { FilterPanelProps };
