'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyState?: EmptyStateProps;
  className?: string;
  rowKeyExtractor?: (row: T, index: number) => string | number;
}

type SortDirection = 'asc' | 'desc' | 'none';

interface SortState {
  key: string;
  direction: SortDirection;
}

const SortIcon = ({ direction }: { direction: SortDirection }) => {
  if (direction === 'asc') {
    return <span style={{ color: 'var(--color-brand-orange, #FF6B35)' }} aria-hidden="true">▲</span>;
  }
  if (direction === 'desc') {
    return <span style={{ color: 'var(--color-brand-orange, #FF6B35)' }} aria-hidden="true">▼</span>;
  }
  return <span className="opacity-40" aria-hidden="true">▲▼</span>;
};

const EmptyStateView = ({ icon, message, action }: EmptyStateProps) => (
  <tr>
    <td colSpan={999}>
      <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: 'var(--color-text-secondary, #BDBDBD)' }}>
        {icon && <div className="text-4xl">{icon}</div>}
        <p className="text-sm">{message}</p>
        {action && <div>{action}</div>}
      </div>
    </td>
  </tr>
);

function Table<T extends object>({
  columns,
  data,
  emptyState,
  className,
  rowKeyExtractor,
}: TableProps<T>) {
  const [sort, setSort] = useState<SortState>({ key: '', direction: 'none' });

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable) return;
    const colKey = String(col.key);
    setSort((prev) => {
      if (prev.key !== colKey) {
        return { key: colKey, direction: 'asc' };
      }
      const next: SortDirection =
        prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? 'none' : 'asc';
      return { key: colKey, direction: next };
    });
  };

  const sortedData = React.useMemo(() => {
    if (sort.direction === 'none' || !sort.key) return data;
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sort.key];
      const bVal = (b as Record<string, unknown>)[sort.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sort]);

  const getCellValue = (row: T, col: Column<T>): unknown => {
    const key = String(col.key);
    return (row as Record<string, unknown>)[key];
  };

  return (
    <div
      className={cn('w-full overflow-x-auto rounded-lg', className)}
      style={{ background: 'var(--color-bg-base, #111111)' }}
    >
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr style={{ background: 'var(--color-bg-surface, #212121)', borderBottom: '1px solid var(--color-border, #616161)' }}>
            {columns.map((col) => {
              const colKey = String(col.key);
              const isSorted = sort.key === colKey && sort.direction !== 'none';
              return (
                <th
                  key={colKey}
                  onClick={() => handleHeaderClick(col)}
                  className={cn(
                    'px-4 py-3 text-left font-medium select-none',
                    col.sortable && 'cursor-pointer hover:opacity-80',
                    col.className
                  )}
                  style={{ color: isSorted ? 'var(--color-brand-orange, #FF6B35)' : 'var(--color-text-secondary, #BDBDBD)' }}
                  aria-sort={
                    col.sortable
                      ? sort.key === colKey && sort.direction !== 'none'
                        ? sort.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <SortIcon
                        direction={sort.key === colKey ? sort.direction : 'none'}
                      />
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            emptyState ? (
              <EmptyStateView {...emptyState} />
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div
                    className="py-16 text-center text-sm"
                    style={{ color: 'var(--color-text-secondary, #BDBDBD)' }}
                  >
                    데이터가 없습니다.
                  </div>
                </td>
              </tr>
            )
          ) : (
            sortedData.map((row, rowIdx) => {
              const rowKey = rowKeyExtractor ? rowKeyExtractor(row, rowIdx) : rowIdx;
              return (
                <tr
                  key={rowKey}
                  className="transition-colors"
                  style={{
                    borderBottom: '1px solid var(--color-border, #616161)',
                    color: 'var(--color-text-primary, #F9F9F9)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background =
                      'var(--color-bg-elevated, #333333)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = '';
                  }}
                >
                  {columns.map((col) => {
                    const colKey = String(col.key);
                    const rawValue = getCellValue(row, col);
                    return (
                      <td
                        key={colKey}
                        className={cn('px-4 py-3', col.className)}
                        style={{ background: 'var(--color-bg-surface, #212121)' }}
                      >
                        {col.render ? col.render(rawValue, row) : String(rawValue ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
export type { TableProps };
