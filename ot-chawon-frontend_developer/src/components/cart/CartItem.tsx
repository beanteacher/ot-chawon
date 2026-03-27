'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Checkbox } from '@/components/ui';

export interface CartItemData {
  cartItemId: string;
  productId: number;
  productName: string;
  brandName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface CartItemProps {
  item: CartItemData;
  selected: boolean;
  onSelect: (cartItemId: string, checked: boolean) => void;
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  selected,
  onSelect,
  onQuantityChange,
  onRemove,
}) => {
  const totalPrice = item.price * item.quantity;

  return (
    <div
      className={cn(
        'flex gap-3 p-4 rounded-lg border transition-colors',
        'border-oc-gray-700 bg-oc-gray-900',
        selected && 'border-oc-primary-500'
      )}
    >
      {/* 체크박스 */}
      <div className="flex items-start pt-1">
        <Checkbox
          checked={selected}
          onChange={(e) => onSelect(item.cartItemId, e.target.checked)}
          aria-label={`${item.productName} 선택`}
        />
      </div>

      {/* 상품 이미지 */}
      <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-oc-gray-800">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-oc-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-oc-gray-400 mb-0.5">{item.brandName}</p>
        <p className="text-sm font-medium text-white truncate">{item.productName}</p>
        <p className="text-xs text-oc-gray-400 mt-1">
          사이즈: {item.size} / 색상: {item.color}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* 수량 조절 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onQuantityChange(item.cartItemId, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              className={cn(
                'w-7 h-7 rounded-md border border-oc-gray-600 flex items-center justify-center',
                'text-oc-gray-300 hover:bg-oc-gray-700 transition-colors',
                'disabled:opacity-40 disabled:cursor-not-allowed'
              )}
              aria-label="수량 감소"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-6 text-center text-sm text-white font-medium">{item.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(item.cartItemId, item.quantity + 1)}
              className={cn(
                'w-7 h-7 rounded-md border border-oc-gray-600 flex items-center justify-center',
                'text-oc-gray-300 hover:bg-oc-gray-700 transition-colors'
              )}
              aria-label="수량 증가"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* 가격 */}
          <div className="text-right">
            <p className="text-sm font-semibold text-oc-primary-500">
              {totalPrice.toLocaleString()}원
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-oc-gray-500">
                {item.price.toLocaleString()}원 x {item.quantity}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 버튼 */}
      <button
        type="button"
        onClick={() => onRemove(item.cartItemId)}
        className="flex-shrink-0 self-start p-1 text-oc-gray-500 hover:text-oc-error transition-colors"
        aria-label={`${item.productName} 삭제`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
