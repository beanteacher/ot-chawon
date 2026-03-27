'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

interface SizeFit {
  size: Size;
  fitScore: number;
  measurements: {
    shoulder: number;
    chest: number;
    waist: number;
    hip: number;
  };
}

interface BodyPart {
  label: string;
  key: keyof SizeFit['measurements'];
  userValue: number;
  unit: string;
}

const DUMMY_SIZES: SizeFit[] = [
  {
    size: 'S',
    fitScore: 62,
    measurements: { shoulder: 43, chest: 86, waist: 70, hip: 90 },
  },
  {
    size: 'M',
    fitScore: 94,
    measurements: { shoulder: 45, chest: 90, waist: 74, hip: 94 },
  },
  {
    size: 'L',
    fitScore: 78,
    measurements: { shoulder: 47, chest: 94, waist: 78, hip: 98 },
  },
  {
    size: 'XL',
    fitScore: 45,
    measurements: { shoulder: 49, chest: 98, waist: 82, hip: 102 },
  },
];

const BODY_PARTS: BodyPart[] = [
  { label: '어깨', key: 'shoulder', userValue: 45, unit: 'cm' },
  { label: '가슴', key: 'chest', userValue: 90, unit: 'cm' },
  { label: '허리', key: 'waist', userValue: 75, unit: 'cm' },
  { label: '엉덩이', key: 'hip', userValue: 95, unit: 'cm' },
];

interface SizeRecommendationProps {
  onAddToCart?: ((size: Size) => void) | undefined;
}

export function SizeRecommendation({ onAddToCart }: SizeRecommendationProps) {
  const [selectedSize, setSelectedSize] = useState<Size>('M');

  const selectedSizeData = (DUMMY_SIZES.find((s) => s.size === selectedSize) ?? DUMMY_SIZES[1] ?? DUMMY_SIZES[0])!
  const recommendedSize = DUMMY_SIZES.reduce((a, b) => (a.fitScore > b.fitScore ? a : b));

  return (
    <div className="space-y-6">
      {/* 사이즈 선택 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-oc-gray-300">사이즈 선택</h3>
          <span className="text-xs text-oc-primary-400">
            AI 추천: {recommendedSize.size}
          </span>
        </div>
        <div className="flex gap-2">
          {DUMMY_SIZES.map(({ size, fitScore }) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedSize === size
                  ? 'bg-oc-primary-500 text-white'
                  : 'bg-oc-gray-800 text-oc-gray-300 hover:bg-oc-gray-700'
              }`}
            >
              {size}
              {size === recommendedSize.size && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px] bg-oc-primary-500 text-white px-1 rounded">
                  추천
                </span>
              )}
              <div className={`text-xs mt-0.5 ${selectedSize === size ? 'text-white/70' : 'text-oc-gray-500'}`}>
                {fitScore}%
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 부위별 핏 비교 */}
      <div>
        <h3 className="text-sm font-semibold text-oc-gray-300 mb-3">부위별 핏 비교</h3>
        <div className="space-y-3">
          {BODY_PARTS.map(({ label, key, userValue, unit }) => {
            const sizeValue = selectedSizeData.measurements[key];
            const diff = sizeValue - userValue;
            const diffAbs = Math.abs(diff);
            const fitPercent = Math.max(0, 100 - diffAbs * 5);

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-oc-gray-400">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-oc-gray-500">
                      내 치수: {userValue}{unit}
                    </span>
                    <span className={`font-medium ${diff > 0 ? 'text-blue-400' : diff < 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {diff > 0 ? `+${diff}` : diff}{unit}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-oc-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      fitPercent > 80
                        ? 'bg-green-500'
                        : fitPercent > 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${fitPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 핏 설명 */}
      <div className="bg-oc-gray-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-oc-primary-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-oc-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-oc-gray-300 font-medium mb-1">
              {selectedSize} 사이즈 핏 분석
            </p>
            <p className="text-xs text-oc-gray-500 leading-relaxed">
              {selectedSize === recommendedSize.size
                ? '이 사이즈가 가장 잘 맞습니다. 어깨와 가슴 부위에서 편안한 여유가 있으며 전체적으로 슬림한 실루엣을 연출합니다.'
                : `추천 사이즈(${recommendedSize.size})보다 ${selectedSize < recommendedSize.size ? '작은' : '큰'} 사이즈입니다. 핏이 ${selectedSize < recommendedSize.size ? '타이트할' : '여유로울'} 수 있습니다.`}
            </p>
          </div>
        </div>
      </div>

      {/* 장바구니 담기 버튼 */}
      <Button
        onClick={() => onAddToCart?.(selectedSize)}
        className="w-full py-4 text-base font-semibold bg-oc-primary-500 hover:bg-oc-primary-600 text-white rounded-xl"
      >
        {selectedSize} 사이즈로 장바구니 담기
      </Button>
    </div>
  );
}
