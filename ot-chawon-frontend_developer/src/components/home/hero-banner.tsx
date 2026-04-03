'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  { src: '/images/hero-fitting.png', alt: 'AI 가상 피팅, 쇼핑의 새로운 경험' },
  { src: '/images/hero-avatar.png', alt: '나만의 3D 아바타로 완벽한 핏을 찾아보세요' },
] as const;

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] overflow-hidden bg-[#e8e8e8]">
      {/* 배경 슬라이드 */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-contain"
            sizes="100vw"
          />
        </div>
      ))}

      {/* 그라데이션 오버레이 — 하단 텍스트 가독성 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* 콘텐츠 */}
      <div className="relative z-10 h-full flex flex-col justify-end max-w-screen-xl mx-auto px-4 pb-14 sm:pb-18">
        <div className="max-w-lg">
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
              className="inline-flex items-center gap-2 border border-white/40 hover:border-white/70 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 backdrop-blur-sm"
            >
              AI 피팅 체험
            </Link>
          </div>
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export { HeroBanner };
