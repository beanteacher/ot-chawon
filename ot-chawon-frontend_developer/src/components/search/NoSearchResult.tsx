'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

const POPULAR_KEYWORDS = ['봄 자켓', '와이드 팬츠', '크롭 티셔츠', '아디다스 운동화'];
const RECOMMENDED_CATEGORIES = ['상의', '하의', '아우터', '신발'];

interface NoSearchResultProps {
  keyword: string;
  onKeywordClick: (keyword: string) => void;
  className?: string;
}

const NoSearchResult = ({ keyword, onKeywordClick, className }: NoSearchResultProps) => {
  return (
    <div className={cn('flex flex-col items-center py-16 px-4', className)}>
      {/* 빈 상태 일러스트 */}
      <div className="w-20 h-20 rounded-full bg-[#212121] flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-[#616161]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </div>

      {/* 메시지 */}
      <h2 className="text-lg font-semibold text-[#F9F9F9] mb-2 text-center">
        {keyword ? (
          <>
            <span className="text-[#FF6B35]">'{keyword}'</span> 검색 결과가 없습니다
          </>
        ) : (
          '검색 결과가 없습니다'
        )}
      </h2>
      <p className="text-sm text-[#9E9E9E] mb-8 text-center">
        다른 검색어를 입력하거나 필터를 변경해 보세요
      </p>

      {/* 인기 검색어 */}
      <div className="w-full max-w-md mb-8">
        <h3 className="text-sm font-semibold text-[#BDBDBD] mb-3 text-center">인기 검색어</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => onKeywordClick(kw)}
              className={cn(
                'px-4 h-9 rounded-full border border-[#616161]',
                'text-sm text-[#BDBDBD] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors'
              )}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* 추천 카테고리 */}
      <div className="w-full max-w-md">
        <h3 className="text-sm font-semibold text-[#BDBDBD] mb-3 text-center">추천 카테고리</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {RECOMMENDED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onKeywordClick(cat)}
              className={cn(
                'px-4 h-9 rounded-full',
                'bg-[#212121] border border-[#333333]',
                'text-sm text-[#BDBDBD] hover:bg-[#333333] hover:text-[#F9F9F9] transition-colors'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { NoSearchResult };
export type { NoSearchResultProps };
