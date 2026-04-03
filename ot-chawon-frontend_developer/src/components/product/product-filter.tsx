'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui';

export interface FilterState {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  colors: string[];
  sizes: string[];
}

interface ProductFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const CATEGORIES = ['상의', '하의', '아우터', '신발', '가방', '액세서리'];
const BRANDS = ['무신사 스탠다드', 'ADIDAS', 'NIKE', 'New Balance', 'Converse', 'Vans'];
const COLORS = [
  { label: '블랙', value: 'black', hex: '#111111' },
  { label: '화이트', value: 'white', hex: '#FFFFFF' },
  { label: '그레이', value: 'gray', hex: '#9E9E9E' },
  { label: '네이비', value: 'navy', hex: '#1E3A5F' },
  { label: '베이지', value: 'beige', hex: '#D4B896' },
  { label: '오렌지', value: 'orange', hex: '#FF6B35' },
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <span
        className={cn(
          'w-4 h-4 border rounded-md flex items-center justify-center transition-colors',
          checked
            ? 'bg-oc-primary-500 border-oc-primary-500'
            : 'border-oc-gray-300 group-hover:border-oc-primary-400'
        )}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-sm text-oc-gray-600 group-hover:text-oc-gray-900 transition-colors">
        {label}
      </span>
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-oc-gray-100 py-4">
      <button
        className="flex items-center justify-between w-full mb-3"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-oc-gray-900">{title}</span>
        <svg
          className={cn('w-4 h-4 text-oc-gray-400 transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

export function ProductFilter({ filters, onChange, onReset, onClose, isMobile = false }: ProductFilterProps) {
  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];

  const handleReset = () => {
    onChange({ categories: [], brands: [], priceMin: 0, priceMax: 500000, colors: [], sizes: [] });
    onReset?.();
  };

  const content = (
    <div className={cn('bg-white text-oc-gray-900', isMobile ? 'p-4' : 'p-0')}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-oc-gray-900">필터</h3>
        <button
          onClick={handleReset}
          className="text-xs text-oc-primary-400 hover:text-oc-primary-300 transition-colors"
        >
          초기화
        </button>
      </div>

      <FilterSection title="카테고리">
        {CATEGORIES.map((cat) => (
          <CheckItem
            key={cat}
            label={cat}
            checked={filters.categories.includes(cat)}
            onChange={() => onChange({ ...filters, categories: toggle(filters.categories, cat) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="브랜드">
        {BRANDS.map((brand) => (
          <CheckItem
            key={brand}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={() => onChange({ ...filters, brands: toggle(filters.brands, brand) })}
          />
        ))}
      </FilterSection>

      <FilterSection title="가격">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-oc-gray-500">
            <span>{filters.priceMin.toLocaleString()}원</span>
            <span>{filters.priceMax.toLocaleString()}원</span>
          </div>
          <input
            type="range"
            min={0}
            max={500000}
            step={10000}
            value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
            className="w-full accent-oc-primary-500"
          />
        </div>
      </FilterSection>

      <FilterSection title="색상">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              title={color.label}
              onClick={() => onChange({ ...filters, colors: toggle(filters.colors, color.value) })}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-all',
                filters.colors.includes(color.value)
                  ? 'border-oc-primary-500 scale-110'
                  : 'border-oc-gray-200 hover:border-oc-gray-400'
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="사이즈">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
              className={cn(
                'px-3 py-1.5 text-xs border rounded-full transition-colors',
                filters.sizes.includes(size)
                  ? 'border-oc-primary-500 bg-oc-primary-500/20 text-oc-primary-400'
                  : 'border-oc-gray-200 text-oc-gray-500 hover:border-oc-gray-400'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {isMobile && (
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary" fullWidth onClick={onClose}>
            적용하기
          </Button>
        </div>
      )}
    </div>
  );

  return content;
}
