'use client';

import React from 'react';
import { useProgress } from '@react-three/drei';

export function ViewerLoading() {
  const { progress } = useProgress();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-oc-gray-50 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-oc-gray-100 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-oc-primary-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
          />
        </svg>
      </div>
      <p className="text-sm text-oc-primary font-medium">3D 모델 로딩 중...</p>
      <div className="w-48 h-1.5 bg-oc-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-oc-primary-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-oc-secondary">{Math.round(progress)}%</p>
    </div>
  );
}
