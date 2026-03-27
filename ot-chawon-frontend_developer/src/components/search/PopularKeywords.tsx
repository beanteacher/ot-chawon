'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

type Trend = 'up' | 'steady' | 'down';

interface PopularKeyword {
  rank: number;
  keyword: string;
  trend: Trend;
}

const POPULAR_KEYWORDS: PopularKeyword[] = [
  { rank: 1, keyword: '봄 자켓', trend: 'up' },
  { rank: 2, keyword: '와이드 팬츠', trend: 'up' },
  { rank: 3, keyword: '크롭 티셔츠', trend: 'steady' },
  { rank: 4, keyword: '아디다스 운동화', trend: 'down' },
  { rank: 5, keyword: '스트라이프 셔츠', trend: 'up' },
  { rank: 6, keyword: '데님 미니스커트', trend: 'steady' },
  { rank: 7, keyword: '후드 집업', trend: 'down' },
  { rank: 8, keyword: '슬링백 힐', trend: 'up' },
];

const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === 'up') {
    return (
      <svg className="w-3 h-3 text-[#FF6B35]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 4l8 16H4L12 4z" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg className="w-3 h-3 text-[#616161]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 20L4 4h16L12 20z" />
      </svg>
    );
  }
  return <span className="text-[#616161] text-xs leading-none">—</span>;
};

interface PopularKeywordsProps {
  onKeywordClick: (keyword: string) => void;
  className?: string;
}

const PopularKeywords = ({ onKeywordClick, className }: PopularKeywordsProps) => {
  return (
    <div className={cn('w-full', className)}>
      <h3 className="text-sm font-semibold text-[#F9F9F9] mb-3">인기 검색어</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {POPULAR_KEYWORDS.map(({ rank, keyword, trend }) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onKeywordClick(keyword)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-left',
              'hover:bg-[#333333] transition-colors group'
            )}
          >
            <span
              className={cn(
                'w-5 text-sm font-bold flex-shrink-0',
                rank <= 3 ? 'text-[#FF6B35]' : 'text-[#616161]'
              )}
            >
              {rank}
            </span>
            <span className="flex-1 text-sm text-[#BDBDBD] group-hover:text-[#F9F9F9] transition-colors truncate">
              {keyword}
            </span>
            <span className="flex-shrink-0 flex items-center">
              <TrendIcon trend={trend} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export { PopularKeywords };
export type { PopularKeywordsProps, PopularKeyword, Trend };
