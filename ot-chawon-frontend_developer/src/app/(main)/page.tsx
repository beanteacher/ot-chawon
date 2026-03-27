import { Suspense } from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryNav } from '@/components/home/CategoryNav';
import { ProductGrid } from '@/components/home/ProductGrid';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

function ProductGridSkeleton() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="h-7 w-32 bg-oc-gray-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-oc-black">
      {/* 히어로 배너 */}
      <HeroBanner />

      {/* 카테고리 네비게이션 */}
      <CategoryNav />

      {/* 추천 상품 그리드 */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid title="추천 상품" />
      </Suspense>

      {/* 신상품 섹션 */}
      <div className="border-t border-oc-gray-900">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid title="신상품" />
        </Suspense>
      </div>

      {/* AI 피팅 CTA 배너 */}
      <section className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-oc-primary-600 to-oc-primary-500 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                AI 3D 피팅 서비스
              </h2>
              <p className="text-white/80 text-sm sm:text-base">
                내 체형을 등록하고, 실제로 입어보지 않아도 핏을 확인하세요.
              </p>
            </div>
            <a
              href="/fitting"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-oc-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-oc-primary-50 transition-colors"
            >
              지금 체험하기
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
