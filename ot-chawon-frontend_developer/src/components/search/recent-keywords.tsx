'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

const STORAGE_KEY = 'ot-chawon-recent-keywords';
const MAX_KEYWORDS = 10;

interface RecentKeywordsProps {
  onKeywordClick: (keyword: string) => void;
  className?: string;
}

const RecentKeywords = ({ onKeywordClick, className }: RecentKeywordsProps) => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setKeywords(JSON.parse(stored) as string[]);
    } catch {
      // localStorage 접근 불가 시 무시
    }
  }, []);

  const saveKeywords = (next: string[]) => {
    setKeywords(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // 무시
    }
  };

  const removeKeyword = (keyword: string) => {
    saveKeywords(keywords.filter((k) => k !== keyword));
  };

  const clearAll = () => {
    saveKeywords([]);
  };

  if (keywords.length === 0) return null;

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-oc-gray-900">최근 검색어</h3>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-[#9E9E9E] hover:text-oc-gray-500 transition-colors"
        >
          전체 삭제
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className={cn(
              'inline-flex items-center gap-1.5 pl-3 pr-2 h-8 rounded-full',
              'bg-oc-gray-100 border border-oc-gray-300'
            )}
          >
            <button
              type="button"
              onClick={() => onKeywordClick(keyword)}
              className="text-sm text-oc-gray-500 hover:text-oc-gray-900 transition-colors"
            >
              {keyword}
            </button>
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="flex items-center justify-center w-4 h-4 rounded-full hover:bg-oc-gray-300 transition-colors"
              aria-label={`${keyword} 삭제`}
            >
              <svg className="w-2.5 h-2.5 text-[#9E9E9E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

/** 외부에서 최근 검색어를 저장할 때 사용하는 유틸 */
function addRecentKeyword(keyword: string): void {
  if (!keyword.trim()) return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: string[] = stored ? (JSON.parse(stored) as string[]) : [];
    const next = [keyword, ...existing.filter((k) => k !== keyword)].slice(0, MAX_KEYWORDS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 무시
  }
}

export { RecentKeywords, addRecentKeyword };
export type { RecentKeywordsProps };
