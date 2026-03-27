'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BodyMeasurementForm } from '@/components/fitting/BodyMeasurementForm';
import { FittingLoading } from '@/components/fitting/FittingLoading';

interface BodyMeasurement {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  hip: number;
  shoulder: number;
  armLength: number;
  legLength: number;
}

export default function FittingEntryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (_data: BodyMeasurement) => {
    setIsLoading(true);
    // 더미: AI 처리 시뮬레이션 후 결과 페이지로 이동
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const dummySessionId = `session-${Date.now()}`;
    router.push(`/fitting/${dummySessionId}`);
  };

  if (isLoading) {
    return (
      <main className="max-w-lg mx-auto px-4 py-8">
        <FittingLoading estimatedSeconds={30} />
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-oc-primary-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-oc-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-oc-primary-400 uppercase tracking-wider">AI 3D 피팅</span>
        </div>
        <h1 className="text-2xl font-bold text-white">체형 정보 입력</h1>
        <p className="text-sm text-oc-gray-400 mt-1">
          정확한 체형 정보를 입력하면 더 정확한 피팅 결과를 제공합니다
        </p>
      </div>

      {/* 안내 배너 */}
      <div className="bg-oc-primary-500/10 border border-oc-primary-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-oc-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-oc-primary-300">AI가 최적의 사이즈를 추천합니다</p>
            <p className="text-xs text-oc-gray-500 mt-0.5">
              SMPL 3D 체형 모델을 사용하여 실제 착용감을 시뮬레이션합니다
            </p>
          </div>
        </div>
      </div>

      {/* 체형 입력 폼 */}
      <BodyMeasurementForm onSubmit={handleSubmit} isLoading={isLoading} />
    </main>
  );
}
