import React from 'react';
import { cn } from '@/lib/utils/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'primary' | 'white' | 'gray' | 'success' | 'error';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  /** 접근성을 위한 레이블 */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

const colorClasses: Record<SpinnerColor, string> = {
  primary: 'text-oc-accent',
  white: 'text-white',
  gray: 'text-oc-gray-400',
  success: 'text-oc-success',
  error: 'text-oc-error',
};

const Spinner = ({
  size = 'md',
  color = 'primary',
  className,
  label = '로딩 중...',
}: SpinnerProps) => {
  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], colorClasses[color], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

/** 화면 전체를 덮는 전역 로딩 스피너 */
const GlobalSpinner = ({ label = '로딩 중...' }: { label?: string }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-8 py-6 shadow-lg">
        <Spinner size="lg" color="primary" />
        <span className="text-sm text-oc-gray-600">{label}</span>
      </div>
    </div>
  );
};

export { Spinner, GlobalSpinner };
export type { SpinnerProps, SpinnerSize, SpinnerColor };
