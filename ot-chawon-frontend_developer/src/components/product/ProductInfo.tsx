'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui';
import { ProductDto } from '@/types/product.dto';

interface ProductInfoProps {
  product: ProductDto.Detail;
  onAddToCart?: (sizeLabel: string, colorValue: string, quantity: number) => void;
  onBuyNow?: (sizeLabel: string, colorValue: string, quantity: number) => void;
}

const COLORS = [
  { label: '블랙', value: 'black', hex: '#111111' },
  { label: '화이트', value: 'white', hex: '#FFFFFF' },
  { label: '그레이', value: 'gray', hex: '#9E9E9E' },
];

const TABS = ['상세설명', '사이즈 가이드', '리뷰'];

const DUMMY_DISCOUNT = 25;

export function ProductInfo({ product, onAddToCart, onBuyNow }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('상세설명');

  const discountedPrice = Math.round(product.price * (1 - DUMMY_DISCOUNT / 100));

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    onAddToCart?.(selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('사이즈를 선택해주세요.');
      return;
    }
    onBuyNow?.(selectedSize, selectedColor, quantity);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 브랜드 + 상품명 + 가격 */}
      <div>
        <p className="text-sm text-oc-primary-400 font-medium mb-1">{product.brandName}</p>
        <h1 className="text-xl font-bold text-white mb-3">{product.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white">{discountedPrice.toLocaleString()}원</span>
          <span className="text-base text-oc-gray-500 line-through">{product.price.toLocaleString()}원</span>
          <span className="text-base font-bold text-oc-primary-500">{DUMMY_DISCOUNT}%</span>
        </div>
      </div>

      {/* 색상 선택 */}
      <div>
        <p className="text-sm font-medium text-oc-gray-300 mb-2">
          색상{selectedColor && <span className="text-oc-primary-400 ml-2">{COLORS.find(c => c.value === selectedColor)?.label}</span>}
        </p>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <button
              key={color.value}
              title={color.label}
              onClick={() => setSelectedColor(color.value === selectedColor ? '' : color.value)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-all',
                color.value === 'white' ? 'border-oc-gray-600' : '',
                selectedColor === color.value
                  ? 'border-oc-primary-500 scale-110 ring-2 ring-oc-primary-500/30'
                  : 'border-oc-gray-700 hover:border-oc-gray-400'
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* 사이즈 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-oc-gray-300">사이즈</p>
          <button className="text-xs text-oc-gray-500 hover:text-oc-gray-300 transition-colors underline">
            사이즈 가이드
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((sizeOpt) => {
            const isOutOfStock = sizeOpt.stock === 0;
            const isSelected = selectedSize === sizeOpt.label;
            return (
              <button
                key={sizeOpt.label}
                disabled={isOutOfStock}
                onClick={() => setSelectedSize(isSelected ? '' : sizeOpt.label)}
                className={cn(
                  'min-w-[52px] h-10 px-3 text-sm border rounded-md transition-all font-medium',
                  isOutOfStock
                    ? 'border-oc-gray-800 text-oc-gray-700 cursor-not-allowed line-through'
                    : isSelected
                    ? 'border-oc-primary-500 bg-oc-primary-500/20 text-oc-primary-400'
                    : 'border-oc-gray-700 text-oc-gray-300 hover:border-oc-gray-400 hover:text-white'
                )}
              >
                {sizeOpt.label}
                {isOutOfStock && <span className="block text-2xs text-oc-gray-700">품절</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 수량 */}
      <div>
        <p className="text-sm font-medium text-oc-gray-300 mb-2">수량</p>
        <div className="flex items-center border border-oc-gray-700 rounded-md w-fit">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-oc-gray-300 hover:text-white hover:bg-oc-gray-800 transition-colors rounded-l-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm font-medium text-white">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-oc-gray-300 hover:text-white hover:bg-oc-gray-800 transition-colors rounded-r-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* 총 금액 */}
      <div className="flex items-center justify-between py-3 border-t border-oc-gray-800">
        <span className="text-sm text-oc-gray-400">총 상품금액</span>
        <span className="text-xl font-bold text-white">
          {(discountedPrice * quantity).toLocaleString()}원
        </span>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          fullWidth
          onClick={handleAddToCart}
          className="border-oc-gray-600 text-oc-gray-200 bg-oc-gray-800 hover:bg-oc-gray-700"
        >
          장바구니
        </Button>
        <Button variant="primary" fullWidth onClick={handleBuyNow}>
          바로구매
        </Button>
      </div>

      {/* 탭 */}
      <div className="mt-4">
        <div className="flex border-b border-oc-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'border-oc-primary-500 text-oc-primary-400'
                  : 'border-transparent text-oc-gray-500 hover:text-oc-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-4">
          {activeTab === '상세설명' && (
            <div className="text-sm text-oc-gray-400 leading-relaxed whitespace-pre-line">
              {product.description || '상품 상세설명이 없습니다.'}
            </div>
          )}
          {activeTab === '사이즈 가이드' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-oc-gray-400">
                <thead>
                  <tr className="border-b border-oc-gray-800">
                    <th className="py-2 text-left text-oc-gray-300">사이즈</th>
                    <th className="py-2 text-center text-oc-gray-300">총장</th>
                    <th className="py-2 text-center text-oc-gray-300">가슴단면</th>
                    <th className="py-2 text-center text-oc-gray-300">어깨너비</th>
                    <th className="py-2 text-center text-oc-gray-300">소매길이</th>
                  </tr>
                </thead>
                <tbody>
                  {['S', 'M', 'L', 'XL'].map((s, i) => (
                    <tr key={s} className="border-b border-oc-gray-800/50">
                      <td className="py-2 font-medium text-white">{s}</td>
                      <td className="py-2 text-center">{65 + i * 2}</td>
                      <td className="py-2 text-center">{48 + i * 2}</td>
                      <td className="py-2 text-center">{44 + i * 2}</td>
                      <td className="py-2 text-center">{60 + i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-oc-gray-600">(단위: cm, 측정 방법에 따라 1~3cm 오차 발생)</p>
            </div>
          )}
          {activeTab === '리뷰' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-3 border-b border-oc-gray-800">
                <div className="text-3xl font-bold text-white">4.8</div>
                <div>
                  <div className="flex text-oc-primary-400 text-lg">★★★★★</div>
                  <p className="text-xs text-oc-gray-500 mt-1">총 128개 리뷰</p>
                </div>
              </div>
              {[
                { user: '홍**', rating: 5, text: '핏이 너무 좋아요. 사이즈도 딱 맞게 왔고 퀄리티 최고입니다!', size: 'M', date: '2025.03.20' },
                { user: '김**', rating: 4, text: '색상이 사진이랑 거의 동일해요. 배송도 빠르고 만족합니다.', size: 'L', date: '2025.03.18' },
                { user: '이**', rating: 5, text: '재구매 의사 있어요. 소재가 부드럽고 착용감 좋습니다.', size: 'S', date: '2025.03.15' },
              ].map((review, idx) => (
                <div key={idx} className="py-3 border-b border-oc-gray-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{review.user}</span>
                      <span className="text-xs text-oc-gray-600">사이즈: {review.size}</span>
                    </div>
                    <span className="text-xs text-oc-gray-600">{review.date}</span>
                  </div>
                  <div className="flex text-oc-primary-400 text-sm mb-1">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="text-sm text-oc-gray-400">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
