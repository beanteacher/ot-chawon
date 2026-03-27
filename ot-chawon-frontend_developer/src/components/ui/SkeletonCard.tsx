import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './Skeleton';

interface SkeletonCardProps {
  /** 카드 개수 */
  count?: number;
  className?: string;
}

/** 상품 카드 스켈레톤 프리셋 */
const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('rounded-xl border border-oc-gray-200 bg-white p-4 shadow-sm', className)}
      aria-hidden="true"
    >
      {/* 이미지 영역 */}
      <Skeleton variant="rectangular" className="h-48 w-full rounded-lg" />
      <div className="mt-3 space-y-2">
        {/* 브랜드 텍스트 */}
        <Skeleton variant="text" className="h-3 w-1/4" />
        {/* 상품명 */}
        <Skeleton variant="text" className="h-4 w-3/4" />
        {/* 가격 */}
        <Skeleton variant="text" className="h-5 w-1/3" />
      </div>
      {/* 버튼 영역 */}
      <Skeleton variant="rectangular" className="mt-4 h-9 w-full rounded-md" />
    </div>
  );
};

/** 여러 개의 상품 카드 스켈레톤 */
const SkeletonCardList = ({ count = 4, className }: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
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
