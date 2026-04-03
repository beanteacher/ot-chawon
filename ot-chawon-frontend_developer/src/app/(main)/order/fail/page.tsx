'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { Suspense } from 'react';

const FAIL_REASON_MAP: Record<string, string> = {
  USER_CANCEL: '사용자가 결제를 취소했습니다.',
  INSUFFICIENT_BALANCE: '잔액이 부족합니다.',
  CARD_DECLINED: '카드 결제가 거절되었습니다.',
  TIMEOUT: '결제 시간이 초과되었습니다.',
  UNKNOWN: '알 수 없는 오류가 발생했습니다.',
};

function OrderFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code') ?? 'UNKNOWN';
  const errorMessage = FAIL_REASON_MAP[errorCode] ?? FAIL_REASON_MAP['UNKNOWN'];

  return (
    <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center text-center">
      {/* 실패 아이콘 */}
      <div className="w-20 h-20 rounded-full bg-oc-error/20 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-oc-error"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-oc-gray-900 mb-2">결제에 실패했습니다</h1>
      <p className="text-sm text-oc-gray-400 mb-8">
        결제 처리 중 문제가 발생했습니다. 다시 시도해 주세요.
      </p>

      {/* 실패 사유 카드 */}
      <div className="w-full rounded-lg border border-oc-error/30 bg-oc-error/10 p-5 mb-8 text-left">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-oc-error flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-oc-error mb-1">실패 사유</p>
            <p className="text-sm text-oc-gray-600">{errorMessage}</p>
            {errorCode !== 'UNKNOWN' && (
              <p className="text-xs text-oc-gray-500 mt-1">오류 코드: {errorCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* 도움말 */}
      <div className="w-full rounded-lg bg-oc-gray-100 p-4 mb-8 text-left">
        <p className="text-xs font-medium text-oc-gray-600 mb-2">문제가 계속 발생하나요?</p>
        <ul className="flex flex-col gap-1">
          {[
            '카드 정보가 올바른지 확인해 주세요',
            '다른 결제 수단으로 시도해 보세요',
            '카드사에 문의하거나 고객센터로 연락해 주세요',
          ].map((tip, i) => (
            <li key={i} className="text-xs text-oc-gray-400 flex items-start gap-1.5">
              <span className="text-oc-gray-600 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* 버튼 */}
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/order')}
        >
          다시 시도
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => router.push('/cart')}
        >
          장바구니로 돌아가기
        </Button>
      </div>
    </main>
  );
}

export default function OrderFailPage() {
  return (
    <Suspense fallback={
      <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center">
        <div className="animate-pulse">로딩 중...</div>
      </main>
    }>
      <OrderFailContent />
    </Suspense>
  );
}
