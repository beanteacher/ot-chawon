import React from 'react';
import { cn } from '@/lib/utils/cn';

type SkeletonVariant = 'text' | 'circular' | 'rectangular';
type SkeletonAnimation = 'pulse' | 'wave' | 'none';

interface SkeletonProps {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  /** 너비 (CSS 값 또는 Tailwind 클래스로 제어 시 생략) */
  width?: string;
  /** 높이 (CSS 값 또는 Tailwind 클래스로 제어 시 생략) */
  height?: string;
  className?: string;
}

const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: 'animate-pulse',
  wave: 'animate-pulse', // wave는 별도 keyframe 없으므로 pulse로 대체
  none: '',
};

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'rounded',
  circular: 'rounded-full',
  rectangular: 'rounded-md',
};

const Skeleton = ({
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
  className,
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        'bg-oc-gray-200',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
};

export { Skeleton };
export type { SkeletonProps, SkeletonVariant, SkeletonAnimation };
