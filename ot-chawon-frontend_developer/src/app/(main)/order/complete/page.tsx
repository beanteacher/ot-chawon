'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { useOrderDetail } from '@/hooks/useOrder';

function OrderCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? undefined;

  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center">
        <div className="animate-pulse text-oc-gray-400">주문 정보를 불러오는 중...</div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center text-center">
        <p className="text-oc-gray-400 mb-4">주문 정보를 불러올 수 없습니다.</p>
        <Button variant="primary" size="lg" onClick={() => router.push('/my/orders')}>
          주문 내역 보기
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center text-center">
      {/* 성공 아이콘 */}
      <div className="w-20 h-20 rounded-full bg-oc-primary-500/20 flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-oc-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-oc-gray-900 mb-2">결제가 완료되었습니다</h1>
      <p className="text-sm text-oc-gray-400 mb-8">
        주문해 주셔서 감사합니다. 배송 준비를 시작하겠습니다.
      </p>

      {/* 주문 정보 카드 */}
      <div className="w-full rounded-lg border border-oc-gray-200 bg-white p-6 mb-8 text-left">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-oc-gray-400">주문 번호</span>
            <span className="text-sm font-mono font-medium text-oc-gray-900">{order.orderId}</span>
          </div>
          <div className="border-t border-oc-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-oc-gray-400">결제 금액</span>
            <span className="text-base font-bold text-oc-primary-500">
              {order.totalPrice.toLocaleString()}원
            </span>
          </div>
          <div className="border-t border-oc-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm text-oc-gray-400">주문 상태</span>
            <span className="text-sm font-medium text-oc-gray-900">{order.status}</span>
          </div>
          {order.trackingNumber && (
            <>
              <div className="border-t border-oc-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-oc-gray-400">운송장 번호</span>
                <span className="text-sm font-mono font-medium text-oc-gray-900">{order.trackingNumber}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 배송 안내 */}
      <div className="w-full rounded-lg bg-oc-gray-100 p-4 mb-8 text-left">
        <p className="text-xs text-oc-gray-400 flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5 text-oc-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          배송 상태는 마이페이지 &gt; 주문 내역에서 실시간으로 확인하실 수 있습니다.
        </p>
      </div>

      {/* 버튼 */}
      <div className="w-full flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => router.push('/my/orders')}
        >
          주문 내역 보기
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => router.push('/products')}
        >
          쇼핑 계속하기
        </Button>
      </div>
    </main>
  );
}

export default function OrderCompletePage() {
  return (
    <Suspense fallback={
      <main className="max-w-screen-sm mx-auto px-4 py-16 flex flex-col items-center">
        <div className="animate-pulse text-oc-gray-400">로딩 중...</div>
      </main>
    }>
      <OrderCompleteContent />
    </Suspense>
  );
}
