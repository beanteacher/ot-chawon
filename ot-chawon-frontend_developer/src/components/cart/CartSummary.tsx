'use client';

import React from 'react';
import { Button } from '@/components/ui';

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  discountAmount?: number;
  shippingFee?: number;
  onOrder: () => void;
  disabled?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  itemCount,
  subtotal,
  discountAmount = 0,
  shippingFee = 0,
  onOrder,
  disabled = false,
}) => {
  const total = subtotal - discountAmount + shippingFee;

  return (
    <div className="rounded-lg border border-oc-gray-700 bg-oc-gray-900 p-5">
      <h2 className="text-base font-semibold text-white mb-4">주문 요약</h2>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-oc-gray-300">
          <span>상품 금액 ({itemCount}개)</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-oc-primary-500">
            <span>할인 금액</span>
            <span>-{discountAmount.toLocaleString()}원</span>
          </div>
        )}

        <div className="flex justify-between text-oc-gray-300">
          <span>배송비</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-oc-primary-500">무료</span>
            ) : (
              `${shippingFee.toLocaleString()}원`
            )}
          </span>
        </div>

        <div className="border-t border-oc-gray-700 pt-3 flex justify-between font-semibold text-base">
          <span className="text-white">총 결제 금액</span>
          <span className="text-oc-primary-500">{total.toLocaleString()}원</span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="mt-5"
        onClick={onOrder}
        disabled={disabled}
      >
        주문하기 ({itemCount}개)
      </Button>

      {subtotal >= 50000 ? (
        <p className="mt-2 text-center text-xs text-oc-primary-500">
          무료 배송 조건 달성
        </p>
      ) : (
        <p className="mt-2 text-center text-xs text-oc-gray-500">
          {(50000 - subtotal).toLocaleString()}원 더 담으면 무료 배송
        </p>
      )}
    </div>
  );
};
