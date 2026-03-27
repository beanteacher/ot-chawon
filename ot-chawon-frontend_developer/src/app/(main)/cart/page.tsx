'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Checkbox } from '@/components/ui';
import { CartItem, CartItemData } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';

const DUMMY_CART_ITEMS: CartItemData[] = [
  {
    cartItemId: 'cart-1',
    productId: 1,
    productName: '오버사이즈 코튼 티셔츠',
    brandName: 'STUDIO OT',
    size: 'M',
    color: '화이트',
    quantity: 2,
    price: 39000,
  },
  {
    cartItemId: 'cart-2',
    productId: 2,
    productName: '와이드 데님 팬츠',
    brandName: 'DENIM CO.',
    size: '32',
    color: '인디고 블루',
    quantity: 1,
    price: 89000,
  },
  {
    cartItemId: 'cart-3',
    productId: 3,
    productName: '울 블렌드 크루넥 니트',
    brandName: 'WARM STUDIO',
    size: 'L',
    color: '베이지',
    quantity: 1,
    price: 128000,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>(DUMMY_CART_ITEMS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(DUMMY_CART_ITEMS.map((i) => i.cartItemId))
  );

  const allSelected = items.length > 0 && selectedIds.size === items.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((i) => i.cartItemId)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectItem = (cartItemId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(cartItemId);
      else next.delete(cartItemId);
      return next;
    });
  };

  const handleQuantityChange = (cartItemId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(cartItemId);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.cartItemId)));
    setSelectedIds(new Set());
  };

  const selectedItems = items.filter((item) => selectedIds.has(item.cartItemId));
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = subtotal >= 50000 ? 0 : 3000;

  const handleOrder = () => {
    router.push('/order');
  };

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
                onClick={handleRemoveSelected}
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
                onSelect={handleSelectItem}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
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
            {(subtotal - 0 + shippingFee).toLocaleString()}원
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
