import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './skeleton';

interface SkeletonCardProps {
  /** 카드 개수 */
  count?: number;
  className?: string;
}

/** 상품 카드 스켈레톤 프리셋 — ProductCard(grid) 레이아웃과 동일 */
const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('rounded-xl bg-white overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* 이미지 영역 — 실제 카드와 동일한 3:4 비율 */}
      <Skeleton variant="rectangular" className="aspect-[3/4] w-full" />
      <div className="p-3 space-y-2">
        {/* 브랜드 */}
        <Skeleton variant="text" className="h-3 w-1/4 rounded-full" />
        {/* 상품명 */}
        <Skeleton variant="text" className="h-4 w-3/4 rounded-full" />
        {/* 가격 */}
        <Skeleton variant="text" className="h-5 w-1/3 rounded-full" />
      </div>
    </div>
  );
};

/** 여러 개의 상품 카드 스켈레톤 */
const SkeletonCardList = ({ count = 4, className }: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export { SkeletonCard, SkeletonCardList };
export type { SkeletonCardProps };
