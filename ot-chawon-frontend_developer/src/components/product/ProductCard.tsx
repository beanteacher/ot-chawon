'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate?: number;
  imageUrl?: string;
  isLiked?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  onLikeToggle?: (id: string, liked: boolean) => void;
}

const ProductCard = ({ product, className, onLikeToggle }: ProductCardProps) => {
  const [liked, setLiked] = useState(product.isLiked ?? false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    onLikeToggle?.(product.id, next);
  };

  const formattedPrice = product.price.toLocaleString('ko-KR');
  const formattedOriginal = product.originalPrice?.toLocaleString('ko-KR');

  return (
    <div
      className={cn(
        'group relative flex flex-col bg-oc-gray-900 rounded-xl overflow-hidden cursor-pointer',
        'transition-transform duration-200 hover:-translate-y-1',
        className
      )}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-oc-gray-800">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-oc-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* 할인율 뱃지 */}
        {product.discountRate && product.discountRate > 0 && (
          <div className="absolute top-2 left-2 bg-oc-primary-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {product.discountRate}%
          </div>
        )}

        {/* 좋아요 버튼 */}
        <button
          onClick={handleLike}
          aria-label={liked ? '좋아요 취소' : '좋아요'}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full',
            'bg-black/40 backdrop-blur-sm transition-colors',
            'hover:bg-black/60'
          )}
        >
          <svg
            className={cn('w-4 h-4 transition-colors', liked ? 'text-oc-primary-500' : 'text-white')}
            fill={liked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      {/* 상품 정보 */}
      <div className="p-3 flex flex-col gap-1">
        <span className="text-xs text-oc-gray-500 font-medium uppercase tracking-wide">
          {product.brand}
        </span>
        <p className="text-sm text-white font-medium line-clamp-2 leading-snug">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-bold text-white">{formattedPrice}원</span>
          {formattedOriginal && (
            <span className="text-xs text-oc-gray-500 line-through">{formattedOriginal}원</span>
          )}
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
export type { Product, ProductCardProps };
