'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasThreeD?: boolean;
  onThreeDView?: () => void;
}

export function ProductGallery({ images, productName, hasThreeD = false, onThreeDView }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const allImages = images.length > 0 ? images : ['/placeholder-product.jpg'];

  return (
    <div className="flex flex-col gap-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square bg-oc-gray-100 rounded-xl overflow-hidden group">
        {imageError[activeIndex] ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-oc-gray-200 rounded-xl flex items-center justify-center">
              <svg className="w-12 h-12 text-oc-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={allImages[activeIndex]}
            alt={`${productName} - 이미지 ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImageError((prev) => ({ ...prev, [activeIndex]: true }))}
          />
        )}

        {/* 이전/다음 버튼 */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* 이미지 카운터 */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}

        {/* 3D 뷰어 버튼 */}
        {hasThreeD && (
          <button
            onClick={onThreeDView}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-oc-primary-500 text-white text-xs px-3 py-1.5 rounded-full font-medium hover:bg-oc-primary-600 transition-colors shadow-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            3D로 보기
          </button>
        )}
      </div>

      {/* 3D 뷰어 플레이스홀더 */}
      {hasThreeD && (
        <div
          className="relative aspect-square bg-gradient-to-br from-oc-gray-100 to-oc-gray-50 rounded-xl overflow-hidden border border-oc-gray-200 cursor-pointer group"
          onClick={onThreeDView}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-oc-primary-500/20 flex items-center justify-center group-hover:bg-oc-primary-500/30 transition-colors">
              <svg className="w-8 h-8 text-oc-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="text-sm text-oc-gray-600 font-medium">3D 뷰어</span>
            <span className="text-xs text-oc-gray-500">클릭하여 3D로 확인하기</span>
          </div>
        </div>
      )}

      {/* 썸네일 리스트 */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                activeIndex === idx
                  ? 'border-oc-primary-500 opacity-100'
                  : 'border-oc-gray-200 opacity-60 hover:opacity-80 hover:border-oc-gray-400'
              )}
            >
              {imageError[idx] ? (
                <div className="w-full h-full bg-oc-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-oc-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                  </svg>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={`썸네일 ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError((prev) => ({ ...prev, [idx]: true }))}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
