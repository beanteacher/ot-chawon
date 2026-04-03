'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  suggestions,
  showSuggestions,
  onShowSuggestions,
  className,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    } else if (e.key === 'Escape') {
      onShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'flex items-center gap-2 w-full h-[52px] px-4',
          'bg-white border border-oc-gray-300 rounded-lg',
          'focus-within:border-[#FF6B35] transition-colors'
        )}
      >
        {/* 검색 아이콘 */}
        <svg
          className="w-5 h-5 text-[#9E9E9E] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => onShowSuggestions(true)}
          onBlur={() => setTimeout(() => onShowSuggestions(false), 150)}
          placeholder="검색어를 입력하세요..."
          className={cn(
            'flex-1 bg-transparent text-oc-gray-900 placeholder:text-[#9E9E9E]',
            'text-base outline-none'
          )}
        />

        {/* 클리어 버튼 */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-oc-gray-300 hover:bg-[#9E9E9E] transition-colors"
            aria-label="검색어 지우기"
          >
            <svg className="w-3 h-3 text-oc-gray-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 검색 버튼 */}
        <button
          type="button"
          onClick={() => onSearch(value)}
          className={cn(
            'flex-shrink-0 px-4 h-9 rounded-md',
            'bg-[#FF6B35] hover:bg-[#E55A24] active:bg-[#CC4F1E]',
            'text-white text-sm font-medium transition-colors'
          )}
        >
          검색
        </button>
      </div>

      {/* 자동완성 드롭다운 */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={cn(
            'absolute top-full left-0 right-0 mt-1 z-50',
            'bg-white border border-oc-gray-300 rounded-lg overflow-hidden shadow-lg'
          )}
        >
          {suggestions.map((suggestion, index) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left',
                  'hover:bg-oc-gray-100 transition-colors',
                  index === 0 && 'bg-oc-gray-50'
                )}
              >
                <svg className="w-4 h-4 text-[#9E9E9E] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className={cn('text-sm', index === 0 ? 'text-[#FF6B35] font-medium' : 'text-oc-gray-900')}>
                  {suggestion}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { SearchBar };
export type { SearchBarProps };
