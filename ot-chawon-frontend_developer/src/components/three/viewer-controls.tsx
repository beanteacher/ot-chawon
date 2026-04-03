'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ViewerControlsProps {
  autoRotate: boolean;
  onAutoRotateToggle: () => void;
  onZoomReset: () => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
}

export function ViewerControls({
  autoRotate,
  onAutoRotateToggle,
  onZoomReset,
  onFullscreenToggle,
  isFullscreen,
}: ViewerControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-oc-gray-100/80 backdrop-blur-sm rounded-xl px-3 py-2">
      {/* 자동 회전 토글 */}
      <button
        onClick={onAutoRotateToggle}
        title={autoRotate ? '자동 회전 끄기' : '자동 회전 켜기'}
        className={cn(
          'p-1.5 rounded-lg transition-colors',
          autoRotate
            ? 'text-oc-primary-400 bg-oc-primary-500/20'
            : 'text-oc-secondary hover:text-oc-primary'
        )}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* 줌 리셋 */}
      <button
        onClick={onZoomReset}
        title="줌 리셋"
        className="p-1.5 rounded-lg text-oc-secondary hover:text-oc-primary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </button>

      {/* 전체화면 토글 */}
      <button
        onClick={onFullscreenToggle}
        title={isFullscreen ? '전체화면 종료' : '전체화면'}
        className="p-1.5 rounded-lg text-oc-secondary hover:text-oc-primary transition-colors"
      >
        {isFullscreen ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
            />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
