import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Skeleton } from './skeleton';

interface SkeletonListProps {
  /** 리스트 아이템 개수 */
  count?: number;
  /** 프로필 아바타 표시 여부 */
  showAvatar?: boolean;
  className?: string;
}

/** 단일 리스트 아이템 스켈레톤 */
const SkeletonListItem = ({
  showAvatar = true,
  className,
}: {
  showAvatar?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn('flex items-center gap-3 py-3', className)}
      aria-hidden="true"
    >
      {showAvatar && (
        <Skeleton variant="circular" className="h-10 w-10 flex-shrink-0" />
      )}
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-2/5" />
        <Skeleton variant="text" className="h-3 w-4/5" />
      </div>
      <Skeleton variant="rectangular" className="h-8 w-16 rounded-md" />
    </div>
  );
};

/** 프로필 스켈레톤 프리셋 */
const SkeletonProfile = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn('flex flex-col items-center gap-4 p-6', className)}
      aria-hidden="true"
    >
      {/* 프로필 아바타 */}
      <Skeleton variant="circular" className="h-24 w-24" />
      {/* 이름 */}
      <Skeleton variant="text" className="h-5 w-32" />
      {/* 소개글 */}
      <div className="w-full space-y-2">
        <Skeleton variant="text" className="h-3 w-full" />
        <Skeleton variant="text" className="h-3 w-5/6" />
        <Skeleton variant="text" className="h-3 w-4/6" />
      </div>
    </div>
  );
};

/** 여러 개의 리스트 아이템 스켈레톤 */
const SkeletonList = ({
  count = 5,
  showAvatar = true,
  className,
}: SkeletonListProps) => {
  return (
    <div
      className={cn('divide-y divide-oc-gray-100', className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonListItem key={i} showAvatar={showAvatar} />
      ))}
    </div>
  );
};

export { SkeletonList, SkeletonListItem, SkeletonProfile };
export type { SkeletonListProps };
