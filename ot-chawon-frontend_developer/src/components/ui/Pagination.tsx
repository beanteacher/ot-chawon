'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function buildPageNumbers(currentPage: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];

  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className,
}: PaginationProps) {
  const pages = buildPageNumbers(currentPage, totalPages);
  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const basePageBtnClass =
    'inline-flex items-center justify-center w-8 h-8 rounded text-sm font-medium transition-colors select-none';

  return (
    <div
      className={cn('flex flex-wrap items-center justify-center gap-1', className)}
      role="navigation"
      aria-label="페이지 네비게이션"
    >
      {/* 이전 버튼 */}
      <button
        onClick={() => !isPrevDisabled && onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        aria-label="이전 페이지"
        className={cn(
          basePageBtnClass,
          isPrevDisabled
            ? 'opacity-30 cursor-not-allowed'
            : 'cursor-pointer hover:opacity-80'
        )}
        style={{
          color: 'var(--color-text-secondary, #BDBDBD)',
          background: 'var(--color-bg-surface, #212121)',
          border: '1px solid var(--color-border, #616161)',
        }}
      >
        ‹
      </button>

      {/* 페이지 번호 */}
      {pages.map((page, idx) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex items-center justify-center w-8 h-8 text-sm select-none"
              style={{ color: 'var(--color-text-secondary, #BDBDBD)' }}
              aria-hidden="true"
            >
              …
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`${page}페이지`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(basePageBtnClass, isActive ? '' : 'hover:opacity-80 cursor-pointer')}
            style={{
              background: isActive
                ? 'var(--color-brand-orange, #FF6B35)'
                : 'var(--color-bg-surface, #212121)',
              color: isActive
                ? '#FFFFFF'
                : 'var(--color-text-secondary, #BDBDBD)',
              border: isActive
                ? '1px solid var(--color-brand-orange, #FF6B35)'
                : '1px solid var(--color-border, #616161)',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        onClick={() => !isNextDisabled && onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        aria-label="다음 페이지"
        className={cn(
          basePageBtnClass,
          isNextDisabled
            ? 'opacity-30 cursor-not-allowed'
            : 'cursor-pointer hover:opacity-80'
        )}
        style={{
          color: 'var(--color-text-secondary, #BDBDBD)',
          background: 'var(--color-bg-surface, #212121)',
          border: '1px solid var(--color-border, #616161)',
        }}
      >
        ›
      </button>

      {/* 페이지 크기 선택 */}
      {pageSize !== undefined && onPageSizeChange && (
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          aria-label="페이지당 항목 수"
          className="ml-3 rounded text-sm px-2 h-8 cursor-pointer"
          style={{
            background: 'var(--color-bg-surface, #212121)',
            color: 'var(--color-text-secondary, #BDBDBD)',
            border: '1px solid var(--color-border, #616161)',
          }}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}개
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export { Pagination };
