'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { FittingDto } from '@/services/fitting/dto/fitting.dto';
import { getFitting, getFittingResult } from '@/services/fitting/fitting-api';
import { SizeRecommendation } from '@/components/fitting/size-recommendation';
import { FittingResult3DViewer } from '@/components/fitting/fitting-result-3d-viewer';
import { FittingComparison } from '@/components/fitting/fitting-comparison';

interface FittingResultClientProps {
  sessionId: string;
}

export function FittingResultClient({ sessionId }: FittingResultClientProps) {
  const router = useRouter();
  const [fitting, setFitting] = useState<FittingDto.Response | null>(null);
  const [result, setResult] = useState<FittingDto.FittingResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const numId = parseInt(sessionId, 10);
        if (isNaN(numId)) {
          setError('유효하지 않은 피팅 세션입니다.');
          return;
        }
        const [fittingData, resultData] = await Promise.all([
          getFitting(numId),
          getFittingResult(numId),
        ]);
        setFitting(fittingData);
        setResult(resultData);
      } catch {
        setError('피팅 결과를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-64 bg-oc-gray-100 rounded-2xl" />
        <div className="h-48 bg-oc-gray-100 rounded-2xl" />
        <div className="h-32 bg-oc-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-oc-gray-500">
        <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm mb-4">{error ?? '피팅 결과를 불러올 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/fitting')}
          className="px-4 py-2 text-sm font-medium text-white bg-oc-primary-500 rounded-lg hover:bg-oc-primary-600 transition-colors"
        >
          다시 피팅하기
        </button>
      </div>
    );
  }

  const recommendation = result.sizeRecommendation;
  const glbUrl = result.fittedGlbUrl ?? '';
  const renders = result.renders ?? {};
  const hasGlb = glbUrl.length > 0;
  const hasRenders = Object.values(renders).some((url) => url.length > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hasGlb ? (
          <FittingResult3DViewer glbUrl={glbUrl} />
        ) : (
          <div className="aspect-square rounded-2xl bg-oc-gray-100 flex flex-col items-center justify-center gap-3 text-oc-gray-500">
            <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm">3D 모델 준비 중</p>
          </div>
        )}

        {/* 우측: 사이즈 추천 */}
        <SizeRecommendation recommendation={recommendation} />
      </div>

      {/* 다각도 렌더링 */}
      {hasRenders && <FittingComparison renders={renders} />}

      {/* 피팅 메타 정보 */}
      {fitting && (
        <div className="bg-oc-gray-100 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-oc-gray-500">
          <span>피팅 ID #{fitting.id}</span>
          {fitting.completedAt && (
            <span>
              {new Date(fitting.completedAt).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      )}

      {/* 장바구니 CTA */}
      <button
        onClick={() => router.push('/cart')}
        className="w-full py-4 text-base font-bold rounded-xl text-white transition-colors"
        style={{ background: '#FF6B35' }}
      >
        {recommendation.recommended_size} 사이즈 장바구니에 담기
      </button>

      {/* 다시 피팅하기 */}
      <button
        onClick={() => router.push('/fitting')}
        className="w-full py-3 text-sm font-medium text-oc-gray-400 border border-oc-gray-200 rounded-xl hover:border-oc-gray-400 hover:text-oc-gray-600 transition-colors"
      >
        다시 피팅하기
      </button>
    </div>
  );
}
