'use client';

import type { FittingDto } from '@/services/fitting/dto/fitting.dto';

interface SizeRecommendationProps {
  recommendation: FittingDto.SizeRecommendation;
}

export function SizeRecommendation({ recommendation }: SizeRecommendationProps) {
  const { recommended_size, confidence, alternatives, reason } = recommendation;

  return (
    <div className="bg-oc-surface rounded-2xl p-6 space-y-5">
      <h2 className="text-lg font-bold text-oc-primary">사이즈 추천</h2>

      {/* 추천 사이즈 배지 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[#FF6B35] shadow-lg shadow-[#FF6B35]/30">
          <span className="text-3xl font-black text-white">{recommended_size}</span>
        </div>
        <div>
          <p className="text-sm text-oc-gray-400">추천 사이즈</p>
          <p className="text-xl font-bold text-white">{recommended_size} 사이즈</p>
          <p className="text-sm text-[#FF6B35] font-medium">신뢰도 {confidence}%</p>
        </div>
      </div>

      {/* 신뢰도 프로그레스 바 */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-oc-gray-400">
          <span>AI 신뢰도</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2.5 bg-oc-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${confidence}%`,
              background: 'linear-gradient(to right, #3B82F6, #60A5FA)',
            }}
          />
        </div>
      </div>

      {/* 대안 사이즈 칩 */}
      {alternatives.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-oc-gray-400">다른 사이즈 옵션</p>
          <div className="flex gap-2 flex-wrap">
            {alternatives.map((size) => (
              <span
                key={size}
                className="px-3 py-1 rounded-full border border-oc-gray-600 text-sm text-oc-gray-300 bg-oc-gray-800"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 추천 이유 목록 */}
      {reason.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-oc-gray-400">추천 근거</p>
          <ul className="space-y-2">
            {reason.map((text, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 text-[#FF6B35] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-oc-gray-300">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
