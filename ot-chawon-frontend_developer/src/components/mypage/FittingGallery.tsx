'use client';

import React, { useState, useEffect } from 'react';
import type { FittingDto } from '@/types/fitting.dto';

interface FittingHistoryItem {
  sessionId: string;
  status: FittingDto.FittingStatus;
  productName: string;
  productImageUrl: string;
  resultThumbnailUrl: string | null;
  fittedAt: string;
}

// Mock 데이터 (실제 API 연동 전)
const MOCK_FITTINGS: FittingHistoryItem[] = [
  {
    sessionId: 'session-001',
    status: 'COMPLETED',
    productName: '오버사이즈 코튼 티셔츠',
    productImageUrl: '',
    resultThumbnailUrl: '',
    fittedAt: '2024-03-20T11:00:00Z',
  },
  {
    sessionId: 'session-002',
    status: 'COMPLETED',
    productName: '울 블렌드 오버핏 코트',
    productImageUrl: '',
    resultThumbnailUrl: '',
    fittedAt: '2024-03-15T14:30:00Z',
  },
  {
    sessionId: 'session-003',
    status: 'COMPLETED',
    productName: '리사이클 나일론 백팩',
    productImageUrl: '',
    resultThumbnailUrl: '',
    fittedAt: '2024-03-10T09:45:00Z',
  },
  {
    sessionId: 'session-004',
    status: 'FAILED',
    productName: '슬림 테이퍼드 데님 팬츠',
    productImageUrl: '',
    resultThumbnailUrl: null,
    fittedAt: '2024-03-08T16:20:00Z',
  },
];

const PlaceholderImage = ({ label }: { label: string }) => (
  <div className="w-full h-full bg-[#333333] flex flex-col items-center justify-center gap-1">
    <svg className="w-8 h-8 text-[#616161]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span className="text-xs text-[#616161]">{label}</span>
  </div>
);

export function FittingGallery() {
  const [fittings, setFittings] = useState<FittingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 서비스 함수 호출 구조 유지 (mock)
    const fetchFittings = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFittings(MOCK_FITTINGS);
      setIsLoading(false);
    };
    fetchFittings();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-lg font-semibold text-[#F9F9F9] mb-6">피팅 이력</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-[#F9F9F9] mb-6">피팅 이력</h2>

      {fittings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#616161]">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm text-[#BDBDBD]">피팅 이력이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fittings.map((item) => {
            const formattedDate = new Date(item.fittedAt).toLocaleDateString('ko-KR');
            const isFailed = item.status === 'FAILED';
            return (
              <div
                key={item.sessionId}
                className="bg-[#212121] border border-[#333333] rounded-xl overflow-hidden"
              >
                {/* 이미지 영역: 원본 + 피팅 결과 나란히 */}
                <div className="flex h-32 sm:h-40">
                  {/* 원본 상품 이미지 */}
                  <div className="flex-1 relative overflow-hidden border-r border-[#333333]">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage label="상품" />
                    )}
                    <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-[#BDBDBD] px-1.5 py-0.5 rounded">
                      상품
                    </span>
                  </div>

                  {/* AI 피팅 결과 썸네일 */}
                  <div className="flex-1 relative overflow-hidden">
                    {isFailed ? (
                      <div className="w-full h-full bg-[#333333] flex flex-col items-center justify-center gap-1">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] text-red-400">실패</span>
                      </div>
                    ) : item.resultThumbnailUrl ? (
                      <img
                        src={item.resultThumbnailUrl}
                        alt={`${item.productName} 피팅 결과`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage label="피팅" />
                    )}
                    {!isFailed && (
                      <span className="absolute top-1 left-1 text-[10px] bg-[#FF6B35]/80 text-white px-1.5 py-0.5 rounded">
                        AI
                      </span>
                    )}
                  </div>
                </div>

                {/* 정보 영역 */}
                <div className="p-3">
                  <p className="text-xs text-[#F9F9F9] font-medium truncate">{item.productName}</p>
                  <p className="text-[10px] text-[#616161] mt-1">{formattedDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
