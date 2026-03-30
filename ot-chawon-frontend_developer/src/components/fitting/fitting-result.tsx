'use client';

import { useState } from 'react';
import { SizeRecommendation } from './size-recommendation';

type ViewAngle = 'front' | 'side' | 'back';
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

interface FittingResultProps {
  sessionId: string;
  productName?: string;
  productImage?: string;
  fitScore?: number;
  onAddToCart?: (size: Size) => void;
}

const VIEW_TABS: { key: ViewAngle; label: string }[] = [
  { key: 'front', label: '전면' },
  { key: 'side', label: '측면' },
  { key: 'back', label: '후면' },
];

function CircularProgress({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{score}</span>
        <span className="text-xs text-oc-gray-500">점</span>
      </div>
    </div>
  );
}

export function FittingResult({
  sessionId,
  productName = '레귤러 핏 데님 재킷',
  productImage,
  fitScore = 94,
  onAddToCart: _onAddToCart,
}: FittingResultProps) {
  const [activeView, setActiveView] = useState<ViewAngle>('front');
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

  return (
    <div className="space-y-6">
      {/* 상품 정보 요약 */}
      <div className="flex items-center gap-4 p-4 bg-oc-gray-800 rounded-xl">
        <div className="w-16 h-16 rounded-lg bg-oc-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {productImage ? (
            <img src={productImage} alt={productName} className="w-full h-full object-cover" />
          ) : (
            <svg className="w-8 h-8 text-oc-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} points="9 22 9 12 15 12 15 22" />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{productName}</p>
          <p className="text-xs text-oc-gray-500 mt-0.5">세션 ID: {sessionId.slice(0, 8)}...</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CircularProgress score={fitScore} />
          <span className="text-xs text-oc-gray-500">핏 점수</span>
        </div>
      </div>

      {/* 3D 뷰어 영역 */}
      <div className="relative bg-oc-gray-900 rounded-2xl overflow-hidden">
        {/* 뷰 전환 탭 */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex bg-oc-gray-800/80 backdrop-blur-sm rounded-full p-1">
          {VIEW_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeView === key
                  ? 'bg-oc-primary-500 text-white'
                  : 'text-oc-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 3D 뷰어 플레이스홀더 */}
        <div className="aspect-[3/4] flex items-center justify-center">
          <div
            className="transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg viewBox="0 0 120 180" className="w-48 h-64" fill="none">
              {/* 아바타 실루엣 */}
              <circle cx="60" cy="22" r="14" fill="#FF6B35" fillOpacity="0.3" stroke="#FF6B35" strokeWidth="1.5" />
              {/* 의류 (재킷) */}
              <path
                d="M36 42 Q60 38 84 42 L88 110 Q60 115 32 110 Z"
                fill="#4B5563"
                fillOpacity="0.6"
                stroke="#FF6B35"
                strokeWidth="1"
              />
              {/* 재킷 칼라 */}
              <path d="M52 42 L60 55 L68 42" fill="none" stroke="#FF6B35" strokeWidth="1" />
              {/* 재킷 단추 */}
              <circle cx="60" cy="65" r="2" fill="#FF6B35" fillOpacity="0.8" />
              <circle cx="60" cy="78" r="2" fill="#FF6B35" fillOpacity="0.8" />
              <circle cx="60" cy="91" r="2" fill="#FF6B35" fillOpacity="0.8" />
              {/* 팔 */}
              <path
                d="M36 45 L20 90 L28 92 L44 50"
                fill="#4B5563"
                fillOpacity="0.5"
                stroke="#FF6B35"
                strokeWidth="1"
              />
              <path
                d="M84 45 L100 90 L92 92 L76 50"
                fill="#4B5563"
                fillOpacity="0.5"
                stroke="#FF6B35"
                strokeWidth="1"
              />
              {/* 하의 */}
              <path d="M42 110 L36 170 L48 170 L58 110" fill="#374151" fillOpacity="0.7" stroke="#6B7280" strokeWidth="1" />
              <path d="M78 110 L84 170 L72 170 L62 110" fill="#374151" fillOpacity="0.7" stroke="#6B7280" strokeWidth="1" />
              {/* 핏 하이라이트 */}
              {activeView === 'front' && (
                <>
                  <line x1="36" y1="50" x2="84" y2="50" stroke="#FF6B35" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                  <line x1="38" y1="80" x2="82" y2="80" stroke="#22c55e" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.5" />
                </>
              )}
              {activeView === 'side' && (
                <path d="M60 42 Q72 42 72 110 Q66 115 60 110" fill="#4B5563" fillOpacity="0.3" stroke="#FF6B35" strokeWidth="0.5" />
              )}
            </svg>
          </div>

          {/* 360도 회전 힌트 */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-oc-gray-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            드래그하여 360° 회전
          </div>
        </div>

        {/* 뷰어 컨트롤 */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 bg-oc-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-oc-gray-300 hover:text-white hover:bg-oc-gray-700 transition-colors"
            title="확대"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 bg-oc-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-oc-gray-300 hover:text-white hover:bg-oc-gray-700 transition-colors"
            title="축소"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            className="w-8 h-8 bg-oc-gray-800/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-oc-gray-300 hover:text-white hover:bg-oc-gray-700 transition-colors"
            title="360도 회전"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* 핏 점수 배지 */}
        <div className="absolute top-3 right-3 bg-oc-gray-800/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${fitScore >= 80 ? 'bg-green-500' : fitScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            <span className="text-xs font-semibold text-white">{fitScore}점</span>
          </div>
        </div>
      </div>

      {/* 사이즈 추천 */}
      <SizeRecommendation
        recommendation={{
          recommended_size: 'M',
          confidence: fitScore,
          alternatives: ['S', 'L'],
          reason: ['AI 분석 결과 M 사이즈가 최적입니다'],
        }}
      />
    </div>
  );
}
