'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox, SkeletonCard } from '@/components/ui';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { ErrorFallback } from '@/components/error/error-fallback';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    isLoading,
    isError,
    refetch,
    selectedIds,
    allSelected,
    someSelected,
    handleSelectAll,
    toggleSelect,
    subtotal,
    selectedCount,
    updateQuantity,
    removeItem,
    removeSelectedItems,
  } = useCart();

  const shippingFee = subtotal >= 50000 ? 0 : 3000;

  const handleOrder = () => {
    router.push(`/order?items=${Array.from(selectedIds).join(',')}`);
  };

  if (isLoading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">장바구니</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="lg:w-80 lg:flex-shrink-0">
            <SkeletonCard />
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">장바구니</h1>
        <ErrorFallback
          variant="generic"
          title="장바구니를 불러올 수 없습니다"
          description="잠시 후 다시 시도해 주세요."
          onReset={() => refetch()}
        />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">장바구니</h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-oc-gray-800 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-oc-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-oc-gray-300 mb-2">장바구니가 비어있습니다</p>
          <p className="text-sm text-oc-gray-500 mb-8">마음에 드는 상품을 장바구니에 담아보세요</p>
          <Button variant="primary" size="lg" onClick={() => router.push('/products')}>
            쇼핑 계속하기
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        장바구니
        <span className="ml-2 text-base font-normal text-oc-gray-400">({items.length})</span>
      </h1>

      {/* 데스크탑: 좌우 분할 / 모바일: 세로 스택 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 왼쪽: 아이템 목록 */}
        <div className="flex-1 min-w-0">
          {/* 전체 선택 바 */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-oc-gray-900 border border-oc-gray-700 mb-3">
            <Checkbox
              label={`전체 선택 (${selectedIds.size}/${items.length})`}
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={removeSelectedItems}
                className="text-sm text-oc-gray-400 hover:text-oc-error transition-colors"
              >
                선택 삭제
              </button>
            )}
          </div>

          {/* 아이템 목록 */}
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                selected={selectedIds.has(item.cartItemId)}
                onSelect={(cartItemId, checked) => {
                  if (checked !== selectedIds.has(cartItemId)) {
                    toggleSelect(cartItemId);
                  }
                }}
                onQuantityChange={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 주문 요약 사이드바 (데스크탑) */}
        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-4">
            <CartSummary
              itemCount={selectedCount}
              subtotal={subtotal}
              shippingFee={shippingFee}
              onOrder={handleOrder}
              disabled={selectedIds.size === 0}
            />
          </div>
        </div>
      </div>

      {/* 모바일 고정 하단 바 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-oc-gray-950 border-t border-oc-gray-700 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-oc-gray-400">총 결제 금액</span>
          <span className="text-base font-bold text-oc-primary-500">
            {(subtotal + shippingFee).toLocaleString()}원
          </span>
        </div>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleOrder}
          disabled={selectedIds.size === 0}
        >
          주문하기 ({selectedCount}개)
        </Button>
      </div>

      {/* 모바일 하단 바 여백 */}
      <div className="lg:hidden h-32" />
    </main>
  );
}
