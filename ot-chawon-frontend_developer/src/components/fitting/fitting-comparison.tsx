'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FittingComparisonProps {
  renders: Record<string, string>;
}

const ANGLE_LABELS: Record<string, string> = {
  '0': '정면',
  '90': '측면',
  '180': '후면',
};

export function FittingComparison({ renders }: FittingComparisonProps) {
  const entries = Object.entries(renders).filter(([, url]) => url);
  const [selected, setSelected] = useState<string | null>(
    entries.length > 0 ? (entries[0]?.[0] ?? null) : null
  );

  if (entries.length === 0) {
    return null;
  }

  const selectedUrl = selected ? renders[selected] : null;

  return (
    <div className="bg-oc-gray-100 rounded-2xl p-6 space-y-4">
      <h2 className="text-lg font-bold text-oc-primary">다각도 렌더링</h2>

      {/* 메인 이미지 */}
      {selectedUrl && (
        <div className="relative aspect-square rounded-xl overflow-hidden bg-oc-gray-50">
          <Image
            src={selectedUrl}
            alt={`피팅 결과 ${selected ? ANGLE_LABELS[selected] ?? selected + '도' : ''}`}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* 썸네일 목록 */}
      <div className="flex gap-3">
        {entries.map(([angle, url]) => (
          <button
            key={angle}
            onClick={() => setSelected(angle)}
            className={`relative flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
              selected === angle
                ? 'border-[#FF6B35]'
                : 'border-oc-gray-200 hover:border-oc-gray-400'
            }`}
          >
            {url ? (
              <Image
                src={url}
                alt={`${ANGLE_LABELS[angle] ?? angle + '도'} 썸네일`}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-oc-gray-100 flex items-center justify-center">
                <span className="text-xs text-oc-gray-500">
                  {ANGLE_LABELS[angle] ?? angle + '°'}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 py-0.5">
              <p className="text-xs text-center text-white">
                {ANGLE_LABELS[angle] ?? angle + '°'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
