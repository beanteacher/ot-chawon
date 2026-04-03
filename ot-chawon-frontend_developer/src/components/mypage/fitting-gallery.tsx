'use client';

import React, { useState, useEffect } from 'react';
import type { FittingDto } from '@/services/fitting/dto/fitting.dto';

interface FittingHistoryItem {
  sessionId: string;
  status: FittingDto.FittingStatus;
  productName: string;
  productImageUrl: string;
  resultThumbnailUrl: string | null;
  fittedAt: string;
}

const PlaceholderImage = ({ label }: { label: string }) => (
  <div className="w-full h-full bg-oc-gray-100 flex flex-col items-center justify-center gap-1">
    <svg className="w-8 h-8 text-oc-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span className="text-xs text-oc-gray-400">{label}</span>
  </div>
);

export function FittingGallery() {
  const [fittings, setFittings] = useState<FittingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFittings = async () => {
      setIsLoading(true);
      try {
        const token = typeof window !== 'undefined'
          ? JSON.parse(localStorage.getItem('auth-storage') ?? '{}')?.state?.accessToken
          : null;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SPRING_GATEWAY_URL ?? 'http://localhost:8080'}/api/v1/fittings`,
          {
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );
        if (!res.ok) throw new Error('Failed to fetch fittings');
        const json = await res.json();
        const data = json.data ?? json;
        const items: FittingHistoryItem[] = (Array.isArray(data) ? data : []).map((f: FittingDto.Response) => ({
          sessionId: String(f.id),
          status: f.status === 'COMPLETED' ? 'COMPLETED' : f.status === 'FAILED' ? 'FAILED' : 'PROCESSING',
          productName: f.itemId ?? '',
          productImageUrl: '',
          resultThumbnailUrl: null,
          fittedAt: f.completedAt ?? f.createdAt,
        }));
        setFittings(items);
      } catch {
        setFittings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFittings();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6">
        <h2 className="text-lg font-semibold text-oc-gray-900 mb-6">피팅 이력</h2>
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-oc-gray-900 mb-6">피팅 이력</h2>

      {fittings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-oc-gray-400">
          <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-sm text-oc-gray-500">피팅 이력이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fittings.map((item) => {
            const formattedDate = new Date(item.fittedAt).toLocaleDateString('ko-KR');
            const isFailed = item.status === 'FAILED';
            return (
              <div
                key={item.sessionId}
                className="bg-white border border-oc-gray-100 rounded-xl overflow-hidden"
              >
                {/* 이미지 영역: 원본 + 피팅 결과 나란히 */}
                <div className="flex h-32 sm:h-40">
                  {/* 원본 상품 이미지 */}
                  <div className="flex-1 relative overflow-hidden border-r border-oc-gray-100">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderImage label="상품" />
                    )}
                    <span className="absolute top-1 left-1 text-[10px] bg-black/30 text-oc-gray-500 px-1.5 py-0.5 rounded">
                      상품
                    </span>
                  </div>

                  {/* AI 피팅 결과 썸네일 */}
                  <div className="flex-1 relative overflow-hidden">
                    {isFailed ? (
                      <div className="w-full h-full bg-oc-gray-100 flex flex-col items-center justify-center gap-1">
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
                  <p className="text-xs text-oc-gray-900 font-medium truncate">{item.productName}</p>
                  <p className="text-[10px] text-oc-gray-400 mt-1">{formattedDate}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
