'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

export type SortOption = 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'discount';

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'popular', label: '인기순' },
  { value: 'newest', label: '최신순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'discount', label: '할인율순' },
];

export function ProductSort({ value, onChange }: ProductSortProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = SORT_OPTIONS.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-oc-gray-300 border border-oc-gray-700 rounded-md hover:border-oc-gray-500 transition-colors bg-oc-gray-900"
      >
        <span>{current?.label}</span>
        <svg
          className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-oc-gray-900 border border-oc-gray-700 rounded-md shadow-lg z-20 overflow-hidden animate-slide-down">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm transition-colors',
                option.value === value
                  ? 'text-oc-primary-400 bg-oc-primary-500/10'
                  : 'text-oc-gray-300 hover:bg-oc-gray-800 hover:text-white'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
