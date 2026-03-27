import React from 'react';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <section className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] overflow-hidden bg-oc-gray-900">
      {/* 배경 그라데이션 (placeholder 이미지 대체) */}
      <div className="absolute inset-0 bg-gradient-to-br from-oc-gray-900 via-oc-gray-800 to-oc-black" />

      {/* 장식용 원형 그라데이션 */}
      <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-oc-primary-500/20 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-oc-secondary-500/15 blur-3xl" />

      {/* 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-oc-black/80 via-transparent to-transparent" />

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-screen-xl mx-auto px-4 pb-12 sm:pb-16">
        <div className="max-w-lg">
          <span className="inline-block text-oc-primary-500 text-sm font-semibold uppercase tracking-widest mb-3">
            New Season
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            나만의 스타일을
            <br />
            <span className="text-oc-primary-500">AI로 완성</span>하세요
          </h1>
          <p className="text-oc-gray-400 text-base sm:text-lg mb-8 leading-relaxed">
            3D 피팅 기술로 옷을 입어보고, 내 체형에 맞는 완벽한 스타일을 찾아보세요.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-oc-primary-500 hover:bg-oc-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              지금 쇼핑하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/fitting"
              className="inline-flex items-center gap-2 border border-oc-gray-600 hover:border-oc-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
            >
              AI 피팅 체험
            </Link>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        <span className="w-6 h-1.5 rounded-full bg-oc-primary-500" />
        <span className="w-1.5 h-1.5 rounded-full bg-oc-gray-600" />
        <span className="w-1.5 h-1.5 rounded-full bg-oc-gray-600" />
      </div>
    </section>
  );
};

export { HeroBanner };
