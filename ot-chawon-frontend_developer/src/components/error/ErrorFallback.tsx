import React from 'react';
import { cn } from '@/lib/utils/cn';

type ErrorFallbackVariant = '404' | '500' | '403' | 'generic';

interface ErrorFallbackProps {
  /** 에러 유형 */
  variant?: ErrorFallbackVariant;
  /** 커스텀 제목 */
  title?: string;
  /** 커스텀 설명 */
  description?: string;
  /** 재시도 핸들러 (없으면 재시도 버튼 미표시) */
  onReset?: () => void;
  /** 뒤로 가기 핸들러 (없으면 미표시) */
  onGoBack?: () => void;
  /** 홈으로 이동 URL (없으면 미표시) */
  homeHref?: string;
  className?: string;
}

const variantConfig: Record<
  ErrorFallbackVariant,
  { code: string; title: string; description: string; codeColor: string }
> = {
  '404': {
    code: '404',
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 이동되었습니다.',
    codeColor: 'text-oc-accent',
  },
  '500': {
    code: '500',
    title: '서버 오류가 발생했습니다',
    description: '일시적인 오류입니다. 잠시 후 다시 시도해 주세요.',
    codeColor: 'text-oc-error',
  },
  '403': {
    code: '403',
    title: '접근 권한이 없습니다',
    description: '이 페이지에 접근할 권한이 없습니다.',
    codeColor: 'text-oc-warning',
  },
  generic: {
    code: '!',
    title: '오류가 발생했습니다',
    description: '예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    codeColor: 'text-oc-error',
  },
};

/** 재사용 가능한 에러 UI 컴포넌트 */
const ErrorFallback = ({
  variant = 'generic',
  title,
  description,
  onReset,
  onGoBack,
  homeHref = '/',
  className,
}: ErrorFallbackProps) => {
  const config = variantConfig[variant];
  const displayTitle = title ?? config.title;
  const displayDescription = description ?? config.description;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 px-4 py-16 text-center',
        className
      )}
    >
      <div className="space-y-2">
        <p className={cn('text-7xl font-bold', config.codeColor)}>{config.code}</p>
        <h2 className="text-xl font-semibold text-oc-gray-900">{displayTitle}</h2>
        <p className="text-sm text-oc-gray-500">{displayDescription}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center rounded-md bg-oc-accent px-5 text-sm font-medium text-white transition-colors hover:bg-oc-primary-600 active:bg-oc-primary-700"
          >
            다시 시도
          </button>
        )}
        {onGoBack && (
          <button
            onClick={onGoBack}
            className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-300 bg-white px-5 text-sm font-medium text-oc-gray-800 transition-colors hover:bg-oc-gray-50 active:bg-oc-gray-100"
          >
            뒤로 가기
          </button>
        )}
        {homeHref && (
          <a
            href={homeHref}
            className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-300 bg-white px-5 text-sm font-medium text-oc-gray-800 transition-colors hover:bg-oc-gray-50 active:bg-oc-gray-100"
          >
            홈으로
          </a>
        )}
      </div>
    </div>
  );
};

export { ErrorFallback };
export type { ErrorFallbackProps, ErrorFallbackVariant };
