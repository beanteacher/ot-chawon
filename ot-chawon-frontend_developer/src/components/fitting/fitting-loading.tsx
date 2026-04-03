'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { label: '체형 분석 중...', description: '입력하신 신체 측정값을 분석하고 있습니다' },
  { label: '3D 아바타 생성 중...', description: 'SMPL 모델로 체형을 재현하고 있습니다' },
  { label: '의류 피팅 중...', description: '선택하신 의류를 아바타에 적용하고 있습니다' },
  { label: '결과 생성 중...', description: '최적의 사이즈를 계산하고 있습니다' },
];

interface FittingLoadingProps {
  estimatedSeconds?: number;
}

export function FittingLoading({ estimatedSeconds = 30 }: FittingLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / (estimatedSeconds * 10);
        return Math.min(next, 95);
      });
      setElapsed((prev) => prev + 0.1);
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, (estimatedSeconds * 1000) / STEPS.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [estimatedSeconds]);

  const remaining = Math.max(0, Math.ceil(estimatedSeconds - elapsed));

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      {/* 3D 아바타 회전 플레이스홀더 */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-4 border-oc-gray-200" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-oc-primary-500 animate-spin"
          style={{ animationDuration: '1.5s' }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-oc-primary-300 animate-spin"
          style={{ animationDuration: '2s', animationDirection: 'reverse' }}
        />
        {/* 아바타 아이콘 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 60 80" className="w-16 h-20" fill="none">
            <circle cx="30" cy="12" r="8" fill="#FF6B35" fillOpacity="0.6" />
            <path
              d="M16 25 Q30 22 44 25 L46 55 Q30 58 14 55 Z"
              fill="#FF6B35"
              fillOpacity="0.4"
            />
            <path d="M16 27 L8 50 L14 51 L22 30" fill="#FF6B35" fillOpacity="0.4" />
            <path d="M44 27 L52 50 L46 51 L38 30" fill="#FF6B35" fillOpacity="0.4" />
            <path d="M22 55 L20 78 L26 78 L28 55" fill="#FF6B35" fillOpacity="0.4" />
            <path d="M38 55 L40 78 L34 78 L32 55" fill="#FF6B35" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* 진행 단계 */}
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-oc-gray-900">{STEPS[currentStep]?.label}</h3>
          <p className="text-sm text-oc-gray-400">{STEPS[currentStep]?.description}</p>
        </div>

        {/* 진행률 바 */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-oc-gray-500">
            <span>{Math.round(progress)}%</span>
            <span>약 {remaining}초 남음</span>
          </div>
          <div className="h-2 bg-oc-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-oc-primary-600 to-oc-primary-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 단계 표시 */}
        <div className="flex justify-between">
          {STEPS.map((_step, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full transition-colors ${
                  index < currentStep
                    ? 'bg-oc-primary-500'
                    : index === currentStep
                    ? 'bg-oc-primary-400 animate-pulse'
                    : 'bg-oc-gray-200'
                }`}
              />
              <span className={`text-xs ${index <= currentStep ? 'text-oc-primary-400' : 'text-oc-gray-600'}`}>
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-oc-gray-600 text-center">
        AI가 최적의 사이즈를 분석하고 있습니다
        <br />
        잠시만 기다려주세요
      </p>
    </div>
  );
}
