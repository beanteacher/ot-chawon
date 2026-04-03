import { Suspense } from 'react';
import { FittingResultClient } from './fitting-result-client';
import { Skeleton } from '@/components/ui';

interface FittingPageProps {
  params: { sessionId: string };
}

export default function FittingPage({ params }: FittingPageProps) {
  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-oc-primary-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-oc-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-oc-primary-400 uppercase tracking-wider">AI 피팅 결과</span>
        </div>
        <h1 className="text-2xl font-bold text-oc-gray-900">3D 피팅 결과</h1>
        <p className="text-sm text-oc-gray-400 mt-1">
          AI가 분석한 최적의 사이즈와 핏을 확인하세요
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton variant="rectangular" className="h-32 rounded-xl" />
            <Skeleton variant="rectangular" className="h-80 rounded-2xl" />
            <Skeleton variant="rectangular" className="h-48 rounded-xl" />
          </div>
        }
      >
        <FittingResultClient sessionId={params.sessionId} />
      </Suspense>
    </main>
  );
}
