'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js 14 글로벌 에러 페이지
 * 반드시 'use client' 지시자 필요
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // 에러 로깅 (추후 Sentry 등 연동 가능)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-oc-gray-50 px-4 text-center">
      <div className="space-y-2">
        <p className="text-8xl font-bold text-oc-error">500</p>
        <h1 className="text-2xl font-semibold text-oc-gray-900">
          서버 오류가 발생했습니다
        </h1>
        <p className="text-sm text-oc-gray-500">
          일시적인 오류입니다. 잠시 후 다시 시도해 주세요.
        </p>
        {error.digest && (
          <p className="text-xs text-oc-gray-400">오류 코드: {error.digest}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-md bg-oc-accent px-5 text-sm font-medium text-white transition-colors hover:bg-oc-primary-600 active:bg-oc-primary-700"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md border border-oc-gray-300 bg-white px-5 text-sm font-medium text-oc-gray-800 transition-colors hover:bg-oc-gray-50 active:bg-oc-gray-100"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
